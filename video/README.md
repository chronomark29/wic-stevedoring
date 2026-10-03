# Video Reels — PT. Wirama Indah Cigading

Video motion graphic vertikal 9:16 (1080×1920, 29 detik) untuk Instagram Reels.
Dibuat oleh **Kaelyth Studio** dari aset website ini: foto operasional, logo, palet
navy–oranye, font Plus Jakarta Sans, dan rekaman desain website barunya.

> **Status website:** website resmi WIC saat ini masih **wicstevedoring.com** (versi
> lama). Desain baru di repo ini adalah karya Kaelyth Studio dan bisa diakses sebagai
> **demo di wic-stevedoring.vercel.app**. Video menyebutnya "Demo website baru", dan
> kartu kontak di akhir video tetap menampilkan wicstevedoring.com sebagai website resmi.

Folder ini **tidak ikut ke website** (diabaikan Vercel lewat `.vercelignore`).

---

## Hasil siap pakai — `out/`

| Berkas | Kegunaan |
|---|---|
| `wic-reels.mp4` | Video utama: musik + SFX orisinal, -14 LUFS (standar Instagram) |
| `wic-reels-sfx-saja.mp4` | Tanpa musik, hanya SFX. Untuk dipasangkan dengan audio yang sedang tren di Instagram |
| `wic-reels-cover.jpg` | Cover Reels (frame hook "1 KAPAL. 55.254 TON GYPSUM") |

Musik dan SFX **disintesis dari nol** oleh `audio.js`, tanpa sampel atau lagu orang
lain, jadi tidak akan kena klaim hak cipta atau dibisukan Instagram.

---

## Alur video

Semua cut jatuh di ketukan musik (120 BPM, 1 ketukan = 0,5 detik).

| Detik | Scene | Tujuan |
|---|---|---|
| 0–3 | **Hook**: "1 KAPAL. 55.254 TON GYPSUM." lalu "Siapa yang bongkar?" | Menahan jempol di 1 detik pertama: angka besar + pertanyaan |
| 3–5 | Drop + logo WIC, "Sejak 1999" | Jawaban dan identitas, tepat di drop musik |
| 5–11 | 15 jenis muatan: montase foto lalu dinding kata, ditutup "15" | Ritme cepat yang makin rapat; penghitung 01/15 membuat orang menonton sampai habis |
| 11–15 | 3 layanan inti: Stevedoring, Cargodoring, Receiving/Delivery | Penjelasan layanan dalam satu rantai |
| 15–19 | 26+ tahun, 31+ klien & mitra, 3 penghargaan, Zero Accident 2016 | Bukti / kredibilitas |
| 19–23 | Demo website baru di mockup HP + laptop: wic-stevedoring.vercel.app, "Desain baru oleh Kaelyth Studio · DEMO" | Memamerkan hasil desain website Kaelyth beserta fiturnya |
| 23–25 | "ONE GREAT. ONE TEAM. ONE WINNER." | Puncak emosi, motto perusahaan |
| 25–29 | "Ada kapal yang akan sandar?" + WhatsApp, website, lokasi | Ajakan bertindak; frame terakhir menyambung ke frame pertama (loop) |

Hanya klaim yang terverifikasi yang dipakai (sama dengan website; lihat
`README.md` di root bagian klaim yang sengaja tidak dipakai).

---

## Panduan posting supaya jangkauannya maksimal

1. **Posting sebagai Collab.** Ajak akun WIC / Melati Group dan akun Kaelyth Studio
   sebagai kolaborator. Video tampil di kedua profil dan kedua audiens sekaligus.
2. **Pakai cover `wic-reels-cover.jpg`.** Teks hook ada di tengah, jadi tetap terbaca
   walaupun grid profil memotongnya menjadi 3:4.
