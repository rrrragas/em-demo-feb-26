/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature block
 * Source: https://www.business.att.com/
 * Base Block: cards
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.generic-list-icon-vp'));
  const cells = [];

  items.forEach((item) => {
    const icon = item.querySelector('img');
    const heading = item.querySelector('h4') || item.querySelector('h3');
    const description = item.querySelector('.type-sm p') || item.querySelector('.type-base p') || item.querySelector('p');
    const legal = item.querySelector('.type-legal-wysiwyg-editor p') || item.querySelector('.type-legal p');
    const cta = item.querySelector('a[href]');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (legal) contentCell.push(legal);
    if (cta) contentCell.push(cta);

    cells.push([icon || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Feature', cells });
  element.replaceWith(block);
}
