// ============================================================
// TIMELINE MODULE — Trip cards + modal (English)
// ============================================================

const TimelineModule = (() => {
  function init() { render(); bindFilters(); }

  function render() {
    const container = document.getElementById('timeline');
    container.innerHTML = '';
    ENDEMAN_LEGACY.trips.forEach((trip, i) => container.appendChild(buildCard(trip, i)));
  }

  function buildCard(trip, index) {
    const card = document.createElement('div');
    card.className = 'trip-card';
    card.dataset.continent = trip.continent;
    card.dataset.tripId = trip.id;
    card.style.animationDelay = `${index * 0.05}s`;
    card.style.borderTopColor = trip.color;

    const highlights = trip.highlights.slice(0, 4)
      .map(h => `<div class="trip-card-highlight">${h}</div>`).join('');

    const countries = trip.countries
      .map(c => `<span class="trip-card-country">${c}</span>`).join('');

    card.innerHTML = `
      <div class="trip-card-header">
        <div class="trip-card-emoji">${trip.emoji}</div>
        <span class="trip-card-continent-tag" style="background:${trip.color}">
          ${trip.continentLabel.toUpperCase()}
        </span>
      </div>
      <div class="trip-card-body">
        <h3 class="trip-card-destination">${trip.destination.toUpperCase()}</h3>
        <p class="trip-card-subtitle">${trip.subtitle}</p>
        <div class="trip-card-countries">${countries}</div>
        <div class="trip-card-highlights">${highlights}</div>
        <div class="trip-card-footer">
          <span class="trip-card-locations-count">
            <i class="fas fa-map-pin" style="color:${trip.color};margin-right:5px"></i>
            ${trip.locations.length} DESTINATIONS
          </span>
          <span class="trip-card-explore" style="color:${trip.color}">
            VIEW DETAILS <i class="fas fa-arrow-right"></i>
          </span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      ModalModule.open(trip);
      if (typeof MapModule !== 'undefined') MapModule.flyToTrip(trip.id);
    });

    return card;
  }

  function bindFilters() {
    document.querySelectorAll('#timelineFilters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#timelineFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });
  }

  function applyFilter(filter) {
    document.querySelectorAll('.trip-card').forEach((card, i) => {
      const show = filter === 'all' || card.dataset.continent === filter;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animationDelay = `${i * 0.04}s`;
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
      }
    });
  }

  return { init };
})();

// ============================================================
// MODAL MODULE
// ============================================================
const ModalModule = (() => {
  let modal, backdrop, closeBtn;

  function init() {
    modal = document.getElementById('tripModal');
    backdrop = document.getElementById('tripModalBackdrop');
    closeBtn = document.getElementById('tripModalClose');
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function open(trip) {
    document.getElementById('tripModalEmoji').textContent = trip.emoji;
    document.getElementById('tripModalTitle').textContent = trip.destination.toUpperCase();
    document.getElementById('tripModalSubtitle').textContent = trip.subtitle;

    document.getElementById('tripModalLocations').innerHTML =
      trip.locations.map(loc => `
        <span class="modal-location-tag">
          <i class="fas fa-map-pin"></i> ${loc}
        </span>
      `).join('');

    document.getElementById('tripModalHighlights').innerHTML = `
      <h4>EXPEDITION HIGHLIGHTS</h4>
      ${trip.highlights.map(h => `<div class="modal-highlight">${h}</div>`).join('')}
    `;

    document.getElementById('tripModalBookText').textContent = trip.bookText;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  return { init, open, close };
})();
