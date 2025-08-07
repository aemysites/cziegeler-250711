/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Hero (hero2)'];

  // Extract the primary image (background image) from the .right div's <picture>
  let imageEl = null;
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const rightDiv = heroWrapper.querySelector('.right');
    if (rightDiv) {
      // Prefer the <picture> element as is
      const picture = rightDiv.querySelector('picture');
      if (picture) {
        imageEl = picture;
      }
    }
  }
  // If not found, still provide empty string so the row is present
  const imageRow = [imageEl || ''];

  // Extract left content (headings + CTA) and footer (h3)
  let contentNodes = [];
  if (heroWrapper) {
    const leftDiv = heroWrapper.querySelector('.left');
    if (leftDiv) {
      // Preserve all child elements in order as array
      const leftChildren = Array.from(leftDiv.children);
      contentNodes = contentNodes.concat(leftChildren);
    }
  }
  const heroFooter = element.querySelector('.hero-footer');
  if (heroFooter) {
    // Usually contains an h3
    const footerChildren = Array.from(heroFooter.children);
    contentNodes = contentNodes.concat(footerChildren);
  }
  // Always provide, even if empty
  const contentRow = [contentNodes.length ? contentNodes : ''];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);
  element.replaceWith(block);
}
