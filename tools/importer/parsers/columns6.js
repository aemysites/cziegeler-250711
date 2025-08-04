/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (each button group)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For each column, extract its button and related image or svg
  const rowCells = columns.map((col) => {
    // Find the button
    const button = col.querySelector('a.button');
    // Find the svg or img
    let icon = col.querySelector('.buy-link-image svg, .locator-link-image img');
    // Create cell content
    const cellContent = [];
    if (button) cellContent.push(button);
    if (icon) cellContent.push(icon);
    return cellContent;
  });
  // Build the table as per the spec: single-cell header row, followed by a row of N columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns6)'],
    rowCells
  ], document);
  element.replaceWith(table);
}
