// ============================================================
// APP.JS — Main init, counters, navbar
// THE JUDY & RON ENDEMAN TRAVEL LEGACY
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  MapModule.init();
  TimelineModule.init();
  ModalModule.init();
  GalleryModule.init();
  PresentationModule.init();

  initCounters();
  initNavbar();
  initStatObserver();
  buildContinents();
  buildYearTimeline();
  initMobileNav();
  initActiveNavLinks();
});

// ─── Animated Counters ───────────────────────────────────────
function initCounters() {
  const els = document.querySelectorAll('.hero-stat-num, .stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const steps = 60;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const t = step / steps;
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = Math.round(target * eased);
    if (step >= steps) { el.textContent = target; clearInterval(interval); }
  }, 2000 / steps);
}

// ─── Navbar scroll ───────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ─── Stat cards observer ─────────────────────────────────────
function initStatObserver() {
  const cards = document.querySelectorAll('.stat-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  cards.forEach(c => observer.observe(c));
}

// ─── Continents grid ─────────────────────────────────────────
function buildContinents() {
  const grid = document.getElementById('continentsGrid');
  if (!grid) return;

  ENDEMAN_LEGACY.continents.forEach(cont => {
    const card = document.createElement('div');
    card.className = 'continent-card';
    card.innerHTML = `
      <span class="continent-emoji">${cont.emoji}</span>
      <span class="continent-name">${cont.name}</span>
      <span class="continent-check">✓ VISITED</span>
    `;
    card.addEventListener('click', () => {
      document.getElementById('timeline-section').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const continent = ENDEMAN_LEGACY.trips.find(t => t.id === cont.trips[0])?.continent;
        if (continent) {
          const btn = document.querySelector(`#timelineFilters [data-filter="${continent}"]`);
          if (btn) btn.click();
        }
      }, 600);
    });
    grid.appendChild(card);
  });
}

// ─── Year Timeline ───────────────────────────────────────────
function buildYearTimeline() {
  const track = document.getElementById('yearTimelineTrack');
  if (!track) return;

  const trips = [...ENDEMAN_LEGACY.trips].sort((a, b) => (a.year || 9999) - (b.year || 9999) || a.order - b.order);

  trips.forEach((trip, i) => {
    const node = document.createElement('div');
    const isAbove = i % 2 === 0;
    node.className = `yr-node ${isAbove ? 'yr-above' : 'yr-below'}`;
    node.style.setProperty('--trip-color', trip.color);

    const meta = `
      <div class="yr-year">${trip.year || '—'}</div>
      <div class="yr-label">${trip.destination}</div>
    `;

    node.innerHTML = isAbove ? `
      <div class="yr-meta">${meta}</div>
      <div class="yr-tick"></div>
      <div class="yr-pin" style="background:${trip.color}">${trip.emoji}</div>
      <div class="yr-spacer"></div>
    ` : `
      <div class="yr-spacer"></div>
      <div class="yr-pin" style="background:${trip.color}">${trip.emoji}</div>
      <div class="yr-tick"></div>
      <div class="yr-meta">${meta}</div>
    `;

    node.addEventListener('click', () => {
      ModalModule.open(trip);
      if (typeof MapModule !== 'undefined') MapModule.flyToTrip(trip.id);
    });

    track.appendChild(node);
  });
}

// ─── Mobile nav ──────────────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.style.display === 'flex';
    Object.assign(links.style, {
      display: isOpen ? 'none' : 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '60px', left: '0', right: '0',
      background: 'rgba(6,6,6,0.98)',
      padding: '20px 40px',
      borderBottom: '2px solid #FFC200',
      zIndex: '999',
      backdropFilter: 'blur(10px)',
    });
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { links.style.display = 'none'; });
  });
}

// ─── Active nav tracking ──────────────────────────────────────
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}
