/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product block
 * Source: https://www.business.att.com/
 * Base Block: cards
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.tile-card'));
  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('.card-img img') || card.querySelector('img');
    const heading = card.querySelector('h3') || card.querySelector('h2');
    const description = card.querySelector('.tileSubheading p') || card.querySelector('.type-sm p');
    const priceDesc = card.querySelector('.price-description');
    const priceAmount = card.querySelector('.price .font-bold');
    const legal = card.querySelector('.type-legal-wysiwyg-editor p') || card.querySelector('.type-legal p');
    const cta = card.querySelector('.cta-container a') || card.querySelector('a[href]');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (priceDesc || priceAmount) {
      const priceText = [priceDesc, priceAmount].filter(Boolean).map((el) => el.textContent.trim()).join(' ');
      if (priceText) contentCell.push(priceText);
    }
    if (legal) contentCell.push(legal);
    if (cta) contentCell.push(cta);

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Product', cells });
  element.replaceWith(block);
}
