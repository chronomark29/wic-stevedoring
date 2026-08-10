# PT. Wirama Indah Cigading — Website Handover Guide

Everything you need to run, edit and publish this website. No programming knowledge required for the common edits.

---

## 1. What this is

A complete, self-contained website. **No build step, no database, no WordPress, no plugins.** It is a folder of files. Upload the folder to any hosting and it works.

```
Wicstevedoring Site/
├── index.html          Beranda (homepage)
├── tentang.html        Tentang Kami
├── layanan.html        Layanan + pencari muatan
├── proyek.html         Proyek / rekam jejak
├── galeri.html         Galeri foto
├── kontak.html         Kontak + formulir penawaran
├── favicon.svg         Ikon tab browser
├── robots.txt          Instruksi untuk Google
├── sitemap.xml         Peta situs untuk Google
└── assets/
    ├── css/            Tampilan (4 file)
    ├── js/             Fungsi interaktif (7 file)
    ├── data/content.js ← EDIT DI SINI untuk mengubah isi
    └── img/            Semua foto & logo
```

---

## 2. How to preview it on your computer

Double-clicking `index.html` mostly works, but a few features need a local server. The reliable way:

```bash
python -m http.server 5173
```

Run that inside the site folder, then open `http://localhost:5173` in your browser.

---

## 3. How to publish it

Pick whichever suits you:

| Host | How |
|---|---|
| **cPanel / Niagahoster / Domainesia** | Open File Manager → `public_html` → upload the whole folder's contents → done |
| **Netlify** (free) | Go to app.netlify.com → drag the folder onto the page → done |
| **Vercel / Cloudflare Pages** (free) | Create a project → upload folder → done |

There is nothing to configure. No PHP, no Node, no database.

---

## 4. The edits you will actually make

### ⭐ Change the phone number, WhatsApp or email

Open `assets/data/content.js`. The very first block is:

```js
WIC.company = {
  phone: '+62 254 602424',
  phoneAlt: '+62 254 605604',
  whatsapp: '6281310121513',   // international format, no + and no spaces
  email: 'operation.wic@melati-group.com',
  ...
};
```

> ⚠️ The phone/email also appear as clickable links in the header and footer of each of the 6 HTML files. Search for `602424` and `operation.wic` across the HTML files and update those too. (Use "Find in all files" in any code editor.)

### ⭐ Adjust the discharge estimator to your real productivity

This is the site's headline feature, and **the numbers currently in it are conservative industry averages, not your audited figures.** Replace them with your own and the tool becomes genuinely accurate.

In `assets/data/content.js`, find `WIC.equipment`:

```js
{ id: 'ship-crane', name: {...}, rate: [4000, 6000] },   // MT per effective working day
{ id: 'shore-crane', name: {...}, rate: [6000, 10000] },
{ id: 'csu',         name: {...}, rate: [10000, 15000] },
{ id: 'bagged',      name: {...}, rate: [1500, 2500] },
```

Change the `[minimum, maximum]` pair for each method. Each cargo also carries a `factor` (e.g. coal `1.1`, raw sugar `0.85`) that adjusts the rate for how easily that commodity flows — tune those too if you wish.

The site always shows a disclaimer stating the result is indicative and not a formal quotation.

### Add or edit a project

In `content.js`, find `WIC.projects` and copy an existing block:

```js
{
  id: 'nama-unik',
  img: 'assets/img/projects/foto-anda.png',
  client: 'PT. Nama Klien',
  figure: '30.000', unit: 'MT',
  title: { id: 'Judul Indonesia', en: 'English Title' },
  desc:  { id: 'Penjelasan…',     en: 'Description…' },
  meta: [ { k: { id: 'Kapal', en: 'Vessel' }, v: 'Mv. Nama Kapal' } ]
}
```

Put the photo in `assets/img/projects/`.

### Add a gallery photo

1. Save the photo into `assets/img/gallery/` (name it `g16.jpg`, `g17.jpg`, …)
2. In `content.js`, add a line to `WIC.gallery`:

