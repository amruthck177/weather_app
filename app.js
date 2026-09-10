/**
 * app.js - Complete Weather Intelligence & Workstation Controller
 * Orchestrates Open-Meteo Weather, Air Quality, Marine, and Archive APIs,
 * Geocoding, AI Advice, Activity Planner, Route Weather, Sound Mixer, and PWA.
 */

import { weatherVfx } from './weatherVfx.js';
import { weatherAudio } from './audio.js';
import { weatherRadar } from './radar.js';

// State Management
const state = {
  city: 'London',
  country: 'United Kingdom',
  lat: 51.5074,
  lon: -0.1278,
  unit: 'c', // 'c' or 'f'
  weatherData: null,
  airQualityData: null,
  marineData: null,
  flashbackData: null,
  isAudioActive: false,
  selectedActivity: 'run',
  favorites: JSON.parse(localStorage.getItem('atmos_favorites') || '["London", "Tokyo", "New York"]'),
  compareCity: 'Tokyo',
  compareData: null
};

// Weather Code Definitions & Visual Assets
function getWeatherMeta(code, isDay = 1) {
  const isNight = isDay === 0;

  switch (code) {
    case 0:
      return {
        text: isNight ? 'Clear Night' : 'Clear Sky',
        theme: isNight ? 'theme-clear-night' : 'theme-clear-day',
        vfx: isNight ? 'night' : 'clear-day',
        audio: 'clear',
        icon: isNight ? getMoonSvg() : getSunSvg()
      };
    case 1:
    case 2:
      return {
        text: 'Partly Cloudy',
        theme: isNight ? 'theme-clear-night' : 'theme-clear-day',
        vfx: isNight ? 'night' : 'clear-day',
        audio: 'wind',
        icon: isNight ? getCloudyNightSvg() : getPartlyCloudySvg()
      };
    case 3:
      return {
        text: 'Overcast',
        theme: 'theme-clouds',
        vfx: 'clouds',
        audio: 'wind',
        icon: getCloudSvg()
      };
    case 45:
    case 48:
      return {
        text: 'Foggy',
        theme: 'theme-clouds',
        vfx: 'fog',
        audio: 'wind',
        icon: getFogSvg()
      };
    case 51:
    case 53:
    case 55:
      return {
        text: 'Light Drizzle',
        theme: 'theme-rain',
        vfx: 'drizzle',
        audio: 'drizzle',
        icon: getDrizzleSvg()
      };
    case 61:
    case 63:
      return {
        text: 'Rain',
        theme: 'theme-rain',
        vfx: 'rain',
        audio: 'rain',
        icon: getRainSvg()
      };
    case 65:
    case 82:
      return {
        text: 'Heavy Rain',
        theme: 'theme-rain',
        vfx: 'rain',
        audio: 'rain',
        icon: getHeavyRainSvg()
      };
    case 71:
    case 73:
    case 75:
    case 85:
    case 86:
      return {
        text: 'Snowfall',
        theme: 'theme-snow',
        vfx: 'snow',
        audio: 'snow',
        icon: getSnowSvg()
      };
    case 95:
    case 96:
    case 99:
      return {
        text: 'Thunderstorm',
        theme: 'theme-thunder',
        vfx: 'thunder',
        audio: 'thunder',
        icon: getThunderSvg()
      };
    default:
      return {
        text: 'Moderate Weather',
        theme: 'theme-clear-day',
        vfx: 'clear-day',
        audio: 'clear',
        icon: getSunSvg()
      };
  }
}

// SVG Weather Icons
function getSunSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="14" fill="#fbbf24"/><g stroke="#f59e0b" stroke-width="3" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="58"/><line x1="6" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="58" y2="32"/><line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/><line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/><line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/><line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/></g></svg>`;
}
function getMoonSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M42 12A22 22 0 1 1 20 48a20 20 0 0 0 22-36Z" fill="#38bdf8" opacity="0.9"/></svg>`;
}
function getPartlyCloudySvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><circle cx="26" cy="24" r="11" fill="#fbbf24"/><path d="M44 48H22a12 12 0 0 1-1.6-23.9A14 14 0 0 1 45 28.5a10 10 0 0 1-1 19.5Z" fill="#e2e8f0" opacity="0.95"/></svg>`;
}
function getCloudyNightSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M32 12A14 14 0 0 1 20 34a12 12 0 0 0 12-22Z" fill="#38bdf8"/><path d="M44 48H22a12 12 0 0 1-1.6-23.9A14 14 0 0 1 45 28.5a10 10 0 0 1-1 19.5Z" fill="#94a3b8" opacity="0.9"/></svg>`;
}
function getCloudSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 50H20a14 14 0 0 1-1.8-27.9A16 16 0 0 1 47 27a12 12 0 0 1-1 23Z" fill="#cbd5e1"/></svg>`;
}
function getFogSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 38H18a12 12 0 0 1 0-24 14 14 0 0 1 26 5 10 10 0 0 1 2 19Z" fill="#94a3b8" opacity="0.6"/><line x1="14" y1="46" x2="50" y2="46" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><line x1="18" y1="52" x2="46" y2="52" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function getDrizzleSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 36H20a12 12 0 0 1 0-24 14 14 0 0 1 26 5 10 10 0 0 1 2 19Z" fill="#94a3b8"/><line x1="22" y1="44" x2="20" y2="50" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="44" x2="30" y2="50" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/><line x1="42" y1="44" x2="40" y2="50" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/></svg>`;
}
function getRainSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 36H20a12 12 0 0 1 0-24 14 14 0 0 1 26 5 10 10 0 0 1 2 19Z" fill="#64748b"/><line x1="22" y1="42" x2="18" y2="54" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/><line x1="34" y1="42" x2="30" y2="54" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/><line x1="46" y1="42" x2="42" y2="54" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function getHeavyRainSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 34H20a12 12 0 0 1 0-24 14 14 0 0 1 26 5 10 10 0 0 1 2 19Z" fill="#475569"/><line x1="20" y1="40" x2="15" y2="56" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/><line x1="32" y1="40" x2="27" y2="56" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/><line x1="44" y1="40" x2="39" y2="56" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/></svg>`;
}
function getSnowSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 34H20a12 12 0 0 1 0-24 14 14 0 0 1 26 5 10 10 0 0 1 2 19Z" fill="#cbd5e1"/><circle cx="22" cy="46" r="2.5" fill="#e0f2fe"/><circle cx="34" cy="48" r="2.5" fill="#e0f2fe"/><circle cx="44" cy="46" r="2.5" fill="#e0f2fe"/><circle cx="28" cy="56" r="2" fill="#e0f2fe"/><circle cx="40" cy="56" r="2" fill="#e0f2fe"/></svg>`;
}
function getThunderSvg() {
  return `<svg viewBox="0 0 64 64" fill="none"><path d="M46 32H20a12 12 0 0 1 0-24 14 14 0 0 1 26 5 10 10 0 0 1 2 19Z" fill="#334155"/><polygon points="32 32 24 44 33 44 28 58 42 42 34 42" fill="#fbbf24"/></svg>`;
}

