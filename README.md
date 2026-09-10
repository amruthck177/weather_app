# ⚡ AtmosVibe - Next-Gen Weather Intelligence & Radar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero API Keys](https://img.shields.io/badge/API%20Keys-Zero%20Required-brightgreen.svg)](#-100-free--zero-api-keys)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange.svg)](#-progressive-web-app-pwa--offline)

A state-of-the-art, feature-packed weather workstation built with Vanilla HTML5, CSS3, and ES6+ JavaScript. **AtmosVibe** blends atmospheric science with living procedural visuals, real-time animated precipitation radar, Web Audio procedural soundscapes, climate flashback machines, and AI-driven lifestyle insights.

---

## 🌟 Major Highlights & Subsystems

### 1. 🌦️ Dynamic Living Atmosphere (Canvas VFX Engine)
- **Ultra 60FPS Procedural Visuals**: Backgrounds adapt dynamically to current conditions:
  - **Rain & Drizzle**: Physics-based falling streaks with surface impact ripples.
  - **Thunderstorm**: Dark storm clouds with organic lightning forks and atmospheric flash illumination.
  - **Snowfall**: 3D multi-layered snowflakes influenced by real-time wind speed.
  - **Clear Day**: Radiating solar lens flares and ambient light motes.
  - **Clear Night**: Twinkling starfield with occasional cosmic shooting stars.
  - **Mist & Fog**: Multi-layered volumetric drifting mist.

### 2. 🗺️ Interactive Live Precipitation Radar (RainViewer + Leaflet)
- Dark-mode, high-performance interactive radar map powered by **Leaflet.js**.
- Live animated precipitation radar loops from **RainViewer API** with playback scrubber, frame timestamps, and play/pause controls.
- Pulsing city marker that pans and zooms smoothly to searched locations.

### 3. 🏃 Optimal Activity Window Planner
- Intelligent 24-hour evaluation for lifestyle activities:
  - 🏃 **Outdoor Run**: Identifies ideal temperature, 0% rain, low UV, and light wind.
  - 🚗 **Car Wash**: Finds optimal dry streaks with no precipitation.
  - 🐕 **Dog Walking**: Avoids hot asphalt and freezing rain/ice.
  - 📸 **Golden Hour Photography**: Calculates optimal sunrise/sunset lighting with favorable cloud textures.
- Automatically calculates and highlights the **exact optimal time range** (e.g., *5:00 PM – 7:30 PM*).

### 4. 🕰️ Weather Flashback (Historical Climate Machine)
- Powered by the **Open-Meteo Historical Archive API** (records dating back to **1940**).
- Compares today's weather in your city against the exact same calendar day across past decades:
  - **1980, 2000, 2010, and 2020**.
  - Displays historical high/lows and calculates climate temperature deltas (e.g., *+3°C warmer today*).

### 5. 🌊 Marine, Surf & Coastal Conditions
- Powered by the **Open-Meteo Marine API**:
  - Real-time wave height ($m$), swell period ($s$), and surf state for coastal areas.
  - Graceful freshwater status indicator for inland cities and lakes.

### 6. 🎛️ 4-Track Procedural Ambient Sound Mixer & Presets
- Synthesizes organic soundscapes directly in browser memory using the **Web Audio API** — zero external MP3 files needed!
- **4 Independent Channel Faders**:
  - 🌧️ Rain Patter
  - 🍃 Wind Breeze
  - ⚡ Thunder Rumble
  - 🌅 Ambient Warmth
- **4 Instant Sound Presets**:
  - `☕ Cozy Attic Rain` (dense rain + gentle warmth)
  - `❄️ Winter Blizzard` (howling wind + crisp air)
  - `⚡ Tropical Storm` (heavy rain + rolling thunder)
  - `🌌 Midnight Calm` (serene ambient night breeze)

