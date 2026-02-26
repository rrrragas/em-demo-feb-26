/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-offer block
 * Source: https://www.business.att.com/
 * Base Block: columns
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Left column content
  const eyebrow = element.querySelector('.eyebrow-lg-desktop') ||
                  element.querySelector('[class*="eyebrow"]');
  const heading = element.querySelector('h2') || element.querySelector('h1');
  const description = element.querySelector('.wysiwyg-editor p') ||
                      element.querySelector('.type-base p');
  const checkItems = Array.from(
    element.querySelectorAll('.check-list-item, .checklist li, ul li')
  );
  const legal = element.querySelector('.type-legal-wysiwyg-editor p') ||
                element.querySelector('.type-legal p');
  const cta = element.querySelector('.cta-container a') || element.querySelector('a.btn');

  const leftContent = [];
  if (eyebrow && eyebrow.textContent.trim()) leftContent.push(eyebrow.textContent.trim());
  if (heading) leftContent.push(heading);
  if (description) leftContent.push(description);
  if (checkItems.length > 0) {
    const listText = checkItems.map((li) => '- ' + li.textContent.trim()).join('\n');
    leftContent.push(listText);
  }
  if (legal) leftContent.push(legal);
  if (cta) leftContent.push(cta);

  // Right column: image
  const image = element.querySelector('.order-img-top img') ||
                element.querySelector('.imgOffer') ||
                element.querySelector('.gvpImgTarget');

  const cells = [
    [leftContent, image || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Offer', cells });
  element.replaceWith(block);
}
