/* global WebImporter */
export default function parse(element, { document }) {
  const recipesContainer = element.querySelector('.featured-recipes');
  if (!recipesContainer) return;

  const recipeCards = Array.from(recipesContainer.children);
  const rows = [];

  // Build data rows (always 2 columns)
  recipeCards.forEach(card => {
    let firstCell = null;
    let secondCell = null;
    const isButtonCard = card.classList.contains('button-container');
    if (isButtonCard) {
      const picture = card.querySelector('picture');
      const button = card.querySelector('a.button');
      if (picture && button) {
        firstCell = picture;
        secondCell = button;
      }
    } else {
      const a = card.querySelector('a');
      if (a) {
        const picture = a.querySelector('picture');
        if (picture) firstCell = picture;
        const span = a.querySelector('span');
        if (span && span.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = span.textContent.trim();
          secondCell = strong;
        }
      }
    }
    if (firstCell && secondCell) {
      rows.push([firstCell, secondCell]);
    }
  });

  // Create table element manually to control header colspan
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Cards';
  headerCell.setAttribute('colspan', '2');
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  // Add data rows
  rows.forEach(rowCells => {
    const tr = document.createElement('tr');
    rowCells.forEach(cell => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else if (Array.isArray(cell)) {
        td.append(...cell);
      } else {
        td.append(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  element.replaceWith(table);
}
