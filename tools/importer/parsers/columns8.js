/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the section
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Find the row that contains the columns
  const row = columnsBlock.firstElementChild;
  if (!row) return;

  // The columns are direct children of the row
  const columns = Array.from(row.children);
  if (columns.length === 0) return;

  // Table must have a header row with exactly one cell
  const cells = [];
  cells.push(['Columns (columns8)']); // Header row with one column
  // Second row: one cell per column (can be two or more depending on the source)
  cells.push(columns);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}