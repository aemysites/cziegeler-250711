/* global WebImporter */
export default function parse(element, { document }) {
  // Find .callout.block inside the element (it is a wrapper for the content)
  const calloutBlock = element.querySelector('.callout.block');
  if (!calloutBlock) return;

  const calloutChildren = Array.from(calloutBlock.children);

  // Block format:
  // Row 1: ['Hero (hero3)']
  // Row 2: background image (first picture)
  // Row 3: all the content (headline, subheading, button, foreground image, etc)

  // 1. Header row
  const headerRow = ['Hero (hero3)'];

  // 2. Background image (first <picture>)
  let backgroundImage = null;
  for (const child of calloutChildren) {
    if (child.tagName.toLowerCase() === 'picture') {
      backgroundImage = child;
      break;
    }
  }
  const backgroundRow = [backgroundImage ? backgroundImage : ''];

  // 3. Content row (all other content not in background image)
  // The rest: typically headline, secondary image, etc
  const contentItems = [];
  let foundBackground = false;
  for (const child of calloutChildren) {
    if (!foundBackground && child.tagName.toLowerCase() === 'picture') {
      // skip background image
      foundBackground = true;
      continue;
    }
    if (foundBackground) {
      contentItems.push(child);
    }
  }
  // Defensive: if there is no second picture or headline, handle gracefully
  const contentRow = [contentItems.length ? contentItems : ''];

  // Compose table cells
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
