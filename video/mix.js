/* ==========================================================================
   mix.js — gabungkan video + musik + SFX menjadi MP4 siap posting.

   Cara pakai (dari folder video/):
       node mix.js                 pakai build/visual.mp4  → out/
       node mix.js --preview       pakai build/visual-preview.mp4 → build/

   Langkah audio:
     1. Ukur loudness tiap stem (music.wav, sfx.wav), lalu atur gain supaya
        musik ≈ -16 LUFS dan SFX ≈ -19 LUFS sebelum digabung. Imbangannya
        tetap sama walaupun aransemen di audio.js diubah.
     2. Gabung → glue compressor → limiter.
     3. Naikkan ke -14 LUFS lalu limiter supaya true peak di bawah -1 dBTP —
        standar loudness Instagram/TikTok/YouTube. Diulang sampai pas.

   Hasil:
     out/wic-reels.mp4           video lengkap (musik + SFX)
     out/wic-reels-sfx-saja.mp4  hanya SFX, untuk ditumpuk dengan audio
                                 trending di Instagram
     out/wic-reels-cover.jpg     cover Reels (frame hook)
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BUILD = path.join(__dirname, 'build');
const PREVIEW = process.argv.includes('--preview');
const OUTDIR = PREVIEW ? BUILD : path.join(__dirname, 'out');
const VISUAL = path.join(BUILD, PREVIEW ? 'visual-preview.mp4' : 'visual.mp4');

const MUSIC_LUFS = -16;
const SFX_LUFS = -19;
const TARGET = { I: -14, TP: -2.2 };   // TP -2,2 di WAV → ≤ -1 dBTP setelah encode AAC

function ff(args) {
  return execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-y'].concat(args), { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
}
function ffErr(args) {
  try {
    const r = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-y'].concat(args), { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    return r.stderr;
  } catch (e) { return String(e.stderr || ''); }
}
function integrated(file) {
  const s = ffErr(['-i', file, '-af', 'ebur128', '-f', 'null', '-']);
  const m = s.match(/I:\s+(-?[\d.]+) LUFS\s*\n\s*Threshold/);
  return m ? parseFloat(m[1]) : NaN;
}
function truePeak(file) {
  const s = ffErr(['-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  const m = s.match(/True peak:\s*\n\s*Peak:\s+(-?[\d.]+) dBFS/);
  return m ? parseFloat(m[1]) : NaN;
}
/* Naikkan gain ke target LUFS lalu limiter. Limiter memotong sedikit
   loudness, jadi diulang sekali dengan koreksi. Hasil deterministik
   (tanpa loudnorm dinamis yang bisa "memompa"). */
function master(input, output, target) {
  const inI = integrated(input);
  let gain = target.I - inI, outI = NaN;
  for (let pass = 0; pass < 3; pass++) {
    ff(['-i', input, '-af',
      'volume=' + gain.toFixed(2) + 'dB,' +
      // limiter di-oversample 4× supaya puncak antar-sampel (true peak)
      // ikut tertahan, lalu sisakan ruang untuk overshoot encoder AAC
      'aresample=192000,' +
      'alimiter=limit=' + Math.pow(10, (target.TP - 0.7) / 20).toFixed(4) + ':attack=1.5:release=60:level=false:asc=1,' +
      'aresample=48000',
      '-c:a', 'pcm_f32le', output]);
    outI = integrated(output);
    if (Math.abs(outI - target.I) < 0.2) break;
    gain += target.I - outI;
  }
  return { inI: inI, outI: outI, tp: truePeak(output) };
}

fs.mkdirSync(OUTDIR, { recursive: true });
if (!fs.existsSync(VISUAL)) {
  console.error(path.relative(__dirname, VISUAL) + ' belum ada. Jalankan render.js dulu.');
  process.exit(1);
}

const music = path.join(BUILD, 'music.wav');
const sfx = path.join(BUILD, 'sfx.wav');
const mI = integrated(music), sI = integrated(sfx);
const gm = (MUSIC_LUFS - mI).toFixed(2), gs = (SFX_LUFS - sI).toFixed(2);
console.log('stem: musik ' + mI + ' LUFS → ' + gm + ' dB, sfx ' + sI + ' LUFS → ' + gs + ' dB');

const pre = path.join(BUILD, 'mix-pre.wav');
ff(['-i', music, '-i', sfx, '-filter_complex',
  '[0]volume=' + gm + 'dB[m];[1]volume=' + gs + 'dB[s];' +
  '[m][s]amix=inputs=2:normalize=0,' +
  // EQ master untuk speaker HP: buang sub tak berguna, kurangi lumpur,
  // tambah presence 2–4 kHz tempat telinga paling peka di speaker kecil.
  'highpass=f=30,lowshelf=f=95:g=-3,equalizer=f=320:t=q:w=1.2:g=-1.5,' +
  'equalizer=f=2800:t=q:w=1:g=2.5,highshelf=f=9000:g=1.5,' +
  'acompressor=threshold=-16dB:ratio=2.2:attack=8:release=140:knee=4',
  '-c:a', 'pcm_f32le', pre]);
const mixed = path.join(BUILD, 'mix.wav');
const st = master(pre, mixed, TARGET);
console.log('master: ' + st.inI + ' → ' + st.outI + ' LUFS, true peak ' + st.tp + ' dBTP');

const preS = path.join(BUILD, 'sfx-pre.wav');
ff(['-i', sfx, '-af', 'volume=' + gs + 'dB', '-c:a', 'pcm_f32le', preS]);
const sfxOnly = path.join(BUILD, 'sfx-only.wav');
master(preS, sfxOnly, { I: -16, TP: -2.2 });

const mux = (audio, out) => ff(['-i', VISUAL, '-i', audio, '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out]);

const main = path.join(OUTDIR, PREVIEW ? 'preview.mp4' : 'wic-reels.mp4');
mux(mixed, main);
console.log('→ ' + path.relative(__dirname, main));
if (!PREVIEW) {
  const alt = path.join(OUTDIR, 'wic-reels-sfx-saja.mp4');
  mux(sfxOnly, alt);
  console.log('→ ' + path.relative(__dirname, alt));
  const cover = path.join(OUTDIR, 'wic-reels-cover.jpg');
  const still = path.join(BUILD, 'stills', 't01.80.png');
  if (fs.existsSync(still)) {
    ff(['-i', still, '-q:v', '2', cover]);
    console.log('→ ' + path.relative(__dirname, cover));
  }
}
