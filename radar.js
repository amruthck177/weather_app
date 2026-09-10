/**
 * radar.js - Interactive Live Weather Radar using Leaflet + RainViewer API
 * Provides live animated precipitation radar with playback scrubber and frame controls.
 */

class WeatherRadarEngine {
  constructor() {
    this.map = null;
    this.cityMarker = null;
    this.radarLayers = [];
    this.timestamps = [];
    this.currentIndex = 0;
    this.animationTimer = null;
    this.isPlaying = true;
    this.host = 'https://tilecache.rainviewer.com';
    this.colorScheme = 2; // Universal RainViewer radar color scheme
    this.smooth = 1;
    this.snow = 1;
    this.currentLat = 51.5074;
    this.currentLon = -0.1278;
    this.cityName = 'London';
  }

  init(containerId = 'radar-map') {
    const el = document.getElementById(containerId);
    if (!el || typeof L === 'undefined') return;

    if (this.map) {
      this.map.invalidateSize();
      return;
    }

    // Initialize Leaflet map with Dark theme
    this.map = L.map(containerId, {
      zoomControl: false,
      attributionControl: false
    }).setView([this.currentLat, this.currentLon], 7);

    // CartoDB Dark Matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // City marker
    this.updateMarker(this.currentLat, this.currentLon, this.cityName);

    // Fetch RainViewer radar frames
    this.loadRadarData();

    // Map resize handling
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  updateMarker(lat, lon, name) {
    this.currentLat = lat;
    this.currentLon = lon;
    this.cityName = name;

    if (!this.map) return;

    if (this.cityMarker) {
      this.map.removeLayer(this.cityMarker);
    }

    const pulseIcon = L.divIcon({
      className: 'radar-city-pulse',
      html: `<div class="pulse-ring"></div><div class="pulse-dot"></div><div class="pulse-label">${name}</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    this.cityMarker = L.marker([lat, lon], { icon: pulseIcon }).addTo(this.map);
    this.map.setView([lat, lon], 7, { animate: true });
  }

  async loadRadarData() {
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      const data = await res.json();

      this.host = data.host || 'https://tilecache.rainviewer.com';
      const pastFrames = data.radar?.past || [];
      const nowcastFrames = data.radar?.nowcast || [];
      const allFrames = [...pastFrames, ...nowcastFrames];

      if (!allFrames.length) return;

      this.timestamps = allFrames;
      this.clearRadarLayers();

      // Create tile layers for each timestamp
      this.radarLayers = allFrames.map((frame, index) => {
        const url = `${this.host}${frame.path}/256/{z}/{x}/{y}/${this.colorScheme}/${this.smooth}_${this.snow}.png`;
        const layer = L.tileLayer(url, {
          opacity: 0,
          zIndex: 10 + index
        });
        layer.addTo(this.map);
        return layer;
      });

      // Start at latest available past frame
      this.currentIndex = Math.max(0, pastFrames.length - 1);
      this.showFrame(this.currentIndex);
      this.updateTimelineUI();

      if (this.isPlaying) {
        this.startPlayback();
      }
    } catch (err) {
      console.warn('Unable to load RainViewer radar frames:', err);
    }
  }

  clearRadarLayers() {
    this.radarLayers.forEach(l => {
      if (this.map.hasLayer(l)) {
        this.map.removeLayer(l);
      }
    });
    this.radarLayers = [];
  }

  showFrame(index) {
    if (!this.radarLayers.length) return;
    this.radarLayers.forEach((layer, idx) => {
      layer.setOpacity(idx === index ? 0.75 : 0);
    });
    this.currentIndex = index;
    this.updateTimelineUI();
  }

  startPlayback() {
    this.stopPlayback();
    this.isPlaying = true;
    this.animationTimer = setInterval(() => {
      const nextIndex = (this.currentIndex + 1) % this.radarLayers.length;
      this.showFrame(nextIndex);
    }, 1200);
  }

  stopPlayback() {
    this.isPlaying = false;
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.stopPlayback();
      return false;
    } else {
      this.startPlayback();
      return true;
    }
  }

  updateTimelineUI() {
    const timeDisplay = document.getElementById('radar-frame-time');
    const slider = document.getElementById('radar-slider');
    const frame = this.timestamps[this.currentIndex];

    if (timeDisplay && frame) {
      const date = new Date(frame.time * 1000);
      const isNowcast = this.currentIndex >= (this.timestamps.length - (frame.path.includes('nowcast') ? 6 : 0));
      timeDisplay.innerHTML = `
        <span class="radar-status-tag ${isNowcast ? 'nowcast' : 'past'}">${isNowcast ? 'FORECAST' : 'LIVE RADAR'}</span>
        ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      `;
    }

    if (slider) {
      slider.max = Math.max(0, this.timestamps.length - 1);
      slider.value = this.currentIndex;
    }
  }
}

export const weatherRadar = new WeatherRadarEngine();
