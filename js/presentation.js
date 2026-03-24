// ============================================================
// PRESENTATION MODULE — Cinematic Legacy Evening Mode
// Three acts: Tribute → Map Journey (with geo-photos) → Finale
// Controls: SPACE pause · → next · ← prev · ESC exit · F fullscreen
// ============================================================

const PresentationModule = (() => {

  // ─── Config ──────────────────────────────────────────────────
  const TRIBUTE_DURATION  = 6000;   // ms for opening tribute screen
  const TRIP_DURATION     = 15000;  // ms per trip in journey
  const FLY_DURATION      = 2200;   // ms for map fly animation
  const FINALE_DURATION   = 12000;  // ms for gallery finale before auto-exit
  const MAX_PHOTO_PINS    = 5;      // max geo-photo pins per trip
  const MUSIC_MAX_VOLUME  = 0.75;

  // ─── State ───────────────────────────────────────────────────
  let active       = false;
  let paused       = false;
  let act          = null;       // 'tribute' | 'journey' | 'finale'
  let tripIndex    = 0;
  let tripTimer    = null;
  let tripStart    = 0;
  let photoMarkers = [];
  let allPhotos    = [];
  let sortedTrips  = [];

  // ─── DOM refs ────────────────────────────────────────────────
  let overlay, tributeScreen, mapJourneyUI, journeyCard,
      progressBar, counter, hint, pausedScreen,
      finaleOverlay, finaleMosaic, finaleMessage, audio;

  // ─── Trip ordering (chronological by year, then order) ───────
  function buildTripOrder() {
    return [...ENDEMAN_LEGACY.trips].sort((a, b) => {
      const ay = a.year || 9999;
      const by = b.year || 9999;
      return ay !== by ? ay - by : (a.order || 0) - (b.order || 0);
    });
  }

  // ─── Init ────────────────────────────────────────────────────
  function init() {
    sortedTrips = buildTripOrder();

    overlay        = document.getElementById('presentationOverlay');
    tributeScreen  = document.getElementById('tributeScreen');
    mapJourneyUI   = document.getElementById('mapJourneyUI');
    journeyCard    = document.getElementById('journeyCard');
    progressBar    = document.getElementById('presentationProgressBar');
    counter        = document.getElementById('presentationCounter');
    hint           = document.getElementById('presentationHint');
    pausedScreen   = document.getElementById('presentationPaused');
    finaleOverlay  = document.getElementById('finaleOverlay');
    finaleMosaic   = document.getElementById('finaleMosaic');
    finaleMessage  = document.getElementById('finaleMessage');
    audio          = document.getElementById('presentationAudio');

    const btn = document.getElementById('btnPresent');
    if (btn) btn.addEventListener('click', start);

    document.addEventListener('keydown', handleKey);

    loadPhotos();
  }

  async function loadPhotos() {
    try {
      const res = await fetch('data/photos.json');
      const data = await res.json();
      allPhotos = data.photos || [];
    } catch (e) {
      allPhotos = [];
    }
  }

  // ─── Start ───────────────────────────────────────────────────
  function start() {
    if (active) return;
    active = true;
    paused = false;
    tripIndex = 0;

    document.body.classList.add('presentation-active');

    // Fullscreen
    document.documentElement.requestFullscreen &&
      document.documentElement.requestFullscreen().catch(() => {});

    showOverlay();
    startMusic();
    showTribute();
  }

  function showOverlay() {
    overlay.style.display = 'block';
    overlay.classList.remove('act-journey', 'act-finale');
    overlay.classList.add('act-tribute');
  }

  // ─── Act 1: Tribute Screen ───────────────────────────────────
  function showTribute() {
    act = 'tribute';
    setVisible(tributeScreen, true);
    setVisible(mapJourneyUI, false);
    setVisible(finaleOverlay, false);
    hint.textContent = 'SPACE · ESC to exit · → to skip';

    tripTimer = setTimeout(startJourney, TRIBUTE_DURATION);
  }

  function skipTribute() {
    clearTimeout(tripTimer);
    startJourney();
  }

  // ─── Act 2: Map Journey ──────────────────────────────────────
  function startJourney() {
    act = 'journey';
    overlay.classList.remove('act-tribute', 'act-finale');
    overlay.classList.add('act-journey');

    setVisible(tributeScreen, false);
    setVisible(mapJourneyUI, true);
    setVisible(finaleOverlay, false);

    hint.textContent = 'SPACE pause · → next · ← back · ESC exit';

    runTrip(0);
  }

  function runTrip(index) {
    if (!active) return;

    if (index >= sortedTrips.length) {
      showFinale();
      return;
    }

    tripIndex = index;
    tripStart = Date.now();
    const trip = sortedTrips[index];

    counter.textContent = `${index + 1}  /  ${sortedTrips.length}`;

    // Fly map
    MapModule.flyToTrip(trip.id);

    // After fly settles: highlight paths + show photo pins
    setTimeout(() => {
      if (!active || tripIndex !== index) return;
      MapModule.setTripHighlight(trip.id);
    }, FLY_DURATION);

    setTimeout(() => {
      if (!active || tripIndex !== index) return;
      addPhotoMarkers(trip);
    }, FLY_DURATION + 400);

    // Show trip card
    setTimeout(() => {
      if (!active || tripIndex !== index) return;
      showCard(trip);
    }, FLY_DURATION + 200);

    // Progress bar
    animateProgress(TRIP_DURATION);

    // Schedule advance
    tripTimer = setTimeout(() => {
      if (!paused) advance();
    }, TRIP_DURATION);
  }

  function advance() {
    clearTimeout(tripTimer);
    dismissCard();
    clearPhotoMarkers();
    MapModule.clearHighlights();
    resetProgress();
    setTimeout(() => runTrip(tripIndex + 1), 300);
  }

  function retreat() {
    clearTimeout(tripTimer);
    dismissCard();
    clearPhotoMarkers();
    MapModule.clearHighlights();
    resetProgress();
    const prev = Math.max(0, tripIndex - 1);
    setTimeout(() => runTrip(prev), 300);
  }

  // ─── Trip Card ───────────────────────────────────────────────
  function showCard(trip) {
    journeyCard.style.borderColor = trip.color;
    journeyCard.innerHTML = `
      <div class="jc-emoji">${trip.emoji}</div>
      <div class="jc-name">${trip.destination}</div>
      ${trip.year ? `<div class="jc-year">${trip.year}</div>` : ''}
      <div class="jc-sub">${trip.subtitle}</div>
      <div class="jc-continent">${trip.continentLabel}</div>
    `;
    journeyCard.classList.add('visible');
  }

  function dismissCard() {
    journeyCard.classList.remove('visible');
  }

  // ─── Photo Pins ──────────────────────────────────────────────
  // Fixed screen positions as fractions of map size from center.
  // Circles are always at these fixed spots — can never overlap.
  // Leader lines connect each circle back to the actual GPS location.
  const SCREEN_SLOTS = [
    { fx: -0.28, fy: -0.28 },  // upper-left
    {  fx: 0.00, fy: -0.35 },  // top-center
    {  fx: 0.28, fy: -0.28 },  // upper-right
    { fx: -0.35, fy:  0.06 },  // mid-left
    {  fx: 0.35, fy:  0.06 },  // mid-right
  ];

  function addPhotoMarkers(trip) {
    const lmap = MapModule.getMap();
    if (!lmap) return;

    // Use curated map_pin photos; fall back to any GPS photos if none curated
    const mapPinPhotos = allPhotos.filter(p => p.trip_id === trip.id && p.map_pin && p.thumb);
    const fallback = allPhotos.filter(p => p.trip_id === trip.id && p.lat && p.lng && p.thumb && !p.map_pin);
    const pool = mapPinPhotos.length > 0 ? mapPinPhotos : fallback;

    const spread = pool.slice(0, MAX_PHOTO_PINS);
    const mapSize = lmap.getSize();
    const cx = mapSize.x / 2;
    const cy = mapSize.y / 2;

    spread.forEach((photo, i) => {
      setTimeout(() => {
        if (!active) return;

        // Use photo GPS if available, otherwise anchor to trip center
        const gpsLL = (photo.lat && photo.lng)
          ? [photo.lat, photo.lng]
          : [trip.centerLat, trip.centerLng];
        const slot = SCREEN_SLOTS[i] || SCREEN_SLOTS[0];

        // Photo circle at fixed screen position (converted to lat/lng)
        const circPx = L.point(cx + slot.fx * mapSize.x, cy + slot.fy * mapSize.y);
        const circLL = lmap.containerPointToLatLng(circPx);

        // 1) Small anchor dot at exact GPS location
        const dotIcon = L.divIcon({
          className: '',
          html: `<div class="photo-anchor-dot" style="background:${trip.color};box-shadow:0 0 0 3px ${trip.color}44"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        const dot = L.marker(gpsLL, { icon: dotIcon, zIndexOffset: 400 }).addTo(lmap);

        // 2) Leader line: GPS dot → circle
        const line = L.polyline([gpsLL, [circLL.lat, circLL.lng]], {
          color: trip.color,
          weight: 1.5,
          opacity: 0.6,
          dashArray: '5, 5',
        }).addTo(lmap);

        // 3) Photo circle at fixed screen slot
        const photoIcon = L.divIcon({
          className: '',
          html: `<div class="map-photo-pin" style="background-image:url('${photo.thumb}');border-color:${trip.color}"></div>`,
          iconSize: [220, 220],
          iconAnchor: [110, 110],
        });
        const photoM = L.marker([circLL.lat, circLL.lng], { icon: photoIcon, zIndexOffset: 500 }).addTo(lmap);

        photoMarkers.push(dot, line, photoM);
      }, i * 450);
    });
  }

  function clearPhotoMarkers() {
    photoMarkers.forEach(m => m.remove());
    photoMarkers = [];
  }

  // Spread photos: one per unique day first, then fill with geographic spread
  // Avoids showing bursts of similar poses from the same shooting session
  function pickSpread(photos, max) {
    if (photos.length <= max) return photos;

    // Step 1: pick one photo per unique date
    const byDay = new Map();
    for (const p of photos) {
      const day = p.date ? p.date.slice(0, 10) : 'unknown';
      if (!byDay.has(day)) byDay.set(day, p);
    }
    const spread = [...byDay.values()];
    if (spread.length >= max) return spread.slice(0, max);

    // Step 2: if we don't have enough unique days, fill with geographic spread
    const cellSize = 3;
    const geoSeen = new Map();
    for (const p of photos) {
      if (spread.includes(p)) continue;
      const key = `${Math.floor(p.lat / cellSize)},${Math.floor(p.lng / cellSize)}`;
      if (!geoSeen.has(key)) { geoSeen.set(key, p); spread.push(p); }
      if (spread.length >= max) break;
    }
    return spread.slice(0, max);
  }

  // ─── Progress bar ────────────────────────────────────────────
  function animateProgress(duration) {
    resetProgress();
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${duration}ms linear`;
      progressBar.style.width = '100%';
    });
  }

  function resetProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
  }

  // ─── Act 3: Gallery Finale ───────────────────────────────────
  function showFinale() {
    act = 'finale';
    overlay.classList.remove('act-tribute', 'act-journey');
    overlay.classList.add('act-finale');

    setVisible(mapJourneyUI, false);
    setVisible(finaleOverlay, true);
    resetProgress();
    dismissCard();
    counter.textContent = '';
    hint.textContent = 'ESC to exit';

    // Build photo mosaic
    finaleMosaic.innerHTML = '';
    const pool = [...allPhotos].sort(() => Math.random() - 0.5).slice(0, 80);
    pool.forEach(photo => {
      const img = document.createElement('img');
      img.className = 'finale-photo';
      img.src = photo.thumb || photo.path;
      img.alt = '';
      img.onerror = () => img.remove();
      finaleMosaic.appendChild(img);
    });

    // Fade in closing message
    setTimeout(() => finaleMessage.classList.add('visible'), 2500);

    // Fade out music
    fadeOutMusic(5000);

    // Auto-exit
    tripTimer = setTimeout(stop, FINALE_DURATION);
  }

  // ─── Pause / Resume ──────────────────────────────────────────
  function togglePause() {
    if (!active || act === 'tribute') return;
    paused = !paused;
    pausedScreen.classList.toggle('visible', paused);

    if (paused) {
      clearTimeout(tripTimer);
      progressBar.style.transition = 'none';
      if (audio) audio.pause();
    } else {
      if (audio) audio.play().catch(() => {});
      const elapsed = Date.now() - tripStart;
      const remaining = Math.max(0, TRIP_DURATION - elapsed);
      if (act === 'journey') {
        progressBar.style.transition = `width ${remaining}ms linear`;
        progressBar.style.width = '100%';
        tripTimer = setTimeout(advance, remaining);
      }
    }
  }

  // ─── Stop ────────────────────────────────────────────────────
  function stop() {
    if (!active) return;
    active = false;
    paused = false;
    act = null;
    clearTimeout(tripTimer);
    clearPhotoMarkers();
    MapModule.clearHighlights();
    dismissCard();
    resetProgress();
    finaleMessage.classList.remove('visible');

    document.body.classList.remove('presentation-active');

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    overlay.classList.remove('act-tribute', 'act-journey', 'act-finale');
    overlay.style.display = 'none';
    setVisible(tributeScreen, false);
    setVisible(mapJourneyUI, false);
    setVisible(finaleOverlay, false);

    stopMusic();
  }

  // ─── Music ───────────────────────────────────────────────────
  function startMusic() {
    if (!audio) return;
    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    fadeInMusic(3000);
  }

  function fadeInMusic(ms) {
    if (!audio) return;
    const steps = 40;
    const interval = ms / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      audio.volume = Math.min(MUSIC_MAX_VOLUME, (step / steps) * MUSIC_MAX_VOLUME);
      if (step >= steps) clearInterval(id);
    }, interval);
  }

  function fadeOutMusic(ms = 3000) {
    if (!audio) return;
    const start = audio.volume;
    const steps = 40;
    const interval = ms / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      audio.volume = Math.max(0, start * (1 - step / steps));
      if (step >= steps) { audio.pause(); clearInterval(id); }
    }, interval);
  }

  function stopMusic() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0;
  }

  // ─── Keyboard ────────────────────────────────────────────────
  function handleKey(e) {
    if (!active) {
      if (e.key === 'p' || e.key === 'P') { e.preventDefault(); start(); }
      return;
    }

    switch (e.key) {
      case ' ':
      case 'Spacebar':
        e.preventDefault();
        if (act === 'tribute') skipTribute();
        else togglePause();
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (paused) break;
        if (act === 'tribute') skipTribute();
        else if (act === 'journey') advance();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (!paused && act === 'journey' && tripIndex > 0) retreat();
        break;

      case 'Escape':
        e.preventDefault();
        stop();
        break;

      case 'f':
      case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(() => {});
        break;
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────
  function setVisible(el, visible) {
    if (!el) return;
    el.style.display = visible ? '' : 'none';
    if (visible) {
      requestAnimationFrame(() => el.classList.add('visible'));
    } else {
      el.classList.remove('visible');
    }
  }

  return { init };

})();
