/* ==========================================================================
   render.js — render stage.html menjadi video, frame demi frame.

   Cara pakai (dari folder video/):
       node render.js                    render penuh 1080×1920 → build/visual.mp4
       node render.js --preview          540×960, cepat, tanpa motion blur
       node render.js --still 1.6,10.2   potret PNG di detik tertentu → build/stills/
       node render.js --from 5 --to 11   render sebagian (untuk cek satu scene)
       node render.js --sub 3            jumlah subframe motion blur (default 2)

   Setiap frame: window.__seek(t) → screenshot → dipipa ke ffmpeg.
   Motion blur: tiap frame dipotret beberapa kali dalam rentang "shutter"
   180° lalu dirata-rata oleh ffmpeg (tmix). Hasilnya blur gerak sungguhan
   untuk whip, slam, dan roll angka, bukan blur palsu.

   Juga menulis build/cues.json (titik SFX) untuk audio.js.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const server = require('./lib/server');
const { launch } = require('./lib/browser');

const BUILD = path.join(__dirname, 'build');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
}

const PREVIEW = !!arg('preview', false);
const STILL = arg('still', null);
const SUB = PREVIEW ? 1 : Math.max(1, parseInt(arg('sub', '2'), 10));
const SHUTTER = 0.5;                  // 180°
const SCALE = PREVIEW ? 0.5 : 1;
const OUT = path.resolve(arg('out', path.join(BUILD, PREVIEW ? 'visual-preview.mp4' : 'visual.mp4')));

(async () => {
  fs.mkdirSync(BUILD, { recursive: true });
  for (const f of ['site-mobile.png', 'site-desktop.png', 'site-mobile-header.png', 'site-mobile-actionbar.png']) {
    if (!fs.existsSync(path.join(BUILD, f))) {
      console.error('build/' + f + ' belum ada. Jalankan dulu: node capture-site.js');
      process.exit(1);
    }
  }

  const srv = await server.start();
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: SCALE });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('[halaman]', e.message));
  await page.goto(srv.url + '/video/stage.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(err);

  const info = await page.evaluate(() => ({ d: window.__duration, fps: window.__fps, cues: window.__cues, impacts: window.__impacts }));
  fs.writeFileSync(path.join(BUILD, 'cues.json'), JSON.stringify({
    duration: info.d, fps: info.fps, bpm: 120, cues: info.cues, impacts: info.impacts
  }, null, 1));

  /* ---- Mode still ---- */
  if (STILL) {
    const dir = path.join(BUILD, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const s of String(STILL).split(',')) {
      const t = parseFloat(s);
      await page.evaluate((tt) => window.__seek(tt), t);
      const file = path.join(dir, 't' + t.toFixed(2).padStart(5, '0') + '.png');
      await page.screenshot({ path: file, type: 'png' });
      console.log(file);
    }
    await browser.close(); srv.close();
    return;
  }

  /* ---- Mode video ---- */
  const fps = info.fps;
  const from = parseFloat(arg('from', '0'));
  const to = Math.min(parseFloat(arg('to', String(info.d))), info.d);
  const f0 = Math.round(from * fps);
  const f1 = Math.round(to * fps);
  const W = 1080 * SCALE, H = 1920 * SCALE;

  const vf = [];
  if (SUB > 1) {
    vf.push('tmix=frames=' + SUB);
    vf.push("select='eq(mod(n\\," + SUB + ")\\," + (SUB - 1) + ")'");
    vf.push('setpts=N/(' + fps + '*TB)');
  }
  vf.push('format=yuv420p');
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps * SUB), '-c:v', 'mjpeg', '-i', '-',
    '-vf', vf.join(','),
    '-r', String(fps),
    '-c:v', 'libx264', '-preset', PREVIEW ? 'veryfast' : 'slow',
    '-crf', PREVIEW ? '23' : '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-s', W + 'x' + H,
    '-movflags', '+faststart',
    OUT
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg keluar dengan kode ' + c)))));

  const t0 = Date.now();
  const total = f1 - f0;
  for (let f = f0; f < f1; f++) {
    for (let s = 0; s < SUB; s++) {
      // subframe disebar di paruh pertama interval frame (shutter 180°),
      // berpusat di waktu frame supaya sinkron dengan audio
      const off = SUB > 1 ? (s / (SUB - 1) - 0.5) * SHUTTER : 0;
      const t = Math.max(0, (f + off) / fps);
      await page.evaluate((tt) => window.__seek(tt), t);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    const done = f - f0 + 1;
    if (done % 30 === 0 || done === total) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write('\rframe ' + done + '/' + total + '  ' + el.toFixed(0) + ' s  (sisa ~' + (el / done * (total - done)).toFixed(0) + ' s)   ');
    }
  }
  ff.stdin.end();
  await ffDone;
  process.stdout.write('\n');
  await browser.close();
  srv.close();
  console.log('Selesai: ' + path.relative(process.cwd(), OUT));
})().catch((e) => { console.error(e); process.exit(1); });
