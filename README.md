# ⚡ AtmosVibe - Next-Gen Weather Intelligence & Radar (Pro Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero API Keys](https://img.shields.io/badge/API%20Keys-Zero%20Required-brightgreen.svg)](#-100-free--zero-api-keys)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange.svg)](#-progressive-web-app-pwa--offline)

A state-of-the-art, feature-packed weather workstation built with Vanilla HTML5, CSS3, and ES6+ JavaScript. **AtmosVibe** blends atmospheric science with living procedural visuals, AI voice broadcasts, 9:16 social share cards, real-time animated precipitation radar, procedural Lo-Fi soundscapes, climate flashback machines, and Earth extremes teleportation.

---

## 🌟 Major Highlights & Subsystems

### 1. 🎙️ AI "Radio Host" Voice Broadcast
- Click **"AI Radio"** in the top navigation to hear a live, conversational weather radio broadcast spoken via native **Web Speech API (`window.speechSynthesis`)**.
- Delivers an energetic meteorological dispatch with current temperature, condition overview, and the day's peak running/outdoor window.

### 2. 📸 9:16 Glassmorphic "Weather Story" Card Generator
- Click **"Story"** to open an Instagram/WhatsApp/TikTok-ready vertical story generator.
- Renders directly onto an HTML5 Canvas with custom atmospheric gradients, current weather art, activity window, and glassmorphic stats.
- One-click **Download PNG** or **Mobile Share (`navigator.share`)**.

### 3. 🔥 Earth's Live Extremes Leaderboard & Instant Teleport
- Live tracker showing the planet's most extreme regions:
  - 🌋 **Hottest Place Right Now**: Death Valley, USA (46°C)
  - 🧊 **Coldest Place Right Now**: Oymyakon, Siberia (-32°C)
  - 💨 **Windiest Place Right Now**: Mt. Washington, USA (68 km/h)
  - 🌧️ **Wettest Place Right Now**: Mawsynram, India (85% Rain)
- Click any extreme card to **instantly teleport the entire dashboard and radar** to that location!

### 4. 🌸 Pollen, Allergen & Migraine Health Deck
- Real-time allergen monitoring for **Grass Pollen**, **Birch Pollen**, and **Ragweed Pollen**.
- **Barometric Headache Sensor**: Monitors 3-hour pressure drops ($\Delta P$) to alert weather-sensitive migraine sufferers.

### 5. 🎹 5-Track Sound Mixer with Procedural Lo-Fi Chords
- Synthesizes organic soundscapes directly in browser memory using the **Web Audio API** — zero external MP3 files needed!
- **3D Spatial Panning (`StereoPannerNode`)**: Raindrops and thunder rumble dynamically pan across stereo headphones.
- **Generative Lo-Fi Chords**: Synthesizes soft, calming musical chord progressions (pentatonic scales in C minor / E major).
- **5 Independent Channel Faders**:
  - 🌧️ Rain Patter
  - 🍃 Wind Breeze
  - ⚡ Thunder Rumble
  - 🌅 Ambient Warmth
  - 🎹 Procedural Lo-Fi Chords
- **4 Instant Sound Presets**: `☕ Cozy Attic Rain`, `❄️ Winter Blizzard`, `⚡ Tropical Storm`, and `🌌 Midnight Calm`.

### 6. 🌦️ Dynamic Living Atmosphere (Canvas VFX Engine)
- **60 FPS Procedural Simulation**:
  - **Rain & Drizzle**: Physics-based falling streaks with surface impact ripples.
  - **Thunderstorm**: Dark rolling storm clouds with realistic lightning flashes.
  - **Snowfall**: 3D multi-layered snowflakes influenced by real-time wind speed.
  - **Clear Day**: Radiating solar lens flares and ambient light motes.
  - **Clear Night**: Twinkling starfield with occasional cosmic shooting stars.
  - **Mist & Fog**: Multi-layered volumetric drifting mist.

### 7. 🗺️ Interactive Live Precipitation Radar (RainViewer + Leaflet)
- Dark-mode interactive radar map powered by **Leaflet.js**.
- Live animated precipitation loops from **RainViewer API** with playback scrubber and frame timestamps.

### 8. 🏃 Optimal Activity Window Planner
- 24-hour evaluation for **Outdoor Run**, **Car Wash**, **Dog Walking**, and **Golden Hour Photography**.
- Automatically highlights the **exact optimal time range** (e.g., *5:00 PM – 7:30 PM*).

### 9. 🕰️ Weather Flashback (Historical Climate Machine)
- Powered by the **Open-Meteo Historical Archive API** (dating back to **1940**).
- Compares today's weather in your city against the same calendar day in **1980, 2000, 2010, and 2020** to display climate deltas.

### 10. 🌊 Marine, Surf & Coastal Conditions
- Powered by the **Open-Meteo Marine API**: wave height ($m$), swell period ($s$), and water roughness.

### 11. 🚗 Commute & Travel Route Weather
- Calculates conditions at **Departure**, **Midpoint Highway**, and **Destination Arrival** with driving hazard badges.

### 12. 📲 Progressive Web App (PWA) & Offline Mode
- Installable standalone app on iOS, Android, and Desktop via `manifest.json`.
- `sw.js` Service Worker with Network-First and offline caching strategies.

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

1. **[Open-Meteo Weather API](https://open-meteo.com/)**: High-resolution global forecasts.
2. **[Open-Meteo Air Quality & Pollen API](https://open-meteo.com/en/docs/air-quality-api)**: Pollutant and pollen monitoring.
3. **[Open-Meteo Historical Archive API](https://open-meteo.com/en/docs/historical-weather-api)**: Climate records back to 1940.
4. **[Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api)**: Ocean wave, swell, and tide conditions.
5. **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)**: Instant city search.
6. **[RainViewer API](https://www.rainviewer.com/api.html)**: Public animated precipitation radar tiles.
7. **CartoDB Dark Matter**: Free open-source map baselayer tiles.

---

## 🚀 Getting Started

```bash
git clone https://github.com/amruthck177/weather_app.git
cd weather_app
python -m http.server 3000
```
Open your browser at `http://localhost:3000`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
