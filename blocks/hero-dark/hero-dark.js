export default function decorate(block) {
  const rows = [...block.children];

  // No rows, nothing to do
  if (rows.length === 0) return;

  // Row 0: images — first picture = background, second = product (hidden)
  const imageRow = rows[0];
  const pictures = imageRow.querySelectorAll('picture');
  const bgPicture = pictures[0];

  // Create background wrapper
  const bgDiv = document.createElement('div');
  bgDiv.className = 'hero-dark-bg';
  if (bgPicture) bgDiv.append(bgPicture);

  // Content wrapper
  const content = document.createElement('div');
  content.className = 'hero-dark-content';

  // Row 1: eyebrow (may be empty)
  const eyebrowText = rows[1]?.children[0]?.textContent?.trim();
  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-dark-eyebrow';
    eyebrow.textContent = eyebrowText;
    content.append(eyebrow);
  }

  // Row 2: heading
  const headingText = rows[2]?.children[0]?.textContent?.trim();
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    content.append(h2);
  }

  // Rows 3+: descriptions, lists, disclaimers, CTAs
  const ctaLinks = [];
  rows.slice(3).forEach((row) => {
    const firstCell = row.children[0];
    const secondCell = row.children[1];

    // Check for CTA links
    const link1 = firstCell?.querySelector('a');
    const link2 = secondCell?.querySelector('a');
    if (link1 || link2) {
      if (link1) ctaLinks.push(link1);
      if (link2) ctaLinks.push(link2);
      return;
    }

    const p = firstCell?.querySelector('p');
    if (!p || !p.textContent.trim()) return;

    // Disclaimer (has <em>)
    if (p.querySelector('em')) {
      const disclaimer = document.createElement('p');
      disclaimer.className = 'hero-dark-disclaimer';
      disclaimer.textContent = p.querySelector('em').textContent;
      content.append(disclaimer);
    } else if (p.textContent.trim().startsWith('-')) {
      // Bullet list (lines starting with -)
      const ul = document.createElement('ul');
      ul.className = 'hero-dark-list';
      const items = p.innerHTML.split(/<br\s*\/?>/);
      items.forEach((item) => {
        const text = item.replace(/<[^>]+>/g, '').replace(/^[\s-]+/, '').trim();
        if (text) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.append(li);
        }
      });
      content.append(ul);
    } else {
      // Description paragraph
      const desc = document.createElement('p');
      desc.className = 'hero-dark-description';
      desc.textContent = p.textContent;
      content.append(desc);
    }
  });

  // Add CTA container
  if (ctaLinks.length > 0) {
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'hero-dark-cta';
    ctaLinks.forEach((link, i) => {
      const a = link.cloneNode(true);
      a.className = i === 0 ? 'hero-dark-btn-primary' : 'hero-dark-btn-secondary';
      ctaDiv.append(a);
    });
    content.append(ctaDiv);
  }

  // Replace block contents
  block.textContent = '';
  block.append(bgDiv, content);
}
