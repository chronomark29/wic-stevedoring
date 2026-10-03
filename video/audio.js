/* ==========================================================================
   audio.js — musik + SFX orisinal untuk video Reels WIC, disintesis dari nol.

   Cara pakai (dari folder video/, SETELAH render.js menulis build/cues.json):
       node audio.js

   Hasil:
     build/music.wav   musik (electro-house 120 BPM, F minor), sudah di-duck
                       di bawah impact
     build/sfx.wav     semua SFX, presisi frame mengikuti build/cues.json

   Tidak memakai sampel atau library apa pun: setiap kick, clap, hi-hat,
   bass, chord, whoosh dan impact dibangkitkan dengan matematika di file
   ini. Hasilnya 100% orisinal, jadi aman dari klaim hak cipta / audio
   dibisukan di Instagram.

   Struktur musik mengikuti scene (detik):
     0–2.75  intro tegang (drum teredam + pad), snare roll + riser
     2.75–3  hening sebelum drop
     3–11    DROP: kick four-on-the-floor, clap, bass offbeat, stab, lead
     11–15   groove + arpeggio (scene layanan)
     15–19   drop lagi (scene angka)
     19–23   breakdown "tech" (scene website), build di akhir
     23–25   half-time stomp (motto)
     25–27   drop terakhir
     27–29   pukulan akhir + ekor, menyambung ke awal video (loop)
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const BUILD = path.join(__dirname, 'build');
const SR = 48000;
const cueData = JSON.parse(fs.readFileSync(path.join(BUILD, 'cues.json'), 'utf8'));
const DUR = cueData.duration;
const N = Math.ceil(DUR * SR);
const TAU = Math.PI * 2;
const BEAT = 60 / cueData.bpm;          // 0.5 s
const S16 = BEAT / 4;                   // seperenambelas

/* ---------------------------------------------------------------- utilitas */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const R = rng(20260929);
const noise = () => R() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

class Bus {
  constructor() { this.L = new Float32Array(N); this.R = new Float32Array(N); }
  /* Tambahkan sinyal mono/stereo mulai detik t0. pan: -1 (kiri) … 1 (kanan). */
  add(t0, sig, gain = 1, pan = 0) {
    const s0 = Math.round(t0 * SR);
    const gl = gain * Math.cos((pan + 1) * Math.PI / 4) * Math.SQRT2;
    const gr = gain * Math.sin((pan + 1) * Math.PI / 4) * Math.SQRT2;
    const L = sig.L || sig, Rr = sig.R || sig;
    for (let i = 0; i < L.length; i++) {
      const j = s0 + i;
      if (j < 0) continue;
      if (j >= N) break;
      this.L[j] += L[i] * gl;
      this.R[j] += Rr[i] * gr;
    }
  }
}

