/**
 * weatherVfx.js - Living Atmospheric Canvas Effects Engine
 * Renders 60FPS procedural particle systems: rain splashes, lightning forks,
 * 3D snow drift, twinkling starfields, shooting stars, and solar flares.
 */

class WeatherVfxEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.currentMode = 'clear-day';
    this.animationFrameId = null;
    this.particles = [];
    this.splashes = [];
    this.stars = [];
    this.shootingStars = [];
    this.lightningBolts = [];
    this.flashOpacity = 0;

    this.windX = 0.5; // Wind influence
    this.lastTime = performance.now();

    this.bindEvents();
  }

  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Listen for thunder strikes from audio or internal triggers
    window.addEventListener('thunder-strike', () => {
      this.triggerLightning();
    });

    this.startLoop();
  }

  bindEvents() {
    // Interactivity: gentle mouse wind sway
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      this.windX = normX * 1.5;
    });
  }

  handleResize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Re-initialize stars if in night mode
    if (this.currentMode.includes('night')) {
      this.initStarfield();
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    this.particles = [];
    this.splashes = [];
    this.lightningBolts = [];
    this.flashOpacity = 0;

    if (mode.includes('night') && !mode.includes('rain') && !mode.includes('snow')) {
      this.initStarfield();
    } else if (mode.includes('thunder')) {
      this.initRain(140);
    } else if (mode.includes('rain')) {
      this.initRain(90);
    } else if (mode.includes('drizzle')) {
      this.initRain(40);
    } else if (mode.includes('snow')) {
      this.initSnow(110);
    } else if (mode.includes('cloud') || mode.includes('fog')) {
      this.initClouds(35);
    } else {
      // Clear day sun motes
      this.initSunMotes(25);
    }
  }

  initStarfield() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 4500);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.75,
        radius: Math.random() * 1.3 + 0.3,
        alpha: Math.random(),
        twinkleSpeed: 0.008 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  initRain(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        len: 15 + Math.random() * 20,
        speed: 12 + Math.random() * 12,
        alpha: 0.25 + Math.random() * 0.45,
        width: 1 + Math.random() * 1.2
      });
    }
  }

  initSnow(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 1 + Math.random() * 3.5,
        speed: 1 + Math.random() * 2.2,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.03,
        alpha: 0.3 + Math.random() * 0.6
      });
    }
  }

  initClouds(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.6),
        radius: 60 + Math.random() * 120,
        speed: 0.15 + Math.random() * 0.35,
        alpha: 0.04 + Math.random() * 0.07
      });
    }
  }

  initSunMotes(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 1 + Math.random() * 2.5,
        speedY: -0.2 - Math.random() * 0.4,
        swayPhase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.4
      });
    }
  }

  triggerLightning() {
    this.flashOpacity = 0.65;
    const startX = this.width * (0.2 + Math.random() * 0.6);
    const bolt = this.createLightningBranch(startX, 0, startX + (Math.random() * 100 - 50), this.height * 0.65, 5);
    this.lightningBolts.push({ segments: bolt, life: 12 });
  }

  createLightningBranch(x1, y1, x2, y2, depth) {
    const segments = [];
    const recurse = (sx, sy, ex, ey, d) => {
      if (d <= 0) {
        segments.push({ sx, sy, ex, ey });
        return;
      }
      const midX = (sx + ex) / 2 + (Math.random() - 0.5) * (ey - sy) * 0.4;
      const midY = (sy + ey) / 2;
      recurse(sx, sy, midX, midY, d - 1);
      recurse(midX, midY, ex, ey, d - 1);

      // Optional small fork
      if (d > 2 && Math.random() < 0.4) {
        const forkEx = midX + (Math.random() - 0.5) * 80;
        const forkEy = midY + Math.random() * 60;
        recurse(midX, midY, forkEx, forkEy, d - 2);
      }
    };
    recurse(x1, y1, x2, y2, depth);
    return segments;
  }

  startLoop() {
    const loop = (now) => {
      this.animationFrameId = requestAnimationFrame(loop);
      this.render();
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.currentMode.includes('night') && !this.currentMode.includes('rain') && !this.currentMode.includes('snow')) {
      this.renderStarfield();
      this.renderShootingStars();
    }

    if (this.currentMode.includes('thunder')) {
      this.renderRain();
      this.renderLightning();
    } else if (this.currentMode.includes('rain') || this.currentMode.includes('drizzle')) {
      this.renderRain();
    } else if (this.currentMode.includes('snow')) {
      this.renderSnow();
    } else if (this.currentMode.includes('cloud') || this.currentMode.includes('fog')) {
      this.renderClouds();
    } else {
      this.renderSunMotes();
    }

    this.renderSplashes();
  }

  renderStarfield() {
    this.ctx.fillStyle = '#ffffff';
    this.stars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = Math.max(0.1, Math.min(1, s.alpha + Math.sin(s.twinklePhase) * 0.4));
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  renderShootingStars() {
    // Randomly spawn shooting star
    if (Math.random() < 0.007 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.4),
        len: 80 + Math.random() * 80,
        speed: 16 + Math.random() * 12,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
        life: 1.0
      });
    }

    this.shootingStars = this.shootingStars.filter(ss => ss.life > 0);
    this.shootingStars.forEach(ss => {
      const vx = Math.cos(ss.angle) * ss.speed;
      const vy = Math.sin(ss.angle) * ss.speed;
      const tailX = ss.x - Math.cos(ss.angle) * ss.len;
      const tailY = ss.y - Math.sin(ss.angle) * ss.len;

      const grad = this.ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();

      ss.x += vx;
      ss.y += vy;
      ss.life -= 0.035;
    });
  }

  renderRain() {
    this.ctx.strokeStyle = 'rgba(180, 215, 255, 0.7)';
    this.ctx.lineCap = 'round';

    this.particles.forEach(p => {
      this.ctx.lineWidth = p.width;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + this.windX * 3, p.y + p.len);
      this.ctx.stroke();

      p.y += p.speed;
      p.x += this.windX * 2.5;

      // Bottom splash impact
      if (p.y > this.height - 15) {
        if (Math.random() < 0.25) {
          this.createSplash(p.x, this.height - 10);
        }
        p.y = -p.len;
        p.x = Math.random() * this.width;
      }
    });
    this.ctx.globalAlpha = 1;
  }

  createSplash(x, y) {
    if (this.splashes.length > 50) return;
    this.splashes.push({
      x,
      y,
      radius: 1,
      maxRadius: 4 + Math.random() * 6,
      alpha: 0.6
    });
  }

  renderSplashes() {
    this.splashes = this.splashes.filter(s => s.alpha > 0.05);
    this.splashes.forEach(s => {
      this.ctx.strokeStyle = `rgba(200, 230, 255, ${s.alpha})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.ellipse(s.x, s.y, s.radius * 1.5, s.radius * 0.6, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      s.radius += 0.5;
      s.alpha -= 0.06;
    });
  }

  renderSnow() {
    this.ctx.fillStyle = '#ffffff';
    this.particles.forEach(p => {
      p.swayPhase += p.swaySpeed;
      const sway = Math.sin(p.swayPhase) * 1.2;

      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      p.y += p.speed;
      p.x += sway + this.windX * 1.5;

      if (p.y > this.height) {
        p.y = -5;
        p.x = Math.random() * this.width;
      }
      if (p.x > this.width) p.x = 0;
      if (p.x < 0) p.x = this.width;
    });
    this.ctx.globalAlpha = 1;
  }

  renderClouds() {
    this.ctx.fillStyle = '#e8f0fe';
    this.particles.forEach(c => {
      this.ctx.globalAlpha = c.alpha;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      this.ctx.fill();

      c.x += c.speed;
      if (c.x - c.radius > this.width) {
        c.x = -c.radius;
        c.y = Math.random() * (this.height * 0.6);
      }
    });
    this.ctx.globalAlpha = 1;
  }

  renderSunMotes() {
    this.ctx.fillStyle = '#ffd54f';
    this.particles.forEach(m => {
      m.swayPhase += 0.02;
      this.ctx.globalAlpha = m.alpha;
      this.ctx.beginPath();
      this.ctx.arc(m.x + Math.sin(m.swayPhase) * 2, m.y, m.radius, 0, Math.PI * 2);
      this.ctx.fill();

      m.y += m.speedY;
      if (m.y < 0) {
        m.y = this.height;
        m.x = Math.random() * this.width;
      }
    });
    this.ctx.globalAlpha = 1;
  }

  renderLightning() {
    if (this.flashOpacity > 0) {
      this.ctx.fillStyle = `rgba(220, 235, 255, ${this.flashOpacity})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.flashOpacity -= 0.05;
    }

    this.lightningBolts = this.lightningBolts.filter(b => b.life > 0);
    this.lightningBolts.forEach(bolt => {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowColor = '#80d4ff';
      this.ctx.shadowBlur = 15;

      bolt.segments.forEach(seg => {
        this.ctx.beginPath();
        this.ctx.moveTo(seg.sx, seg.sy);
        this.ctx.lineTo(seg.ex, seg.ey);
        this.ctx.stroke();
      });

      this.ctx.shadowBlur = 0;
      bolt.life--;
    });
  }
}

export const weatherVfx = new WeatherVfxEngine();
