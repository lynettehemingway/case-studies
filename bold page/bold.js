const appScreens = [
  { name: 'Home', file: 'original', alt: 'Home screen with shopping shortcuts and a map', caption: 'Home brings lists, nearby stores, and recent activity together.' },
  { name: 'List', file: 'editlist', alt: 'Grocery list with ingredients, quantities, and route-planning controls', caption: 'Edit the ingredients and quantities before comparing stores.' },
  { name: 'Routes', file: 'route', alt: 'Route recommendations with travel time, distance, stops, and costs', caption: 'Compare store stops, grocery prices, and the cost of the drive.' },
  { name: 'Recipes', file: 'recipes', alt: 'Recipe import screen with ingredients', caption: 'Turn recipe ingredients into a shopping list.' },
  { name: 'Carter', file: 'mealidea', alt: 'Carter assistant with a prompt for meal ideas', caption: 'Ask Carter for meal ideas and help with ingredients.' },
  { name: 'Profile', file: 'jack', alt: 'Shopping profile with dietary and store preferences', caption: 'Manage shopping preferences. Savings figures shown are prototype content.' },
  { name: 'Sign-in', file: 'gallery', alt: 'CARTograph welcome screen and sign-in options', caption: 'The welcome screen introduces CARTograph and the sign-in options.' }
];

const flowTabs = [...document.querySelectorAll('.walkthrough-steps [role="tab"]')];
let activeScreen = 0;

function showScreen(index, moveFocus = false) {
  activeScreen = (index + appScreens.length) % appScreens.length;
  const screen = appScreens[activeScreen];
  const image = document.querySelector('#flow-image');
  image.src = `../assets/screens/${screen.file}.png`;
  image.alt = screen.alt;
  image.removeAttribute('width');
  image.removeAttribute('height');

  const previous = appScreens[(activeScreen + appScreens.length - 1) % appScreens.length];
  const next = appScreens[(activeScreen + 1) % appScreens.length];
  document.querySelector('#flow-before').src = `../assets/screens/${previous.file}.png`;
  document.querySelector('#flow-after').src = `../assets/screens/${next.file}.png`;
  document.querySelector('#flow-caption').textContent = screen.caption;
  document.querySelector('#flow-position').textContent = `${screen.name} / ${activeScreen + 1} of ${appScreens.length}`;
  document.querySelector('#flow-panel').setAttribute('aria-labelledby', flowTabs[activeScreen].id);
  updateTabs(flowTabs, activeScreen);
  if (moveFocus) flowTabs[activeScreen].focus();
}

flowTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showScreen(index));
  tab.addEventListener('keydown', event => {
    const target = tabDestination(event, activeScreen, flowTabs.length, true);
    if (target !== null) showScreen(target, true);
  });
});
document.querySelector('#flow-previous').addEventListener('click', () => showScreen(activeScreen - 1));
document.querySelector('#flow-next').addEventListener('click', () => showScreen(activeScreen + 1));

const chapterList = document.querySelector('#chapter-tabs');
const story = document.querySelector('#bold-story');
const readingMode = document.querySelector('#reading-mode');
const chapterControls = document.querySelector('#chapter-controls');
const chapterTabs = [];
const chapterPanels = [];
let activeChapter = 0;
let fullStory = false;

if (window.cartograph) {
  const labels = ['The problem', 'My role', 'The flow', 'Decisions', 'Constraints', 'The result', 'Next steps'];
  story.replaceChildren();

  window.cartograph.sections.forEach((section, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `chapter-tab-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `chapter-${index}`);
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.textContent = labels[index] || section.title;
    tab.append(number, label);
    tab.addEventListener('click', () => showChapter(index));
    tab.addEventListener('keydown', event => {
      const target = tabDestination(event, activeChapter, chapterTabs.length);
      if (target !== null) showChapter(target, true);
    });
    chapterTabs.push(tab);
    chapterList.append(tab);

    const panel = createChapter(section, index);
    chapterPanels.push(panel);
    story.append(panel);
  });

  readingMode.hidden = false;
  chapterControls.hidden = false;
  showChapter(0);
}

function createChapter(section, index) {
  const panel = document.createElement('section');
  panel.id = `chapter-${index}`;
  panel.className = 'bold-chapter';
  panel.tabIndex = 0;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', `chapter-tab-${index}`);

  const number = document.createElement('span');
  number.className = 'chapter-number';
  number.setAttribute('aria-hidden', 'true');
  number.textContent = String(index + 1).padStart(2, '0');

  const copy = document.createElement('div');
  copy.className = 'bold-chapter-copy';
  const heading = document.createElement('h3');
  heading.id = `chapter-title-${index}`;
  heading.textContent = section.title;
  copy.append(heading);
  section.paragraphs.forEach(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    copy.append(paragraph);
  });

  if (section.steps || section.items) {
    const list = document.createElement(section.steps ? 'ol' : 'ul');
    (section.steps || section.items).forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    });
    copy.append(list);
  }
  panel.append(number, copy);

  if (section.image) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = section.image;
    image.alt = section.imageAlt;
    image.loading = 'lazy';
    const caption = document.createElement('figcaption');
    caption.textContent = section.caption;
    figure.append(image, caption);
    panel.append(figure);
  }
  return panel;
}

function showChapter(index, moveFocus = false) {
  activeChapter = Math.max(0, Math.min(index, chapterPanels.length - 1));
  updateTabs(chapterTabs, activeChapter);
  chapterPanels.forEach((panel, panelIndex) => {
    panel.hidden = !fullStory && panelIndex !== activeChapter;
  });
  document.querySelector('#chapter-position').textContent = `${activeChapter + 1} / ${chapterPanels.length}`;
  document.querySelector('#chapter-previous').disabled = activeChapter === 0;
  document.querySelector('#chapter-next').disabled = activeChapter === chapterPanels.length - 1;
  if (moveFocus) chapterTabs[activeChapter].focus();
}

readingMode.addEventListener('click', () => {
  fullStory = !fullStory;
  readingMode.setAttribute('aria-pressed', String(fullStory));
  readingMode.textContent = fullStory ? 'Back to chapters' : 'Show full case study';
  chapterList.hidden = fullStory;
  chapterControls.hidden = fullStory;
  chapterPanels.forEach((panel, index) => {
    panel.setAttribute('role', fullStory ? 'region' : 'tabpanel');
    panel.setAttribute('aria-labelledby', fullStory ? `chapter-title-${index}` : `chapter-tab-${index}`);
  });
  showChapter(activeChapter);
});
document.querySelector('#chapter-previous').addEventListener('click', () => showChapter(activeChapter - 1));
document.querySelector('#chapter-next').addEventListener('click', () => showChapter(activeChapter + 1));

function updateTabs(tabs, selected) {
  tabs.forEach((tab, index) => {
    tab.setAttribute('aria-selected', String(index === selected));
    tab.tabIndex = index === selected ? 0 : -1;
  });
}

function tabDestination(event, current, count, vertical = false) {
  const keys = {
    [vertical ? 'ArrowDown' : 'ArrowRight']: (current + 1) % count,
    [vertical ? 'ArrowUp' : 'ArrowLeft']: (current + count - 1) % count,
    Home: 0,
    End: count - 1
  };
  if (!(event.key in keys)) return null;
  event.preventDefault();
  return keys[event.key];
}