class Biquad {
  constructor(type, f, q = 0.707) { this.type = type; this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set(f, q); }
  set(f, q = this.q) {
    this.q = q;
    const w = TAU * clamp(f, 10, SR * 0.45) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
    let b0, b1, b2;
    if (this.type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (this.type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; }
    const a0 = 1 + a;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = -2 * c / a0; this.a2 = (1 - a) / a0;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
}
/* Osilator saw anti-aliasing */
function Saw(f, phase = R()) {
  let p = phase;
  return function (freq = f) {
    const dt = freq / SR;
    const v = 2 * p - 1 - polyblep(p, dt);
    p += dt; if (p >= 1) p -= 1;
    return v;
  };
}
const len = (sec) => new Float32Array(Math.ceil(sec * SR));

/* Freeverb (Jezar) — reverb untuk bus kirim */
function freeverb(bus, { room = 0.84, damp = 0.25, width = 1 } = {}) {
  const k = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((v) => Math.round(v * k));
  const apT = [556, 441, 341, 225].map((v) => Math.round(v * k));
  const spread = Math.round(23 * k);
  function chan(input, off) {
    const combs = combT.map((n) => ({ b: new Float32Array(n + off), i: 0, fs: 0 }));
    const aps = apT.map((n) => ({ b: new Float32Array(n + off), i: 0 }));
    const out = new Float32Array(N);
    for (let s = 0; s < N; s++) {
      const x = input[s] * 0.015;
      let y = 0;
      for (const c of combs) {
        const o = c.b[c.i];
        c.fs = o * (1 - damp) + c.fs * damp;
        c.b[c.i] = x + c.fs * room;
        if (++c.i >= c.b.length) c.i = 0;
        y += o;
      }
      for (const a of aps) {
        const bo = a.b[a.i];
        a.b[a.i] = y + bo * 0.5;
        if (++a.i >= a.b.length) a.i = 0;
        y = bo - y;
      }
      out[s] = y;
    }
    return out;
  }
  const mono = new Float32Array(N);
  for (let s = 0; s < N; s++) mono[s] = (bus.L[s] + bus.R[s]) * 0.5;
  const l = chan(mono, 0), r = chan(mono, spread);
  const o = new Bus();
  const w1 = (width / 2 + 0.5), w2 = (1 - width) / 2;
  for (let s = 0; s < N; s++) { o.L[s] = l[s] * w1 + r[s] * w2; o.R[s] = r[s] * w1 + l[s] * w2; }
  return o;
}

/* Delay ping-pong (untuk lead) */
function pingpong(bus, time, fb, mixGain) {
  const d = Math.round(time * SR);
  const o = new Bus();
  const bl = new Float32Array(d), br = new Float32Array(d);
  const lp = new Biquad('lp', 4500), lp2 = new Biquad('lp', 4500);
  let i = 0;
  for (let s = 0; s < N; s++) {
    const inL = (bus.L[s] + bus.R[s]) * 0.5;
    const yl = bl[i], yr = br[i];
    bl[i] = lp.run(inL + yr * fb);
    br[i] = lp2.run(yl * fb);
    if (++i >= d) i = 0;
    o.L[s] = yl * mixGain; o.R[s] = yr * mixGain;
  }
  return o;
}

/* ---------------------------------------------------------------- instrumen */
function kick(vel = 1, dec = 6.5) {
  const out = len(0.6);
  let ph = 0;
  const hp = new Biquad('hp', 900);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const f = 46 + 150 * Math.exp(-t * 26) + 380 * Math.exp(-t * 200);
    ph += TAU * f / SR;
    const atk = t < 0.0015 ? t / 0.0015 : 1;
    const body = Math.sin(ph) * Math.exp(-t * dec) * atk;
    const click = hp.run(noise()) * Math.exp(-t * 380) * 0.75 + Math.sin(TAU * 2600 * t) * Math.exp(-t * 260) * 0.18;
    out[i] = Math.tanh(1.7 * (body + click)) * vel;
  }
  return out;
}
function clap(vel = 1) {
  const out = len(0.45);
  const bp = new Biquad('bp', 1150, 0.9), hp = new Biquad('hp', 600);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    let e = 0;
    for (let k = 0; k < 3; k++) { const tk = t - k * 0.0105; if (tk >= 0) e += Math.exp(-tk * 190); }
    if (t > 0.021) e += 0.75 * Math.exp(-(t - 0.021) * 15);
    out[i] = hp.run(bp.run(noise())) * e * 1.9 * vel;
  }
  return out;
}
function snare(vel = 1) {
  const out = len(0.3);
  const bp = new Biquad('bp', 2100, 0.7);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    ph += TAU * (180 + 60 * Math.exp(-t * 40)) / SR;
    out[i] = (bp.run(noise()) * 1.6 * Math.exp(-t * 20) + Math.sin(ph) * 0.55 * Math.exp(-t * 32)) * vel;
  }
  return out;
}
const HATF = [205.3, 304.4, 369.6, 522.7, 540, 800];
function metal(t, mul) {
  let v = 0;
  for (const f of HATF) v += ((t * f * mul) % 1) < 0.5 ? 1 : -1;
  return v / 6;
}
function hat(vel = 1, open = false) {
  const out = len(open ? 0.45 : 0.08);
  const hp = new Biquad('hp', 7200, 0.8), hp2 = new Biquad('hp', 6000);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const s = metal(t, 1.0) * 0.7 + noise() * 0.5;
    out[i] = hp2.run(hp.run(s)) * Math.exp(-t * (open ? 9 : 55)) * vel;
  }
  return out;
}
function crash(vel = 1, dec = 1.5) {
  const n = Math.ceil(2.8 * SR);
  const L = new Float32Array(n), Rr = new Float32Array(n);
  const hl = new Biquad('hp', 3200), hr = new Biquad('hp', 3200);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = Math.exp(-t * dec) * (t < 0.003 ? t / 0.003 : 1) * vel;
    const m = metal(t, 2.37) * 0.5;
    L[i] = hl.run(noise() * 0.8 + m) * e;
    Rr[i] = hr.run(noise() * 0.8 + m) * e;
  }
  return { L, R: Rr };
}
function bassPluck(note, vel = 1, dur = 0.24) {
  const out = len(dur + 0.05);
  const f = mtof(note);
  const saw = Saw(f, 0), lp = new Biquad('lp', 800, 1.1);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    lp.set(140 + 2300 * Math.exp(-t * 26), 1.1);
    ph += TAU * f / SR;
    const env = (t < 0.002 ? t / 0.002 : 1) * Math.exp(-t * 7) * (t > dur ? Math.exp(-(t - dur) * 120) : 1);
    out[i] = Math.tanh(1.5 * (lp.run(saw()) * 0.8 + Math.sin(ph) * 0.65)) * env * vel;
  }
  return out;
}
function sub808(note, vel = 1, dur = 1.0) {
  const out = len(dur);
  const f0 = mtof(note);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    ph += TAU * f0 * (1 + 1.4 * Math.exp(-t * 45)) / SR;
    const env = (t < 0.003 ? t / 0.003 : 1) * Math.exp(-t * 2.2) * (t > dur - 0.05 ? (dur - t) / 0.05 : 1);
    out[i] = Math.tanh(2.2 * Math.sin(ph)) * 0.75 * env * vel;
  }
  return out;
}
const DETUNE = [-26, -16, -7, 0, 7, 16, 26];
/* Supersaw stereo (stab atau pad). env(t) → amplitudo, cut(t) → cutoff LPF. */
function supersaw(notes, dur, env, cut, q = 0.8) {
  const n = Math.ceil(dur * SR);
  const L = new Float32Array(n), Rr = new Float32Array(n);
  const oscs = [];
  notes.forEach((m) => DETUNE.forEach((c, k) => {
    oscs.push({ o: Saw(mtof(m) * Math.pow(2, c / 1200)), f: mtof(m) * Math.pow(2, c / 1200), pan: (k / (DETUNE.length - 1)) * 2 - 1 });
  }));
  const lpl = new Biquad('lp', 2000, q), lpr = new Biquad('lp', 2000, q);
  const g = 1 / Math.sqrt(oscs.length);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (i % 32 === 0) { const c = cut(t); lpl.set(c, q); lpr.set(c, q); }
    let l = 0, r = 0;
    for (const o of oscs) { const v = o.o(o.f); l += v * (1 - o.pan) * 0.5; r += v * (1 + o.pan) * 0.5; }
    const e = env(t) * g;
    L[i] = lpl.run(l) * e; Rr[i] = lpr.run(r) * e;
  }
  return { L, R: Rr };
}
function pluck(note, vel = 1, dur = 0.3, bright = 1) {
  const out = len(dur);
  const f = mtof(note);
  const s1 = Saw(f), s2 = Saw(f * 1.004), lp = new Biquad('lp', 3000, 1.4);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    if (i % 16 === 0) lp.set((500 + 5200 * bright * Math.exp(-t * 24)), 1.4);
    const env = (t < 0.002 ? t / 0.002 : 1) * Math.exp(-t * 11) * (t > dur - 0.02 ? (dur - t) / 0.02 : 1);
    out[i] = lp.run(s1() * 0.6 + s2() * 0.6) * env * vel;
  }
  return out;
}
/* Noise yang disapu filter: dasar whoosh, riser, sweep */
function sweepNoise(dur, fFrom, fTo, envFn, q = 1.2, curve = 'exp') {
  const out = len(dur);
  const bp = new Biquad('bp', fFrom, q);
  for (let i = 0; i < out.length; i++) {
    const t = i / SR, p = t / dur;
    if (i % 32 === 0) bp.set(curve === 'exp' ? fFrom * Math.pow(fTo / fFrom, p) : fFrom + (fTo - fFrom) * p, q);
    out[i] = bp.run(noise()) * envFn(p, t);
  }
  return out;
}

