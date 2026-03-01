// ─────────────────────────────────────────────────────────────────────────────
// VICTORIAN MUSIC ENGINE
// Original atmospheric music — synthesized strings, piano, cello, rain, bells
// Web Audio API only — no external files, no copyrighted material
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useCallback, useEffect } from "react";

// D minor chord progressions — dark Victorian atmosphere
const MAIN_PROGRESSION = [
  { root: 146.83, third: 174.61, fifth: 220.0 },   // Dm
  { root: 116.54, third: 146.83, fifth: 174.61 },  // Bb
  { root: 130.81, third: 164.81, fifth: 196.0 },   // F
  { root: 123.47, third: 155.56, fifth: 185.0 },   // C
];

const TENSION_PROGRESSION = [
  { root: 146.83, third: 174.61, fifth: 207.65 },
  { root: 138.59, third: 164.81, fifth: 196.0 },
  { root: 123.47, third: 146.83, fifth: 174.61 },
  { root: 130.81, third: 155.56, fifth: 185.0 },
];

const RESOLVE_PROGRESSION = [
  { root: 146.83, third: 185.0, fifth: 220.0 },
  { root: 196.0,  third: 246.94, fifth: 293.66 },
  { root: 220.0,  third: 277.18, fifth: 329.63 },
  { root: 146.83, third: 185.0, fifth: 220.0 },
];

