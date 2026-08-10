/* ==========================================================================
   main.js — scroll engine, header, nav, counters, parallax
   No dependencies. Everything degrades gracefully.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDesktop = window.matchMedia('(min-width: 861px)');

  /* ---------------------------------------------------------------------
     1. Scroll reveal — one observer for every [data-reveal] on the page.
     --------------------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    // Apply per-element delay from data-delay, and index-based stagger
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--i', i);
      });
    });

    els.forEach(function (el) {
      var d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--reveal-delay', d + 'ms');
    });

    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target); // fire once
      });
      // threshold 0 fires on any intersection at all. A ratio-based threshold
      // silently fails for very short elements and for sections taller than
      // the viewport, so it is deliberately not used here.
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    els.forEach(function (el) { io.observe(el); });

    // Jaring pengaman. IntersectionObserver hanya melaporkan keadaan pada saat
    // callback-nya berjalan, bukan riwayatnya. Di perangkat lambat, callback
    // bisa kelaparan CPU saat pengunjung men-scroll cepat; begitu akhirnya
    // jalan, elemennya sudah lewat di atas layar dan dilaporkan "tidak
    // terlihat" — akibatnya opacity-nya tinggal 0 selamanya. Sapu apa pun yang
    // sudah berada sepenuhnya di atas viewport dan tampilkan langsung.
    catchUp();
    if (!catchUpBound) {
      catchUpBound = true;
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { ticking = false; catchUp(); });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('load', catchUp);
    }
  }

  /* Tampilkan elemen yang sudah terlewat di atas layar tanpa sempat terpicu. */
  var catchUpBound = false;
  function catchUp() {
    var pending = document.querySelectorAll('[data-reveal]:not(.is-in)');
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].getBoundingClientRect().bottom <= 0) {
        pending[i].classList.add('is-in');
      }
    }
  }

  /* ---------------------------------------------------------------------
     2. Headline word reveal — wrap each word so it can slide up from a mask.
        Uses [data-split] on the heading.
     --------------------------------------------------------------------- */
  // A "word" is a run of non-space characters, where any complete HTML tag
  // counts as part of the run. This keeps markup such as
  // `Business<span class="dot">.</span>` together as a single word instead of
  // splitting on the space inside the attribute.
  var WORD_RE = /(?:<[^>]*>|[^\s<])+/g;

  function initSplit() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.dataset.splitDone) return;
      var lines = el.innerHTML.split(/<br\s*\/?>/i);
      var w = 0;
      el.innerHTML = lines.map(function (line) {
        var words = (line.match(WORD_RE) || []).map(function (word) {
          return '<span class="split-word" style="--w:' + (w++) + '">' + word + '</span>';
        }).join(' ');
        return '<span class="split-line">' + words + '</span>';
      }).join('');
      el.dataset.splitDone = '1';
      el.classList.add('split-ready');
    });
  }

  // i18n replaces innerHTML, which wipes the word spans — re-split afterwards.
  function resplit() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      delete el.dataset.splitDone;
    });
    initSplit();
  }

  /* ---------------------------------------------------------------------
     3. Header — stuck state + scroll progress bar
     --------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var bar = document.querySelector('.scroll-progress');
    var waFloat = document.querySelector('.wa-float');
    if (!header) return;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle('is-stuck', y > 40);

      if (bar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(y / max, 1) : 0;
        bar.style.transform = 'scaleX(' + pct + ')';
      }
      if (waFloat) waFloat.classList.toggle('is-visible', y > 600);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------------------------------------------------------------------
     4. Mobile navigation drawer
     --------------------------------------------------------------------- */
  function initMobileNav() {
    var burger = document.querySelector('.burger');
    var drawer = document.querySelector('.mobile-nav');
    if (!burger || !drawer) return;

    drawer.querySelectorAll('.mobile-nav__links a').forEach(function (a, i) {
      a.style.setProperty('--i', i);
    });

    function setOpen(open) {
      burger.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
    });
    // Close if resized up to desktop while open
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && drawer.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------------
     5. Counters — animate to [data-count]. Supports data-since for the
        never-goes-stale "years of operation" figure.
     --------------------------------------------------------------------- */
  // Completed years since the founding date. WIC was founded 10 December 1999,
  // so a plain year subtraction would over-report by up to eleven months.
  function yearsSince(year, month /* 1-12 */, day) {
    var now = new Date();
    var y = now.getFullYear() - year;
    var m = (now.getMonth() + 1) - month;
    if (m < 0 || (m === 0 && now.getDate() < day)) y -= 1;
    return Math.max(0, y);
  }

  function animateCount(el) {
    var since = el.getAttribute('data-since');
    var target = since
      ? yearsSince(parseInt(since, 10),
                   parseInt(el.getAttribute('data-since-month') || '1', 10),
                   parseInt(el.getAttribute('data-since-day') || '1', 10))
      : parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    var suffix = el.getAttribute('data-suffix') || '';
    var useGrouping = el.getAttribute('data-group') !== 'false';

    function render(v) {
      var n = Math.round(v);
      el.textContent = (useGrouping ? n.toLocaleString('id-ID') : String(n)) + suffix;
    }

    if (reduceMotion) { render(target); return; }

    var dur = 1500, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      render(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll('[data-count], [data-since]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(animateCount);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     6. Parallax — single rAF loop for all [data-parallax] layers.
        data-parallax = speed multiplier (negative moves against scroll).
        Desktop only; disabled under reduced motion.
     --------------------------------------------------------------------- */
  function initParallax() {
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!layers.length || reduceMotion) return;

    var ticking = false;

    function apply() {
      ticking = false;
      if (!mqDesktop.matches) {
        layers.forEach(function (l) { l.style.setProperty('--py', '0px'); });
        return;
      }
      var vh = window.innerHeight;
      layers.forEach(function (l) {
        var rect = l.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(l.getAttribute('data-parallax')) || 0;
        // progress: -1 (below viewport) → 1 (above viewport)
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        l.style.setProperty('--py', (progress * speed * 100).toFixed(2) + 'px');
      });
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------------------------------------------------------------------
     7. Pinned process scroller — highlights the active step and fills a
        vertical rail as the section passes through the viewport.
     --------------------------------------------------------------------- */
  function initProcess() {
    var section = document.querySelector('[data-process]');
    if (!section) return;

    var steps = Array.prototype.slice.call(section.querySelectorAll('[data-step]'));
    var fill = section.querySelector('.process__rail-fill');
    var visuals = Array.prototype.slice.call(section.querySelectorAll('[data-step-visual]'));
    if (!steps.length) return;

    var ticking = false;

    function apply() {
      ticking = false;
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 when the section top hits the middle, 1 when its bottom does
      var total = rect.height - vh * 0.5;
      var scrolled = (vh * 0.5) - rect.top;
      var p = total > 0 ? Math.max(0, Math.min(scrolled / total, 1)) : 0;

      if (fill) fill.style.setProperty('--fill', (p * 100).toFixed(1) + '%');

      var active = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === active); });
      visuals.forEach(function (v, i) { v.classList.toggle('is-active', i === active); });
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------------------------------------------------------------------
     8. Marquee — duplicate the track content so the loop is seamless.
     --------------------------------------------------------------------- */
  function initMarquee() {
    document.querySelectorAll('.marquee__track').forEach(function (track) {
      if (track.dataset.cloned) return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = '1';
    });
  }

  /* ---------------------------------------------------------------------
     9. Mark the current page in the nav
     --------------------------------------------------------------------- */
  function initActiveNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-nav__links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href && href === here) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------------------------------------------------------------------
     10. Boot
     --------------------------------------------------------------------- */
  function boot() {
    initSplit();
    initReveal();
    initHeader();
    initMobileNav();
    initCounters();
    initParallax();
    initProcess();
    initMarquee();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('wic:langchange', function () {
    resplit();
    initActiveNav();
  });

  // Expose for modules that inject content and need to re-scan
  window.WIC = window.WIC || {};
  window.WIC.refreshReveal = initReveal;
  window.WIC.reduceMotion = reduceMotion;
})();
