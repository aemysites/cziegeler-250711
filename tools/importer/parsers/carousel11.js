/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.quote-carousel.block');
  if (!carousel) return;

  // Gather all quotecard slides
  const slides = Array.from(carousel.querySelectorAll('.quotecard'));

  // Header row as in the example
  const rows = [['Carousel']];

  // Process each slide
  slides.forEach((slide) => {
    // IMAGE extraction: First cell should be ONLY the image from the aphorist picture img
    let imgEl = null;
    const aphorist = slide.querySelector('.aphorist');
    if (aphorist) {
      const picture = aphorist.querySelector('picture');
      if (picture) {
        imgEl = picture.querySelector('img');
      }
    }

    // TEXT extraction: Second cell: quote (p), author (li[0]), organization (li[1])
    const textCellContent = [];
    // Get quote (may be null)
    const quoteP = slide.querySelector('p');
    if (quoteP) {
      // Use <blockquote> for semantic meaning of the quote
      const blockquote = document.createElement('blockquote');
      blockquote.appendChild(quoteP);
      textCellContent.push(blockquote);
    }
    // Author and org
    if (aphorist) {
      const ul = aphorist.querySelector('ul');
      if (ul) {
        const lis = ul.querySelectorAll('li');
        if (lis.length > 0) {
          // Author as <strong>
          const strong = document.createElement('strong');
          strong.textContent = lis[0].textContent.trim();
          textCellContent.push(document.createElement('br'));
          textCellContent.push(strong);
        }
        if (lis.length > 1) {
          // Org as <span>
          const span = document.createElement('span');
          span.textContent = lis[1].textContent.trim();
          textCellContent.push(document.createElement('br'));
          textCellContent.push(span);
        }
      }
    }
    // Only add br if both author/org exist
    // Remove first br if textCellContent is just [blockquote, br]
    if (textCellContent.length === 2 && textCellContent[1].tagName === 'BR') {
      textCellContent.pop();
    }
    // If quoteP is null, remove blockquote from textCellContent
    if (!quoteP && textCellContent.length > 0 && textCellContent[0].tagName === 'BLOCKQUOTE') {
      textCellContent.shift();
    }

    // Place the original elements directly in the table cells
    rows.push([
      imgEl,
      textCellContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
