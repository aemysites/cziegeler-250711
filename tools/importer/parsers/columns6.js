/* global WebImporter */
export default function parse(element, { document }) {
  // Extract both button containers
  const buyLink = element.querySelector('.buy-link.button-container');
  const locatorLink = element.querySelector('.locator-link.button-container');

  // Get contents for first column
  const buyButton = buyLink ? buyLink.querySelector('a') : null;
  const buyLogo = buyLink ? buyLink.querySelector('.buy-link-image > span') : null;
  const buyCellContent = [];
  if (buyButton) buyCellContent.push(buyButton);
  if (buyLogo) buyCellContent.push(buyLogo);

  // Get contents for second column
  const locatorButton = locatorLink ? locatorLink.querySelector('a') : null;
  const locatorImg = locatorLink ? locatorLink.querySelector('img') : null;
  const locatorCellContent = [];
  if (locatorButton) locatorCellContent.push(locatorButton);
  if (locatorImg) locatorCellContent.push(locatorImg);

  // Prepare header row as a single cell (will do colspan after table is created)
  const headerRow = ['Columns (columns6)'];
  const contentRow = [buyCellContent.length ? buyCellContent : '', locatorCellContent.length ? locatorCellContent : ''];
  const rows = [
    headerRow,
    contentRow
  ];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the header <th> to span across all columns
  const th = block.querySelector('tr:first-child th');
  if (th) {
    th.colSpan = contentRow.length;
  }

  // Replace original element
  element.replaceWith(block);
}
