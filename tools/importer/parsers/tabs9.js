/* global WebImporter */
export default function parse(element, { document }) {
  // Find the questions container within the block
  const questionsContainer = element.querySelector('#faq-replace-questions-container');
  if (!questionsContainer) return;
  const tabDivs = Array.from(questionsContainer.children);

  // We need to know the number of columns for the header row to span
  // Each tab row is 2 columns (label + content)
  const rows = [];
  // Header row: single cell, but should span 2 columns
  // We'll add a colspan=2 to the <th> after creating the table
  rows.push(['Tabs']);

  tabDivs.forEach(tabDiv => {
    // Tab label: picture (if present) + text up to the first <div> (which is the content)
    const labelParts = [];
    const children = Array.from(tabDiv.childNodes);
    for (let i = 0; i < children.length; i++) {
      const n = children[i];
      if (n.nodeType === 1 && n.tagName === 'PICTURE') {
        labelParts.push(n);
      } else if (n.nodeType === 1 && n.tagName === 'DIV') {
        break;
      } else if (n.nodeType === 3 && n.textContent.trim() !== '') {
        labelParts.push(n);
      }
    }
    let labelCell = labelParts.length === 1 ? labelParts[0] : labelParts;
    const contentDiv = tabDiv.querySelector('div');
    let contentCell = contentDiv || '';
    rows.push([labelCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Fix header cell to span 2 columns
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
