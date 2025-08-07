/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block within the section
  const callout = element.querySelector('.callout.block');
  if (!callout) return;

  // Get all direct children of the callout block
  const children = Array.from(callout.children);

  // Variables for background image, headline, foreground image
  let backgroundPicture = null;
  let heading = null;
  let foregroundPicture = null;

  // Iterate through children to identify relevant elements
  let pictureCount = 0;
  for (const child of children) {
    if (child.tagName.toLowerCase() === 'picture') {
      if (pictureCount === 0) {
        backgroundPicture = child;
      } else if (pictureCount === 1) {
        foregroundPicture = child;
      }
      pictureCount++;
    } else if (/^h[1-6]$/i.test(child.tagName)) {
      heading = child;
    }
  }

  // Construct the rows for the block table
  const rows = [];
  // Header row as specified in the instructions and example
  rows.push(['Hero (hero3)']);
  // Second row: Background image (if present)
  rows.push([backgroundPicture ? backgroundPicture : '']);
  // Third row: Heading and foreground image (if present)
  const content = [];
  if (heading) content.push(heading);
  if (foregroundPicture) content.push(foregroundPicture);
  rows.push([content.length === 1 ? content[0] : content]);

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
