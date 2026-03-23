// ============================================================
// MAP MODULE — Leaflet interactive world map
// Animated flight paths, custom markers, destination popups
// ============================================================

const MapModule = (() => {
  let map = null;
  let markers = [];
  let flightLines = [];
  let animationRunning = false;
  let markersVisible = true;

  // ─── Initialize ─────────────────────────────────────────────
  function init() {
    map = L.map('map', {
      center: [20, 10],
      zoom: 2,
      zoomControl: false,
      attributionControl: true,
      maxBounds: [[-90, -200], [90, 200]],
      minZoom: 1.5,
    });

    // Esri World Dark Gray — dark map, English labels, free non-commercial
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
      maxZoom: 16,
    }).addTo(map);
    // English label overlay (renders above base, below markers)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: '',
    }).addTo(map);

    // Zoom control bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add all destination markers
    addAllMarkers();

    // Draw flight paths (static)
    drawFlightPaths();

    // Build legend
    buildLegend();

    // Wire up control buttons
    document.getElementById('btnAnimateFlights').addEventListener('click', animateFlights);
    document.getElementById('btnResetView').addEventListener('click', resetView);
    document.getElementById('btnToggleMarkers').addEventListener('click', toggleMarkers);
  }

  // ─── Markers ─────────────────────────────────────────────────
  function addAllMarkers() {
    ENDEMAN_LEGACY.allDestinations.forEach(dest => {
      const trip = ENDEMAN_LEGACY.trips.find(t => t.id === dest.trip);
      const color = trip ? trip.color : '#D4AF37';

      const icon = L.divIcon({
        className: '',
        html: `
          <div class="marker-dot" style="
            width: 12px; height: 12px;
            background: ${color};
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.4);
            box-shadow: 0 0 8px ${color}88, 0 0 0 4px ${color}22;
            cursor: pointer;
            transition: transform 0.2s ease;
          "></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([dest.lat, dest.lng], { icon })
        .addTo(map)
        .bindPopup(buildPopupHTML(dest, trip), {
          maxWidth: 250,
          className: 'endeman-popup',
        });

      // Hover tooltip
      marker.bindTooltip(dest.name, {
        className: 'endeman-tooltip',
        permanent: false,
        direction: 'top',
        offset: [0, -8],
      });

      // Click — fly to destination
      marker.on('click', () => {
        map.flyTo([dest.lat, dest.lng], 6, { duration: 1.5, easeLinearity: 0.25 });
      });

      markers.push({ marker, dest, trip });
    });
  }

  function buildPopupHTML(dest, trip) {
    const emoji = trip ? trip.emoji : '✈';
    return `
      <div class="map-popup">
        <div class="map-popup-name">${dest.name}</div>
        <div class="map-popup-country">${dest.country}</div>
        <div class="map-popup-trip">${emoji} ${trip ? trip.destination : ''}</div>
      </div>
    `;
  }

  // ─── Flight Paths & Cruise Routes ────────────────────────────
  function drawFlightPaths() {
    ENDEMAN_LEGACY.trips.forEach(trip => {
      const tripDests = ENDEMAN_LEGACY.allDestinations.filter(d => d.trip === trip.id);
      if (tripDests.length < 2) return;

      for (let i = 0; i < tripDests.length - 1; i++) {
        const from = [tripDests[i].lat, tripDests[i].lng];
        const to = [tripDests[i + 1].lat, tripDests[i + 1].lng];

        let points, style;

        if (trip.isCruise) {
          // Cruise ship routes: gentle sea-level curves, anchor-dash pattern
          points = getBezierPoints(from, to, 60, 0.08);
          style = {
            color: trip.color,
            weight: 2,
            opacity: 0.35,
            dashArray: '2, 9',
            className: `cruise-line cruise-${trip.id}`,
          };
        } else {
          // Flight paths: high arcs
          points = getBezierPoints(from, to, 60, 0.35);
          style = {
            color: trip.color,
            weight: 1,
            opacity: 0.25,
            dashArray: '4, 8',
            className: `flight-line flight-${trip.id}`,
          };
        }

        const line = L.polyline(points, style).addTo(map);
        flightLines.push({ line, from, to, color: trip.color, tripId: trip.id, isCruise: !!trip.isCruise });
      }
    });
  }

  // Quadratic Bezier curve (arcFactor: 0.35 = flight arc, 0.08 = sea route)
  function getBezierPoints(from, to, numPoints = 60, arcFactor = 0.35) {
    const [lat1, lng1] = from;
    const [lat2, lng2] = to;

    // Handle antimeridian crossing
    let adjLng2 = lng2;
    if (Math.abs(lng1 - lng2) > 180) {
      adjLng2 = lng2 + (lng1 > 0 ? 360 : -360);
    }

    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + adjLng2) / 2;
    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(adjLng2 - lng1, 2));
    const arcHeight = Math.min(dist * arcFactor, 30);

    const ctrlLat = midLat + arcHeight;
    const ctrlLng = midLng;

    const points = [];
    for (let t = 0; t <= 1; t += 1 / numPoints) {
      const lat = Math.pow(1 - t, 2) * lat1 + 2 * (1 - t) * t * ctrlLat + Math.pow(t, 2) * lat2;
      const lng = Math.pow(1 - t, 2) * lng1 + 2 * (1 - t) * t * ctrlLng + Math.pow(t, 2) * adjLng2;
      points.push([lat, lng]);
    }
    return points;
  }

  // ─── Animate Flights ──────────────────────────────────────────
  function animateFlights() {
    if (animationRunning) return;
    animationRunning = true;

    const btn = document.getElementById('btnAnimateFlights');
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>ANIMATING...</span>';

    // Reset all lines to invisible
    flightLines.forEach(({ line }) => line.setStyle({ opacity: 0 }));

    // Animate each line sequentially with a delay
    let delay = 0;
    const increment = 150;

    flightLines.forEach(({ line, color }, i) => {
      setTimeout(() => {
        animateLine(line, color);
        if (i === flightLines.length - 1) {
          setTimeout(() => {
            animationRunning = false;
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-plane"></i> <span>ANIMATE ROUTES</span>';
          }, 1500);
        }
      }, delay);
      delay += increment;
    });
  }

  function animateLine(line, color) {
    let opacity = 0;
    const target = 0.55;
    const step = 0.05;

    line.setStyle({ color, opacity: 0, weight: 1.5, dashArray: '5, 6' });

    const interval = setInterval(() => {
      opacity += step;
      line.setStyle({ opacity: Math.min(opacity, target) });
      if (opacity >= target) clearInterval(interval);
    }, 30);
  }

  // ─── Reset View ───────────────────────────────────────────────
  function resetView() {
    map.flyTo([20, 10], 2, { duration: 2, easeLinearity: 0.25 });
  }

  // ─── Toggle Markers ───────────────────────────────────────────
  function toggleMarkers() {
    markersVisible = !markersVisible;
    markers.forEach(({ marker }) => {
      if (markersVisible) {
        marker.addTo(map);
      } else {
        marker.remove();
      }
    });

    const btn = document.getElementById('btnToggleMarkers');
    if (markersVisible) {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span>DESTINATIONS</span>';
    } else {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fas fa-eye-slash"></i> <span>HIDE</span>';
    }
  }

  // ─── Build Legend ─────────────────────────────────────────────
  function buildLegend() {
    const container = document.getElementById('mapLegendItems');
    ENDEMAN_LEGACY.trips.forEach(trip => {
      const item = document.createElement('div');
      item.className = 'map-legend-item';
      item.innerHTML = `
        <div class="map-legend-dot" style="background:${trip.color}"></div>
        <span>${trip.destination}</span>
      `;
      item.addEventListener('click', () => {
        // Fly to trip center
        map.flyTo([trip.centerLat, trip.centerLng], trip.zoom, { duration: 2 });
      });
      container.appendChild(item);
    });
  }

  // ─── Fly to trip (called from timeline) ──────────────────────
  function flyToTrip(tripId) {
    const trip = ENDEMAN_LEGACY.trips.find(t => t.id === tripId);
    if (!trip) return;
    map.flyTo([trip.centerLat, trip.centerLng], trip.zoom, { duration: 2, easeLinearity: 0.25 });

    // Highlight this trip's flight lines
    flightLines.forEach(({ line, tripId: tid, color }) => {
      if (tid === tripId) {
        line.setStyle({ opacity: 0.8, weight: 2, dashArray: '' });
        setTimeout(() => line.setStyle({ opacity: 0.25, weight: 1, dashArray: '4, 8' }), 3000);
      }
    });
  }

  // ─── Presentation: expose map + highlight controls ──────────
  function getMap() { return map; }

  function setTripHighlight(tripId) {
    flightLines.forEach(({ line, tripId: tid, isCruise }) => {
      if (tid === tripId) {
        line.setStyle({ opacity: 0.9, weight: isCruise ? 3 : 2.5, dashArray: isCruise ? '2, 9' : '' });
      } else {
        line.setStyle({ opacity: 0.08, weight: 1 });
      }
    });
  }

  function clearHighlights() {
    flightLines.forEach(({ line, color, isCruise }) => {
      line.setStyle({ color, opacity: 0.25, weight: isCruise ? 2 : 1, dashArray: isCruise ? '2, 9' : '4, 8' });
    });
  }

  // Map section — scroll to
  function scrollToMap() {
    document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
  }

  return { init, flyToTrip, scrollToMap, getMap, setTripHighlight, clearHighlights };
})();