/* ---------------------------------------------------------------- MUSIK */
const music = new Bus(), mSend = new Bus(), mDelay = new Bus();

// F minor: Fm – Db – Ab – Eb (satu chord per bar, bar mulai di drop 3,0 s)
const PROG = [
  { root: 41, chord: [65, 68, 72], bass: 41 },    // Fm
  { root: 37, chord: [61, 65, 68], bass: 37 },    // Db
  { root: 44, chord: [63, 68, 72], bass: 44 },    // Ab
  { root: 39, chord: [63, 67, 70], bass: 39 }     // Eb
];
const chordAt = (t) => PROG[((Math.floor((t - 3) / 2) % 4) + 4) % 4];
// Hook melodi lead (per 2 bar, grid 8th): angka = MIDI, null = diam
const LEAD = [
  72, null, 68, 72, null, 75, 72, 70,
  72, null, 68, 72, null, 77, 75, 72
];
const ARP = [0, 1, 2, 1, 2, 0, 1, 2, 0, 2, 1, 2, 0, 1, 2, 1];

function section(t) {
  if (t < 2.75) return 'intro';
  if (t < 3) return 'gap';
  if (t < 11) return 'A';
  if (t < 15) return 'B';
  if (t < 19) return 'C';
  if (t < 22.75) return 'D';
  if (t < 23) return 'gap';
  if (t < 25) return 'E';
  if (t < 27) return 'F';
  return 'outro';
}

