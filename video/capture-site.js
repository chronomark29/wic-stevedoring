/* ==========================================================================
   capture-site.js — potret website WIC untuk segmen "Website baru".

   Cara pakai:
       cd video
       node capture-site.js

   Hasil (folder build/):
     site-mobile.png         halaman beranda versi HP, lebar 390px @2x,
                             dipotong ~6000px teratas (cukup untuk scroll 4 detik)
     site-mobile-header.png  header dalam keadaan "menempel" (setelah scroll),
                             ditaruh tetap di atas layar HP saat halaman bergulir
     site-mobile-actionbar.png  bar aksi bawah (Telepon / WhatsApp / Penawaran)
     site-desktop.png        tampilan pertama versi desktop 1440×900

   emulateMedia({ reducedMotion: 'reduce' }) membuat semua animasi reveal
   langsung tampil (situs sudah mendukungnya di animations.css), jadi
   potretnya lengkap tanpa menunggu scroll.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const server = require('./lib/server');
const { launch } = require('./lib/browser');
const { routeGoogleFonts } = require('./lib/fonts');

const OUT = path.join(__dirname, 'build');
const MOBILE_MAX_H = 6000;

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    imgs.forEach((img) => { img.loading = 'eager'; });
    await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
  });
  await page.waitForTimeout(600);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await server.start();
  const browser = await launch();

  /* ---- HP ---- */
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce'
  });
  await routeGoogleFonts(mobile, srv.url);
  const mp = await mobile.newPage();
  await mp.goto(srv.url + '/index.html', { waitUntil: 'networkidle' });
  await settle(mp);
  // Bar aksi HP (Telepon / WhatsApp / Penawaran) posisinya fixed: kalau ikut
  // dipotret fullPage ia menempel di tengah halaman. Dipotret terpisah dulu,
  // lalu disembunyikan; di video ia ditaruh tetap di bawah layar HP.
  const ab = await mp.evaluate(() => {
    const r = document.querySelector('.action-bar').getBoundingClientRect();
    return { x: 0, y: Math.floor(r.top), width: 390, height: Math.ceil(r.height) };
  });
  await mp.screenshot({ path: path.join(OUT, 'site-mobile-actionbar.png'), clip: ab });
  await mp.addStyleTag({ content: '.action-bar{display:none!important}' });
  const fullH = await mp.evaluate(() => document.documentElement.scrollHeight);
  const h = Math.min(fullH, MOBILE_MAX_H);
  await mp.screenshot({
    path: path.join(OUT, 'site-mobile.png'),
    fullPage: true,
    clip: { x: 0, y: 0, width: 390, height: h }
  });

  // Header "menempel": gulir sedikit, lalu potret area header saja.
  await mp.evaluate(() => window.scrollTo(0, 400));
  await mp.waitForTimeout(500);
  const hb = await mp.evaluate(() => {
    const r = document.querySelector('.site-header').getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top), width: 390, height: Math.ceil(r.height) };
  });
  await mp.screenshot({ path: path.join(OUT, 'site-mobile-header.png'), clip: hb });

  /* ---- Desktop ---- */
  const desk = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce'
  });
  await routeGoogleFonts(desk, srv.url);
  const dp = await desk.newPage();
  await dp.goto(srv.url + '/index.html', { waitUntil: 'networkidle' });
  await settle(dp);
  await dp.screenshot({ path: path.join(OUT, 'site-desktop.png') });

  fs.writeFileSync(path.join(OUT, 'site.json'), JSON.stringify({
    mobile: { cssWidth: 390, cssHeight: h, scale: 2, header: hb, actionBar: ab }
  }, null, 2));

  await browser.close();
  srv.close();
  console.log('Website dipotret: tinggi halaman HP ' + fullH + 'px (dipakai ' + h + 'px).');
})().catch((e) => { console.error(e); process.exit(1); });
