/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-dark block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: [background image] | [side image]
 * - Row 2: [eyebrow] | (empty)
 * - Row 3: [heading] | (empty)
 * - Row 4: [description] | (empty)
 * - Row 5: [legal] | (empty)
 * - Row 6: [CTA 1] | [CTA 2]
 *
 * Source HTML Pattern:
 * .hero.aem-GridColumn .hero-wrapper.theme-dark-bg-img
 *
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('.bg-hero-panel img') ||
                  element.querySelector('.bg-no-repeat img') ||
                  element.querySelector('.bg-art img');

  // Extract side/content image
  const sideImage = element.querySelector('.hero-panel-image img') ||
                    element.querySelector('.visible-mobile');

  // Extract eyebrow
  const eyebrow = element.querySelector('.eyebrow-lg-desktop') ||
                  element.querySelector('[class*="eyebrow"]');

  // Extract heading
  const heading = element.querySelector('h2') ||
                  element.querySelector('h1');

  // Extract description
  const descEl = element.querySelector('.wysiwyg-editor p') ||
                 element.querySelector('.type-base p');

  // Extract legal text
  const legal = element.querySelector('.type-legal-wysiwyg-editor p') ||
                element.querySelector('.type-legal p');

  // Extract CTAs
  const ctas = Array.from(element.querySelectorAll('.cta-container a'));

  // Extract checklist items if present
  const checkItems = Array.from(
    element.querySelectorAll('.check-list-item, .checklist-item, ul li')
  );

  // Build cells array - 2-column layout for dark hero
  const cells = [];

  // Row 1: Background image | Side image
  const imgRow = [];
  imgRow.push(bgImage || '');
  imgRow.push(sideImage || '');
  cells.push(imgRow);

  // Row 2: Eyebrow
  if (eyebrow && eyebrow.textContent.trim()) {
    cells.push([eyebrow.textContent.trim(), '']);
  }

  // Row 3: Heading
  if (heading) {
    cells.push([heading, '']);
  }

  // Row 4: Description
  if (descEl) {
    cells.push([descEl, '']);
  }

  // Row 4b: Checklist (if present)
  if (checkItems.length > 0) {
    const listContent = checkItems.map((li) => li.textContent.trim()).join('\n- ');
    cells.push(['- ' + listContent, '']);
  }

  // Row 5: Legal
  if (legal) {
    cells.push([legal, '']);
  }

  // Row 6: CTAs (up to 2 side by side)
  if (ctas.length > 0) {
    cells.push([ctas[0] || '', ctas[1] || '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Dark', cells });
  element.replaceWith(block);
}
