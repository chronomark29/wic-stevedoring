/* ==========================================================================
   render.js — renders the data collections from content.js into the page.
   Keeps every page's markup lean and makes content.js the single place to
   edit projects, awards, testimonials and the client list.
   ========================================================================== */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Projects ---------- */
  function renderProjects() {
    document.querySelectorAll('[data-projects]').forEach(function (host) {
      var limit = parseInt(host.getAttribute('data-projects'), 10) || WIC.projects.length;
      host.innerHTML = WIC.projects.slice(0, limit).map(function (p, i) {
        var meta = (p.meta || []).map(function (m) {
          return '<div class="proj-meta__row"><dt>' + esc(WIC.t(m.k)) + '</dt><dd>' + esc(WIC.t(m.v)) + '</dd></div>';
        }).join('');
        return '' +
          '<article class="card proj-card" id="' + p.id + '" data-reveal="fade-up" data-delay="' + (i % 3) * 110 + '">' +
            '<div class="proj-card__media">' +
              '<img src="' + p.img + '" alt="' + esc(WIC.t(p.title)) + '" loading="lazy" decoding="async">' +
              '<span class="proj-card__client">' + esc(WIC.t(p.client)) + '</span>' +
              '<div class="proj-card__figure"><b>' + esc(p.figure) + '</b>' +
                (p.unit ? '<span>' + esc(p.unit) + '</span>' : '') + '</div>' +
            '</div>' +
            '<div class="proj-card__body">' +
              '<h3>' + esc(WIC.t(p.title)) + '</h3>' +
              '<p>' + esc(WIC.t(p.desc)) + '</p>' +
              '<dl class="proj-meta">' + meta + '</dl>' +
            '</div>' +
          '</article>';
      }).join('');
    });
  }

  /* ---------- Awards ---------- */
  function renderAwards() {
    document.querySelectorAll('[data-awards]').forEach(function (host) {
      host.innerHTML = WIC.awards.map(function (a, i) {
        return '' +
          '<article class="card award-card" data-reveal="fade-up" data-delay="' + i * 110 + '">' +
            '<div class="award-card__img"><img src="' + a.img + '" alt="' + esc(WIC.t(a.title)) + '" loading="lazy" decoding="async"></div>' +
            '<span class="award-card__year">' + esc(a.year) + '</span>' +
            '<h3>' + esc(WIC.t(a.title)) + '</h3>' +
            '<p class="award-card__issuer">' + esc(a.issuer) + '</p>' +
            '<p style="margin-top:.6rem">' + esc(WIC.t(a.desc)) + '</p>' +
          '</article>';
      }).join('');
    });
  }

  /* ---------- Testimonials ---------- */
  function renderTestimonials() {
    document.querySelectorAll('[data-testimonials]').forEach(function (host) {
      host.innerHTML = WIC.testimonials.map(function (t, i) {
        return '' +
          '<article class="card testi-card" data-reveal="fade-up" data-delay="' + i * 110 + '">' +
            '<span class="testi-card__mark" aria-hidden="true">&ldquo;</span>' +
            '<blockquote>' + esc(WIC.t(t.quote)) + '</blockquote>' +
            '<div class="testi-card__foot">' +
              '<img class="testi-card__logo" src="' + t.logo + '" alt="' + esc(t.company) + '" loading="lazy" decoding="async">' +
              '<div class="testi-card__who"><b>' + esc(t.name) + '</b><span>' + esc(t.company) + '</span></div>' +
            '</div>' +
          '</article>';
      }).join('');
    });
  }

  /* ---------- Partner marquee (two rows, opposite directions) ---------- */
  function renderPartners() {
    document.querySelectorAll('[data-partners-row]').forEach(function (track) {
      var row = parseInt(track.getAttribute('data-partners-row'), 10);
      var half = Math.ceil(WIC.partners.length / 2);
      var items = row === 2 ? WIC.partners.slice(half) : WIC.partners.slice(0, half);
      track.innerHTML = items.map(function (p) {
        return '<div class="marquee__item"><img src="assets/img/partners/' + p.f + '" alt="' + esc(p.n) + '" loading="lazy" decoding="async"></div>';
      }).join('');
      delete track.dataset.cloned;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = '1';
    });
  }

  /* ---------- Static partner grid (about page) ---------- */
  function renderPartnerGrid() {
    document.querySelectorAll('[data-partner-grid]').forEach(function (host) {
      host.innerHTML = WIC.partners.map(function (p, i) {
        return '' +
          '<div class="partner-tile" data-reveal="scale-in" data-delay="' + (i % 6) * 55 + '" title="' + esc(p.n) + '">' +
            '<img src="assets/img/partners/' + p.f + '" alt="' + esc(p.n) + '" loading="lazy" decoding="async">' +
          '</div>';
      }).join('');
    });
  }

  function renderAll() {
    if (!window.WIC || !WIC.projects) return;
    renderProjects();
    renderAwards();
    renderTestimonials();
    renderPartners();
    renderPartnerGrid();
    if (WIC.refreshReveal) WIC.refreshReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
  document.addEventListener('wic:langchange', renderAll);
})();
