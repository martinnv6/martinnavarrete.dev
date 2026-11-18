/**
 * martinnavarrete.dev - Core Client-Side Logic
 * Pure vanilla JavaScript: Fast, zero external dependencies, accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLanguage();
  initExperienceFilters();
  initResumeModal();
  initMobileNavigation();
  initHeaderScroll();
});

/**
 * Theme Toggle with LocalStorage & OS Preference sync
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or fallback to system preference
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = htmlRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      try { localStorage.setItem('theme', newTheme); } catch (e) { /* storage unavailable */ }
    });
  }

  // React to OS-level theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) { /* storage unavailable */ }
    if (!stored) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#080b11');
  }
}

/**
 * Experience Timeline Filtering
 */
function initExperienceFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!filterButtons.length || !timelineItems.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // Update active button state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      // Filter timeline items
      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Resume Download Modal using native HTML5 <dialog>
 */
function initResumeModal() {
  const dialog = document.getElementById('resume-dialog');
  const openButtons = Array.from(document.querySelectorAll('#resume-modal-btn, [data-open-resumes]'))
    .filter((btn, i, all) => all.indexOf(btn) === i);
  const closeBtn = document.getElementById('modal-close-btn');

  if (!dialog) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dialog.showModal();
      btn.setAttribute('aria-expanded', 'true');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeDialog();
    });
  }

  // Close when clicking dialog backdrop
  dialog.addEventListener('click', (e) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeDialog();
    }
  });

  dialog.addEventListener('cancel', () => {
    openButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  });

  // "See the leadership / engineering resumes" links land on /<track>/#resumes:
  // open the dialog straight away, and drop the hash so a reload doesn't reopen it.
  if (location.hash === '#resumes' && typeof dialog.showModal === 'function') {
    dialog.showModal();
    history.replaceState(null, '', location.pathname + location.search);
  }

  function closeDialog() {
    dialog.close();
    openButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  }
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-sublink');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isExpanded = navMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isExpanded.toString());
  });

  // Escape closes the menu and returns focus to the toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.focus();
    }
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * Header shadow effect on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * English / Spanish switch.
 *
 * English is the source text in the HTML. /i18n.js defines window.I18N_ES as a
 * translation memory: { "English text block": "Spanish text block" }, keyed by
 * the block's innerHTML with whitespace collapsed. One entry covers every page
 * where that text appears (header, contact, resume dialog, footer...).
 *
 * The walk translates the outermost element whose content matches an entry and
 * skips its children, so a <li> with <strong> inside is translated as a whole.
 * Text that has no entry simply stays in English. Originals are cached, so
 * switching back to English restores the exact markup.
 */
function initLanguage() {
  const dict = window.I18N_ES || {};
  const toggle = document.getElementById('lang-toggle');
  const root = document.documentElement;
  const ATTRS = ['aria-label', 'title', 'content', 'alt'];
  const originalHtml = new Map();
  const originalAttrs = new Map();
  const originalTitle = document.title;
  const norm = (str) => str.replace(/\s+/g, ' ').trim();

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* not persisted */ } }
  };

  // Collect translatable blocks once, in English, before anything is swapped.
  const blocks = [];
  (function walk(el) {
    for (const child of el.children) {
      if (child.matches('script, style, svg, template, #lang-toggle')) continue;
      const key = norm(child.innerHTML);
      if (key && Object.prototype.hasOwnProperty.call(dict, key)) {
        blocks.push(child);
        originalHtml.set(child, child.innerHTML);
      } else {
        walk(child);
      }
    }
  })(document.body);

  const attrEls = [];
  document.querySelectorAll('[aria-label], [title], meta[name="description"], img[alt]').forEach(el => {
    if (el.id === 'lang-toggle') return;
    const saved = {};
    ATTRS.forEach(a => {
      const v = el.getAttribute(a);
      if (v && Object.prototype.hasOwnProperty.call(dict, norm(v))) saved[a] = v;
    });
    if (Object.keys(saved).length) { attrEls.push(el); originalAttrs.set(el, saved); }
  });

  function apply(lang) {
    const es = lang === 'es';
    blocks.forEach(el => {
      const en = originalHtml.get(el);
      el.innerHTML = es ? dict[norm(en)] : en;
    });
    attrEls.forEach(el => {
      const saved = originalAttrs.get(el);
      Object.keys(saved).forEach(a => el.setAttribute(a, es ? dict[norm(saved[a])] : saved[a]));
    });
    const t = norm(originalTitle);
    document.title = es && dict[t] ? dict[t] : originalTitle;
    root.setAttribute('lang', es ? 'es' : 'en');

    // Keep internal links in the chosen language
    document.querySelectorAll('a[href^="/"]:not([href^="/assets/"])').forEach(a => {
      const url = new URL(a.getAttribute('href'), location.origin);
      if (es) url.searchParams.set('lang', 'es'); else url.searchParams.delete('lang');
      a.setAttribute('href', url.pathname + url.search + url.hash);
    });

    if (toggle) {
      // The button always offers the other language, labelled in that language.
      toggle.textContent = es ? 'EN' : 'ES';
      toggle.setAttribute('lang', es ? 'en' : 'es');
      const label = es ? 'View in English' : 'Ver en español';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    }
  }

  const fromUrl = new URLSearchParams(location.search).get('lang');
  let current = (fromUrl === 'es' || fromUrl === 'en') ? fromUrl : (store.get('lang') === 'es' ? 'es' : 'en');
  apply(current);

  if (toggle) {
    toggle.addEventListener('click', () => {
      current = current === 'es' ? 'en' : 'es';
      apply(current);
      store.set('lang', current);
      const url = new URL(location.href);
      if (current === 'es') url.searchParams.set('lang', 'es'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    });
  }
}