export function useSoundManager() {
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const ambienceRef = useRef({ nodes: [], intervals: [] });
  const musicRef = useRef({ timeout: null, active: false, theme: "main" });
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      masterGainRef.current = ctxRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(0.5, ctxRef.current.currentTime);
      masterGainRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  }, []);

  const playStringNote = useCallback((freq, duration, startTime, gainVal, ctx, dest) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc1.type = "sawtooth";
    osc2.type = "sawtooth";
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.003, startTime);
    vibrato.type = "sine";
    vibrato.frequency.setValueAtTime(5.5, startTime);
    vibratoGain.gain.setValueAtTime(0, startTime);
    vibratoGain.gain.linearRampToValueAtTime(freq * 0.008, startTime + 0.3);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibratoGain.connect(osc2.frequency);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.15);
    gain.gain.setValueAtTime(gainVal, startTime + duration - 0.3);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, startTime);
    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gain); gain.connect(dest);
    osc1.start(startTime); osc2.start(startTime); vibrato.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
    vibrato.stop(startTime + duration + 0.1);
  }, []);

  const playPianoNote = useCallback((freq, duration, startTime, gainVal, ctx, dest) => {
    [1, 2, 3, 4].forEach((h, i) => {
      const gains = [1, 0.5, 0.25, 0.12];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * h, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainVal * gains[i], startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(gainVal * gains[i] * 0.3, startTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain); gain.connect(dest);
      osc.start(startTime); osc.stop(startTime + duration + 0.1);
    });
  }, []);

  const playCelloNote = useCallback((freq, duration, startTime, gainVal, ctx, dest) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = "sawtooth"; osc2.type = "triangle";
    osc.frequency.setValueAtTime(freq * 0.5, startTime);
    osc2.frequency.setValueAtTime(freq * 0.502, startTime);
    filter.type = "lowpass"; filter.frequency.setValueAtTime(800, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.2);
    gain.gain.setValueAtTime(gainVal, startTime + duration - 0.4);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(filter); osc2.connect(filter);
    filter.connect(gain); gain.connect(dest);
    osc.start(startTime); osc2.start(startTime);
    osc.stop(startTime + duration + 0.1); osc2.stop(startTime + duration + 0.1);
  }, []);

  const playChord = useCallback((chord, startTime, duration, ctx, dest, theme) => {
    const isTension = theme === "tension";
    playCelloNote(chord.root, duration, startTime, 0.09, ctx, dest);
    playStringNote(chord.third, duration, startTime, isTension ? 0.055 : 0.07, ctx, dest);
    playStringNote(chord.fifth, duration, startTime, isTension ? 0.045 : 0.06, ctx, dest);
    // Piano arpeggio
    [chord.root * 2, chord.third * 2, chord.fifth * 2].forEach((f, i) => {
      playPianoNote(f, 1.5, startTime + 0.5 + i * 0.12, theme === "resolve" ? 0.08 : 0.05, ctx, dest);
    });
  }, [playCelloNote, playStringNote, playPianoNote]);

  const scheduleMusic = useCallback((theme) => {
    if (!musicRef.current.active) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const prog = theme === "tension" ? TENSION_PROGRESSION
      : theme === "resolve" ? RESOLVE_PROGRESSION
      : MAIN_PROGRESSION;
    const beat = theme === "tension" ? 2.0 : 2.8;
    const total = prog.length * beat;
    prog.forEach((chord, i) => {
      playChord(chord, now + i * beat, beat + 0.3, ctx, masterGainRef.current, theme);
    });
    musicRef.current.timeout = setTimeout(() => {
      if (musicRef.current.active) scheduleMusic(musicRef.current.theme);
    }, (total - 0.5) * 1000);
  }, [getCtx, playChord]);

  const startAmbience = useCallback(() => {
    const ctx = getCtx();
    const dest = masterGainRef.current;
    const nodes = [];
    const intervals = [];

    // Rain
    const bufSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = buf; rainSrc.loop = true;
    const rainF = ctx.createBiquadFilter();
    rainF.type = "bandpass"; rainF.frequency.setValueAtTime(1200, ctx.currentTime); rainF.Q.setValueAtTime(0.8, ctx.currentTime);
    const rainF2 = ctx.createBiquadFilter();
    rainF2.type = "highpass"; rainF2.frequency.setValueAtTime(400, ctx.currentTime);
    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0, ctx.currentTime);
    rainGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 4);
    rainSrc.connect(rainF); rainF.connect(rainF2); rainF2.connect(rainGain); rainGain.connect(dest);
    rainSrc.start();
    nodes.push({ type: "source", node: rainSrc }, { type: "gain", node: rainGain });

    // Wind drones
    [55, 82.4, 110].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(freq, ctx.currentTime);
      lfo.type = "sine"; lfo.frequency.setValueAtTime(0.15 + i * 0.05, ctx.currentTime);
      lfoG.gain.setValueAtTime(freq * 0.02, ctx.currentTime);
      lfo.connect(lfoG); lfoG.connect(osc.frequency);
      filt.type = "lowpass"; filt.frequency.setValueAtTime(200, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04 - i * 0.01, ctx.currentTime + 6);
      osc.connect(filt); filt.connect(gain); gain.connect(dest);
      osc.start(); lfo.start();
      nodes.push({ type: "source", node: osc }, { type: "source", node: lfo }, { type: "gain", node: gain });
    });

    // Westminster bells
    const bellNotes = [392.0, 349.23, 329.63, 261.63];
    const ringBell = () => {
      if (!musicRef.current.active) return;
      const t = ctx.currentTime;
      bellNotes.forEach((freq, i) => {
        const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator();
        const g = ctx.createGain();
        o1.type = "sine"; o2.type = "sine";
        o1.frequency.setValueAtTime(freq, t + i * 0.6);
        o2.frequency.setValueAtTime(freq * 2.756, t + i * 0.6);
        g.gain.setValueAtTime(0, t + i * 0.6);
        g.gain.linearRampToValueAtTime(0.08, t + i * 0.6 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.6 + 5);
        o1.connect(g); o2.connect(g); g.connect(dest);
        o1.start(t + i * 0.6); o2.start(t + i * 0.6);
        o1.stop(t + i * 0.6 + 6); o2.stop(t + i * 0.6 + 6);
      });
    };
    setTimeout(ringBell, 3000);
    intervals.push(setInterval(ringBell, 32000 + Math.random() * 15000));
    ambienceRef.current = { nodes, intervals };
  }, [getCtx]);

  const stopAmbience = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ambienceRef.current.intervals.forEach(clearInterval);
    ambienceRef.current.nodes.forEach(({ type, node }) => {
      try {
        if (type === "gain") node.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        else node.stop(ctx.currentTime + 2);
      } catch (e) {}
    });
    ambienceRef.current = { nodes: [], intervals: [] };
  }, []);

  const toggle = useCallback(() => {
    if (enabled) {
      musicRef.current.active = false;
      if (musicRef.current.timeout) clearTimeout(musicRef.current.timeout);
      stopAmbience();
      setEnabled(false);
    } else {
      getCtx().resume().then(() => {
        musicRef.current.active = true;
        startAmbience();
        setTimeout(() => scheduleMusic(musicRef.current.theme), 2000);
        setEnabled(true);
      });
    }
  }, [enabled, getCtx, startAmbience, stopAmbience, scheduleMusic]);

  const setTheme = useCallback((theme) => {
    if (musicRef.current.theme === theme) return;
    musicRef.current.theme = theme;
    if (musicRef.current.timeout) clearTimeout(musicRef.current.timeout);
    if (musicRef.current.active) setTimeout(() => scheduleMusic(theme), 400);
  }, [scheduleMusic]);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(v, ctxRef.current.currentTime + 0.2);
    }
  }, []);

  const playClick = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain); gain.connect(masterGainRef.current);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  }, [getCtx]);

  const playReveal = useCallback(() => {
    const ctx = getCtx();
    [261.63, 329.63, 392.0, 523.25].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.6);
      osc.connect(gain); gain.connect(masterGainRef.current);
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.8);
    });
  }, [getCtx]);

  const playWin = useCallback(() => {
    const ctx = getCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      playStringNote(freq, 1.2, ctx.currentTime + i * 0.22, 0.2, ctx, masterGainRef.current);
      playPianoNote(freq * 2, 1.0, ctx.currentTime + i * 0.22, 0.15, ctx, masterGainRef.current);
    });
  }, [getCtx, playStringNote, playPianoNote]);

  const playLose = useCallback(() => {
    const ctx = getCtx();
    [392.0, 349.23, 311.13, 261.63].forEach((freq, i) => {
      playCelloNote(freq, 1.5, ctx.currentTime + i * 0.35, 0.18, ctx, masterGainRef.current);
    });
  }, [getCtx, playCelloNote]);

  useEffect(() => {
    return () => {
      if (musicRef.current.timeout) clearTimeout(musicRef.current.timeout);
      ambienceRef.current.intervals.forEach(clearInterval);
    };
  }, []);

  return { enabled, toggle, volume, setVolume, setTheme, playClick, playReveal, playWin, playLose };
}
