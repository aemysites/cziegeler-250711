/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required by spec
  const rows = [['Cards']];
  // Get all steps (each direct child of .steps.block)
  const stepsBlock = element.querySelector('.steps.block');
  if (!stepsBlock) {
    // Defensive: if not found, do nothing
    return;
  }
  const stepCards = stepsBlock.querySelectorAll(':scope > div');
  stepCards.forEach((card) => {
    // Each card contains: .step > span, then two <p>s (1st=title, 2nd=desc)
    const span = card.querySelector('.step span');
    const ps = card.querySelectorAll('p');
    if (!span && ps.length === 0) {
      // Skip cards with no content
      return;
    }
    // Compose card DOM:
    // Number as bold (with period), Title as bold (strong), then <br>, then description as normal text
    const wrapper = document.createElement('div');
    if (span) {
      const num = document.createElement('strong');
      num.textContent = span.textContent.trim() + '. ';
      wrapper.appendChild(num);
    }
    if (ps[0]) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = ps[0].textContent.trim();
      wrapper.appendChild(titleEl);
      wrapper.appendChild(document.createElement('br'));
    }
    if (ps[1]) {
      // Use existing <p> for description (referencing, not cloning)
      wrapper.appendChild(ps[1]);
    }
    rows.push([wrapper]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
