/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-links block
 * Source: https://www.business.att.com/
 * Base Block: columns
 * Generated: 2026-02-26
 */
export default function parse(element, { document }) {
  const columns = Array.from(
    element.querySelectorAll('.link-farm-col, .grid-col-3, [class*="link-farm"] > div > div')
  );

  // If specific column classes not found, try getting direct child divs
  let colElements = columns;
  if (colElements.length === 0) {
    const container = element.querySelector('.container .row') || element;
    colElements = Array.from(container.querySelectorAll(':scope > div'));
  }

  const cells = [];
  const row = [];

  colElements.forEach((col) => {
    const links = Array.from(col.querySelectorAll('a[href]'));
    if (links.length > 0) {
      row.push(links);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Links', cells });
  element.replaceWith(block);
}
