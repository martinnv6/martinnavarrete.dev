/**
 * martinnavarrete.dev - Core Client-Side Logic
 * Pure vanilla JavaScript: Fast, zero external dependencies, accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
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
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = htmlRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // React to OS-level theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
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
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

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
  const openButtons = [
    document.getElementById('resume-modal-btn'),
    document.getElementById('hero-resume-btn')
  ].filter(Boolean);
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
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    const isExpanded = navMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isExpanded.toString());
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
