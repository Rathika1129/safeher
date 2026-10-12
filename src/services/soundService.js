// Web Audio API sound synthesizer for SafeHer
// Provides realistic siren, countdown beeps, and safe check-in chimes without external audio assets

class SoundService {
  constructor() {
    this.audioCtx = null;
    this.sirenOscillator1 = null;
    this.sirenOscillator2 = null;
    this.sirenGain = null;
    this.sirenInterval = null;
    this.isSirenPlaying = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play countdown tick/beep
  playBeep(frequency = 600, duration = 0.15) {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio beep error:', e);
    }
  }

  // Play gentle success chime when marking safe
  playSafeChime() {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.5);
        }, idx * 90);
      });
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  // Start SOS emergency siren
  startEmergencySiren() {
    if (this.isSirenPlaying) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      this.isSirenPlaying = true;
      let high = false;

      const cycle = () => {
        if (!this.isSirenPlaying) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        const targetFreq = high ? 950 : 650;
        osc.frequency.setValueAtTime(high ? 650 : 950, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(targetFreq, this.audioCtx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);

        high = !high;
      };

      cycle();
      this.sirenInterval = setInterval(cycle, 380);
    } catch (e) {
      console.warn('Siren start error:', e);
    }
  }

  // Stop emergency siren
  stopEmergencySiren() {
    this.isSirenPlaying = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }
}

export const soundService = new SoundService();