// --- Intro: drum teredam + pad + roll
(function intro() {
  const lp = new Biquad('lp', 260, 0.9);
  const tmp = new Bus();
  for (let b = 0; b < 6; b++) tmp.add(b * BEAT, kick(0.9), 0.75);
  for (let s = 0; s < 22; s++) tmp.add(s * S16, hat(0.25 + (s % 2) * 0.12));
  for (let i = 0; i < N; i++) { tmp.L[i] = lp.run(tmp.L[i]); }
  tmp.R.set(tmp.L);
  music.add(0, tmp, 0.8);
  // pad Fm gelap, naik pelan
  const pad = supersaw([53, 56, 60, 65], 2.75,
    (t) => Math.min(1, t / 1.2) * (t > 2.68 ? (2.75 - t) / 0.07 : 1),
    (t) => 300 + 900 * (t / 2.75));
  music.add(0, pad, 0.7);
  mSend.add(0, pad, 0.3);
  // snare roll 2.0–2.75 makin rapat
  let t = 2.0, step = S16;
  while (t < 2.74) {
    const v = 0.25 + 0.75 * ((t - 2.0) / 0.75);
    music.add(t, snare(v), 0.55);
    mSend.add(t, snare(v), 0.2);
    if (t > 2.375) step = S16 / 2;
    t += step;
  }
  // sub drone
  music.add(0, sub808(29, 0.5, 2.7), 0.4);
})();

// --- Drum & bass untuk bagian groove
function drums(t0, t1, opt) {
  for (let s = Math.round(t0 / S16); s * S16 < t1 - 1e-6; s++) {
    const t = s * S16;
    const pos = s % 16;           // posisi dalam bar (relatif grid global)
    const beatIdx = s % 4;
    const half = opt.half;
    if (beatIdx === 0 && (!half || pos === 0 || pos === 8)) music.add(t, kick(1.0), 0.68);
    if (opt.clap && (pos === 4 || pos === 12)) { music.add(t, clap(0.9), 0.95); mSend.add(t, clap(0.9), 0.4); }
    if (opt.hats) {
      const acc = beatIdx === 2 ? 0.55 : beatIdx === 0 ? 0.25 : 0.35;
      music.add(t, hat(acc * opt.hats), 0.8, 0.25);
    }
    if (opt.open && beatIdx === 2) music.add(t, hat(0.42, true), 0.7, -0.2);
    if (opt.bass && beatIdx === 2) {
      const c = chordAt(t);
      music.add(t, bassPluck(c.bass + 12, 1.0, 0.2), 0.5);
    }
    if (opt.stabs && (pos === 0 || pos === 6 || pos === 10)) {
      const c = chordAt(t);
      const st = supersaw(c.chord.map((m) => m), 0.32,
        (x) => (x < 0.003 ? x / 0.003 : 1) * Math.exp(-x * 11),
        (x) => 900 + 5200 * Math.exp(-x * 14));
      music.add(t, st, 0.62);
      mSend.add(t, st, 0.26);
    }
    if (opt.arp) {
      const c = chordAt(t);
      const note = c.chord[ARP[pos]] + 12;
      const pl = pluck(note, 0.5 + (pos % 4 === 0 ? 0.2 : 0), 0.22, opt.arpBright || 1);
      music.add(t, pl, 0.46, pos % 2 ? 0.35 : -0.35);
      mSend.add(t, pl, 0.15);
    }
    if (opt.lead && pos % 2 === 0) {
      const bar2 = Math.floor((t - 3) / 2) % 2;
      const n = LEAD[(bar2 * 8) + pos / 2];
      if (n) {
        const pl = pluck(n, 0.85, 0.34, 1.2);
        music.add(t, pl, 0.55);
        mDelay.add(t, pl, 0.5);
        mSend.add(t, pl, 0.12);
      }
    }
  }
}
// Pad panjang dengan sidechain mengikuti kick
function pads(t0, t1, gain, cutoff) {
  for (let t = t0; t < t1 - 1e-6; t += 2) {
    const c = chordAt(t);
    const d = Math.min(2, t1 - t);
    const p = supersaw(c.chord.map((m) => m - 12).concat([c.chord[0]]), d + 0.25,
      (x) => Math.min(1, x / 0.06) * (x > d ? Math.max(0, 1 - (x - d) / 0.25) : 1),
      () => cutoff, 0.7);
    music.add(t, p, gain);
    mSend.add(t, p, gain * 0.5);
  }
}
function build(t0, t1) {
  // snare roll + riser musikal
  let t = t0, step = S16;
  while (t < t1 - 1e-6) {
    const p = (t - t0) / (t1 - t0);
    music.add(t, snare(0.2 + 0.8 * p), 0.5);
    mSend.add(t, snare(0.2 + 0.8 * p), 0.18);
    if (p > 0.5) step = S16 / 2;
    t += step;
  }
  const d = t1 - t0;
  const rs = sweepNoise(d, 400, 7000, (p) => p * p, 1.0);
  music.add(t0, rs, 0.35);
}

