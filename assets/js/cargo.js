/* ==========================================================================
   cargo.js — Cargo Capability Finder.
   Filterable grid of every commodity WIC handles; selecting one reveals the
   handling method, the equipment used, and the matching real project.
   ========================================================================== */
(function () {
  'use strict';

  /* Inline icons, keyed to WIC.cargo[].icon */
  var ICONS = {
    wheat: '<path d="M12 22V9"/><path d="M12 9C12 6 10 3 7 2c-1 3 1 6 5 7Z"/><path d="M12 9c0-3 2-6 5-7 1 3-1 6-5 7Z"/><path d="M12 15c0-3 2-5 5-6 1 3-1 5-5 6Z"/><path d="M12 15c0-3-2-5-5-6-1 3 1 5 5 6Z"/>',
    seed: '<path d="M12 21c-4 0-7-3-7-7 0-5 4-9 9-11 1 6-1 12-5 15"/><path d="M12 21c4 0 7-3 7-7"/>',
    sugar: '<rect x="3" y="7" width="8" height="8" rx="1"/><rect x="12" y="11" width="8" height="8" rx="1"/><path d="M6 7V5m3 2V5"/>',
    coal: '<path d="M4 15l4-7 4 3 3-5 5 9-2 4H6Z"/>',
    rock: '<path d="M3 16l4-9 6 2 3-4 5 6-2 7H5Z"/><path d="M7 7l6 2"/>',
    steel: '<path d="M3 8h18M3 16h18"/><path d="M6 8v8m6-8v8m6-8v8"/>',
    bag: '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.rock) + '</svg>';
  }

  function init() {
    var root = document.querySelector('[data-cargo-finder]');
    if (!root || !window.WIC || !WIC.cargo) return;

    var grid = root.querySelector('[data-cargo-grid]');
    var panel = root.querySelector('[data-cargo-panel]');
    var filters = root.querySelectorAll('[data-cargo-filter]');
    var selectedId = WIC.cargo[0].id;
    var filter = 'all';

    function renderGrid() {
      grid.innerHTML = WIC.cargo
        .filter(function (c) { return filter === 'all' || c.cat === filter; })
        .map(function (c) {
          var on = c.id === selectedId ? ' is-selected' : '';
          return '' +
            '<button type="button" class="cargo-chip' + on + '" data-cargo-id="' + c.id + '" ' +
                    'aria-pressed="' + (c.id === selectedId) + '">' +
              '<span class="cargo-chip__icon">' + icon(c.icon) + '</span>' +
              '<span class="cargo-chip__name">' + WIC.t(c.name) + '</span>' +
            '</button>';
        }).join('');
    }

    function renderPanel() {
      var c = WIC.cargo.find(function (x) { return x.id === selectedId; });
      if (!c) { panel.innerHTML = ''; return; }

      var equipNames = c.equipment.map(function (id) {
        var e = WIC.equipment.find(function (x) { return x.id === id; });
        return e ? '<li><span class="tick" aria-hidden="true"></span>' + WIC.t(e.name) + '</li>' : '';
      }).join('');

      var proj = c.project && WIC.projects.find(function (p) { return p.id === c.project; });
      var projHtml = proj ? '' +
        '<a class="cargo-panel__project" href="proyek.html#' + proj.id + '">' +
          '<img src="' + proj.img + '" alt="" loading="lazy" width="120" height="80">' +
          '<span>' +
            '<small>' + WIC.s('cargo.seeProject') + '</small>' +
            '<strong>' + WIC.t(proj.title) + '</strong>' +
          '</span>' +
          '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a>' : '';

      panel.innerHTML = '' +
        '<div class="cargo-panel__head">' +
          '<span class="cargo-panel__icon">' + icon(c.icon) + '</span>' +
          '<div>' +
            '<span class="badge ' + (c.cat === 'dry' ? '' : 'badge--accent') + '">' +
              WIC.s(c.cat === 'dry' ? 'misc.dryBulk' : 'misc.breakBulk') + '</span>' +
            '<h3>' + WIC.t(c.name) + '</h3>' +
          '</div>' +
        '</div>' +
        '<div class="cargo-panel__body">' +
          '<h4>' + WIC.s('cargo.method') + '</h4>' +
          '<p>' + WIC.t(c.method) + '</p>' +
          '<h4>' + WIC.s('cargo.equipment') + '</h4>' +
          '<ul class="ticklist">' + equipNames + '</ul>' +
          projHtml +
        '</div>';
    }

    function select(id, scroll) {
      selectedId = id;
      renderGrid();
      renderPanel();
      if (scroll && window.matchMedia('(max-width: 900px)').matches) {
        panel.scrollIntoView({ behavior: WIC.reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cargo-id]');
      if (btn) select(btn.getAttribute('data-cargo-id'), true);
    });

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.getAttribute('data-cargo-filter');
        filters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        var visible = WIC.cargo.filter(function (c) { return filter === 'all' || c.cat === filter; });
        if (visible.length && !visible.some(function (c) { return c.id === selectedId; })) {
          selectedId = visible[0].id;
        }
        renderGrid();
        renderPanel();
      });
    });

    document.addEventListener('wic:langchange', function () { renderGrid(); renderPanel(); });

    renderGrid();
    renderPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
