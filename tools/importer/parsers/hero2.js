/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row - must exactly match the example
  const headerRow = ['Hero (hero2)'];

  // --- Row 2: Image (right-side picture)
  let imageRow;
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      const right = heroBlock.querySelector('.right');
      if (right) {
        const picture = right.querySelector('picture');
        if (picture) {
          imageRow = [picture];
        }
      }
    }
  }
  if (!imageRow) imageRow = [''];

  // --- Row 3: Headline, subheadline, CTA, footer
  let contentRow;
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector('.hero.block');
    const contentElements = [];
    // Headline, subheadline, CTA (h1, h2, a)
    if (heroBlock) {
      const left = heroBlock.querySelector('.left');
      if (left) {
        left.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            contentElements.push(node);
          }
        });
      }
    }
    // Footer (h3)
    const heroFooter = element.querySelector('.hero-footer');
    if (heroFooter) {
      const h3 = heroFooter.querySelector('h3');
      if (h3) {
        contentElements.push(h3);
      }
    }
    contentRow = [contentElements];
  } else {
    contentRow = [''];
  }

  // Compose table rows
  const rows = [headerRow, imageRow, contentRow];

  // Create the block table (all elements referenced from source)
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
