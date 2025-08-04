/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Hero (hero4)'];

  // --- Background image row ---
  // Try: 1. data-background-image attribute 2. inner background-image column img
  let bgImgEl = null;
  const bgImgUrl = element.getAttribute('data-background-image');
  if (bgImgUrl) {
    // Use absolute URL if necessary
    let src = bgImgUrl;
    if (src.startsWith('/')) {
      src = window.location.origin + src;
    }
    bgImgEl = document.createElement('img');
    bgImgEl.src = src;
    bgImgEl.alt = '';
  } else {
    // fallback: try to find .background-image img
    const innerBg = element.querySelector('.background-image img');
    if (innerBg) bgImgEl = innerBg;
  }
  const bgImageRow = [bgImgEl || ''];

  // --- Content row ---
  // Find the content column (right side)
  let contentCol = null;
  const colsBlock = element.querySelector('.columns.block');
  if (colsBlock) {
    const colDivs = colsBlock.querySelectorAll(':scope > div');
    // Heuristic: the column with .background-image-column is likely the right one
    colDivs.forEach((div) => {
      if (div.classList.contains('background-image-column')) contentCol = div;
    });
    // Fallback: use right column if not found by class
    if (!contentCol && colDivs.length > 1) {
      contentCol = colDivs[1];
    }
  }
  if (!contentCol) contentCol = element;

  // Collect elements for the content cell, in order: heading, paragraphs, CTA
  const contentCell = [];
  // Find the first h1, h2, or h3 in the contentCol
  const heading = contentCol.querySelector('h1,h2,h3');
  if (heading) contentCell.push(heading);
  // Collect all regular paragraphs (ignore .button-container)
  const paragraphs = [...contentCol.querySelectorAll('p:not(.button-container)')];
  paragraphs.forEach(p => contentCell.push(p));
  // Find button/cta
  // Prefer to reference the <p class="button-container"> if it exists, otherwise the button/a itself
  const btnContainer = contentCol.querySelector('p.button-container');
  if (btnContainer) {
    contentCell.push(btnContainer);
  } else {
    const btn = contentCol.querySelector('.button, a.button');
    if (btn) contentCell.push(btn);
  }
  // If nothing found, push empty string
  const contentRow = [contentCell.length ? contentCell : ''];

  // Compose the table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
