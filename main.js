/* ============================================================
   THEME — persists user preference, respects system default
   ============================================================ */
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     THEME TOGGLE
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ============================================================
     HEADER BORDER ON SCROLL
     ============================================================ */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     GSAP ANIMATIONS
     ============================================================ */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => (el.style.opacity = 1));
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* --- Hero: fade in on load with slight upward motion --- */
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('.hero-badge',       { opacity: 0, y: 20, duration: 0.55 })
    .from('.hero h1',          { opacity: 0, y: 26, duration: 0.7 }, '-=0.35')
    .from('.hero-lede',        { opacity: 0, y: 22, duration: 0.6 }, '-=0.45')
    .from('.hero-cta',         { opacity: 0, y: 18, duration: 0.55 }, '-=0.4')
    .from('.hero-meta',        { opacity: 0, y: 18, duration: 0.55 }, '-=0.4')
    .from('.terminal',         { opacity: 0, y: 30, duration: 0.7 },  '-=0.6');

  /* --- Section-level fade-up on scroll --- */
  document.querySelectorAll('section').forEach((section) => {
    // Section header
    const head = section.querySelector('.section-head');
    if (head) {
      gsap.fromTo(
        head,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: head, start: 'top 88%', once: true }
        }
      );
    }

    // Staggered grid children
    const grids = section.querySelectorAll(
      '.focus-grid, .proj-grid, .writeups-grid, .cert-grid, .skills-grid, .highlight-list, .timeline'
    );
    grids.forEach(grid => {
      const children = grid.children;
      if (!children.length) return;
      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
        }
      );
    });

    // About copy block
    const aboutCopy = section.querySelector('.about-copy');
    if (aboutCopy) {
      gsap.fromTo(
        aboutCopy,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: aboutCopy, start: 'top 85%', once: true }
        }
      );
    }

    // Contact card
    const contactCard = section.querySelector('.contact-card');
    if (contactCard) {
      gsap.fromTo(
        contactCard,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: contactCard, start: 'top 85%', once: true }
        }
      );
    }
  });

  /* Ensure .reveal elements that GSAP animates start hidden and get shown */
  gsap.set('.reveal', { opacity: 1 });

  /* Refresh after fonts load so layout is measured correctly */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
});