// Unit Helpers
function formatTemp(celsius) {
  if (celsius === undefined || celsius === null) return '--';
  if (state.unit === 'f') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function getUnitSymbol() {
  return state.unit === 'f' ? '°F' : '°C';
}

function getMoonPhaseInfo(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0, e = 0, jd = 0, b = 0;
  if (month < 3) {
    year--;
    month += 12;
  }
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = parseInt(jd);
  jd -= b;
  b = Math.round(jd * 8);
  if (b >= 8) b = 0;

  const phases = [
    { name: 'New Moon', icon: '🌑' },
    { name: 'Waxing Crescent', icon: '🌒' },
    { name: 'First Quarter', icon: '🌓' },
    { name: 'Waxing Gibbous', icon: '🌔' },
    { name: 'Full Moon', icon: '🌕' },
    { name: 'Waning Gibbous', icon: '🌖' },
    { name: 'Last Quarter', icon: '🌗' },
    { name: 'Waning Crescent', icon: '🌘' }
  ];

  return phases[b];
}

// API Fetchers
async function fetchWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast fetch failed');
  return await res.json();
}

async function fetchAirQuality(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function fetchMarineData(lat, lon) {
  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,ocean_current_velocity`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function fetchFlashbackData(lat, lon) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const years = [1980, 2000, 2010, 2020];

  const results = [];
  for (const yr of years) {
    const dateStr = `${yr}-${month}-${day}`;
    try {
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        results.push({
          year: yr,
          max: data.daily?.temperature_2m_max?.[0],
          min: data.daily?.temperature_2m_min?.[0],
          code: data.daily?.weather_code?.[0] || 0
        });
      }
    } catch (e) {
      console.warn(`Flashback error for ${yr}:`, e);
    }
  }
  return results;
}

// Render Hero
function renderHero(data) {
  const current = data.current;
  const meta = getWeatherMeta(current.weather_code, current.is_day);

  document.body.className = meta.theme;
  weatherVfx.setMode(meta.vfx);
  weatherAudio.setWeather(meta.audio);

  document.getElementById('hero-city-name').textContent = state.city;
  const now = new Date();
  document.getElementById('hero-country-time').textContent = `${state.country} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  document.getElementById('hero-temp').textContent = formatTemp(current.temperature_2m);
  document.getElementById('hero-temp-unit').textContent = getUnitSymbol();
  document.getElementById('hero-condition-text').textContent = meta.text;
  document.getElementById('hero-icon-container').innerHTML = meta.icon;

  document.getElementById('hero-feels-like').textContent = `${formatTemp(current.apparent_temperature)}°`;
  const daily = data.daily;
  if (daily) {
    document.getElementById('hero-high-low').textContent = `${formatTemp(daily.temperature_2m_max[0])}° / ${formatTemp(daily.temperature_2m_min[0])}°`;
  }
  document.getElementById('hero-wind-speed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.getElementById('hero-humidity').textContent = `${current.relative_humidity_2m}%`;

  const favBtn = document.getElementById('fav-btn');
  if (state.favorites.includes(state.city)) {
    favBtn.classList.add('is-fav');
  } else {
    favBtn.classList.remove('is-fav');
  }
}

// Render AI Life Advice
function renderAiAdvisor(data, aqiData) {
  const current = data.current;
  const daily = data.daily;
  const temp = current.temperature_2m;
  const wind = current.wind_speed_10m;
  const rainProb = daily.precipitation_probability_max[0] || 0;
  const uv = daily.uv_index_max[0] || 3;
  const aqi = aqiData?.current?.us_aqi || 30;

  let attire = 'Comfortable light layers';
  let attireDetail = 'Moderate pleasant temperature.';
  if (temp < 6) {
    attire = 'Heavy Winter Outerwear';
    attireDetail = 'Thermal layers, warm scarf, insulated coat and gloves.';
  } else if (temp < 16) {
    attire = 'Light Jacket or Knit Sweater';
    attireDetail = 'Chilly breezes expected, layer with denim or fleece.';
  } else if (temp > 27) {
    attire = 'Light Cotton & Sunglasses';
    attireDetail = 'Breathable lightweight fabrics and sun protection.';
  }

  let rainGear = 'No Umbrella Needed';
  let rainDetail = 'Skies remain mostly dry throughout today.';
  if (rainProb > 45 || current.precipitation > 0) {
    rainGear = 'Carry Umbrella / Waterproof';
    rainDetail = `High precipitation chance (${rainProb}%). Rain expected.`;
  }

  let sunAdvice = 'Low Sun Risk';
  let sunDetail = 'Minimal UV exposure during midday.';
  if (uv >= 6) {
    sunAdvice = 'High UV Warning (SPF 50+)';
    sunDetail = 'Seek shade during peak 11am-4pm hours; sunglasses mandatory.';
  } else if (uv >= 3) {
    sunAdvice = 'Moderate UV (SPF 30)';
    sunDetail = 'Wear sunglasses and apply sun cream for outdoor strolls.';
  }

  const insightsContainer = document.getElementById('ai-insights-container');
  insightsContainer.innerHTML = `
    <div class="insight-item">
      <div class="insight-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </svg>
      </div>
      <div class="insight-text">
        <h4>${attire}</h4>
        <p>${attireDetail}</p>
      </div>
    </div>
    <div class="insight-item">
      <div class="insight-icon-box" style="background: rgba(56, 189, 248, 0.15); color: var(--accent-cyan);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
        </svg>
      </div>
      <div class="insight-text">
        <h4>${rainGear}</h4>
        <p>${rainDetail}</p>
      </div>
    </div>
    <div class="insight-item">
      <div class="insight-icon-box" style="background: rgba(251, 191, 36, 0.15); color: var(--accent-yellow);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>
      </div>
      <div class="insight-text">
        <h4>${sunAdvice}</h4>
        <p>${sunDetail}</p>
      </div>
    </div>
  `;

  let runScore = 90;
  if (temp < 5 || temp > 28) runScore -= 30;
  if (rainProb > 40) runScore -= 35;
  if (aqi > 80) runScore -= 25;
  runScore = Math.max(15, Math.min(99, runScore));

  let driveScore = 95;
  if (current.weather_code >= 61) driveScore -= 30;
  if (wind > 35) driveScore -= 20;
  if (current.weather_code >= 45 && current.weather_code <= 48) driveScore -= 40;
  driveScore = Math.max(20, Math.min(99, driveScore));

  let starScore = 85;
  if (current.cloud_cover > 40) starScore -= (current.cloud_cover * 0.75);
  if (current.is_day === 1) starScore = 20;
  starScore = Math.max(10, Math.round(starScore));

  let beachScore = 40;
  if (temp > 23 && current.is_day === 1 && rainProb < 20) beachScore = 88;
  else if (temp > 20) beachScore = 65;

  const scoreClass = (s) => (s >= 75 ? 'score-good' : s >= 45 ? 'score-fair' : 'score-poor');

  document.getElementById('activity-scores-container').innerHTML = `
    <div class="activity-badge">
      <span class="act-name">🏃 Outdoor Run</span>
      <span class="act-score ${scoreClass(runScore)}">${runScore}/100</span>
    </div>
    <div class="activity-badge">
      <span class="act-name">🚗 Driving Safety</span>
      <span class="act-score ${scoreClass(driveScore)}">${driveScore}/100</span>
    </div>
    <div class="activity-badge">
      <span class="act-name">🔭 Stargazing</span>
      <span class="act-score ${scoreClass(starScore)}">${starScore}/100</span>
    </div>
    <div class="activity-badge">
      <span class="act-name">🏖️ Beach & Pool</span>
      <span class="act-score ${scoreClass(beachScore)}">${beachScore}/100</span>
    </div>
  `;
}

// Render Hourly Curve
function renderHourlyCurve(data) {
  const svg = document.getElementById('hourly-chart-svg');
  if (!svg || !data.hourly) return;

  const hourly = data.hourly;
  const currentHour = new Date().getHours();
  const hours = [];
  for (let i = currentHour; i < currentHour + 24; i++) {
    hours.push({
      time: hourly.time[i],
      temp: hourly.temperature_2m[i],
      rainProb: hourly.precipitation_probability[i] || 0,
      code: hourly.weather_code[i]
    });
  }

  const svgWidth = 850;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 40;

  const temps = hours.map(h => formatTemp(h.temp));
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const tempRange = Math.max(1, maxTemp - minTemp);

  const stepX = (svgWidth - paddingX * 2) / (hours.length - 1);

  const points = hours.map((h, i) => {
    const x = paddingX + i * stepX;
    const y = svgHeight - paddingY - ((formatTemp(h.temp) - minTemp) / tempRange) * (svgHeight - paddingY * 2);
    return { x, y, h };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  let rainBarsSvg = '';
  points.forEach((p) => {
    if (p.h.rainProb > 0) {
      const barHeight = (p.h.rainProb / 100) * 45;
      const barY = svgHeight - barHeight;
      rainBarsSvg += `
        <rect x="${p.x - 5}" y="${barY}" width="10" height="${barHeight}" rx="3" fill="rgba(56, 189, 248, 0.22)"/>
        <text x="${p.x}" y="${barY - 3}" font-size="9" fill="#38bdf8" text-anchor="middle" font-family="var(--font-mono)">${p.h.rainProb}%</text>
      `;
    }
  });

  let labelsSvg = '';
  points.forEach((p) => {
    const hourLabel = new Date(p.h.time).toLocaleTimeString([], { hour: 'numeric' });
    labelsSvg += `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>
      <text x="${p.x}" y="${p.y - 12}" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="var(--font-main)">${formatTemp(p.h.temp)}°</text>
      <text x="${p.x}" y="${svgHeight - 10}" font-size="10" fill="#94a3b8" text-anchor="middle" font-family="var(--font-mono)">${hourLabel}</text>
    `;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <path d="${areaD}" fill="url(#curveGradient)"/>
    ${rainBarsSvg}
    <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    ${labelsSvg}
  `;
}

// Render Optimal Activity Window
function renderOptimalActivityWindow(data) {
  if (!data?.hourly) return;
  const hourly = data.hourly;
  const currentHour = new Date().getHours();
  const candidates = [];

  for (let i = currentHour; i < currentHour + 24; i++) {
    const hourDate = new Date(hourly.time[i]);
    const temp = hourly.temperature_2m[i];
    const rain = hourly.precipitation_probability[i] || 0;
    const uv = (data.daily?.uv_index_max?.[0] || 3);
    const code = hourly.weather_code[i];

    let score = 0;
    if (state.selectedActivity === 'run') {
      score = 100 - Math.abs(temp - 17) * 4 - (rain * 0.8);
    } else if (state.selectedActivity === 'car') {
      score = 100 - (rain * 1.5) - (code >= 50 ? 50 : 0);
    } else if (state.selectedActivity === 'dog') {
      score = 100 - Math.abs(temp - 19) * 3 - (rain * 0.9);
    } else if (state.selectedActivity === 'photo') {
      // Near sunset or sunrise
      const h = hourDate.getHours();
      const isGolden = (h >= 6 && h <= 8) || (h >= 17 && h <= 20);
      score = isGolden ? 95 : 40;
    }
    candidates.push({ i, hourDate, temp, rain, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  const startStr = best.hourDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const endHour = new Date(best.hourDate.getTime() + 2.5 * 3600000);
  const endStr = endHour.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  document.getElementById('opt-time-range').textContent = `${startStr} – ${endStr}`;
  document.getElementById('opt-chips-container').innerHTML = `
    <span class="cond-chip">🌡️ ${formatTemp(best.temp)}${getUnitSymbol()} (Ideal)</span>
    <span class="cond-chip">💧 ${best.rain}% Rain Odds</span>
    <span class="cond-chip">☀️ Peak Comfort</span>
    <span class="cond-chip">🍃 Gentle Conditions</span>
  `;
}

// Render Weather Flashback
function renderFlashback(flashbackList, currentTemp) {
  const container = document.getElementById('flashback-container');
  document.getElementById('flashback-city-label').textContent = state.city;
  if (!container || !flashbackList.length) return;

  container.innerHTML = flashbackList.map(item => {
    const delta = item.max !== undefined ? Math.round(currentTemp - item.max) : 0;
    const isWarmer = delta > 0;
    const deltaStr = delta === 0 ? 'Exact match' : `${Math.abs(delta)}° ${isWarmer ? 'warmer today' : 'cooler today'}`;
    const deltaClass = delta > 0 ? 'delta-warmer' : delta < 0 ? 'delta-cooler' : 'delta-same';

    return `
      <div class="flashback-col">
        <span class="flashback-year">${item.year}</span>
        <span class="flashback-temp">${formatTemp(item.max)}°</span>
        <span class="flashback-delta ${deltaClass}">
          ${isWarmer ? '🔥' : '❄️'} ${deltaStr}
        </span>
      </div>
    `;
  }).join('');
}

// Render Details Grid & Marine
function renderDetailsGrid(data, aqiData, marineData) {
  const current = data.current;
  const daily = data.daily;

  // 1. Wind
  const windDir = current.wind_direction_10m;
  const compassNeedle = document.getElementById('compass-needle');
  if (compassNeedle) compassNeedle.style.transform = `rotate(${windDir}deg)`;
  document.getElementById('metric-wind-val').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  const gust = current.wind_gusts_10m ? Math.round(current.wind_gusts_10m) : Math.round(current.wind_speed_10m * 1.3);
  document.getElementById('metric-wind-dir').textContent = `${getCompassDirection(windDir)} • Gusts up to ${gust} km/h`;

  // 2. UV
  const uv = daily.uv_index_max[0] || 0;
  document.getElementById('metric-uv-val').textContent = uv.toFixed(1);
  const uvFill = document.getElementById('uv-meter-fill');
  uvFill.style.width = `${Math.min(100, (uv / 11) * 100)}%`;
  const uvPill = document.getElementById('metric-uv-pill');
  if (uv < 3) {
    uvPill.className = 'aqi-pill aqi-good';
    uvPill.textContent = 'Low';
  } else if (uv < 6) {
    uvPill.className = 'aqi-pill aqi-moderate';
    uvPill.textContent = 'Moderate';
  } else {
    uvPill.className = 'aqi-pill aqi-unhealthy';
    uvPill.textContent = 'Very High';
  }

  // 3. AQI
  const aqiVal = aqiData?.current?.us_aqi || 28;
  document.getElementById('metric-aqi-val').textContent = aqiVal;
  const aqiPill = document.getElementById('metric-aqi-pill');
  if (aqiVal <= 50) {
    aqiPill.className = 'aqi-pill aqi-good';
    aqiPill.textContent = 'Good';
  } else if (aqiVal <= 100) {
    aqiPill.className = 'aqi-pill aqi-moderate';
    aqiPill.textContent = 'Moderate';
  } else {
    aqiPill.className = 'aqi-pill aqi-unhealthy';
    aqiPill.textContent = 'Unhealthy';
  }
  const pm25 = aqiData?.current?.pm2_5 || 7.4;
  const pm10 = aqiData?.current?.pm10 || 14.1;
  document.getElementById('metric-aqi-pollutants').textContent = `PM2.5: ${pm25} µg/m³ • PM10: ${pm10} µg/m³`;

  // 4. Marine
  const waveHeight = marineData?.current?.wave_height;
  const wavePeriod = marineData?.current?.wave_period;
  if (waveHeight !== undefined && waveHeight !== null) {
    document.getElementById('marine-wave-height').textContent = `${waveHeight.toFixed(1)} m`;
    document.getElementById('marine-state-tag').textContent = waveHeight > 1.5 ? 'Rough Surf' : 'Gentle Swell';
    document.getElementById('marine-sub-info').textContent = `Swell: ${wavePeriod ? wavePeriod.toFixed(1) + 's' : '5.5s'} • Coastal Active`;
  } else {
    document.getElementById('marine-wave-height').textContent = 'Inland';
    document.getElementById('marine-state-tag').textContent = 'Calm Freshwaters';
    document.getElementById('marine-sub-info').textContent = 'Local lakes & rivers peaceful';
  }

  // 5. Sun & Moon
  const sunriseStr = daily.sunrise[0];
  const sunsetStr = daily.sunset[0];
  const sunrise = new Date(sunriseStr);
  const sunset = new Date(sunsetStr);
  document.getElementById('metric-sunrise-time').textContent = `Sunrise: ${sunrise.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  document.getElementById('metric-sunset-time').textContent = `Sunset: ${sunset.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  const durationMinutes = Math.round((sunset - sunrise) / 60000);
  const durH = Math.floor(durationMinutes / 60);
  const durM = durationMinutes % 60;
  document.getElementById('metric-daylight-duration').textContent = `Daylight: ${durH}h ${durM}m`;

  const moon = getMoonPhaseInfo();
  document.getElementById('metric-moon-phase').textContent = `${moon.name} ${moon.icon}`;

  // 6. Humidity
  document.getElementById('metric-humidity-val').textContent = `${current.relative_humidity_2m}%`;
  const dewPoint = data.hourly?.dew_point_2m ? data.hourly.dew_point_2m[new Date().getHours()] : (current.temperature_2m - ((100 - current.relative_humidity_2m) / 5));
  document.getElementById('metric-dewpoint-val').textContent = `The dew point is ${formatTemp(dewPoint)}${getUnitSymbol()} right now.`;

  // 7. Visibility
  const visMeters = data.hourly?.visibility ? data.hourly.visibility[new Date().getHours()] : 10000;
  const visKm = Math.round(visMeters / 1000);
  document.getElementById('metric-visibility-val').textContent = `${visKm} km`;
  document.getElementById('metric-visibility-sub').textContent = visKm >= 10 ? 'Perfect atmospheric clarity.' : 'Slight mist or haze.';

  // 8. Pressure
  const pressure = Math.round(current.pressure_msl || current.surface_pressure || 1013);
  document.getElementById('metric-pressure-val').textContent = `${pressure} hPa`;
}

function getCompassDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

// Render 7-Day Extended Forecast
function renderExtendedForecast(data) {
  const daily = data.daily;
  const forecastList = document.getElementById('forecast-list');
  if (!forecastList || !daily) return;

  const minTemps = daily.temperature_2m_min.map(t => formatTemp(t));
  const maxTemps = daily.temperature_2m_max.map(t => formatTemp(t));
  const globalMin = Math.min(...minTemps);
  const globalMax = Math.max(...maxTemps);
  const globalRange = Math.max(1, globalMax - globalMin);

  let html = '';
  for (let i = 0; i < daily.time.length; i++) {
    const date = new Date(daily.time[i]);
    const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const code = daily.weather_code[i];
    const meta = getWeatherMeta(code, 1);

    const min = minTemps[i];
    const max = maxTemps[i];

    const leftPercent = ((min - globalMin) / globalRange) * 100;
    const widthPercent = Math.max(12, ((max - min) / globalRange) * 100);

    html += `
      <div class="forecast-row">
        <span class="forecast-day">${dayName}</span>
        <div class="forecast-icon">${meta.icon}</div>
        <span class="forecast-desc">${meta.text}</span>
        <div class="forecast-temp-range">
          <span class="temp-low">${min}°</span>
          <div class="temp-bar-bg">
            <div class="temp-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
          </div>
          <span class="temp-high">${max}°</span>
        </div>
      </div>
    `;
  }
  forecastList.innerHTML = html;
}

// Main Weather Coordinator
async function loadCityWeather(lat, lon, cityName, countryName) {
  try {
    state.lat = lat;
    state.lon = lon;
    state.city = cityName;
    state.country = countryName;

    const [weatherData, aqiData, marineData, flashbackData] = await Promise.all([
      fetchWeatherData(lat, lon),
      fetchAirQuality(lat, lon),
      fetchMarineData(lat, lon),
      fetchFlashbackData(lat, lon)
    ]);

    state.weatherData = weatherData;
    state.airQualityData = aqiData;
    state.marineData = marineData;
    state.flashbackData = flashbackData;

    renderHero(weatherData);
    renderAiAdvisor(weatherData, aqiData);
    renderHourlyCurve(weatherData);
    renderOptimalActivityWindow(weatherData);
    renderFlashback(flashbackData, weatherData.current.temperature_2m);
    renderDetailsGrid(weatherData, aqiData, marineData);
    renderExtendedForecast(weatherData);

    weatherRadar.updateMarker(lat, lon, cityName);
    document.getElementById('radar-modal-title').textContent = `Live Precipitation Radar - ${cityName}`;
  } catch (err) {
    console.error('Error loading weather data:', err);
  }
}

// Search Autocomplete
let searchDebounceTimer = null;
async function handleSearchInput(e) {
  const query = e.target.value.trim();
  const dropdown = document.getElementById('search-dropdown');

  clearTimeout(searchDebounceTimer);
  if (query.length < 2) {
    dropdown.classList.remove('active');
    dropdown.innerHTML = '';
    return;
  }

  searchDebounceTimer = setTimeout(async () => {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results || [];

      if (!results.length) {
        dropdown.innerHTML = `<div class="search-item" style="color: var(--text-muted); cursor: default;">No locations found</div>`;
        dropdown.classList.add('active');
        return;
      }

      dropdown.innerHTML = results.map(item => `
        <div class="search-item" data-lat="${item.latitude}" data-lon="${item.longitude}" data-city="${item.name}" data-country="${item.country || ''}">
          <div class="search-item-info">
            <span class="search-city-name">${item.name}</span>
            <span class="search-country">${[item.admin1, item.country].filter(Boolean).join(', ')}</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${item.latitude.toFixed(2)}°, ${item.longitude.toFixed(2)}°</span>
        </div>
      `).join('');
      dropdown.classList.add('active');
    } catch (err) {
      console.warn('Geocoding search failed:', err);
    }
  }, 250);
}

// Commute Route Weather Calculator
async function calculateRouteWeather(originName, destName) {
  const timeline = document.getElementById('commute-timeline-content');
  timeline.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">Calculating weather along route...</div>`;

  try {
    const [resO, resD] = await Promise.all([
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(originName)}&count=1&language=en&format=json`).then(r => r.json()),
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destName)}&count=1&language=en&format=json`).then(r => r.json())
    ]);

    const o = resO.results?.[0];
    const d = resD.results?.[0];
    if (!o || !d) {
      timeline.innerHTML = `<div style="color: var(--accent-red); padding: 1rem;">Could not resolve one of the cities. Please check spelling.</div>`;
      return;
    }

    const midLat = (o.latitude + d.latitude) / 2;
    const midLon = (o.longitude + d.longitude) / 2;

    const [wO, wMid, wD] = await Promise.all([
      fetchWeatherData(o.latitude, o.longitude),
      fetchWeatherData(midLat, midLon),
      fetchWeatherData(d.latitude, d.longitude)
    ]);

    const makeWaypointHtml = (tag, cityName, w) => {
      const temp = formatTemp(w.current.temperature_2m);
      const meta = getWeatherMeta(w.current.weather_code);
      let hazard = 'Clear Highway Driving';
      let isHazard = false;
      if (w.current.weather_code >= 61) {
        hazard = 'Wet Highway / Aquaplaning Risk';
        isHazard = true;
      } else if (w.current.weather_code >= 45 && w.current.weather_code <= 48) {
        hazard = 'Dense Fog / Low Visibility';
        isHazard = true;
      } else if (w.current.wind_speed_10m > 35) {
        hazard = 'High Crosswinds Warning';
        isHazard = true;
      }

      return `
        <div class="route-waypoint">
          <div class="waypoint-info">
            <span class="waypoint-tag">${tag}</span>
            <span class="waypoint-city">${cityName}</span>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${meta.text} • Wind: ${Math.round(w.current.wind_speed_10m)} km/h</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span style="font-size: 1.6rem; font-weight: 800; color: #fff;">${temp}${getUnitSymbol()}</span>
            <span class="${isHazard ? 'hazard-badge' : 'aqi-pill aqi-good'}">${hazard}</span>
          </div>
        </div>
      `;
    };

    timeline.innerHTML = `
      ${makeWaypointHtml('DEPARTURE POINT', o.name, wO)}
      ${makeWaypointHtml('MIDPOINT HIGHWAY ROUTE', 'En Route Waypoint', wMid)}
      ${makeWaypointHtml('DESTINATION ARRIVAL', d.name, wD)}
    `;
  } catch (err) {
    timeline.innerHTML = `<div style="color: var(--accent-red); padding: 1rem;">Failed to calculate route weather.</div>`;
  }
}

// Notification Toast Trigger
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const text = document.getElementById('toast-text');
  if (toast && text) {
    text.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
}

// Dual-City Comparison Engine
async function loadComparisonCity(cityName) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (!geoData.results?.length) return;

    const target = geoData.results[0];
    const [c1Weather, c2Weather] = await Promise.all([
      fetchWeatherData(state.lat, state.lon),
      fetchWeatherData(target.latitude, target.longitude)
    ]);

    document.getElementById('compare-city-1-name').textContent = state.city;
    document.getElementById('compare-city-1-temp').textContent = `${formatTemp(c1Weather.current.temperature_2m)}${getUnitSymbol()}`;
    document.getElementById('compare-city-1-metrics').innerHTML = `
      <div class="compare-metric-row"><span class="compare-metric-label">Feels Like</span><span class="compare-metric-val">${formatTemp(c1Weather.current.apparent_temperature)}°</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Condition</span><span class="compare-metric-val">${getWeatherMeta(c1Weather.current.weather_code).text}</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Humidity</span><span class="compare-metric-val">${c1Weather.current.relative_humidity_2m}%</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Wind</span><span class="compare-metric-val">${Math.round(c1Weather.current.wind_speed_10m)} km/h</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Precipitation Odds</span><span class="compare-metric-val">${c1Weather.daily.precipitation_probability_max[0]}%</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Max UV</span><span class="compare-metric-val">${c1Weather.daily.uv_index_max[0]}</span></div>
    `;

    document.getElementById('compare-city-2-name').textContent = target.name;
    document.getElementById('compare-city-2-temp').textContent = `${formatTemp(c2Weather.current.temperature_2m)}${getUnitSymbol()}`;
    document.getElementById('compare-city-2-metrics').innerHTML = `
      <div class="compare-metric-row"><span class="compare-metric-label">Feels Like</span><span class="compare-metric-val">${formatTemp(c2Weather.current.apparent_temperature)}°</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Condition</span><span class="compare-metric-val">${getWeatherMeta(c2Weather.current.weather_code).text}</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Humidity</span><span class="compare-metric-val">${c2Weather.current.relative_humidity_2m}%</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Wind</span><span class="compare-metric-val">${Math.round(c2Weather.current.wind_speed_10m)} km/h</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Precipitation Odds</span><span class="compare-metric-val">${c2Weather.daily.precipitation_probability_max[0]}%</span></div>
      <div class="compare-metric-row"><span class="compare-metric-label">Max UV</span><span class="compare-metric-val">${c2Weather.daily.uv_index_max[0]}</span></div>
    `;
  } catch (e) {
    console.warn('Comparison failed:', e);
  }
}

// Event Listeners & Bootstrapping
function setupEventListeners() {
  // Unit toggle
  const unitBtn = document.getElementById('unit-toggle-btn');
  const unitDisplay = document.getElementById('unit-display');
  unitBtn.addEventListener('click', () => {
    state.unit = state.unit === 'c' ? 'f' : 'c';
    unitDisplay.textContent = state.unit === 'c' ? '°C' : '°F';
    if (state.weatherData) {
      renderHero(state.weatherData);
      renderAiAdvisor(state.weatherData, state.airQualityData);
      renderHourlyCurve(state.weatherData);
      renderOptimalActivityWindow(state.weatherData);
      if (state.flashbackData) renderFlashback(state.flashbackData, state.weatherData.current.temperature_2m);
      renderDetailsGrid(state.weatherData, state.airQualityData, state.marineData);
      renderExtendedForecast(state.weatherData);
    }
  });

  // Audio ambient soundscape toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-btn-label');
  audioBtn.addEventListener('click', () => {
    state.isAudioActive = weatherAudio.togglePlay();
    if (state.isAudioActive) {
      audioBtn.classList.add('sound-playing', 'active');
      audioLabel.textContent = 'Playing';
    } else {
      audioBtn.classList.remove('sound-playing', 'active');
      audioLabel.textContent = 'Ambient';
    }
  });

  // Mixer Modal & Faders
  const mixerBtn = document.getElementById('mixer-toggle-btn');
  const mixerModal = document.getElementById('mixer-modal');
  const closeMixerBtn = document.getElementById('close-mixer-btn');
  mixerBtn.addEventListener('click', () => {
    mixerModal.classList.add('active');
    weatherAudio.ensureContextRunning();
  });
  closeMixerBtn.addEventListener('click', () => mixerModal.classList.remove('active'));

  ['rain', 'wind', 'thunder', 'warmth'].forEach(ch => {
    const fader = document.getElementById(`fader-${ch}`);
    const label = document.getElementById(`label-fader-${ch}`);
    if (fader) {
      fader.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        weatherAudio.setChannelVolume(ch, val);
        if (label) label.textContent = `${Math.round(val * 100)}%`;
      });
    }
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      weatherAudio.setPreset(btn.dataset.preset);
      ['rain', 'wind', 'thunder', 'warmth'].forEach(ch => {
        const fader = document.getElementById(`fader-${ch}`);
        const label = document.getElementById(`label-fader-${ch}`);
        if (fader && label) label.textContent = `${Math.round(parseFloat(fader.value) * 100)}%`;
      });
    });
  });

  // Activity Planner Selector
  document.querySelectorAll('.planner-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.planner-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.selectedActivity = pill.dataset.act;
      if (state.weatherData) renderOptimalActivityWindow(state.weatherData);
    });
  });

  // Commute Travel Modal
  const commuteBtn = document.getElementById('commute-toggle-btn');
  const commuteModal = document.getElementById('commute-modal');
  const closeCommuteBtn = document.getElementById('close-commute-btn');
  const calcRouteBtn = document.getElementById('calc-route-btn');
  commuteBtn.addEventListener('click', () => {
    commuteModal.classList.add('active');
    calculateRouteWeather(document.getElementById('route-origin-input').value, document.getElementById('route-dest-input').value);
  });
  closeCommuteBtn.addEventListener('click', () => commuteModal.classList.remove('active'));
  calcRouteBtn.addEventListener('click', () => {
    calculateRouteWeather(document.getElementById('route-origin-input').value, document.getElementById('route-dest-input').value);
  });

  // Briefing Notification
  const briefingBtn = document.getElementById('briefing-btn');
  briefingBtn.addEventListener('click', () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        const title = `Morning Briefing: ${state.city}`;
        const temp = formatTemp(state.weatherData?.current?.temperature_2m || 20);
        const cond = state.weatherData ? getWeatherMeta(state.weatherData.current.weather_code).text : 'Pleasant';
        const body = `Good day! It's currently ${temp}${getUnitSymbol()} with ${cond}. Check AtmosVibe for optimal run windows!`;

        if (permission === 'granted') {
          new Notification(title, { body });
        }
        showToast(`Briefing: ${temp}${getUnitSymbol()}, ${cond}`);
      });
    } else {
      showToast(`Briefing: ${state.city} is currently pleasant!`);
    }
  });

  // Live Radar Modal
  const radarBtn = document.getElementById('radar-toggle-btn');
  const radarModal = document.getElementById('radar-modal');
  const closeRadarBtn = document.getElementById('close-radar-btn');
  const radarPlayBtn = document.getElementById('radar-play-pause-btn');
  const radarPlayIcon = document.getElementById('radar-play-icon');
  const radarSlider = document.getElementById('radar-slider');

  radarBtn.addEventListener('click', () => {
    radarModal.classList.add('active');
    weatherRadar.init('radar-map');
    weatherRadar.updateMarker(state.lat, state.lon, state.city);
  });
  closeRadarBtn.addEventListener('click', () => radarModal.classList.remove('active'));

  radarPlayBtn.addEventListener('click', () => {
    const isPlaying = weatherRadar.togglePlayback();
    radarPlayIcon.innerHTML = isPlaying
      ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
      : '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
  });

  radarSlider.addEventListener('input', (e) => {
    weatherRadar.stopPlayback();
    weatherRadar.showFrame(parseInt(e.target.value));
    radarPlayIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
  });

  // Compare Modal
  const compareBtn = document.getElementById('compare-toggle-btn');
  const compareModal = document.getElementById('compare-modal');
  const closeCompareBtn = document.getElementById('close-compare-btn');
  const compareInput = document.getElementById('compare-search-input');
  compareBtn.addEventListener('click', () => {
    compareModal.classList.add('active');
    loadComparisonCity(state.compareCity);
  });
  closeCompareBtn.addEventListener('click', () => compareModal.classList.remove('active'));
  compareInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      state.compareCity = e.target.value.trim();
      loadComparisonCity(state.compareCity);
    }
  });

  // Search input & dropdown
  const searchInput = document.getElementById('city-search');
  const searchDropdown = document.getElementById('search-dropdown');
  searchInput.addEventListener('input', handleSearchInput);

  searchDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.search-item');
    if (!item) return;

    const lat = parseFloat(item.dataset.lat);
    const lon = parseFloat(item.dataset.lon);
    const city = item.dataset.city;
    const country = item.dataset.country;

    loadCityWeather(lat, lon, city, country);
    searchDropdown.classList.remove('active');
    searchInput.value = '';
    document.querySelectorAll('.quick-pill').forEach(p => p.classList.remove('active'));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      searchDropdown.classList.remove('active');
    }
  });

  // Geolocation Button
  const geoBtn = document.getElementById('geo-location-btn');
  geoBtn.addEventListener('click', () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`);
            const data = await res.json();
            const cityName = data.results?.[0]?.name || 'Current Location';
            const countryName = data.results?.[0]?.country || '';
            loadCityWeather(lat, lon, cityName, countryName);
          } catch (e) {
            loadCityWeather(lat, lon, 'My Location', '');
          }
        },
        () => alert('Unable to retrieve location. Please check browser permissions or search manually.')
      );
    }
  });

  // Quick Location Pills
  document.querySelectorAll('.quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.quick-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const city = pill.dataset.city;
      const lat = parseFloat(pill.dataset.lat);
      const lon = parseFloat(pill.dataset.lon);
      const country = pill.dataset.country;
      loadCityWeather(lat, lon, city, country);
    });
  });

  // Favorites
  const favBtn = document.getElementById('fav-btn');
  favBtn.addEventListener('click', () => {
    if (state.favorites.includes(state.city)) {
      state.favorites = state.favorites.filter(c => c !== state.city);
      favBtn.classList.remove('is-fav');
    } else {
      state.favorites.push(state.city);
      favBtn.classList.add('is-fav');
    }
    localStorage.setItem('atmos_favorites', JSON.stringify(state.favorites));
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (e.key === 'Escape') {
        searchDropdown.classList.remove('active');
        document.activeElement.blur();
      }
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key.toLowerCase() === 'u') {
      unitBtn.click();
    } else if (e.key.toLowerCase() === 'm') {
      radarBtn.click();
    } else if (e.key.toLowerCase() === 's') {
      audioBtn.click();
    } else if (e.key.toLowerCase() === 'c') {
      compareBtn.click();
    } else if (e.key.toLowerCase() === 't') {
      commuteBtn.click();
    } else if (e.key.toLowerCase() === 'r') {
      loadCityWeather(state.lat, state.lon, state.city, state.country);
    }
  });
}

// Service Worker Registration for PWA & Offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('Service Worker registration failed:', err);
    });
  });
}

// Application Initialization
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('weather-canvas');
  weatherVfx.init(canvas);
  setupEventListeners();
  loadCityWeather(state.lat, state.lon, state.city, state.country);
});
