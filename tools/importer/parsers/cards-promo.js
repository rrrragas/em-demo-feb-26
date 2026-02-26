/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo block
 * Source: https://www.business.att.com/
 * Base Block: cards
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.card-wrapper'));
  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('.card img') || card.querySelector('img');
    const eyebrow = card.querySelector('.eyebrow-text') || card.querySelector('[class*="eyebrow"]');
    const heading = card.querySelector('h2') || card.querySelector('h3');
    const description = card.querySelector('.wysiwyg-editor p') || card.querySelector('.type-base p');
    const legal = card.querySelector('.type-legal-wysiwyg-editor p');
    const cta = card.querySelector('.cta-container a') || card.querySelector('a.btn');

    const contentCell = [];
    if (eyebrow && eyebrow.textContent.trim()) contentCell.push(eyebrow.textContent.trim());
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (legal) contentCell.push(legal);
    if (cta) contentCell.push(cta);

    cells.push([image || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Promo', cells });
  element.replaceWith(block);
}
