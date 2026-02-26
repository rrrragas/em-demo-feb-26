import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    const brandPicture = navBrand.querySelector('picture');
    if (brandLink && brandPicture) {
      brandLink.textContent = '';
      brandLink.append(brandPicture);
    }
    if (brandLink?.classList.contains('button')) {
      brandLink.className = '';
      brandLink.closest('.button-container')?.classList.remove('button-container');
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // Build search box (visible on desktop only, hidden via CSS on mobile)
  const navSearch = document.createElement('div');
  navSearch.className = 'nav-search';
  const searchForm = document.createElement('form');
  searchForm.className = 'nav-search-form';
  searchForm.setAttribute('role', 'search');
  searchForm.addEventListener('submit', (e) => e.preventDefault());
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = "Let's find what you need...";
  searchInput.setAttribute('aria-label', 'Search AT&T business');
  const searchBtn = document.createElement('button');
  searchBtn.type = 'submit';
  searchBtn.className = 'nav-search-btn';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 14 14" fill="none"><path d="M10.725 10C12.6 7.738 12.366 4.402 10.194 2.424 8.022.446 4.679.524 2.601 2.601.524 4.679.446 8.022 2.424 10.194 4.402 12.366 7.738 12.6 10 10.725L14.13 14.855 14.84 14.145 10.725 10ZM6.5 11C4.015 11 2 8.985 2 6.5S4.015 2 6.5 2 11 4.015 11 6.5 8.985 11 6.5 11Z" fill="#1D2329"/></svg>';
  searchForm.append(searchInput, searchBtn);
  navSearch.append(searchForm);
  nav.append(navSearch);

  // Build account sign-in link (visible on desktop only, hidden via CSS on mobile)
  const navAccount = document.createElement('div');
  navAccount.className = 'nav-account';
  const accountLink = document.createElement('a');
  accountLink.href = 'https://www.att.com/acctmgmt/signin';
  accountLink.className = 'nav-account-link';
  accountLink.textContent = 'Account sign in';
  navAccount.append(accountLink);
  nav.append(navAccount);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  // build two-tier header: top utility bar + main nav
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // create top utility bar (desktop only, hidden via CSS on mobile)
  const topBar = document.createElement('div');
  topBar.className = 'nav-top-bar';
  const topBarInner = document.createElement('div');
  topBarInner.className = 'nav-top-bar-inner';

  // Personal | Business toggle on left
  const segmentToggle = document.createElement('div');
  segmentToggle.className = 'nav-segment';
  segmentToggle.innerHTML = '<a href="https://www.att.com/?customerType=personal">Personal</a>'
    + '<span class="nav-segment-divider">|</span>'
    + '<a href="https://www.business.att.com" class="nav-segment-active">Business</a>';
  topBarInner.append(segmentToggle);

  // Clone tools links into top bar (original stays in nav for mobile)
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const topTools = document.createElement('div');
    topTools.className = 'nav-top-tools';
    const toolsClone = navTools.querySelector('.default-content-wrapper');
    if (toolsClone) {
      topTools.append(toolsClone.cloneNode(true));
    }
    topBarInner.append(topTools);
  }

  topBar.append(topBarInner);
  navWrapper.append(topBar);
  navWrapper.append(nav);
  block.append(navWrapper);
}
