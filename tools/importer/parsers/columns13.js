/* global WebImporter */
export default function parse(element, { document }) {
  // The element is the .steps-wrapper
  // Find the steps block
  const stepsBlock = element.querySelector('.steps.block');
  if (!stepsBlock) return;

  // Get all immediate child divs of .steps.block (each is a column)
  const stepColumns = Array.from(stepsBlock.children);

  // Prepare each column for the table's second row
  const columns = stepColumns.map((col) => {
    // Each col has a single child div
    const inner = col.firstElementChild;
    if (!inner) return '';
    // Step circle (number)
    const stepNumberDiv = inner.querySelector('.step');
    // Title (first p)
    const firstP = inner.querySelector('p');
    // Description (second p)
    const paragraphs = inner.querySelectorAll('p');
    const descP = paragraphs.length > 1 ? paragraphs[1] : null;

    // Build column content as a single div for resilience
    const frag = document.createElement('div');
    if (stepNumberDiv) frag.appendChild(stepNumberDiv);
    if (firstP) {
      // Title is rendered as all caps and bold in screenshot
      const strong = document.createElement('strong');
      strong.textContent = firstP.textContent;
      frag.appendChild(strong);
    }
    if (descP) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(descP);
    }
    return frag;
  });

  // Compose the block table: header row, then columns row
  const tableData = [
    ['Columns (columns13)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
