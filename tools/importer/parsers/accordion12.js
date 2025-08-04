/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row for Accordion
  const cells = [['Accordion']];

  // Find the main block containing the FAQ columns
  const faqBlock = element.querySelector('.faq-inplace');
  if (!faqBlock) {
    // If not found, do not proceed
    return;
  }
  // Query for the two columns in the block
  const columns = Array.from(faqBlock.querySelectorAll(':scope > div'));
  columns.forEach(col => {
    // For each FAQ item in this column
    const items = Array.from(col.querySelectorAll(':scope > div'));
    items.forEach(item => {
      const qa = Array.from(item.querySelectorAll(':scope > div'));
      if (qa.length >= 2) {
        // Reference existing elements for question and answer
        const question = qa[0];
        const answer = qa[1];
        cells.push([question, answer]);
      }
    });
  });

  // Create table using the structure above
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
