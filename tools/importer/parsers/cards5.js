/* global WebImporter */
export default function parse(element, { document }) {
  // Find the featured-recipes container
  const featuredRecipes = element.querySelector('.featured-recipes');
  if (!featuredRecipes) return;

  // Get all direct children (cards)
  const cards = Array.from(featuredRecipes.children).filter((child) =>
    child.classList.contains('featured-recipe')
  );

  // Header row should have two columns, matching all other rows
  const rows = [['Cards', '']];

  cards.forEach((card) => {
    // Button card (All Cocktails)
    if (card.classList.contains('button-container')) {
      const picture = card.querySelector('picture');
      const button = card.querySelector('a.button');
      if (!picture && !button) return; // skip empty card
      // Place button below image, each in same cell
      const cellDiv = document.createElement('div');
      if (picture) cellDiv.appendChild(picture);
      if (button) {
        cellDiv.appendChild(document.createElement('br'));
        cellDiv.appendChild(button);
      }
      rows.push([cellDiv, '']);
      return;
    }
    // Regular cards
    const a = card.querySelector('a');
    const picture = a ? a.querySelector('picture') : null;
    const span = a ? a.querySelector('span') : null;
    let imgCell = picture || '';
    let textCell = '';
    if (span && span.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = span.textContent.trim();
      textCell = strong;
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