drums(3, 11, { clap: true, hats: 1, open: true, bass: true, stabs: true, lead: false });
drums(5, 11, { lead: true });
pads(3, 11, 0.2, 1800);
build(9, 10);
music.add(3, crash(0.9), 0.55); mSend.add(3, crash(0.9), 0.2);
music.add(3, sub808(29, 1, 1.2), 0.5);
music.add(10, crash(0.7), 0.45);

drums(11, 15, { clap: true, hats: 0.8, bass: true, arp: true });
pads(11, 15, 0.17, 2200);
music.add(11, crash(0.6), 0.35);

drums(15, 19, { clap: true, hats: 1, open: true, bass: true, stabs: true, lead: true });
pads(15, 19, 0.2, 2000);
music.add(15, crash(0.9), 0.5); mSend.add(15, crash(0.9), 0.2);

drums(19, 22.75, { half: true, hats: 0.6, arp: true, arpBright: 0.55 });
pads(19, 22.75, 0.24, 1300);
build(22, 22.75);

// Motto: stomp half-time (SFX stomp menimpa) + 808 + pad besar
[23.0, 23.5, 24.0].forEach((t, i) => {
  const c = chordAt(t);
  music.add(t, sub808(c.root - 12 + (i === 2 ? 2 : 0), 1, 0.5), 0.55);
  music.add(t, kick(1.0, 5), 0.65);
});
pads(23, 25, 0.22, 2600);
music.add(23, crash(1), 0.55); mSend.add(23, crash(1), 0.25);
music.add(24.5, kick(0.9), 0.8);
for (let t = 24.5; t < 24.99; t += S16 / 2) music.add(t, snare(0.3 + (t - 24.5)), 0.45);

drums(25, 27, { clap: true, hats: 1, open: true, bass: true, stabs: true, lead: true });
pads(25, 27, 0.21, 2400);
music.add(25, crash(1), 0.55); mSend.add(25, crash(1), 0.25);

// Pukulan akhir 27,0 + ekor
(function outro() {
  const c = PROG[0];
  const st = supersaw(c.chord.concat([c.chord[0] + 12]), 2.0,
    (x) => (x < 0.004 ? x / 0.004 : 1) * Math.exp(-x * 1.6),
    (x) => 600 + 6000 * Math.exp(-x * 2.2));
  music.add(27, st, 0.55); mSend.add(27, st, 0.45);
  music.add(27, kick(1.1, 4), 0.7);
  music.add(27, sub808(29, 1, 1.9), 0.55);
  music.add(27, crash(1, 1.1), 0.6); mSend.add(27, crash(1), 0.3);
  const pad = supersaw([53, 56, 60, 65], 2.0,
    (x) => Math.min(1, x / 0.3) * Math.exp(-x * 1.2),
    (x) => 1400 * Math.exp(-x * 1.4) + 200, 0.7);
  music.add(27, pad, 0.25); mSend.add(27, pad, 0.3);
})();

/* ---------------------------------------------------------------- SFX */
const sfx = new Bus(), sSend = new Bus();

