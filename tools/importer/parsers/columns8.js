/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the provided section
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) {
    columnsBlock = element.querySelector('[data-block-name="columns"]');
  }
  if (!columnsBlock) {
    columnsBlock = element;
  }

  // Get columns: they may be direct children of columnsBlock, or inside a row wrapper
  let rowDiv = columnsBlock.querySelector(':scope > div');
  let colDivs = [];
  if (
    rowDiv &&
    Array.from(rowDiv.children).length > 1 // more than one column
  ) {
    colDivs = Array.from(rowDiv.children);
  } else {
    colDivs = Array.from(columnsBlock.children);
  }

  // Only keep divs that are real columns with content
  colDivs = colDivs.filter(div =>
    div.children.length > 0 || div.querySelector('img, picture, h1, h2, h3, h4, h5, h6, p, ul, ol, a, button, span')
  );

  // Header row should be a single cell (regardless of number of columns)
  const headerRow = ['Columns (columns8)'];
  const columnsRow = colDivs;
  const cells = [headerRow, columnsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
