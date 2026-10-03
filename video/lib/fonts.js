/* ==========================================================================
   fonts.js — sajikan Plus Jakarta Sans dari @fontsource (lokal).

   Website memuat font dari Google Fonts. Di lingkungan render (container,
   CI, atau komputer tanpa internet) request itu bisa gagal dan Chromium
   diam-diam memakai font cadangan. Fungsi ini mencegat request ke Google
   Fonts dan menjawabnya dengan CSS @font-face yang menunjuk ke berkas
   woff2 lokal — font yang sama persis, hanya sumbernya yang berbeda.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const PKG = path.join(__dirname, '..', 'node_modules', '@fontsource', 'plus-jakarta-sans');
const WEIGHTS = [400, 500, 600, 700, 800];

function fontCss(baseUrl) {
  const filesUrl = baseUrl + '/video/node_modules/@fontsource/plus-jakarta-sans/files/';
  return WEIGHTS
    .map((w) => fs.readFileSync(path.join(PKG, w + '.css'), 'utf8'))
    .join('\n')
    .replace(/url\(\.\/files\//g, 'url(' + filesUrl);
}

async function routeGoogleFonts(context, baseUrl) {
  const css = fontCss(baseUrl);
  await context.route('**/fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css; charset=utf-8', body: css }));
  await context.route('**/fonts.gstatic.com/**', (route) => route.abort());
}

module.exports = { routeGoogleFonts, fontCss };
