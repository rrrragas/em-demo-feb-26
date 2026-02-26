/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner block
 *
 * Source: https://www.business.att.com/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: Mobile image
 * - Row 3: Eyebrow text
 * - Row 4: Heading
 * - Row 5: Description
 *
 * Source HTML Pattern:
 * .hero.aem-GridColumn .hero-wrapper.theme-light-bg-img
 *   .bg-hero-panel img (background)
 *   .hero-panel-image img (mobile)
 *   .eyebrow-lg-desktop (eyebrow text)
 *   h2 (heading)
 *   .wysiwyg-editor p (description)
 *
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('.bg-hero-panel img') ||
                  element.querySelector('.bg-no-repeat img') ||
                  element.querySelector('.bg-art img');

  // Extract mobile image
  const mobileImage = element.querySelector('.hero-panel-image img') ||
                      element.querySelector('.visible-mobile');

  // Extract eyebrow text
  const eyebrow = element.querySelector('.eyebrow-lg-desktop') ||
                  element.querySelector('[class*="eyebrow"]');

  // Extract heading
  const heading = element.querySelector('h2') ||
                  element.querySelector('h1') ||
                  element.querySelector('[class*="heading"]');

  // Extract description
  const description = element.querySelector('.wysiwyg-editor p') ||
                      element.querySelector('.type-base p') ||
                      element.querySelector('p');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Mobile image
  if (mobileImage) {
    cells.push([mobileImage]);
  }

  // Row 3: Eyebrow
  if (eyebrow) {
    cells.push([eyebrow.textContent.trim()]);
  }

  // Row 4: Heading
  if (heading) {
    cells.push([heading]);
  }

  // Row 5: Description
  if (description) {
    cells.push([description]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Banner', cells });
  element.replaceWith(block);
}