### 7. 🚗 Commute & Travel Route Weather
- Interactive travel route calculator:
  - Input origin and destination cities (e.g., *London to Edinburgh*).
  - Calculates conditions at **Departure**, **Midpoint Highway Waypoint**, and **Destination Arrival**.
  - Displays real-time driving hazard badges (*Aquaplaning Risk*, *Low Visibility Fog*, *High Crosswinds*, *Clear Highway*).

### 8. 📊 24-Hour Visual Temperature & Rain Curve
- Smooth SVG Bézier curve charting 24-hour temperature, dew point, and vertical precipitation probability bars with interactive hover scrubbing.

### 9. 🌿 Comprehensive Air Quality & Environmental Grid
- **Wind & Direction Compass** with rotating direction pointer.
- **UV Index** with color-coded safety risk gauge.
- **Air Quality Index (AQI)**: Real-time US & European AQI, $PM_{2.5}$, and $PM_{10}$.
- **Sun & Moon Timeline**: Sunrise, sunset, daylight duration, and calculated lunar phase (`Waxing Gibbous 🌔`, `Full Moon 🌕`, etc.).
- **Humidity & Dew Point**, **Atmospheric Visibility**, **Barometric Pressure**, and **Precipitation Probability**.

### 10. 📲 Progressive Web App (PWA) & Offline Mode
- **Standalone Mobile & Desktop App**: Installable via `manifest.json`.
- **Service Worker (`sw.js`)**: Caches static assets and uses a Stale-While-Revalidate caching strategy for weather data so previously viewed cities load instantly offline.
- **Morning Weather Briefing**: One-click summary notification generator.

---

## ⚡ Power-User Keyboard Shortcuts

| Key | Action |
|:---:|:---|
| `/` | Focus search bar to query any city worldwide |
| `U` | Toggle between Celsius (°C) and Fahrenheit (°F) |
| `M` | Open / Close Live Precipitation Radar modal |
| `S` | Toggle Ambient Weather Audio |
| `C` | Open / Close Dual-City Comparison modal |
| `T` | Open / Close Commute & Travel Route Weather modal |
| `R` | Refresh current city weather data |
| `Esc`| Dismiss search suggestions and close modals |

---

## 🔑 100% Free & Zero API Keys

AtmosVibe requires **NO API keys, NO registrations, and NO subscriptions**:

1. **[Open-Meteo Weather API](https://open-meteo.com/)**: High-resolution global forecasts (current, hourly, 7-day).
2. **[Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)**: Worldwide pollutant monitoring ($PM_{2.5}$, $PM_{10}$, $O_3$, $NO_2$).
3. **[Open-Meteo Historical Archive API](https://open-meteo.com/en/docs/historical-weather-api)**: Historical climate records from 1940 to present day.
4. **[Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api)**: Global ocean wave, swell, and tide conditions.
5. **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)**: Instant city search and coordinate lookups.
6. **[RainViewer API](https://www.rainviewer.com/api.html)**: Free public animated precipitation radar tiles.
7. **CartoDB Dark Matter**: Free open-source map baselayer tiles.

---

## 🚀 Getting Started

### Quick Run
1. Clone this repository:
   ```bash
   git clone https://github.com/amruthck177/weather_app.git
   cd weather_app
   ```

2. Start any local HTTP server:
   ```bash
   # Python 3
   python -m http.server 3000

   # Node.js
   npx serve .
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
weather_app/
├── index.html       # Semantic layout, dashboards, and modal controllers
├── styles.css       # Glassmorphism design system, themes, and responsive grid
├── app.js           # Core orchestrator: APIs, AI advisor, activity planner, and routes
├── weatherVfx.js    # 60 FPS procedural atmospheric canvas particle engine
├── radar.js         # Leaflet + RainViewer live animated radar controller
├── audio.js         # 4-channel Web Audio soundscape synthesizer & presets
├── manifest.json    # Progressive Web App (PWA) manifest configuration
├── sw.js            # Service Worker providing offline caching & network resilience
└── README.md        # Complete project documentation
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
