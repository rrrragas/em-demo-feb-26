function formatCardBody(body) {
  const p = body.querySelector('p');
  if (!p) return;

  const fragment = document.createDocumentFragment();

  // Extract title from <strong>
  const strong = p.querySelector('strong');
  if (strong) {
    const title = document.createElement('h3');
    title.className = 'cards-product-title';
    title.textContent = strong.textContent;
    fragment.append(title);
  }

  // Extract link
  const link = p.querySelector('a');

  // Extract disclaimer from <em>
  const em = p.querySelector('em');

  // Collect text segments between <br> tags (skip title, disclaimer, and link)
  const segments = [];
  let current = '';
  [...p.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') {
      if (current.trim()) segments.push(current.trim());
      current = '';
    } else if (node === strong || node === link || node === em) {
      // skip these - handled separately
    } else if (node.nodeType === Node.TEXT_NODE) {
      current += node.textContent;
    }
  });
  if (current.trim()) segments.push(current.trim());

  // segments: [description, pricing line]
  const [description, pricingText] = segments;

  if (description) {
    const desc = document.createElement('p');
    desc.className = 'cards-product-desc';
    desc.textContent = description;
    fragment.append(desc);
  }

  if (pricingText) {
    const priceMatch = pricingText.match(/^(.*?)\$(\d+)(\/mo\.?)(.*)/);
    if (priceMatch) {
      const pricingDiv = document.createElement('div');
      pricingDiv.className = 'cards-product-pricing';

      const label = document.createElement('p');
      label.className = 'cards-product-price-label';
      label.textContent = priceMatch[1].trim();
      pricingDiv.append(label);

      const amount = document.createElement('p');
      amount.className = 'cards-product-price-amount';
      amount.innerHTML = `<span class="cards-product-dollar">$</span>${priceMatch[2]}<span class="cards-product-period">${priceMatch[3]}</span>`;
      pricingDiv.append(amount);

      const extra = priceMatch[4].trim();
      if (extra) {
        const sub = document.createElement('p');
        sub.className = 'cards-product-price-sub';
        sub.textContent = extra;
        pricingDiv.append(sub);
      }

      fragment.append(pricingDiv);
    } else {
      // "Custom pricing to fit your business needs" style
      const custom = document.createElement('p');
      custom.className = 'cards-product-custom-pricing';
      custom.textContent = pricingText;
      fragment.append(custom);
    }
  }

  if (em) {
    const disclaimer = document.createElement('p');
    disclaimer.className = 'cards-product-disclaimer';
    disclaimer.textContent = em.textContent;
    fragment.append(disclaimer);
  }

  if (link) {
    const cta = document.createElement('p');
    cta.className = 'cards-product-cta';
    const a = link.cloneNode(true);
    cta.append(a);
    fragment.append(cta);
  }

  body.textContent = '';
  body.append(fragment);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-product-card-image';
      } else {
        div.className = 'cards-product-card-body';
        formatCardBody(div);
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
