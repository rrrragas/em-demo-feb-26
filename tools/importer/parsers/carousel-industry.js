/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-industry block
 *
 * Source: https://www.business.att.com/
 * Base Block: carousel
 *
 * Block Structure:
 * - Row per slide: [background image] | [icon + heading + description + CTA]
 *
 * Source HTML Pattern:
 * .story-stack.aem-GridColumn
 *   .story-stack-item (each slide)
 *     img (background)
 *     img (icon)
 *     h3/h4 (heading)
 *     p (description)
 *     a (CTA link)
 *
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  // Find slide items
  const slides = Array.from(
    element.querySelectorAll('.story-stack-item, .story-card, [class*="story-stack"] .card')
  );

  // Fallback: try direct child structure if specific classes not found
  let slideElements = slides;
  if (slideElements.length === 0) {
    const container = element.querySelector('.container .row') || element;
    slideElements = Array.from(container.querySelectorAll(':scope > div'));
  }

  const cells = [];

  slideElements.forEach((slide) => {
    const images = Array.from(slide.querySelectorAll('img'));
    // First image is typically background, second is icon
    const bgImage = images[0] || null;
    const icon = images.length > 1 ? images[1] : null;

    const heading = slide.querySelector('h3') ||
                    slide.querySelector('h4') ||
                    slide.querySelector('h2');
    const description = slide.querySelector('p');
    const cta = slide.querySelector('a[href]');

    // Build content cell: icon + heading + description + CTA
    const contentCell = [];
    if (icon) contentCell.push(icon);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    if (bgImage || contentCell.length > 0) {
      cells.push([bgImage || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel-Industry', cells });
  element.replaceWith(block);
}