const SFX = {
  boom(c) {
    const o = len(2.0);
    let ph = 0; const lp = new Biquad('lp', 1800);
    for (let i = 0; i < o.length; i++) {
      const t = i / SR;
      ph += TAU * (30 + 70 * Math.exp(-t * 6)) / SR;
      o[i] = Math.tanh(2.4 * Math.sin(ph) * Math.exp(-t * 2.2)) * 0.9 + lp.run(noise()) * Math.exp(-t * 18) * 0.7;
    }
    sfx.add(c.t, o, 0.95 * c.amp); sSend.add(c.t, o, 0.3);
    sfx.add(c.t, crash(0.6, 2.2), 0.3);
  },
  impact(c) {
    const o = len(1.2);
    let ph = 0; const lp = new Biquad('lp', 3000);
    const soft = c.soft ? 0.6 : 1;
    for (let i = 0; i < o.length; i++) {
      const t = i / SR;
      ph += TAU * (42 + 110 * Math.exp(-t * 18)) / SR;
      o[i] = Math.tanh(2 * Math.sin(ph) * Math.exp(-t * 4)) * 0.85 + lp.run(noise()) * Math.exp(-t * 30) * 0.8 * soft;
    }
    sfx.add(c.t, o, 0.75 * c.amp); sSend.add(c.t, o, 0.35 * c.amp);
  },
  drop(c) {
    SFX.impact({ t: c.t, amp: 1.0 });
    const o = len(2.4);
    let ph = 0;
    for (let i = 0; i < o.length; i++) {
      const t = i / SR;
      ph += TAU * (60 * Math.exp(-t * 1.2) + 22) / SR;
      o[i] = Math.tanh(1.8 * Math.sin(ph)) * Math.exp(-t * 1.6);
    }
    sfx.add(c.t, o, 0.7);
    // whoosh turun (downlifter)
    sfx.add(c.t, sweepNoise(1.2, 5000, 300, (p) => (1 - p) * (1 - p), 0.9), 0.45, 0.2);
    sSend.add(c.t, crash(0.8), 0.25);
  },
  stamp(c) {
    SFX.impact({ t: c.t, amp: c.amp });
    const o = len(0.12);
    const bp = new Biquad('bp', 2600, 0.8);
    for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = bp.run(noise()) * Math.exp(-t * 60) * 1.4; }
    sfx.add(c.t, o, 0.5);
  },
  stomp(c) {
    sfx.add(c.t, kick(1.0, 4.5), 0.75);
    sfx.add(c.t + 0.005, clap(1.0), 0.6); sSend.add(c.t, clap(1.0), 0.5);
    SFX.impact({ t: c.t, amp: 0.55 + 0.15 * (c.n || 0), soft: 1 });
  },
  hit(c) {
    const o = len(0.4);
    let ph = 0; const bp = new Biquad('bp', 1800, 0.8);
    for (let i = 0; i < o.length; i++) {
      const t = i / SR;
      ph += TAU * (95 + 160 * Math.exp(-t * 35)) / SR;
      o[i] = Math.sin(ph) * Math.exp(-t * 12) * 0.8 + bp.run(noise()) * Math.exp(-t * 40) * 0.9;
    }
    sfx.add(c.t, o, 0.55 * (c.amp || 0.6) / 0.6); sSend.add(c.t, o, 0.2);
  },
  tick(c) {
    const o = len(0.05);
    const f = 2200 + 900 * (c.amp || 0.6);
    for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = Math.sin(TAU * f * t) * Math.exp(-t * 140) + noise() * Math.exp(-t * 900) * 0.4; }
    sfx.add(c.t, o, 0.26 * (0.6 + (c.amp || 0.6) * 0.5));
  },
  roll(c) {
    // Tick tiap kali kolom angka terakhir melewati satu digit (power3.out, 24 digit)
    const target = 24, d = c.dur;
    let last = 0;
    for (let k = 0; k <= 400; k++) {
      const p = k / 400, idx = (1 - Math.pow(1 - p, 3)) * target;
      if (Math.floor(idx) > last) {
        last = Math.floor(idx);
        const tt = c.t + p * d;
        const o = len(0.03);
        const f = 3200 + R() * 600;
        for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = Math.sin(TAU * f * t) * Math.exp(-t * 260) * 0.8 + noise() * Math.exp(-t * 1200) * 0.5; }
        sfx.add(tt, o, 0.18, (R() - 0.5) * 0.4);
      }
    }
  },
  count(c) {
    // Tick tiap angka naik (innerText snap, expo.out)
    for (let k = 1; k <= c.n; k++) {
      const p = clamp(-Math.log2(1 - (k - 0.5) / c.n) / 10, 0, 1);
      SFX.tick({ t: c.t + p * c.dur, amp: 0.4 + 0.5 * k / c.n });
    }
  },
  whoosh(c) {
    const d = c.dur || 0.4;
    const o = sweepNoise(d, 350, 3200, (p) => Math.pow(Math.sin(Math.PI * Math.min(1, p * 1.15)), 1.6), 1.1);
    const L = new Float32Array(o.length), Rr = new Float32Array(o.length);
    for (let i = 0; i < o.length; i++) { const p = i / o.length; L[i] = o[i] * (1 - p * 0.7); Rr[i] = o[i] * (0.3 + p * 0.7); }
    sfx.add(c.t, { L, R: Rr }, 0.9); sSend.add(c.t, o, 0.25);
  },
  whip(c) {
    const o = sweepNoise(0.3, 1200, 5500, (p) => Math.pow(Math.sin(Math.PI * p), 2.2), 1.6);
    const L = new Float32Array(o.length), Rr = new Float32Array(o.length);
    for (let i = 0; i < o.length; i++) { const p = i / o.length; L[i] = o[i] * (0.2 + p * 0.8); Rr[i] = o[i] * (1 - p * 0.8); }
    sfx.add(c.t, { L, R: Rr }, 1.0); sSend.add(c.t, o, 0.2);
  },
  swish(c) {
    sfx.add(c.t - 0.04, sweepNoise(0.2, 2500, 6500, (p) => Math.sin(Math.PI * p), 1.4), 0.55, (R() - 0.5) * 0.6);
  },
  swoosh(c) {
    const f = c.pitch || 1;
    sfx.add(c.t - 0.05, sweepNoise(0.32, 600 * f, 2600 * f, (p) => Math.pow(Math.sin(Math.PI * p), 1.5), 1.0), 0.6, (R() - 0.5) * 0.5);
  },
  riser(c) {
    const d = c.dur;
    const o = sweepNoise(d, 250, 9000, (p) => Math.pow(p, 2.2), 0.9);
    const saw = Saw(200), lp = new Biquad('lp', 2000);
    for (let i = 0; i < o.length; i++) {
      const p = i / o.length;
      o[i] += lp.run(saw(160 * Math.pow(5, p))) * Math.pow(p, 2.5) * 0.35;
    }
    sfx.add(c.t, o, 0.7); sSend.add(c.t, o, 0.3);
  },
  sweep(c) {
    const d = c.dur || 0.5, f = c.pitch || 1;
    const o = len(d);
    let ph = 0;
    for (let i = 0; i < o.length; i++) {
      const t = i / SR, p = t / d;
      ph += TAU * (420 * f * Math.pow(2.2, p)) / SR;
      o[i] = Math.sin(ph) * Math.sin(Math.PI * p) * 0.4;
    }
    sfx.add(c.t, o, 0.22); sSend.add(c.t, o, 0.35);
  },
  pop(c) {
    const f = c.pitch || 1;
    const o = len(0.12);
    let ph = 0;
    for (let i = 0; i < o.length; i++) {
      const t = i / SR;
      ph += TAU * (380 * f + 1500 * f * (1 - Math.exp(-t * 60))) / SR;
      o[i] = Math.sin(ph) * Math.exp(-t * 38) * (t < 0.001 ? t / 0.001 : 1);
    }
    sfx.add(c.t, o, 0.42, (R() - 0.5) * 0.4); sSend.add(c.t, o, 0.12);
  },
  popcorn(c) {
    for (let k = 0; k < c.n; k++) SFX.pop({ t: c.t + R() * c.dur, pitch: 0.8 + R() * 0.8 });
  },
  shimmer(c) {
    for (let k = 0; k < 14; k++) {
      const tt = c.t + k * 0.03 + R() * 0.02;
      const f = 2600 + R() * 5200;
      const o = len(0.4);
      for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = Math.sin(TAU * f * t) * Math.exp(-t * 14) * (t < 0.002 ? t / 0.002 : 1); }
      sfx.add(tt, o, 0.06, (R() - 0.5) * 1.4); sSend.add(tt, o, 0.12);
    }
  },
  ding(c) {
    // lonceng FM: C6 + G6
    [[84, 1], [91, 0.6], [96, 0.35]].forEach(([m, g]) => {
      const f = mtof(m), o = len(1.6);
      let pc = 0, pm = 0;
      for (let i = 0; i < o.length; i++) {
        const t = i / SR;
        pm += TAU * f * 3.5 / SR;
        pc += TAU * f / SR;
        o[i] = Math.sin(pc + 2.2 * Math.exp(-t * 5) * Math.sin(pm)) * Math.exp(-t * 2.6) * g;
      }
      sfx.add(c.t, o, 0.2); sSend.add(c.t, o, 0.4);
    });
  },
  type(c) {
    const o = len(0.04);
    const hp = new Biquad('hp', 1800);
    let ph = 0;
    for (let i = 0; i < o.length; i++) { const t = i / SR; ph += TAU * 170 / SR; o[i] = hp.run(noise()) * Math.exp(-t * 300) * 0.9 + Math.sin(ph) * Math.exp(-t * 120) * 0.4; }
    sfx.add(c.t, o, 0.2 * (c.amp || 0.6), (R() - 0.5) * 0.3);
  },
  swipe(c) {
    sfx.add(c.t, sweepNoise(0.2, 1300, 3600, (p) => Math.sin(Math.PI * p) * (1 - p * 0.5), 1.3), 0.35, 0.3);
  },
  click(c) {
    [0, 0.07].forEach((dt, k) => {
      const o = len(0.03);
      const bp = new Biquad('bp', k ? 2400 : 1600, 2);
      for (let i = 0; i < o.length; i++) { const t = i / SR; o[i] = bp.run(noise()) * Math.exp(-t * 400) * 2.2; }
      sfx.add(c.t + dt, o, 0.5);
    });
  },
  reverse(c) {
    const d = c.dur;
    const cr = crash(1, 2.2);
    const n = Math.ceil(d * SR);
    const L = new Float32Array(n), Rr = new Float32Array(n);
    for (let i = 0; i < n; i++) { const j = n - 1 - i; L[i] = cr.L[j] * Math.pow(i / n, 1.5); Rr[i] = cr.R[j] * Math.pow(i / n, 1.5); }
    sfx.add(c.t, { L, R: Rr }, 0.55);
  }
};

