const newspaper = document.querySelector('#news-story');
const index = document.querySelector('#news-index');

if (window.cartograph) {
  newspaper.replaceChildren();
  window.cartograph.sections.forEach(section => {
    const article = document.createElement('section');
    article.id = section.id;
    const heading = document.createElement('h3');
    heading.textContent = section.title;
    article.append(heading);
    section.paragraphs.forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      article.append(paragraph);
    });
    if (section.steps || section.items) {
      const list = document.createElement(section.steps ? 'ol' : 'ul');
      (section.steps || section.items).forEach(text => {
        const item = document.createElement('li');
        item.textContent = text;
        list.append(item);
      });
      article.append(list);
    }
    if (section.image) {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = section.image;
      image.alt = section.imageAlt;
      image.loading = 'lazy';
      const caption = document.createElement('figcaption');
      caption.textContent = section.caption;
      figure.append(image, caption);
      article.append(figure);
    }
    newspaper.append(article);
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = section.title;
    index.append(link);
  });
}

let textSize = 16;
const smaller = document.querySelector('#news-smaller');
const larger = document.querySelector('#news-larger');
function resizeText(change) {
  textSize = Math.max(14, Math.min(22, textSize + change));
  newspaper.style.setProperty('--article-size', `${textSize}px`);
  smaller.disabled = textSize === 14;
  larger.disabled = textSize === 22;
}
smaller.addEventListener('click', () => resizeText(-2));
larger.addEventListener('click', () => resizeText(2));
document.querySelector('#news-print').addEventListener('click', () => window.print());
