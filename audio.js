/**
 * audio.js - 5-Track Procedural Web Audio Weather Mixer & Lo-Fi Generator
 * Synthesizes organic ambient sounds (rain, wind, thunder, calm warmth) AND
 * generative Lo-Fi pentatonic ambient musical chords with 3D spatial panning.
 */

class WeatherAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.volume = 0.35;
    this.currentWeatherType = 'clear';

    // Channel fader volumes (0 to 1)
    this.channels = {
      rain: 0.4,
      wind: 0.3,
      thunder: 0.2,
      warmth: 0.35,
      chords: 0.3
    };

    // Channel Gain Nodes
    this.channelGains = {
      rain: null,
      wind: null,
      thunder: null,
      warmth: null,
      chords: null
    };

    // Spatial Panner Nodes
    this.rainPanner = null;
    this.thunderPanner = null;

    // Generators & timers
    this.activeNodes = [];
    this.thunderTimeout = null;
    this.chordInterval = null;
    this.chordStep = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Initialize 5 channel gains
    Object.keys(this.channels).forEach((ch) => {
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(this.channels[ch], this.ctx.currentTime);
      gainNode.connect(this.masterGain);
      this.channelGains[ch] = gainNode;
    });

    // Create Stereo Panner nodes if supported
    if (this.ctx.createStereoPanner) {
      this.rainPanner = this.ctx.createStereoPanner();
      this.rainPanner.pan.setValueAtTime(-0.2, this.ctx.currentTime);

      this.thunderPanner = this.ctx.createStereoPanner();
      this.thunderPanner.pan.setValueAtTime(0.3, this.ctx.currentTime);
    }
  }

  ensureContextRunning() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setChannelVolume(channel, val) {
    if (this.channels[channel] !== undefined) {
      this.channels[channel] = Math.max(0, Math.min(1, val));
      if (this.channelGains[channel] && this.ctx) {
        this.channelGains[channel].gain.setTargetAtTime(this.channels[channel], this.ctx.currentTime, 0.05);
      }
    }
  }

  setPreset(presetName) {
    const presets = {
      'cozy-rain': { rain: 0.75, wind: 0.2, thunder: 0.0, warmth: 0.4, chords: 0.35 },
      'winter-blizzard': { rain: 0.0, wind: 0.85, thunder: 0.0, warmth: 0.1, chords: 0.2 },
      'tropical-storm': { rain: 0.85, wind: 0.65, thunder: 0.55, warmth: 0.2, chords: 0.15 },
      'midnight-calm': { rain: 0.15, wind: 0.3, thunder: 0.0, warmth: 0.7, chords: 0.45 }
    };

    const preset = presets[presetName];
    if (preset) {
      Object.keys(preset).forEach(ch => {
        this.setChannelVolume(ch, preset[ch]);
        const slider = document.getElementById(`fader-${ch}`);
        if (slider) slider.value = preset[ch];
      });
    }
  }

  togglePlay() {
    this.ensureContextRunning();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(this.currentWeatherType);
      return true;
    }
  }

  setWeather(weatherType) {
    this.currentWeatherType = weatherType;
    if (this.isPlaying) {
      this.stopGenerators();
      this.startGenerators(weatherType);
    }
  }

  start(weatherType = 'clear') {
    this.ensureContextRunning();
    this.isPlaying = true;
    this.currentWeatherType = weatherType;
    this.stopGenerators();
    this.startGenerators(weatherType);
  }

  stop() {
    this.isPlaying = false;
    this.stopGenerators();
  }

  stopGenerators() {
    if (this.thunderTimeout) {
      clearTimeout(this.thunderTimeout);
      this.thunderTimeout = null;
    }
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }

    this.activeNodes.forEach(item => {
      try {
        if (item.stop) item.stop();
        if (item.disconnect) item.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  createNoiseBuffer(seconds = 5) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  startGenerators(type) {
    if (!this.ctx || !this.isPlaying) return;

    this.playRainTrack();
    this.playWindTrack();
    this.playWarmthTrack();
    this.startLoFiChords();

    if (type.includes('thunder') || this.channels.thunder > 0.1) {
      this.scheduleThunder();
    }
  }

  playRainTrack() {
    const noiseBuffer = this.createNoiseBuffer(6);
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1000;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 5500;

    noiseSource.connect(highpass);
    highpass.connect(lowpass);

    if (this.rainPanner) {
      lowpass.connect(this.rainPanner);
      this.rainPanner.connect(this.channelGains.rain);
    } else {
      lowpass.connect(this.channelGains.rain);
    }

    noiseSource.start();
    this.activeNodes.push(noiseSource, highpass, lowpass);
  }

  playWindTrack() {
    const noiseBuffer = this.createNoiseBuffer(8);
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);
    filter.Q.value = 2.2;

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.16;

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 320;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.channelGains.wind);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, filter, lfo, lfoGain);
  }

  playWarmthTrack() {
    const noiseBuffer = this.createNoiseBuffer(10);
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.channelGains.warmth);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter);
  }

  // Generative Lo-Fi Ambient Chords
  startLoFiChords() {
    // Beautiful pentatonic chord frequencies (C minor 9 / E major 7)
    const chordProgressions = [
      [130.81, 155.56, 196.00, 233.08], // C, Eb, G, Bb
      [116.54, 146.83, 174.61, 220.00], // Bb, D, F, A
      [103.83, 130.81, 155.56, 196.00], // Ab, C, Eb, G
      [116.54, 146.83, 174.61, 207.65]  // Bb, D, F, Ab
    ];

    const playChord = () => {
      if (!this.ctx || !this.isPlaying || this.channels.chords < 0.05) return;
      const notes = chordProgressions[this.chordStep % chordProgressions.length];
      this.chordStep++;

      const now = this.ctx.currentTime;
      const duration = 4.2;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        const noteGain = this.ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.07 / notes.length, now + 0.8 + idx * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.channelGains.chords);

        osc.start(now);
        osc.stop(now + duration);
      });
    };

    playChord();
    this.chordInterval = setInterval(playChord, 5000);
  }

  scheduleThunder() {
    if (!this.isPlaying) return;
    const delay = 7000 + Math.random() * 11000;
    this.thunderTimeout = setTimeout(() => {
      if (this.channels.thunder > 0.05) {
        this.triggerThunderClap();
      }
      this.scheduleThunder();
    }, delay);
  }

  triggerThunderClap() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const duration = 3.5;

    // Randomize stereo position
    if (this.thunderPanner) {
      this.thunderPanner.pan.setValueAtTime((Math.random() * 2 - 1) * 0.8, now);
    }

    const noiseBuffer = this.createNoiseBuffer(duration);
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(130, now);
    filter.frequency.exponentialRampToValueAtTime(45, now + duration);

    const strikeGain = this.ctx.createGain();
    strikeGain.gain.setValueAtTime(0.01, now);
    strikeGain.gain.linearRampToValueAtTime(0.65, now + 0.08);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(strikeGain);

    if (this.thunderPanner) {
      strikeGain.connect(this.thunderPanner);
      this.thunderPanner.connect(this.channelGains.thunder);
    } else {
      strikeGain.connect(this.channelGains.thunder);
    }

    noise.start(now);
    noise.stop(now + duration);

    window.dispatchEvent(new CustomEvent('thunder-strike'));
  }
}

export const weatherAudio = new WeatherAudioEngine();
