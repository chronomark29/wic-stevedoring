#!/usr/bin/env bash
# ==========================================================================
# build.sh — bangun video Reels WIC dari nol sampai siap posting.
#
#   cd video
#   npm install          # sekali saja (gsap + font Plus Jakarta Sans)
#   bash build.sh        # ±15 menit; hasil di video/out/
#
# Butuh: Node 18+, ffmpeg, dan Playwright + Chromium
# (npm i -g playwright && npx playwright install chromium).
# ==========================================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "1/5  Memotret website…"
node capture-site.js

echo "2/5  Render frame 1080×1920 dengan motion blur…"
node render.js --sub 3

echo "3/5  Cover…"
node render.js --still 1.8 > /dev/null

echo "4/5  Sintesis musik + SFX…"
node audio.js

echo "5/5  Mixing, mastering, dan gabung ke MP4…"
node mix.js

echo "Selesai. Lihat folder video/out/"
