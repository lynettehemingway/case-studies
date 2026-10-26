const screens = [
  { name: 'Home', file: 'original', alt: 'Home screen with shopping shortcuts, nearby deals, and a map', caption: 'The starting point for lists, nearby stores, and recent activity.' },
  { name: 'List', file: 'editlist', alt: 'Grocery list editor with ingredients, quantities, and route planning', caption: 'Edit ingredients and quantities before comparing prices and routes.' },
  { name: 'Routes', file: 'route', alt: 'Route options comparing store stops, travel time, distance, and cost', caption: 'Compare grocery savings with the time and cost of the drive.' },
  { name: 'Recipes', file: 'recipes', alt: 'Recipe import screen with an ingredient list', caption: 'Bring recipe ingredients into a shopping list.' },
  { name: 'Carter', file: 'mealidea', alt: 'Carter AI assistant with a meal-idea prompt', caption: 'Ask Carter for meal ideas and help with ingredients.' },
  { name: 'Profile', file: 'jack', alt: 'Profile screen with dietary and store preferences', caption: 'Manage shopping preferences. Displayed savings figures are prototype content.' },
  { name: 'Sign-in', file: 'gallery', alt: 'CARTograph welcome and sign-in screen', caption: 'The welcome screen introduces CARTograph and the sign-in options.' }
];

const tabs = [...document.querySelectorAll('[role="tab"]')];
const activeImage = document.querySelector('#active-screen');
const screenPanel = document.querySelector('#screen-panel');
const zoomButton = document.querySelector('#open-screen');
const dialog = document.querySelector('#screen-dialog');
let selectedScreen = 0;

function selectScreen(index, focusTab = false) {
  selectedScreen = (index + screens.length) % screens.length;
  const screen = screens[selectedScreen];

  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === selectedScreen;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  activeImage.src = `../assets/screens/${screen.file}.png`;
  activeImage.alt = screen.alt;
  // Let the original aspect ratio handle the differently sized exports.
  activeImage.removeAttribute('width');
  activeImage.removeAttribute('height');
  document.querySelector('#screen-caption').textContent = screen.caption;
  document.querySelector('#screen-name').textContent = screen.name;
  document.querySelector('#screen-count').textContent = `${selectedScreen + 1} / ${screens.length}`;
  screenPanel.setAttribute('aria-labelledby', tabs[selectedScreen].id);
  zoomButton.setAttribute('aria-label', `Enlarge ${screen.name} screen`);

  if (focusTab) tabs[selectedScreen].focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScreen(index));
  tab.addEventListener('keydown', event => {
    const destinations = {
      ArrowRight: selectedScreen + 1,
      ArrowLeft: selectedScreen - 1,
      Home: 0,
      End: screens.length - 1
    };
    if (event.key in destinations) {
      event.preventDefault();
      selectScreen(destinations[event.key], true);
    }
  });
});

document.querySelector('#previous-screen').addEventListener('click', () => selectScreen(selectedScreen - 1));
document.querySelector('#next-screen').addEventListener('click', () => selectScreen(selectedScreen + 1));

zoomButton.addEventListener('click', () => {
  const screen = screens[selectedScreen];
  document.querySelector('#dialog-title').textContent = `${screen.name} screen`;
  const image = document.querySelector('#enlarged-screen');
  image.src = activeImage.src;
  image.alt = screen.alt;
  image.removeAttribute('width');
  image.removeAttribute('height');
  dialog.showModal();
});

document.querySelector('#close-screen').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  }
});
dialog.addEventListener('close', () => zoomButton.focus());

// Reading pages are measured against the available space, including at zoom.
const reader = document.querySelector('#reader-content');
const picker = document.querySelector('#chapter-picker');
const readerHeading = document.querySelector('#reader-heading');
const workspace = document.querySelector('.minimal-workspace');
const readingButton = document.querySelector('#show-reading');
const screensButton = document.querySelector('#show-screens');
const sections = window.cartograph?.sections || [];
let pages = [];
let readingPage = 0;
let currentSection = 0;
let resizeFrame;

function setView(view) {
  workspace.dataset.view = view;
  readingButton.setAttribute('aria-pressed', String(view === 'read'));
  screensButton.setAttribute('aria-pressed', String(view === 'screens'));
  if (view === 'read') requestAnimationFrame(paginate);
}
readingButton.addEventListener('click', () => setView('read'));
screensButton.addEventListener('click', () => setView('screens'));

function makeBlock(block) {
  if (block.kind === 'paragraph') {
    const paragraph = document.createElement('p');
    paragraph.textContent = block.text;
    return paragraph;
  }
  const list = document.createElement(block.kind === 'step' ? 'ol' : 'ul');
  if (block.kind === 'step') list.start = block.number;
  const item = document.createElement('li');
  item.textContent = block.text;
  list.append(item);
  return list;
}

function drawPage(blocks) {
  reader.replaceChildren(...blocks.map(makeBlock));
}

function paginate() {
  if (!sections.length || reader.clientHeight < 20 || reader.clientWidth < 20) return;
  const section = sections[currentSection];
  const blocks = section.paragraphs.map(text => ({ kind: 'paragraph', text }));
  (section.steps || section.items || []).forEach((text, index) => {
    blocks.push({ kind: section.steps ? 'step' : 'item', number: index + 1, text });
  });
  if (section.caption) blocks.push({ kind: 'paragraph', text: section.caption });

  const nextPages = [];
  let page = [];
  blocks.forEach(block => {
    let words = block.text.split(/\s+/);
    while (words.length) {
      let low = 0;
      let high = words.length;
      // Find the largest piece that fits without shrinking the reading type.
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        drawPage([...page, { ...block, text: words.slice(0, middle).join(' ') }]);
        if (reader.scrollHeight <= reader.clientHeight) low = middle;
        else high = middle - 1;
      }
      if (low === 0 && page.length) {
        nextPages.push(page);
        page = [];
        continue;
      }
      // A single word guarantees progress on an exceptionally small viewport.
      const take = Math.max(1, low);
      page.push({ ...block, text: words.slice(0, take).join(' ') });
      words = words.slice(take);
      if (words.length) {
        nextPages.push(page);
        page = [];
      }
    }
  });
  if (page.length) nextPages.push(page);
  pages = nextPages;
  readingPage = Math.min(readingPage, pages.length - 1);
  showReadingPage(readingPage);
}

function showReadingPage(index) {
  if (!pages.length) return;
  readingPage = Math.max(0, Math.min(index, pages.length - 1));
  drawPage(pages[readingPage]);
  document.querySelector('#reading-position').textContent = `${readingPage + 1} / ${pages.length}`;
  document.querySelector('#previous-page').disabled = readingPage === 0;
  document.querySelector('#next-page').disabled = readingPage === pages.length - 1;
}

if (sections.length) {
  picker.replaceChildren(...sections.map((section, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = section.title;
    return option;
  }));
  readerHeading.textContent = sections[0].title;
  picker.addEventListener('change', () => {
    currentSection = Number(picker.value);
    readingPage = 0;
    readerHeading.textContent = sections[currentSection].title;
    const imageIndex = screens.findIndex(screen => sections[currentSection].image === `../assets/screens/${screen.file}.png`);
    if (imageIndex !== -1) selectScreen(imageIndex);
    paginate();
  });
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(paginate);
  }).observe(reader);
  requestAnimationFrame(paginate);
}

document.querySelector('#previous-page').addEventListener('click', () => showReadingPage(readingPage - 1));
document.querySelector('#next-page').addEventListener('click', () => showReadingPage(readingPage + 1));
reader.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    showReadingPage(readingPage + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
