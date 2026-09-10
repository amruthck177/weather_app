# ⚡ AtmosVibe - Next-Gen Weather Intelligence & Radar

A next-generation, visually captivating, and feature-packed web application providing real-time worldwide weather forecasts, interactive live precipitation radar, procedural Web Audio soundscapes, AI-driven lifestyle insights, and dynamic canvas particle atmospheric visual effects.

---

## ✨ Key Features

### 1. 🌦️ Dynamic Living Atmosphere (Canvas VFX Engine)
- **Ultra 60FPS Procedural Visuals**: Backgrounds adapt dynamically to current weather conditions:
  - **Rain & Drizzle**: Physics-based falling streaks with surface impact ripples.
  - **Thunderstorm**: Volumetric dark rolling clouds with organic ambient lightning flashes and subtle screen rumble.
  - **Snowfall**: 3D multi-layered snowflakes with realistic wind turbulence.
  - **Clear Day**: Radiating solar lens flares and atmospheric light shimmer.
  - **Clear Night**: Twinkling starfield with occasional cosmic shooting stars.
  - **Mist & Fog**: Drifting multi-layered mist and fog simulation.

### 2. 🗺️ Interactive Live Precipitation Radar (RainViewer + Leaflet)
- Dark-mode, high-performance interactive radar map.
- Live animated precipitation loops with frame timeline scrubber, play/pause controls, and smooth color palettes.
- Auto-zooms to searched cities with live condition markers.

### 3. 🧠 Smart Weather AI Assistant & Activity Insights
- **Attire & Gear Advisor**: Automated recommendations for layers, outerwear, sunglasses, and umbrella needs based on real-time temperature, wind chills, UV index, and rain probability.
- **Activity Quality Scores**: Real-time 0–100 ratings for:
  - 🏃‍♂️ **Outdoor Running & Workout**
  - 🚗 **Driving Safety & Road Conditions**
  - 🔭 **Stargazing & Astronomical Visibility**
  - 🏖️ **Beach & Pool / UV Safety**
- **Astronomical Timeline**: Solar progress (dawn, sunrise, solar noon, sunset, dusk) and accurate lunar phase graphic.

### 4. 🎧 Procedural Ambient Soundscapes (Web Audio API)
- Zero external audio files required! Synthesizes ambient weather audio directly in browser memory using Web Audio nodes (white/pink noise filters, low-frequency oscillators, filtered resonance):
  - Soothing rain patter
  - Whistling wind breeze
  - Distant low-frequency thunder rumbles
  - Gentle summer day ambience
- Volume slider and one-click mute/unmute.

### 5. 📊 24-Hour Interactive Temperature & Precipitation Curve
- Interactive smooth SVG curve charting 24-hour temperature, "feels like" temp, and precipitation chance bars.
- Mouse hover / touch scrubbing with real-time detail tooltip.

### 6. 🌿 Comprehensive Air Quality Index (AQI) & Pollutant Breakdown
- Powered by the Open-Meteo Air Quality API:
  - US & European AQI levels with color-coded risk meter.
  - $PM_{2.5}$, $PM_{10}$, Ozone ($O_3$), Nitrogen Dioxide ($NO_2$), Carbon Monoxide ($CO$).
  - Health guidance for sensitive groups.

### 7. ⚖️ Dual-City Comparison Mode
- Compare weather side-by-side between two cities (temperature, humidity, wind, UV, 7-day outlook) — ideal for vacation or trip planning.

### 8. ⚡ Power-User Experience & Keyboard Shortcuts
- Search anywhere with `/`.
- Toggle between Celsius and Fahrenheit with `C` / `F`.
- Toggle live radar modal with `M`.
- Toggle ambient soundscapes with `S`.
- Refresh weather with `R`.
- Instant quick-search pills for popular global hubs (Tokyo, London, New York, Paris, Sydney, Bengaluru).
- Saved favorites with local storage persistence.

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5 semantic markup, ES6+ JavaScript modules.
- **Styling**: Vanilla CSS with modern CSS custom properties, Glassmorphism, backdrop filters, responsive grid layout, and custom animations.
- **Visuals & VFX**: HTML5 2D Canvas procedural particle engine.
- **Audio**: Web Audio API (procedural parametric synthesis).
- **Maps**: Leaflet.js with CartoDB Dark Matter base tiles + RainViewer API live radar overlays.
- **Data Providers**:
  - [Open-Meteo Weather API](https://open-meteo.com/) (Free, no API key needed, global high-resolution forecasts).
  - [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api).
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api).
  - [RainViewer API](https://www.rainviewer.com/api.html).

---

## 🚀 Getting Started

### Prerequisites
Any modern web browser (Chrome, Edge, Firefox, Safari) and a simple HTTP server (like Python, Node `serve`, or VS Code Live Server).

### Running Locally

1. Open a terminal in the project directory:
   ```bash
   cd weather_app
   ```

2. Start a local HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 3000
   ```
   Or using Node.js:
   ```bash
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
├── index.html       # Semantic layout, modals, drawers, and UI components
├── styles.css       # Glassmorphic design system, responsive grid, animations
├── app.js           # Core state management, Open-Meteo APIs, insights, shortcuts
├── weatherVfx.js    # 60fps Canvas particle and atmospheric effects engine
├── audio.js         # Procedural Web Audio synthesizer for ambient soundscapes
├── radar.js         # Leaflet + RainViewer live animated radar controller
└── README.md        # Comprehensive documentation
```

---

## 📄 License
MIT License. Open-source and free to use.
