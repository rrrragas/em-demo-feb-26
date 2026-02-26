/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for AT&T Business website cleanup
 * Purpose: Remove non-content elements and fix DOM issues common across AT&T Business pages
 * Applies to: www.business.att.com (all templates)
 * Generated: 2026-02-26
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove empty utility divs that interfere with content parsing
    // EXTRACTED: Found in captured DOM - empty .max-width-background divs throughout
    const emptyDivs = element.querySelectorAll('.max-width-background');
    emptyDivs.forEach((div) => {
      if (!div.textContent.trim() && !div.querySelector('img')) {
        div.remove();
      }
    });

    // Remove empty price components
    // EXTRACTED: Found in captured DOM - .price-comp-wrapper with empty .price-comp children
    const emptyPriceWrappers = element.querySelectorAll('.price-comp-wrapper');
    emptyPriceWrappers.forEach((pw) => {
      const priceComp = pw.querySelector('.price-comp');
      if (priceComp && !priceComp.textContent.trim()) {
        pw.remove();
      }
    });

    // Remove empty timer elements
    // EXTRACTED: Found in captured DOM - .timer divs with no content
    const timers = element.querySelectorAll('.timer');
    timers.forEach((t) => {
      if (!t.textContent.trim()) t.remove();
    });

    // Remove empty video containers and link containers
    // EXTRACTED: Found in captured DOM - .video-content-offer .links-container with no content
    const emptyLinkContainers = element.querySelectorAll('.video-content-offer .links-container');
    emptyLinkContainers.forEach((c) => {
      if (!c.textContent.trim()) c.remove();
    });

    // Remove empty CTA containers
    // EXTRACTED: Found in captured DOM - .cta-container with no links
    const emptyCtaContainers = element.querySelectorAll('.cta-container');
    emptyCtaContainers.forEach((c) => {
      if (!c.querySelector('a') && !c.textContent.trim()) c.remove();
    });

    // Remove hidden spoken text (accessibility duplicates)
    // EXTRACTED: Found in captured DOM - .hidden-spoken divs with redundant price text
    WebImporter.DOMUtils.remove(element, ['.hidden-spoken']);

    // Remove swiper-specific elements that are non-content
    // EXTRACTED: Found in captured DOM - .swiper-pagination, .swiper-button-next/prev
    WebImporter.DOMUtils.remove(element, [
      '.swiper-pagination',
      '.swiper-button-next',
      '.swiper-button-prev',
      '.swiper-scrollbar',
    ]);

    // Remove absolute-fill overlay divs that are empty
    // EXTRACTED: Found in captured DOM - .absolute-fill.overflow-hidden and .absolute-fill.bgcolor
    const absoluteFills = element.querySelectorAll('.absolute-fill');
    absoluteFills.forEach((af) => {
      if (!af.textContent.trim() && !af.querySelector('img')) {
        af.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean tracking attributes
    // EXTRACTED: Found in captured DOM - data-track, data-analytics, onclick attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp');
    });
  }
}
