// Advanced Web Audio API Synthesizer with Procedural Chiptune/Cyberpunk BGM & SFX
class SoundManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playCoin() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(1046.50, now); // C6
    osc2.frequency.setValueAtTime(1567.98, now + 0.07); // G6
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(now); osc1.stop(now + 0.07);
    osc2.start(now + 0.07); osc2.stop(now + 0.28);
  }

  playHit() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.22);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playShoot() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playPowerup() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const freqs = [330, 440, 550, 660, 880];
    freqs.forEach((f, i) => {
      const now = this.ctx.currentTime + i * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    });
  }

  playLevelUp() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    });
  }

  playVictory() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const melody = [
      { f: 440, d: 0.14 },
      { f: 554, d: 0.14 },
      { f: 659, d: 0.18 },
      { f: 880, d: 0.35 }
    ];
    let time = this.ctx.currentTime;
    melody.forEach(m => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(m.f, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + m.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + m.d);
      time += m.d * 0.85;
    });
  }

  playClick() {
    if (!this.soundEnabled) return;
    this.init(); this.resume(); if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Cyberpunk Ambient Background Pulse
  startAmbientMusic() {
    if (!this.musicEnabled || this.bgmTimer) return;
    this.init(); this.resume();
    const bassNotes = [110, 110, 130.81, 98]; // A2, C3, G2
    this.bgmTimer = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const note = bassNotes[this.bgmStep % bassNotes.length];
      this.bgmStep++;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }, 450);
  }

  stopAmbientMusic() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setSoundEnabled(val) {
    this.soundEnabled = val;
  }

  setMusicEnabled(val) {
    this.musicEnabled = val;
    if (val) this.startAmbientMusic();
    else this.stopAmbientMusic();
  }
}

export const soundManager = new SoundManager();
