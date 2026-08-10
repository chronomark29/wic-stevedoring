# Redesain Website PT. Wirama Indah Cigading

Redesain lengkap website [wicstevedoring.com](https://wicstevedoring.com) — perusahaan jasa bongkar muat (PBM) di Pelabuhan Cigading, Cilegon, yang beroperasi sejak 1999.

Website lama dibangun dengan WordPress + Divi pada 2021 dan tidak pernah diperbarui. Versi ini dibangun ulang dari nol sebagai situs statis tanpa dependensi, dengan fokus mengubahnya dari brosur digital menjadi alat pencari pelanggan.

## Isi

| Folder / berkas | Keterangan |
|---|---|
| `index.html` + 5 halaman | Beranda, Tentang Kami, Layanan, Proyek, Galeri, Kontak |
| `assets/css/` | `base` (token desain) · `components` · `sections` · `animations` |
| `assets/js/` | `main` (mesin animasi scroll) · `i18n` · `estimator` · `cargo` · `gallery` · `lead` · `render` |
| `assets/data/content.js` | **Satu-satunya sumber data** — proyek, muatan, klien, penghargaan, tarif estimator |
| `assets/img/` | Foto operasional, 31 logo klien, penghargaan |
| `pitch/` | Sumber pitch deck (HTML → PDF) + skrip render |
| `Pitch-Deck-WIC.pdf` | Pitch deck 18 slide, Bahasa Indonesia |
| `README-HANDOVER.md` | Panduan serah terima untuk klien |
| `SALES-ONEPAGER.md` | Ringkasan penjualan satu halaman |
| `_reference/` | Tangkapan layar website lama (dokumentasi kondisi "sebelum") |

## Fitur

- **Kalkulator Estimasi Bongkar** — pilih komoditas, tonase, dan metode bongkar; keluar perkiraan produktivitas (MT/hari) dan lama sandar, lalu terkirim ke WhatsApp dalam format rapi
- **Pencari Kemampuan Muatan** — 15 komoditas dengan peralatan dan proyek terkait
- **Dwibahasa Indonesia / Inggris** — ganti seketika, tersimpan di `localStorage`
- **Formulir penawaran 3 langkah** — hasilnya jadi satu pesan WhatsApp
- **Animasi scroll** — `IntersectionObserver` + CSS, menghormati `prefers-reduced-motion`
- **Galeri** dengan lightbox beraksesibilitas keyboard
- **SEO** — meta per halaman, JSON-LD `LocalBusiness`, `sitemap.xml`

## Menjalankan

Situs statis murni, tanpa proses build:

```bash
python -m http.server 5211
```

Buka `http://127.0.0.1:5211/`.

## Membuat ulang pitch deck

```bash
cd pitch && node build-pdf.js
```

Butuh `playwright-core` dan Microsoft Edge. Menghasilkan `Pitch-Deck-WIC.pdf` beserta PNG tiap slide di `pitch/slides/`.

## Catatan data

Beberapa hal dari website lama sengaja **tidak** dicantumkan karena belum terverifikasi:

- **Sertifikasi ISO** — unggahan audit menyebut *Ratu Melati*, bukan WIC
- **Angka "2641"** — muncul tanpa keterangan pada situs lama
- **Foto testimoni** — situs lama memakai foto stok orang asing; diganti kutipan + logo perusahaan

Tarif pada kalkulator (`WIC.equipment[].rate` di `content.js`) adalah rentang perkiraan industri, **bukan** produktivitas terukur WIC. Perlu diganti dengan angka sebenarnya sebelum situs dipakai secara resmi.

---

Dikerjakan oleh Mark Jeshua Lightio El Rindengan · rindenganmark@gmail.com