3. **Beri nama audio orisinalnya** (Instagram mengizinkan mengganti nama "Original
   audio"), misalnya *"WIC — Satu Rantai · Kaelyth Studio"*. Kalau orang lain memakai
   audionya, nama itu ikut tersebar.
4. **Caption + disclaimer.** Baris pertama adalah hook (yang terlihat sebelum
   "selengkapnya"). Link di caption Instagram tidak bisa diklik, jadi pasang juga
   wic-stevedoring.vercel.app di bio atau stiker link Story.

   ```
   1 kapal. 55.254 ton gypsum. Siapa yang bongkar? ⚓

   PT. Wirama Indah Cigading, mitra bongkar muat di Pelabuhan Cigading sejak 1999.
   Stevedoring, cargodoring, sampai receiving/delivery — satu rantai, satu tim.

   🎬 Motion graphic & 🖥️ desain website baru oleh Kaelyth Studio.
   Coba demo website barunya: wic-stevedoring.vercel.app

   Ada kapal yang akan sandar? WhatsApp 0813-1012-1513

   —
   ℹ️ Disclaimer: Website resmi PT. Wirama Indah Cigading saat ini tetap di
   wicstevedoring.com (versi lama). wic-stevedoring.vercel.app adalah desain website
   baru hasil karya Kaelyth Studio dan sudah bisa diakses sebagai versi demo.
   Logo, nama, dan foto adalah milik PT. Wirama Indah Cigading.

   #bongkarmuat #stevedoring #pelabuhan #cilegon #banten #logistik #pelayaran #curahkering #motiongraphic #webdesign #kaelythstudio
   ```

5. **Sematkan komentar pertama** berisi ajakan dan disclaimer singkat, misalnya:
   *"Mau jadwalkan bongkar muat di Cigading? Chat WA 0813-1012-1513. Demo website
   baru buatan Kaelyth Studio: wic-stevedoring.vercel.app (website resmi saat ini
   masih wicstevedoring.com)."*
6. **Balas semua komentar di jam pertama.** Interaksi awal ikut menentukan seberapa
   luas Reels didorong.
7. **Bagikan ke Story** dengan stiker link ke demo wic-stevedoring.vercel.app.
8. **Uji dulu dengan "Trial Reels"** (fitur Instagram untuk menayangkan Reels ke
   non-pengikut lebih dulu) kalau ingin membandingkan versi musik orisinal dengan
   versi `wic-reels-sfx-saja.mp4` + audio tren.

---

## Membuat ulang / mengubah video

```bash
cd video
npm install        # sekali saja
bash build.sh      # ±20 menit → out/
```

Butuh Node 18+, ffmpeg, dan Playwright + Chromium
(`npm i -g playwright && npx playwright install chromium`).

| Berkas | Isi |
|---|---|
| `stage.html` | Panggung 1080×1920: tata letak dan gaya semua scene |
| `timeline.js` | Semua gerak dan waktu (GSAP), daftar titik SFX (`cue(...)`) |
| `capture-site.js` | Memotret website untuk scene "Website baru" |
| `render.js` | Render frame demi frame → `build/visual.mp4` |
| `audio.js` | Sintesis musik + SFX → `build/music.wav`, `build/sfx.wav` |
| `mix.js` | Mixing, mastering -14 LUFS, gabung ke MP4 → `out/` |
| `lib/` | Server lokal, peluncur browser, font lokal |

Perintah yang berguna saat mengedit:

```bash
node render.js --still 1.8,10.2   # potret PNG di detik tertentu → build/stills/
node render.js --preview          # video 540×960 cepat (±3 menit)
node mix.js --preview             # gabung preview + audio → build/preview.mp4
```

Pratinjau langsung di browser: jalankan `python -m http.server` dari root repo, lalu
buka `http://127.0.0.1:8000/video/stage.html?play=1` (atau `?t=12.5` untuk diam di
satu detik).

**Mengganti teks:** teks ada di `stage.html` (scene statis) dan di `timeline.js`
(daftar muatan `S3A`/`S3_WALL`, chip fitur `FEATS`). Ukuran font menyesuaikan lebar
sendiri. **Mengubah waktu:** semua angka detik di `timeline.js`. Jika memindahkan
scene, pastikan cut tetap di kelipatan 0,5 detik agar sinkron dengan musik.
Struktur musik ada di `audio.js` (bagian "MUSIK"), dan SFX otomatis mengikuti
`cue(...)` di timeline.
