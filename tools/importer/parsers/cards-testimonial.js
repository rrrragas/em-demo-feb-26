/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-testimonial block
 * Source: https://www.business.att.com/
 * Base Block: cards
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.tile-card'));
  const cells = [];

  cards.forEach((card) => {
    const tag = card.querySelector('.eyebrow-text') || card.querySelector('.type-eyebrow-md') || card.querySelector('[class*="eyebrow"]');
    const heading = card.querySelector('h3') || card.querySelector('h2');
    const description = card.querySelector('.tileSubheading p') || card.querySelector('.type-sm p');
    const attribution = card.querySelector('sup') || card.querySelector('.attribution');
    const cta = card.querySelector('.cta-container a') || card.querySelector('a[href]');

    const tagCell = tag ? tag.textContent.trim() : '';
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (attribution) contentCell.push(attribution);
    if (cta) contentCell.push(cta);

    cells.push([tagCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Testimonial', cells });
  element.replaceWith(block);
}
