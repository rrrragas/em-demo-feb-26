import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Restructure utility links from pipe-separated paragraph into a grid of lists.
 * Source layout: 4-column grid, each column has 2 links stacked vertically.
 * @param {Element} section The utility links section element
 */
function decorateUtilityLinks(section) {
  const dcw = section.querySelector('.default-content-wrapper');
  if (!dcw) return;

  const p = dcw.querySelector('p');
  if (!p) return;

  const links = [...p.querySelectorAll('a')];
  if (links.length === 0) return;

  // Split links into groups of 2 for a 4-column grid
  const grid = document.createElement('div');
  grid.className = 'footer-utility-grid';

  const groupSize = 2;
  for (let i = 0; i < links.length; i += groupSize) {
    const ul = document.createElement('ul');
    links.slice(i, i + groupSize).forEach((link) => {
      const li = document.createElement('li');
      const a = link.cloneNode(true);
      li.append(a);
      ul.append(li);
    });
    grid.append(ul);
  }

  p.replaceWith(grid);
}

/**
 * Restructure legal links from pipe-separated paragraph into a list.
 * @param {Element} section The legal section element
 */
function decorateLegalLinks(section) {
  const dcw = section.querySelector('.default-content-wrapper');
  if (!dcw) return;

  const paragraphs = dcw.querySelectorAll('p');
  if (paragraphs.length === 0) return;

  // First paragraph has the legal links with pipe separators
  const linkP = paragraphs[0];
  const links = [...linkP.querySelectorAll('a')];
  if (links.length === 0) return;

  const ul = document.createElement('ul');
  ul.className = 'footer-legal-links';
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = link.cloneNode(true);
    li.append(a);
    ul.append(li);
  });

  linkP.replaceWith(ul);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Get the 4 sections: [0] teal banner, [1] categories, [2] utility, [3] legal
  const sections = footer.querySelectorAll('.section');
  if (sections.length >= 3) decorateUtilityLinks(sections[2]);
  if (sections.length >= 4) decorateLegalLinks(sections[3]);

  block.append(footer);
}
