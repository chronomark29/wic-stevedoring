/* ==========================================================================
   build-pdf.js — render panduan.html menjadi Panduan-Website-WIC.pdf (A4).

   Cara pakai:
       cd panduan
       node build-pdf.js

   Butuh playwright-core dan Microsoft Edge. Kalau playwright-core tidak
   terpasang di folder ini, arahkan saja NODE_PATH ke tempat ia berada:
       set NODE_PATH=C:\path\ke\node_modules && node build-pdf.js

   Halaman dimuat lewat file:// — panduan ini tidak butuh server karena
   seluruh isinya teks dan CSS, tanpa gambar dari folder website.
   ========================================================================== */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const EDGE  = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SRC   = path.join(__dirname, 'panduan.html');
const PDF   = path.join(__dirname, '..', 'Panduan-Website-WIC.pdf');
const SHOTS = path.join(__dirname, 'halaman');

/* Ukuran A4 pada 96 dpi. Dipakai untuk mendeteksi isi yang meluber
   keluar halaman sebelum PDF dicetak. */
const A4_W = 794;
const A4_H = 1123;

/* Ambang keterbacaan. Panduan ini dibaca orang non-teknis dan sering
   dicetak, jadi tidak boleh ada teks di bawah 16px. */
const MIN_FONT = 16;

