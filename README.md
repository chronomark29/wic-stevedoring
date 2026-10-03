# Website PT. Wirama Indah Cigading

Website resmi [wicstevedoring.com](https://wicstevedoring.com) — perusahaan jasa bongkar
muat (PBM) di Pelabuhan Cigading, Cilegon, yang beroperasi sejak 1999.

Dibangun sebagai **situs statis tanpa dependensi**: tidak ada WordPress, tidak ada
database, tidak ada plugin, tidak ada biaya lisensi berulang. Cukup satu folder yang
diunggah ke hosting mana pun.

> **Baru pertama kali membuka repo ini?**
> Baca **[PANDUAN-WEBSITE.md](PANDUAN-WEBSITE.md)** — panduan lengkap Bahasa Indonesia:
> cara mengunduh, menjalankan, mengubah isi, dan menayangkan website ini.
> Versi PDF siap cetak: **[Panduan-Website-WIC.pdf](Panduan-Website-WIC.pdf)**

---

## Isi repo

| Folder / berkas | Keterangan |
|---|---|
| `index.html` + 5 halaman | Beranda, Tentang Kami, Layanan, Proyek, Galeri, Kontak |
| `assets/css/` | `base` (token desain) · `components` · `sections` · `animations` |
| `assets/js/` | `main` (mesin animasi scroll) · `i18n` · `estimator` · `cargo` · `gallery` · `lead` · `render` |
| `assets/data/content.js` | **Satu-satunya sumber data** — proyek, muatan, klien, penghargaan, tarif estimator |
| `assets/img/` | Foto operasional, 31 logo klien, penghargaan |
| `PANDUAN-WEBSITE.md` | Panduan pemakaian lengkap, Bahasa Indonesia |
| `Panduan-Website-WIC.pdf` | Panduan yang sama dalam bentuk PDF A4 siap cetak |
| `panduan/` | Sumber PDF panduan (HTML + skrip render) — tidak memengaruhi website |
| `_reference/` | Tangkapan layar website lama, arsip kondisi "sebelum" |
| `video/` | Video Reels motion graphic 9:16 (sumber + hasil di `video/out/`) — tidak ikut ke website |

---

## Fitur

- **Kalkulator Estimasi Bongkar** — pilih komoditas, tonase, dan metode bongkar; keluar
  perkiraan produktivitas (MT/hari) dan lama sandar, lalu terkirim ke WhatsApp dalam
  format rapi
- **Pencari Kemampuan Muatan** — 15 komoditas dengan peralatan dan proyek terkait
- **Dwibahasa Indonesia / Inggris** — ganti seketika, tersimpan di `localStorage`
- **Formulir penawaran 3 langkah** — hasilnya jadi satu pesan WhatsApp
- **Animasi scroll** — `IntersectionObserver` + CSS, menghormati `prefers-reduced-motion`
- **Galeri** dengan lightbox beraksesibilitas keyboard
- **Tombol aksi tetap di HP** — Telepon · WhatsApp · Penawaran
- **Angka yang tidak pernah basi** — "26+ tahun" dihitung otomatis dari 1999
- **SEO** — meta per halaman, JSON-LD `LocalBusiness`, `sitemap.xml`

---

## Menjalankan di komputer

Situs statis murni, tanpa proses build:

```bash
python -m http.server 5211
```

Lalu buka `http://127.0.0.1:5211/`.

Langkah lengkapnya, termasuk kalau Python belum terpasang, ada di
[PANDUAN-WEBSITE.md bagian 3](PANDUAN-WEBSITE.md#3-cara-membuka-di-komputer-sendiri).

## Membuat ulang PDF panduan

Hanya diperlukan bila isi `panduan/panduan.html` diubah:

```bash
cd panduan && node build-pdf.js
```

Butuh `playwright-core` dan Microsoft Edge. Menghasilkan `Panduan-Website-WIC.pdf`
di akar repo beserta PNG tiap halaman di `panduan/halaman/`.

---

## Catatan data

Beberapa hal dari website lama sengaja **tidak** dicantumkan karena belum terverifikasi:

- **Sertifikasi ISO** — unggahan audit menyebut *Ratu Melati*, bukan WIC
- **Angka "2641"** — muncul tanpa keterangan pada situs lama
- **Foto testimoni** — situs lama memakai foto stok orang asing; diganti kutipan + logo perusahaan

Tarif pada kalkulator (`WIC.equipment[].rate` di `content.js`) adalah rentang perkiraan
industri, **bukan** produktivitas terukur WIC. Perlu diganti dengan angka sebenarnya
sebelum situs dipakai secara resmi.

Rinciannya ada di
[PANDUAN-WEBSITE.md bagian 11](PANDUAN-WEBSITE.md#11-yang-perlu-dikonfirmasi-sebelum-benar-benar-live).

---

## Butuh update cepat dan presisi?

Untuk perubahan rutin — menambah foto galeri, memperbarui dokumentasi proyek, mengganti
angka pada kalkulator, atau membuat halaman baru — pengerjaannya jauh lebih cepat dan
hasilnya lebih rapi bila dikerjakan di **Kaelyth Studio (Mark)**, yang membangun website
ini dan paling memahami strukturnya. Cukup kirim fotonya atau tulisannya; perubahan
langsung tayang tanpa Anda perlu menyentuh kode.

**Kaelyth Studio (Mark)** · rindenganmark@gmail.com
