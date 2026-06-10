/* ============================================================
   YOUR MELODY JACKPOT — sound effects
   Everything synthesized with the Web Audio API. No files.
   ============================================================ */

const Sound = (() => {
  let ctx = null;
  let muted = false;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function env(gainNode, t0, peak, attack, decay) {
    const g = gainNode.gain;
    g.setValueAtTime(0.0001, t0);
    g.exponentialRampToValueAtTime(peak, t0 + attack);
    g.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
  }

  function tone(freq, type, peak, attack, decay, when = 0, detune = 0) {
    const c = ac(); if (!c || muted) return;
    const t0 = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (detune) o.detune.setValueAtTime(detune, t0);
    env(g, t0, peak, attack, decay);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + attack + decay + 0.05);
  }

  function noise(peak, decay, when = 0, freq = 1200, q = 1) {
    const c = ac(); if (!c || muted) return;
    const t0 = c.currentTime + when;
    const len = Math.ceil(c.sampleRate * (decay + 0.05));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    env(g, t0, peak, 0.004, decay);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
    src.stop(t0 + decay + 0.06);
  }

  return {
    unlock() { ac(); },
    setMuted(m) { muted = m; },
    isMuted() { return muted; },

    /* lever pull: mechanical clunk */
    pull() {
      noise(0.5, 0.09, 0, 420, 0.8);
      tone(95, "triangle", 0.5, 0.005, 0.16);
      tone(60, "sine", 0.45, 0.005, 0.22, 0.02);
    },

    /* reel tick while spinning */
    tick() { noise(0.12, 0.025, 0, 2400, 2.5); },

    /* a reel stops */
    clack() {
      noise(0.35, 0.05, 0, 900, 1.2);
      tone(180, "square", 0.16, 0.004, 0.07);
    },

    /* lock-in / confirm ding */
    ding() {
      tone(1318.5, "sine", 0.32, 0.005, 0.5);
      tone(2637, "sine", 0.1, 0.005, 0.35);
    },

    /* per-second countdown tap */
    tap() { tone(660, "square", 0.1, 0.004, 0.06); },

    /* urgent countdown tap */
    tapHot() { tone(880, "square", 0.13, 0.004, 0.06); },

    /* win: bell arpeggio + coin clinks */
    jackpot() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, i) => {
        tone(n, "triangle", 0.32, 0.006, 0.55, i * 0.09);
        tone(n * 2, "sine", 0.1, 0.006, 0.4, i * 0.09);
      });
      for (let i = 0; i < 9; i++) {
        const d = 0.35 + Math.random() * 0.9;
        tone(2200 + Math.random() * 1800, "sine", 0.07, 0.003, 0.12, d);
        noise(0.06, 0.03, d, 5200, 4);
      }
    },

    /* lose: descending womp */
    nodice() {
      const c = ac(); if (!c || muted) return;
      const t0 = c.currentTime;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(220, t0);
      o.frequency.exponentialRampToValueAtTime(82, t0 + 0.7);
      const f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(900, t0);
      f.frequency.exponentialRampToValueAtTime(220, t0 + 0.7);
      env(g, t0, 0.3, 0.02, 0.75);
      o.connect(f).connect(g).connect(c.destination);
      o.start(t0);
      o.stop(t0 + 0.85);
    },

    /* soft UI click */
    click() { noise(0.14, 0.03, 0, 1500, 1.5); }
  };
})();
