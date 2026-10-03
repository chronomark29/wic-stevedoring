/* ==========================================================================
   browser.js — buka Chromium lewat Playwright.

   Playwright dicari di node_modules lokal dulu, lalu di instalasi global.
   Di container cloud Chromium sudah ada di /opt/pw-browsers; di komputer
   lain Playwright memakai browser bawaannya sendiri.
   ========================================================================== */
const path = require('path');
const { execSync } = require('child_process');

function loadPlaywright() {
  try { return require('playwright'); } catch (e) { /* lanjut */ }
  try { return require('playwright-core'); } catch (e) { /* lanjut */ }
  const globalRoot = execSync('npm root -g').toString().trim();
  return require(path.join(globalRoot, 'playwright'));
}

async function launch() {
  const { chromium } = loadPlaywright();
  return chromium.launch({
    args: ['--force-color-profile=srgb', '--hide-scrollbars', '--disable-lcd-text']
  });
}

module.exports = { launch };
