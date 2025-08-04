/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block containing the slides
  const quoteCarousel = element.querySelector('.quote-carousel.block');
  if (!quoteCarousel) return;

  const quoteCards = Array.from(quoteCarousel.querySelectorAll('.quotecard'));
  if (!quoteCards.length) return;

  // Build block rows: first row is header
  const rows = [['Carousel']];

  quoteCards.forEach((card) => {
    // Extract image (mandatory) from .aphorist > picture > img
    let img = null;
    const aphorist = card.querySelector('.aphorist');
    if (aphorist) {
      const picture = aphorist.querySelector('picture');
      if (picture) {
        img = picture.querySelector('img');
      }
    }

    // Prepare text cell (quote + attribution)
    const cellContent = [];

    // Quote text in <p> (styled as <h3> per semantic importance)
    const p = card.querySelector('p');
    if (p && p.textContent.trim()) {
      const heading = document.createElement('h3');
      heading.textContent = p.textContent.trim();
      cellContent.push(heading);
    }

    // Attribution from .aphorist > ul > li
    if (aphorist) {
      const ul = aphorist.querySelector('ul');
      if (ul) {
        const lis = ul.querySelectorAll('li');
        if (lis.length > 0 && lis[0].textContent.trim()) {
          // Author name bold
          const author = document.createElement('strong');
          author.textContent = lis[0].textContent.trim();
          cellContent.push(author);
        }
        if (lis.length > 1 && lis[1].textContent.trim()) {
          // Affiliation
          const org = document.createElement('div');
          org.textContent = lis[1].textContent.trim();
          cellContent.push(org);
        }
      }
    }

    // Only add row if we have an image and at least quote or author
    if (img && cellContent.length > 0) {
      rows.push([
        img,
        cellContent
      ]);
    }
  });

  // Create block table and replace original element
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