cueData.cues.forEach((c) => {
  const fn = SFX[c.type];
  if (!fn) { console.warn('SFX tidak dikenal:', c.type); return; }
  fn(Object.assign({ amp: 1 }, c));
});

/* ---------------------------------------------------------------- mix */
// Reverb & delay
const mVerb = freeverb(mSend, { room: 0.82, damp: 0.3 });
const mDel = pingpong(mDelay, BEAT * 0.75, 0.38, 0.32);
const sVerb = freeverb(sSend, { room: 0.86, damp: 0.25 });

for (let i = 0; i < N; i++) {
  music.L[i] += mVerb.L[i] * 0.9 + mDel.L[i];
  music.R[i] += mVerb.R[i] * 0.9 + mDel.R[i];
  sfx.L[i] += sVerb.L[i] * 0.8;
  sfx.R[i] += sVerb.R[i] * 0.8;
}

// Ducking musik di bawah impact besar + hening sebelum drop (2,75–3,0)
const BIG = { boom: 1, drop: 1, impact: 0.8, stamp: 0.8, stomp: 0.6 };
const duck = new Float32Array(N).fill(1);
cueData.cues.forEach((c) => {
  const depth = BIG[c.type];
  if (!depth) return;
  const s0 = Math.round(c.t * SR);
  for (let i = 0; i < SR * 0.6; i++) {
    const j = s0 + i; if (j >= N) break;
    const g = 1 - 0.45 * depth * Math.min(1, c.amp || 1) * Math.exp(-i / SR / 0.16);
    duck[j] = Math.min(duck[j], g);
  }
});
function gate(t0, t1) {
  const a = Math.round(t0 * SR), b = Math.round(t1 * SR), f = Math.round(0.006 * SR);
  for (let j = a - f; j < b + f; j++) {
    if (j < 0 || j >= N) continue;
    let g = 0;
    if (j < a) g = (a - j) / f; else if (j >= b) g = (j - b) / f;
    duck[j] *= g;
  }
}
gate(2.75, 3.0);
gate(22.75, 23.0);
for (let i = 0; i < N; i++) { music.L[i] *= duck[i]; music.R[i] *= duck[i]; }

// Fade sangat pendek di ujung supaya tidak ada klik saat loop
const fe = Math.round(0.01 * SR);
for (let i = 0; i < fe; i++) {
  const g = i / fe;
  [music, sfx].forEach((b) => { b.L[N - 1 - i] *= g; b.R[N - 1 - i] *= g; });
}

/* ---------------------------------------------------------------- tulis WAV (float32) */
function writeWav(file, bus) {
  const data = Buffer.alloc(N * 2 * 4);
  let peak = 0;
  for (let i = 0; i < N; i++) {
    data.writeFloatLE(bus.L[i], i * 8);
    data.writeFloatLE(bus.R[i], i * 8 + 4);
    peak = Math.max(peak, Math.abs(bus.L[i]), Math.abs(bus.R[i]));
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
  console.log(path.basename(file) + '  puncak ' + (20 * Math.log10(peak)).toFixed(1) + ' dBFS');
}
writeWav(path.join(BUILD, 'music.wav'), music);
writeWav(path.join(BUILD, 'sfx.wav'), sfx);