```js
{ f: 'g16.jpg', cat: 'operasi', cap: { id: 'Keterangan foto', en: 'Photo caption' } },
```

`cat` must be one of: `operasi`, `alat`, `kapal`, `tim`.

### Add a client logo

1. Save the logo into `assets/img/partners/`
2. Add to `WIC.partners`: `{ n: 'Nama Perusahaan', f: 'namafile.png' }`

### Change any wording on the site

All text lives in `assets/js/i18n.js`, in two lists: `id:` (Indonesian) and `en:` (English). Find the phrase, change it in **both** lists. For example:

```js
'hero.title': 'Menggerakkan Muatan Anda,<br>Menguatkan Bisnis Anda<span class="dot">.</span>',
```

---

## 5. Features built into the site

| Feature | Where | Notes |
|---|---|---|
| **Instant Discharge Estimator** | Homepage | Cargo + tonnage + method → estimated MT/day and days alongside, sent to WhatsApp in one tap |
| **Cargo Capability Finder** | Homepage + Layanan | All 15 commodities, filterable, each linked to the real project |
| **3-step quote request** | Kontak | Builds a complete, formatted WhatsApp message — no backend needed |
| **Bilingual ID / EN** | Every page | Header toggle; the choice is remembered on the visitor's device |
| **Photo gallery + lightbox** | Galeri | Filter by category; arrow keys and swipe supported |
| **Sticky mobile action bar** | Mobile, every page | Telepon · WhatsApp · Penawaran, always within thumb reach |
| **Scroll animations** | Every page | Reveal, parallax, pinned process, counters, logo marquee |
| **Self-updating figures** | Every page | "26+ tahun" is calculated from 1999 — it will never go stale |
| **SEO** | Every page | Unique titles/descriptions, Open Graph, LocalBusiness structured data, sitemap |
| **Accessibility** | Every page | Keyboard navigation, focus states, skip link, and full `prefers-reduced-motion` support |

---

## 6. Things to confirm before going fully live

These were deliberately **left out or flagged** rather than guessed, because a customer may check them:

1. **ISO 9001:2015** — the Melati Group Instagram shows an ISO audit, but the post names *Ratu Melati*, a sister company, not WIC. No ISO badge is shown anywhere on this site. If WIC holds its own certificate, send the certificate number and it can be added.
2. **The "2641" counter** from the old website — its label was never visible, so its meaning could not be verified. It has not been reused. If it means "vessels handled" or "shipments completed", tell us and it can go back in as a proper statistic.
3. **Testimonial photos** — the old site used stock photographs of people who are *not* Didi Setiadi, Agustino or Diki Taufan. Those images were not reused. Testimonials are now shown as quote cards with the client's company logo. If you have real photos with permission, they can be added.
4. **Instagram handle** — the old footer linked `@benua.group`; the group's actual account is `@melati.group`, which is what this site links to. Confirm which is correct.
5. **Map location** — the map uses a Google Maps address search for the office. If you want an exact pin, send the Google Maps share link.

---

## 7. Technical notes

- **One external request only:** the Plus Jakarta Sans font from Google Fonts. Everything else is local. To go 100 % offline, download the font, place it in `assets/fonts/`, and swap the `<link>` in each HTML `<head>` for an `@font-face` rule.
- **Header and footer are repeated in each of the 6 HTML files.** This is normal for a site with no build step. If you change a navigation link, change it in all six.
- **Browser support:** all current versions of Chrome, Edge, Firefox and Safari, desktop and mobile. With JavaScript disabled, all content still displays — only the animations and interactive tools stop.
- **Images** are the originals from the previous site. For the best loading speed, consider converting the largest ones in `assets/img/projects/` to WebP.

---

## 8. Quick troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Photos don't appear | Folder uploaded without `assets/` | Re-upload the whole folder including `assets/` |
| Estimator or gallery does nothing | JavaScript blocked, or files opened via `file://` | Serve over http (see section 2) |
| Language toggle does nothing | Browser private mode blocking `localStorage` | It still switches, it just won't be remembered |
| Edits don't show up | Browser cache | Press `Ctrl + Shift + R` |
