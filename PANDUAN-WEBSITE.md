# Panduan Website PT. Wirama Indah Cigading

Panduan lengkap untuk menjalankan, mengubah isi, dan menayangkan website ini.
Ditulis untuk dibaca siapa saja — **tidak perlu bisa memrogram** untuk perubahan sehari-hari.

Tersedia juga dalam bentuk PDF siap cetak: **[Panduan-Website-WIC.pdf](Panduan-Website-WIC.pdf)**

---

## Daftar Isi

1. [Apa yang Anda terima](#1-apa-yang-anda-terima)
2. [Cara mengunduh dari GitHub](#2-cara-mengunduh-dari-github)
3. [Cara membuka di komputer sendiri](#3-cara-membuka-di-komputer-sendiri)
4. [Cara memasang ke internet](#4-cara-memasang-ke-internet)
5. [Mengganti nomor telepon, WhatsApp, dan email](#5-mengganti-nomor-telepon-whatsapp-dan-email)
6. [Menambah foto galeri](#6-menambah-foto-galeri)
7. [Menambah proyek](#7-menambah-proyek)
8. [Menambah logo klien](#8-menambah-logo-klien)
9. [Menyetel angka kalkulator estimasi](#9-menyetel-angka-kalkulator-estimasi)
10. [Mengubah tulisan di halaman](#10-mengubah-tulisan-di-halaman)
11. [Yang perlu dikonfirmasi sebelum benar-benar live](#11-yang-perlu-dikonfirmasi-sebelum-benar-benar-live)
12. [Kalau ada masalah](#12-kalau-ada-masalah)
13. [Butuh update cepat dan presisi?](#13-butuh-update-cepat-dan-presisi)

---

## 1. Apa yang Anda terima

Website ini **hanya sebuah folder berisi berkas**. Tidak ada WordPress, tidak ada
database, tidak ada plugin, tidak ada biaya langganan. Folder ini diunggah ke hosting
mana pun, lalu website langsung jalan.

```
Wicstevedoring Site/
├── index.html               Beranda
├── tentang.html             Tentang Kami
├── layanan.html             Layanan + pencari muatan
├── proyek.html              Proyek / rekam jejak
├── galeri.html              Galeri foto
├── kontak.html              Kontak + formulir penawaran
├── favicon.svg              Ikon kecil di tab browser
├── robots.txt               Instruksi untuk mesin pencari
├── sitemap.xml              Peta situs untuk Google
├── PANDUAN-WEBSITE.md       Panduan ini
├── Panduan-Website-WIC.pdf  Panduan ini dalam bentuk PDF
├── panduan/                 Sumber PDF panduan (tidak memengaruhi website)
├── _reference/              Tangkapan layar website lama, sebagai arsip
└── assets/
    ├── css/                 Tampilan — 4 berkas
    ├── js/                  Fungsi interaktif — 7 berkas
    ├── data/content.js      ← DI SINILAH ISI WEBSITE DIUBAH
    └── img/                 Semua foto dan logo
```

**Yang paling penting untuk diingat:** hampir semua perubahan isi cukup dilakukan
di satu berkas, yaitu `assets/data/content.js`.

---

## 2. Cara mengunduh dari GitHub

Seluruh kode website tersimpan di GitHub — layanan penyimpanan kode di internet.
Repo ini terbuka untuk umum, jadi Anda tidak perlu punya akun atau login:

**<https://github.com/chronomark29/wic-stevedoring>**

Ada dua cara mengunduhnya. Pilih salah satu.

### Cara A — Unduh ZIP (paling gampang, tanpa memasang apa pun)

1. Buka alamat di atas lewat browser.
2. Cari tombol hijau bertuliskan **Code**, lalu klik.
3. Pilih **Download ZIP**.
4. Buka folder **Downloads** di komputer Anda, klik kanan berkas ZIP tadi,
   pilih **Extract All** (Ekstrak Semua).
5. Selesai. Hasil ekstraknya adalah folder website Anda.

> **Tips:** simpan folder hasil ekstrak di tempat yang mudah dicari, misalnya
> `Documents\Website WIC`. Hindari menyimpannya di dalam folder Downloads,
> karena mudah terhapus saat bersih-bersih.

### Cara B — `git clone` (untuk yang ingin ikut menerima pembaruan)

Cara ini butuh aplikasi **Git**, unduh gratis di <https://git-scm.com/downloads>.
Setelah terpasang, buka **Command Prompt** lalu ketik:

```bash
git clone https://github.com/chronomark29/wic-stevedoring.git
```

Kelebihan cara ini: nanti kalau ada perbaikan, Anda cukup mengetik `git pull` untuk
menarik versi terbaru — tidak perlu mengunduh ulang semuanya.

---

## 3. Cara membuka di komputer sendiri

Sebelum diunggah ke internet, website ini bisa langsung dicoba di komputer.
Caranya sesederhana membuka foto:

1. Buka folder website di **File Explorer**.
2. Klik dua kali berkas `index.html`
3. Website terbuka di browser. Selesai.

> **Semua fitur berfungsi dengan cara ini.**
> Kalkulator estimasi, pencari muatan, galeri beserta lightbox-nya, tombol ganti
> bahasa, dan perpindahan antar halaman — semuanya sudah diuji dan berjalan normal
> saat dibuka dengan klik dua kali. Anda **tidak perlu** memasang Python, Node,
> atau aplikasi apa pun.

Yang perlu diingat hanya satu: **jangan memindahkan `index.html` keluar dari
foldernya.** Berkas itu mengambil tampilan dan foto dari folder `assets/` di
sebelahnya. Kalau dipisahkan, halaman akan tampil polos tanpa warna dan tanpa foto.

### Kalau ada fitur yang tetap tidak jalan

Ini jarang terjadi, biasanya karena pengaturan keamanan browser di komputer kantor.
Jalan keluarnya: buka folder website, klik kolom alamat File Explorer, ketik `cmd`
lalu Enter, kemudian jalankan:

```bash
python -m http.server 5211
```

Lalu buka **http://127.0.0.1:5211/** di browser. Tekan **Ctrl + C** untuk
menghentikannya.

---

## 4. Cara memasang ke internet

Pilih satu di antara tiga cara berikut, sesuai hosting yang Anda pakai.

### Pilihan 1 — cPanel (Niagahoster, Domainesia, Rumahweb, dan sejenisnya)

1. Masuk ke cPanel milik Anda.
2. Buka menu **File Manager**.
3. Masuk ke folder **`public_html`**.
4. Hapus isi lama di dalamnya bila website versi lama masih ada di situ.
5. Unggah **seluruh isi** folder website — bukan foldernya, melainkan isinya:
   `index.html`, `assets/`, dan seterusnya harus berada langsung di dalam `public_html`.
6. Buka nama domain Anda di browser. Website sudah tayang.

> **Hati-hati:** kalau `index.html` masuk ke dalam sub-folder (misalnya
> `public_html/Wicstevedoring Site/index.html`), website tidak akan muncul.
> Berkas `index.html` harus berada **langsung** di dalam `public_html`.

### Pilihan 2 — Netlify (gratis, paling cepat)

1. Buka <https://app.netlify.com> dan buat akun gratis.
2. Setelah masuk, cari area bertuliskan **"Drag and drop your site output folder here"**.
3. Seret folder website dari File Explorer, jatuhkan ke area tersebut.
4. Tunggu beberapa detik. Netlify langsung memberi alamat web.
5. Nama domain sendiri bisa dipasang lewat menu **Domain settings**.

### Pilihan 3 — Vercel (gratis, otomatis mengikuti GitHub)

1. Buka <https://vercel.com> dan masuk memakai akun GitHub.
2. Klik **Add New → Project**.
3. Pilih repository `wic-stevedoring`.
4. Biarkan semua pengaturan apa adanya, lalu klik **Deploy**.
5. Setiap kali ada perubahan yang disimpan ke GitHub, website otomatis diperbarui
   dalam waktu kurang dari satu menit.

Tidak ada yang perlu diatur pada ketiga cara di atas. Tidak ada PHP, tidak ada Node,
tidak ada database.

---

## 5. Mengganti nomor telepon, WhatsApp, dan email

Buka berkas `assets/data/content.js` memakai aplikasi teks apa pun.
Notepad sudah cukup, tetapi **Visual Studio Code** jauh lebih nyaman —
gratis di <https://code.visualstudio.com>.

Blok paling atas berisi data perusahaan:

```js
WIC.company = {
  phone:    '+62 254 602424',
  phoneAlt: '+62 254 605604',
  whatsapp: '6281310121513',   // format internasional, tanpa + dan tanpa spasi
  email:    'operation.wic@melati-group.com',
  ...
};
```

Ganti isi di dalam tanda kutip, simpan, selesai.

> **Hati-hati:** nomor telepon dan email juga tertulis langsung di bagian atas
> (header) dan bawah (footer) ke-6 berkas HTML. Setelah mengubah `content.js`,
> cari juga tulisan **`602424`** dan **`operation.wic`** di seluruh berkas HTML,
> lalu ganti di sana. Di Visual Studio Code, gunakan **Ctrl + Shift + F**
> untuk mencari di semua berkas sekaligus.

---

## 6. Menambah foto galeri

1. Simpan foto ke folder `assets/img/gallery/`.
2. Beri nama berurutan mengikuti yang sudah ada: `g16.jpg`, `g17.jpg`, dan seterusnya.
3. Buka `assets/data/content.js`, cari bagian `WIC.gallery`, lalu tambahkan satu baris:

```js
{ f: 'g16.jpg', cat: 'operasi', cap: { id: 'Keterangan foto', en: 'Photo caption' } },
```

Keterangan isian:

| Bagian | Artinya |
|---|---|
| `f` | Nama berkas foto, harus persis sama dengan nama di folder |
| `cat` | Kategori — **hanya boleh** `operasi`, `alat`, `kapal`, atau `tim` |
| `cap.id` | Keterangan foto Bahasa Indonesia |
| `cap.en` | Keterangan foto Bahasa Inggris |

> **Tips:** ukuran foto sebaiknya di bawah 500 KB supaya website tetap ringan
> dibuka dari HP. Foto dari kamera HP biasanya 3–5 MB, jadi perlu diperkecil dulu.
> Bisa memakai <https://squoosh.app> — gratis, langsung di browser.

---

## 7. Menambah proyek

1. Simpan foto proyek ke `assets/img/projects/`.
2. Di `content.js`, cari `WIC.projects`, lalu salin satu blok yang sudah ada dan
   ubah isinya:

```js
{
  id: 'nama-unik',
  img: 'assets/img/projects/foto-anda.png',
  client: 'PT. Nama Klien',
  figure: '30.000', unit: 'MT',
  title: { id: 'Judul Indonesia', en: 'English Title' },
  desc:  { id: 'Penjelasan singkat…', en: 'Short description…' },
  meta: [ { k: { id: 'Kapal', en: 'Vessel' }, v: 'Mv. Nama Kapal' } ]
}
```

`id` harus unik — tidak boleh sama dengan proyek lain.

---

## 8. Menambah logo klien

1. Simpan berkas logo ke `assets/img/partners/`.
   Format PNG dengan latar transparan memberi hasil paling rapi.
2. Di `content.js`, cari `WIC.partners`, tambahkan satu baris:

```js
{ n: 'Nama Perusahaan', f: 'namafile.png' },
```

---

## 9. Menyetel angka kalkulator estimasi

Kalkulator Estimasi Bongkar adalah fitur utama website ini. Calon pelanggan memilih
komoditas, tonase, dan metode bongkar, lalu langsung melihat perkiraan produktivitas
dan lama sandar.

> **Penting.** Angka yang terpasang saat ini adalah **rata-rata industri yang
> konservatif**, bukan angka produktivitas WIC yang sebenarnya. Begitu diganti
> dengan angka Anda sendiri, alat ini menjadi benar-benar akurat.

Di `content.js`, cari `WIC.equipment`:

```js
{ id: 'ship-crane',  rate: [4000, 6000] },    // MT per hari kerja efektif
{ id: 'shore-crane', rate: [6000, 10000] },
{ id: 'csu',         rate: [10000, 15000] },
{ id: 'bagged',      rate: [1500, 2500] },
```

Ubah pasangan angka `[minimum, maksimum]` sesuai produktivitas gang Anda.

Setiap komoditas juga punya `factor` — pengali yang menyesuaikan kecepatan bongkar
menurut sifat muatan: batu bara `1.1` karena mengalir lancar, raw sugar `0.85`
karena lebih lambat. Angka ini juga boleh disetel.

Website selalu menampilkan keterangan bahwa hasilnya bersifat perkiraan dan
bukan penawaran resmi.

---

## 10. Mengubah tulisan di halaman

Semua tulisan yang tampil di website tersimpan di `assets/js/i18n.js`, dalam dua
daftar: `id:` untuk Bahasa Indonesia dan `en:` untuk Bahasa Inggris.

Contoh:

```js
'hero.title': 'Menggerakkan Muatan Anda,<br>Menguatkan Bisnis Anda<span class="dot">.</span>',
```

> **Hati-hati:** setiap tulisan harus diubah di **kedua** daftar — `id:` dan `en:`.
> Kalau hanya salah satu, tulisan lama akan muncul kembali saat pengunjung
> mengganti bahasa.

---

## 11. Yang perlu dikonfirmasi sebelum benar-benar live

Hal-hal berikut sengaja **tidak dicantumkan** di website, karena belum bisa
dipastikan kebenarannya. Website yang menawarkan jasa kepada Cargill dan Wilmar
tidak boleh memuat klaim yang bisa dibantah.

| Hal | Alasan belum dipakai | Yang dibutuhkan |
|---|---|---|
| **Sertifikasi ISO 9001:2015** | Unggahan audit di Instagram menyebut *Ratu Melati*, perusahaan saudara, bukan WIC | Nomor sertifikat atas nama WIC |
| **Angka "2641"** dari situs lama | Muncul tanpa keterangan, artinya tidak diketahui | Penjelasan artinya, misalnya jumlah kapal yang ditangani |
| **Foto testimoni** | Situs lama memakai foto stok orang asing, bukan Didi Setiadi, Agustino, atau Diki Taufan | Foto asli beserta izin pemakaian |
| **Akun Instagram** | Footer lama menautkan `@benua.group`, sedangkan akun grup yang aktif `@melati.group` | Konfirmasi akun mana yang benar |
| **Titik peta** | Peta memakai pencarian alamat, bukan titik persis | Tautan berbagi dari Google Maps |

Testimoni saat ini ditampilkan sebagai kartu kutipan dengan logo perusahaan klien,
tanpa foto orang.

---

## 12. Kalau ada masalah

| Gejala | Penyebab | Solusi |
|---|---|---|
| Foto tidak muncul | Folder `assets/` tidak ikut terunggah | Unggah ulang seluruh folder termasuk `assets/` |
| Kalkulator atau galeri diam saja | JavaScript diblokir pengaturan keamanan browser | Coba browser lain, atau pakai server lokal ([bagian 3](#3-cara-membuka-di-komputer-sendiri)) |
| Pilihan bahasa tidak diingat | Browser dalam mode penyamaran (incognito) | Normal — bahasa tetap berganti, hanya tidak tersimpan |
| Perubahan tidak kelihatan | Browser masih menampilkan versi lama dari ingatannya | Tekan **Ctrl + Shift + R** |
| Website tampil berantakan tanpa warna | `index.html` terpisah dari folder `assets/` | Pastikan keduanya selalu dalam satu folder |
| Halaman kosong putih | Ada kesalahan penulisan di `content.js` | Tekan **F12** di browser, lihat pesan merah di tab **Console** — di situ tertulis baris yang salah |

> **Tips paling berguna:** sebelum mengubah `content.js`, **salin dulu berkasnya**
> sebagai cadangan, misalnya `content-backup.js`. Kalau terjadi kesalahan,
> tinggal kembalikan yang lama.

---

## 13. Butuh update cepat dan presisi?

Untuk perubahan rutin — menambah foto galeri, memperbarui dokumentasi proyek,
mengganti angka pada kalkulator, menambah logo klien, atau membuat halaman baru —
pengerjaannya jauh lebih cepat dan hasilnya lebih rapi bila dikerjakan di
**Kaelyth Studio (Mark)**, yang membangun website ini dan paling memahami strukturnya.

Cukup kirimkan fotonya atau tulisannya. Perubahan langsung tayang, tanpa Anda perlu
menyentuh kode sama sekali, dan tanpa risiko website rusak karena salah ketik satu
tanda baca.

**Kaelyth Studio (Mark)** · rindenganmark@gmail.com
