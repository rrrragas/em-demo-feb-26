/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-award block
 * Source: https://www.business.att.com/
 * Base Block: columns
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.order-img-top img') ||
                element.querySelector('.imgOffer') ||
                element.querySelector('.gvpImgTarget');
  const heading = element.querySelector('h2') || element.querySelector('h1');
  const description = element.querySelector('.wysiwyg-editor p') ||
                      element.querySelector('.type-base p');
  const legal = element.querySelector('.type-legal-wysiwyg-editor p') ||
                element.querySelector('.type-legal p');

  const textContent = [];
  if (heading) textContent.push(heading);
  if (description) textContent.push(description);
  if (legal) textContent.push(legal);

  const cells = [
    [image || '', textContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Award', cells });
  element.replaceWith(block);
}
