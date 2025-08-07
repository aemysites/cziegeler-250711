/* global WebImporter */
export default function parse(element, { document }) {
  // The accordion is structured as two columns, each column is a <div> inside the main block
  // Each column has multiple <div>s, each with 2 child divs: [question, answer]

  // Collect all immediate column divs
  const columnDivs = Array.from(element.querySelectorAll(':scope > div > div'));
  const accordionRows = [];

  columnDivs.forEach((columnDiv) => {
    Array.from(columnDiv.children).forEach((itemDiv) => {
      // Each itemDiv should have 2 children: [question, answer]
      if (itemDiv.children.length >= 2) {
        const title = itemDiv.children[0];
        const content = itemDiv.children[1];
        // Only push if both title and content exist and are not empty
        if (title.textContent.trim() || content.textContent.trim()) {
          accordionRows.push([title, content]);
        }
      }
    });
  });

  // Compose the table: header + each accordion row
  const tableRows = [
    ['Accordion'],
    ...accordionRows
  ];

  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