fs.mkdirSync(SHOTS, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const ctx = await browser.newContext({
    viewport: { width: A4_W, height: A4_H },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();

  const failed = [];
  page.on('requestfailed', r => failed.push(r.url().split('/').pop()));
  page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().split('/').pop()); });

  await page.goto('file:///' + SRC.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  /* ---------- Pemeriksaan sebelum render ---------- */
  const check = await page.evaluate(({ A4_W, A4_H, MIN_FONT }) => {
    // .glow dan .dots sengaja melewati tepi halaman dan sudah dipotong oleh
    // overflow:hidden. Disembunyikan dulu supaya yang terukur hanya konten.
    const deco = [...document.querySelectorAll('.glow, .dots')];
    deco.forEach(d => d.style.display = 'none');

    const pages = [...document.querySelectorAll('.page')];
    const over = pages.map((p, i) => ({
      hal: i + 1,
      lebihTinggi: p.scrollHeight - A4_H,
      lebihLebar: p.scrollWidth - A4_W
    })).filter(p => p.lebihTinggi > 1 || p.lebihLebar > 1);

    // Kotak kode memakai white-space:pre + overflow:hidden, jadi baris yang
    // kepanjangan terpotong diam-diam tanpa merusak tinggi halaman. Harus
    // diperiksa sendiri, tidak ikut terdeteksi oleh pemeriksaan halaman di atas.
    const preTerpotong = [...document.querySelectorAll('.page pre')]
      .filter(e => e.scrollWidth - e.clientWidth > 1)
      .map(e => '+' + (e.scrollWidth - e.clientWidth) + 'px — "'
                + e.innerText.trim().split('\n')[0].slice(0, 40) + '…"');

    // Alamat web harus berupa <a> supaya ikut jadi tautan yang bisa diklik di
    // PDF. Alamat yang cuma teks memaksa pembaca mengetik ulang, dan di situlah
    // "https://" sering jadi salah ketik.
    const tautan = [...document.querySelectorAll('.page a[href^="http"]')].length;
    const alamatTanpaTautan = [...document.querySelectorAll('.page code, .page pre')]
      .filter(e => /^(https?:\/\/)?[a-z0-9-]+\.(com|app|org|id|net)(\/|$)/i.test(e.innerText.trim()))
      .map(e => e.innerText.trim().slice(0, 50));

    const imgs = [...document.querySelectorAll('img')];
    const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0)
                       .map(i => i.getAttribute('src'));

    // Teks yang terlalu kecil untuk dibaca nyaman di kertas.
    // pre.tree dikecualikan: itu bagan struktur folder, bukan kalimat — ia
    // memang perlu sedikit lebih rapat supaya seluruh pohon muat satu halaman.
    const tiny = [...document.querySelectorAll('.page p, .page li, .page td, .page pre, .page .tip, .page .warn')]
      .filter(e => !e.classList.contains('tree'))
      .filter(e => e.innerText.trim() && parseFloat(getComputedStyle(e).fontSize) < MIN_FONT)
      .map(e => (e.className || e.tagName.toLowerCase()) + ' — "' + e.innerText.trim().slice(0, 40) + '…"');

    // Baris terlalu panjang melelahkan mata; batas nyaman ± 75 karakter.
    // Lebar rata-rata karakter diukur betulan, bukan ditebak dari ukuran font.
    const ctx2d = document.createElement('canvas').getContext('2d');
    const longLines = [...document.querySelectorAll('.page p, .page li')]
      .filter(e => {
        const t = e.innerText.trim();
        if (t.length < 60) return false;
        const cs = getComputedStyle(e);
        ctx2d.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        const avg = ctx2d.measureText(t.slice(0, 120)).width / Math.min(t.length, 120);
        // padding kiri li dipakai untuk nomor/bulatan, bukan teks
        const lebarTeks = e.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return lebarTeks / avg > 78;
      })
      .map(e => {
        const cs = getComputedStyle(e);
        const w = e.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return Math.round(w) + 'px — "' + e.innerText.trim().slice(0, 34) + '…"';
      });

    deco.forEach(d => d.style.display = '');

    return {
      jumlahHalaman: pages.length,
      meluber: over,
      gambarRusak: broken,
      totalGambar: imgs.length,
      fontOk: document.fonts.check('800 40px "Plus Jakarta Sans"'),
      monoOk: document.fonts.check('400 15px "JetBrains Mono"'),
      tautan,
      alamatTanpaTautan,
      preTerpotong,
      teksKecil: tiny,
      barisPanjang: longLines
    };
  }, { A4_W, A4_H, MIN_FONT });

  console.log('Jumlah halaman    :', check.jumlahHalaman);
  console.log('Font Plus Jakarta :', check.fontOk ? 'OK' : 'GAGAL (pakai font cadangan)');
  console.log('Font JetBrains    :', check.monoOk ? 'OK' : 'GAGAL (pakai font cadangan)');
  console.log('Gambar            :', check.totalGambar, '| rusak:', check.gambarRusak.length);
  if (check.gambarRusak.length) console.log('  rusak:', check.gambarRusak);
  console.log('Halaman meluber   :', check.meluber.length ? JSON.stringify(check.meluber) : 'tidak ada');
  console.log('Tautan diklik     :', check.tautan);
  console.log('Alamat tak diklik :', check.alamatTanpaTautan.length);
  if (check.alamatTanpaTautan.length) check.alamatTanpaTautan.forEach(t => console.log('  •', t));
  console.log('Kode terpotong    :', check.preTerpotong.length);
  if (check.preTerpotong.length) check.preTerpotong.forEach(t => console.log('  •', t));
  console.log('Teks < ' + MIN_FONT + 'px      :', check.teksKecil.length);
  if (check.teksKecil.length) check.teksKecil.forEach(t => console.log('  •', t));
  console.log('Baris kepanjangan :', check.barisPanjang.length);
  if (check.barisPanjang.length) check.barisPanjang.forEach(t => console.log('  •', t));
  console.log('Request gagal     :', failed.length ? [...new Set(failed)] : 'tidak ada');

  /* ---------- Ekspor tiap halaman jadi PNG untuk diperiksa mata ---------- */
  for (let i = 0; i < check.jumlahHalaman; i++) {
    const el = page.locator('.page').nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await el.screenshot({ path: path.join(SHOTS, `hal-${String(i + 1).padStart(2, '0')}.png`) });
  }
  console.log('PNG halaman       :', check.jumlahHalaman, 'tersimpan di panduan/halaman/');

  /* ---------- Cetak PDF ---------- */
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: PDF,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    pageRanges: `1-${check.jumlahHalaman}`
  });

  const mb = fs.statSync(PDF).size / 1024 / 1024;
  console.log('PDF               :', PDF);
  console.log('Ukuran            :', mb.toFixed(2), 'MB');

  await browser.close();
})();
