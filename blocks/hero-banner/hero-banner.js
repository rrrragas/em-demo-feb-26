export default function decorate(block) {
  const rows = [...block.children];

  // Extract pictures from first two rows (desktop bg, mobile bg)
  const desktopPic = rows[0]?.querySelector('picture');
  const mobilePic = rows[1]?.querySelector('picture');

  // Extract text content from remaining rows (eyebrow, headline, description)
  const eyebrowText = rows[2]?.textContent.trim();
  const headlineText = rows[3]?.textContent.trim();
  const descriptionText = rows[4]?.textContent.trim();

  // Clear block
  block.textContent = '';

  // No image variant
  if (!desktopPic && !mobilePic) {
    block.classList.add('no-image');
  }

  // Build background container
  if (desktopPic || mobilePic) {
    const bgWrap = document.createElement('div');
    bgWrap.className = 'hero-banner-bg';
    if (desktopPic) {
      desktopPic.classList.add('hero-banner-desktop');
      bgWrap.append(desktopPic);
    }
    if (mobilePic) {
      mobilePic.classList.add('hero-banner-mobile');
      bgWrap.append(mobilePic);
    }
    block.append(bgWrap);
  }

  // Build content container
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-banner-eyebrow';
    eyebrow.textContent = eyebrowText;
    content.append(eyebrow);
  }

  if (headlineText) {
    const h2 = document.createElement('h2');
    h2.textContent = headlineText;
    content.append(h2);
  }

  if (descriptionText) {
    const desc = document.createElement('p');
    desc.className = 'hero-banner-description';
    desc.textContent = descriptionText;
    content.append(desc);
  }

  block.append(content);
}
