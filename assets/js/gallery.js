/* ==========================================================================
   gallery.js — filterable photo grid + accessible lightbox.
   Keyboard: ← → to navigate, Esc to close. Focus is trapped while open and
   returned to the thumbnail that opened it.
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var root = document.querySelector('[data-gallery]');
    if (!root || !window.WIC || !WIC.gallery) return;

    var grid = root.querySelector('[data-gallery-grid]');
    var filters = root.querySelectorAll('[data-gallery-filter]');
    var limit = parseInt(root.getAttribute('data-gallery-limit'), 10) || WIC.gallery.length;
    var filter = 'all';
    var visible = [];
    var lastTrigger = null;

    /* ---------- grid ---------- */
    function list() {
      return WIC.gallery
        .filter(function (g) { return filter === 'all' || g.cat === filter; })
        .slice(0, limit);
    }

    function render() {
      visible = list();
      grid.innerHTML = visible.map(function (g, i) {
        return '' +
          '<button type="button" class="gal__item" data-gal-index="' + i + '" data-reveal="scale-in" data-delay="' + (i % 4) * 70 + '">' +
            '<img src="assets/img/gallery/' + g.f + '" alt="' + WIC.t(g.cap) + '" loading="lazy" decoding="async">' +
            '<span class="gal__cap">' + WIC.t(g.cap) + '</span>' +
            '<span class="gal__zoom" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>' +
            '</span>' +
          '</button>';
      }).join('');
      if (WIC.refreshReveal) WIC.refreshReveal();
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.getAttribute('data-gallery-filter');
        filters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      });
    });

    /* ---------- lightbox ---------- */
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.hidden = true;
    lb.innerHTML = '' +
      '<div class="lightbox__backdrop" data-lb-close></div>' +
      '<div class="lightbox__inner">' +
        '<button class="lightbox__btn lightbox__close" data-lb-close type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<button class="lightbox__btn lightbox__prev" data-lb-prev type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>' +
        '</button>' +
        '<button class="lightbox__btn lightbox__next" data-lb-next type="button">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>' +
        '</button>' +
        '<figure class="lightbox__figure">' +
          '<img alt="" data-lb-img>' +
          '<figcaption><span data-lb-cap></span><span class="lightbox__count" data-lb-count></span></figcaption>' +
        '</figure>' +
      '</div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('[data-lb-img]');
    var lbCap = lb.querySelector('[data-lb-cap]');
    var lbCount = lb.querySelector('[data-lb-count]');
    var current = 0;

    function syncLabels() {
      lb.querySelector('[data-lb-close]').setAttribute('aria-label', WIC.s('gal.close'));
      lb.querySelector('[data-lb-prev]').setAttribute('aria-label', WIC.s('gal.prev'));
      lb.querySelector('[data-lb-next]').setAttribute('aria-label', WIC.s('gal.next'));
    }

    function show(i) {
      if (!visible.length) return;
      current = (i + visible.length) % visible.length;
      var g = visible[current];
      lbImg.src = 'assets/img/gallery/' + g.f;
      lbImg.alt = WIC.t(g.cap);
      lbCap.textContent = WIC.t(g.cap);
      lbCount.textContent = (current + 1) + ' / ' + visible.length;
    }

    function open(i, trigger) {
      lastTrigger = trigger || null;
      syncLabels();
      show(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      lb.querySelector('[data-lb-close]').focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      lb.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      window.setTimeout(function () { lb.hidden = true; }, 250);
      if (lastTrigger) lastTrigger.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowLeft') { show(current - 1); return; }
      if (e.key === 'ArrowRight') { show(current + 1); return; }
      if (e.key === 'Tab') {
        // Trap focus inside the dialog
        var focusables = lb.querySelectorAll('button');
        var first = focusables[0];
        var lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-gal-index]');
      if (btn) open(parseInt(btn.getAttribute('data-gal-index'), 10), btn);
    });

    lb.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-close]')) close();
      else if (e.target.closest('[data-lb-prev]')) show(current - 1);
      else if (e.target.closest('[data-lb-next]')) show(current + 1);
    });

    /* Swipe on touch devices */
    var touchX = null;
    lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 55) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });

    document.addEventListener('wic:langchange', function () {
      render();
      syncLabels();
      if (!lb.hidden) show(current);
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
