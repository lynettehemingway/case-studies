const caseStudy = window.cartograph;
const story = document.querySelector('#story');

if (caseStudy && story) {
  story.replaceChildren(...caseStudy.sections.map(createSection));
}

function createSection(section) {
  const container = document.createElement('section');
  container.id = section.id;
  container.className = section.image ? 'case-section has-screen' : 'case-section';

  const copy = document.createElement('div');
  copy.className = 'section-copy';
  const heading = document.createElement('h2');
  heading.textContent = section.title;
  copy.append(heading);

  section.paragraphs.forEach(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    copy.append(paragraph);
  });

  if (section.steps || section.items) {
    const list = document.createElement(section.steps ? 'ol' : 'ul');
    list.className = section.steps ? 'shopping-flow' : 'next-steps';
    (section.steps || section.items).forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    });
    copy.append(list);
  }
  container.append(copy);

  if (section.image) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = section.image;
    image.alt = section.imageAlt;
    image.width = 1206;
    image.height = 2622;
    image.loading = 'lazy';
    const caption = document.createElement('figcaption');
    caption.textContent = section.caption;
    figure.append(image, caption);
    container.append(figure);
  }
  return container;
}

const carousel = document.querySelector('#screen-carousel');

if (carousel) {
  const cards = [...carousel.querySelectorAll('.screen-card')];
  const previousButton = document.querySelector('#previous-screen');
  const nextButton = document.querySelector('#next-screen');
  const position = document.querySelector('#screen-position');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentCard = 0;

  function goToCard(index) {
    const target = cards[Math.max(0, Math.min(index, cards.length - 1))];
    carousel.scrollTo({
      left: target.offsetLeft - cards[0].offsetLeft,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }

  function updateControls() {
    const start = cards[0].offsetLeft;
    currentCard = cards.reduce((closest, card, index) => {
      const distance = Math.abs(card.offsetLeft - start - carousel.scrollLeft);
      const closestDistance = Math.abs(cards[closest].offsetLeft - start - carousel.scrollLeft);
      return distance < closestDistance ? index : closest;
    }, 0);
    previousButton.disabled = currentCard === 0;
    nextButton.disabled = currentCard === cards.length - 1;
    position.textContent = `${currentCard + 1} / ${cards.length}`;
  }

  previousButton.addEventListener('click', () => goToCard(currentCard - 1));
  nextButton.addEventListener('click', () => goToCard(currentCard + 1));
  carousel.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goToCard(currentCard + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  updateControls();
}
