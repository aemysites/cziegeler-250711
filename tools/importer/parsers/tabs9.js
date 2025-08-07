/* global WebImporter */
export default function parse(element, { document }) {
  // Find the questions container holding all the tabs
  const questionsContainer = element.querySelector('#faq-replace-questions-container');
  if (!questionsContainer) return;

  // Gather all direct children (each tab/question)
  const tabDivs = Array.from(questionsContainer.children);
  if (!tabDivs.length) return;

  // Compose the rows (header first)
  const rows = [['Tabs']];

  tabDivs.forEach((tab) => {
    // Find <picture> (icon) if any
    const picture = tab.querySelector('picture');

    // Extract the label text (the text node after <picture>, before <div>)
    let label = '';
    let foundPicture = false;
    for (let i = 0; i < tab.childNodes.length; i++) {
      const node = tab.childNodes[i];
      if (picture && node === picture) {
        foundPicture = true;
        continue;
      }
      if (foundPicture && node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        label = node.textContent.trim();
        break;
      }
    }
    if (!label) {
      // If no picture or text node after, try any text node
      for (let i = 0; i < tab.childNodes.length; i++) {
        const node = tab.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          label = node.textContent.trim();
          break;
        }
      }
    }

    // Compose label cell: icon + label (preserve both if present)
    let labelCell;
    if (picture && label) {
      labelCell = [picture, document.createTextNode(' ' + label)];
    } else if (picture) {
      labelCell = [picture];
    } else if (label) {
      labelCell = label;
    } else {
      labelCell = '';
    }

    // Extract the content <div> (answer)
    const contentDiv = Array.from(tab.children).find(el => el.tagName === 'DIV');

    rows.push([
      labelCell,
      contentDiv || '',
    ]);
  });

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
