/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero4)'];

  // 2. Background image row (should be the block's background image)
  let bgImgUrl = element.getAttribute('data-background-image');
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  } else {
    // fallback: try to find in .background-image img
    const bgImgInBlock = element.querySelector('.background-image img');
    if (bgImgInBlock && bgImgInBlock.src) {
      bgImgEl = bgImgInBlock;
    }
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: heading, paragraphs, button (in the right-side column)
  let contentCol = element.querySelector('.background-image-column');
  let content = [];
  if (contentCol) {
    // Remove the background-image decorative div if present (for clean content)
    const bgImgDiv = contentCol.querySelector('.background-image');
    if (bgImgDiv) bgImgDiv.remove();
    // Heading
    const heading = contentCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) content.push(heading);
    // Paragraph(s), excluding button-container
    contentCol.querySelectorAll('p:not(.button-container)').forEach(p => content.push(p));
    // Button/link
    const buttonContainer = contentCol.querySelector('p.button-container, div.button-container');
    if (buttonContainer) {
      const btnLink = buttonContainer.querySelector('a');
      if (btnLink) content.push(btnLink);
    }
  }

  // Fallback: if no content found (shouldn't happen for valid block)
  if (content.length === 0) {
    content = [''];
  }

  // Create the table as per the block guidelines
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    [content],
  ], document);

  element.replaceWith(table);
}
