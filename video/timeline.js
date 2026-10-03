/* ==========================================================================
   timeline.js — seluruh gerak video Reels WIC.

   Prinsip:
   - Satu master timeline GSAP yang di-pause. render.js memanggil
     window.__seek(t) per frame, jadi hasilnya deterministik.
   - Gerak yang lebih mudah ditulis sebagai fungsi waktu (shake, roll angka,
     dinding kata, ketikan URL, grain) dihitung di DERIVED, dipanggil setelah
     tl.seek() di setiap frame.
   - Semua waktu dalam detik dan mengikuti grid musik 120 BPM:
     1 beat = 0,5 s = 15 frame. Cut jatuh di beat.
   - cue(t, jenis) mencatat titik SFX. render.js menyimpannya ke
     build/cues.json dan audio.js membangkitkan suara tepat di titik itu.
   ========================================================================== */
(function () {
  'use strict';

  var FPS = 30;
  var DURATION = 29;
  var ORANGE = '#F58220';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var expoOut = gsap.parseEase('expo.out');
  var power3Out = gsap.parseEase('power3.out');
  var power2InOut = gsap.parseEase('power2.inOut');

  // immediateRender dibiarkan default (true untuk fromTo): setelah reset
  // progress(1)→progress(0) di init(), tiap elemen berada di nilai "from"
  // tween pertamanya, dan seek maju/mundur ke mana pun konsisten.
  var tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  var cues = [];
  var impacts = [];
  var DERIVED = [];

  function cue(t, type, extra) {
    var c = { t: Math.round(t * 1000) / 1000, type: type };
    if (extra) for (var k in extra) c[k] = extra[k];
    cues.push(c);
  }
  /* Impact visual: shake + punch zoom + chromatic aberration. */
  function hit(t, amp, sfx, extra) {
    impacts.push({ t: t, amp: amp });
    if (sfx) cue(t, sfx, Object.assign({ amp: amp }, extra || {}));
  }
  function scene(sel, t0, t1) {
    tl.set(sel, { visibility: 'visible' }, t0);
    tl.set(sel, { visibility: 'hidden' }, t1);
  }
  function flash(t, color, peak, dur) {
    tl.set('#flash', { backgroundColor: color }, t);
    tl.fromTo('#flash', { opacity: peak }, { opacity: 0, duration: dur, ease: 'power2.out' }, t);
  }
  /* Ukur lebar teks lalu atur font-size supaya pas selebar maxW. */
  function fit(el, maxW, maxFs) {
    el.style.fontSize = '100px';
    var w = el.getBoundingClientRect().width;
    var fs = Math.min(maxFs, 100 * maxW * 0.985 / w);
    el.style.fontSize = fs + 'px';
    return fs;
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ======================================================================
     BUILD — DOM yang dibangkitkan dan diukur (butuh font sudah termuat)
     ====================================================================== */
  var S1_DIGITS = '55.254';
  var S1_STOP = [];   // waktu tiap kolom angka berhenti
  var s1Cols = [];
  var s1FontPx = 0;

  var S3A = [
    { t: 5.0, w: 'GANDUM', img: '../assets/img/projects/wheat-gandum.png' },
    { t: 5.5, w: 'JAGUNG', bg: '#F58220', fg: '#071F4D' },
    { t: 6.0, w: 'SOYABEAN MEAL', img: '../assets/img/projects/soyabean-meal.png' },
    { t: 6.5, w: 'KEDELAI', bg: '#FFFFFF', fg: '#071F4D' },
    { t: 7.0, w: 'RAW SUGAR', img: '../assets/img/projects/raw-sugar.png' }
  ];
  var S3_WALL = ['GANDUM', 'JAGUNG', 'SOYABEAN MEAL', 'KEDELAI', 'RAW SUGAR',
    'BATUBARA', 'CLINKER', 'GARAM', 'PUPUK', 'BATU KAPUR', 'BATU SPLIT',
    'PASIR', 'BAHAN BAJA', 'PRODUK BAJA', 'MUATAN KARUNG'];
  var wallRows = [], wallT = [], wallTop = [], wallBottom = [], wallH = 0;

  var PARTNERS = ['cargill', 'wilmar', 'mayora', 'japfa', 'krakatau-port', 'petrokimia-gresik',
    'golden-grand-mills', 'grainland', 'cpi', 'malindo', 'farmsco', 'ipc',
    'sreeya', 'kjl', 'aplus', 'cabot'];

  var FEATS = [
    { t: 19.7,  x: 60,  y: 700,  txt: 'Responsif di HP' },
    { t: 20.35, x: 500, y: 930,  txt: 'Bilingual ID / EN' },
    { t: 21.0,  x: 60,  y: 1150, txt: 'Kalkulator estimasi' },
    { t: 21.65, x: 480, y: 1380, txt: 'WhatsApp 1 klik' }
  ];
  var URL_TXT = 'wicstevedoring.com';

  function build() {
    /* --- S1: kolom angka bergulir --- */
    var kapal = $('.s1-kapal');
    fit(kapal, 900, 190);
    var num = $('#s1num');
    num.style.fontSize = '290px';
    S1_DIGITS.split('').forEach(function (ch) {
      if (ch === '.') {
        var sep = document.createElement('div');
        sep.className = 'sep'; sep.textContent = '.';
        num.appendChild(sep);
        return;
      }
      var col = document.createElement('div');
      col.className = 'col';
      var strip = document.createElement('div');
      strip.className = 'strip';
      for (var i = 0; i < 30; i++) {
        var d = document.createElement('div');
        d.textContent = String(i % 10);
        strip.appendChild(d);
      }
      col.appendChild(strip);
      num.appendChild(col);
      s1Cols.push({ strip: strip, target: 20 + Number(ch) });
    });
    // Pastikan baris angka muat 920px
    var nw = num.getBoundingClientRect().width;
    s1FontPx = Math.min(290, 290 * 920 / nw);
    num.style.fontSize = s1FontPx + 'px';
    s1Cols.forEach(function (c, i) { S1_STOP.push(1.0 + i * 0.1); });

    fit($('.s1-who1'), 920, 140);
    fit($('.s8-q .a'), 920, 112);
    fit($('.s8-q .b'), 920, 170);
    fit($('.s1-who2'), 920, 250);

    /* --- S3: item fase A --- */
    var host = $('#s3items');
    S3A.forEach(function (it, i) {
      var el = document.createElement('div');
      el.className = 'item ' + (it.img ? 'photo' : 'type');
      if (it.img) {
        el.innerHTML =
          '<div class="bgblur"><img class="cover" src="' + it.img + '" alt=""></div>' +
          '<div class="card"><img src="' + it.img + '" alt=""></div>' +
          '<div class="word"><div class="m"><span class="display ca nowrap">' + it.w + '<i class="dot">.</i></span></div></div>';
      } else {
        el.innerHTML =
          '<div class="solid" style="background:' + it.bg + '"></div>' +
          '<div class="word"><div class="m"><span class="display nowrap" style="color:' + it.fg + '">' + it.w + '<i class="dot" style="color:' + (it.bg === '#F58220' ? '#fff' : ORANGE) + '">.</i></span></div></div>';
      }
      host.appendChild(el);
      var span = $('.word span', el);
      var fs = fit(span, 920, it.img ? 190 : 330);
      if (!it.img) {
        $('.word', el).style.top = (960 - fs * 0.5) + 'px';
      }
      it.el = el;
    });

    /* --- S3: dinding kata fase B --- */
    var wall = $('#s3wall');
    var y = 0;
    S3_WALL.forEach(function (w, i) {
      var row = document.createElement('div');
      row.className = 'row' + (i % 2 === 1 ? ' out' : '');
      var span = document.createElement('span');
      span.textContent = w;
      row.appendChild(span);
      wall.appendChild(row);
      span.style.display = 'inline-block';
      var fs = fit(span, 920, 240);
      row.style.fontSize = fs + 'px';
      span.style.fontSize = '';
      var h = fs * 0.84;
      wallTop.push(y); y += h; wallBottom.push(y);
      wallRows.push(row);
      wallT.push(i < 5 ? 7.5 + i * 0.03 : 7.5 + (i - 5) * 0.25);
    });
    wallH = y;

    /* --- S5: logo partner --- */
    var lg = $('#s5logos');
    PARTNERS.forEach(function (p) {
      var d = document.createElement('div');
      d.className = 'lg';
      d.style.height = '104px';
      d.innerHTML = '<img src="../assets/img/partners/' + p + '.png" alt="">';
      lg.appendChild(d);
    });

    /* --- S6: chip fitur --- */
    var fh = $('#s6feats');
    FEATS.forEach(function (f) {
      var d = document.createElement('div');
      d.className = 's6-feat';
      d.style.left = f.x + 'px';
      d.style.top = f.y + 'px';
      d.innerHTML = '<span class="ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' + f.txt;
      fh.appendChild(d);
      f.el = d;
    });

    /* --- S7: motto, tiap baris dipaskan lebar lalu ditumpuk di tengah --- */
    var lines = $$('.s7-line');
    var total = 0;
    lines.forEach(function (l) {
      l.style.display = 'inline-block';
      var fs = fit(l, 920, 230);
      l.style.display = 'block';
      l._h = fs * 0.92;
      total += l._h;
    });
    $('.s7-lines').style.top = (930 - total / 2) + 'px';

    /* --- Mask reveal: ruang bawah .m mengikuti ukuran font teksnya supaya
           ekor huruf (g, y, p) tidak terpotong --- */
    $$('.m').forEach(function (m) {
      var child = m.firstElementChild;
      var fs = parseFloat(getComputedStyle(child).fontSize);
      m.style.paddingBottom = (fs * 0.26).toFixed(1) + 'px';
      m.style.marginBottom = (-fs * 0.26).toFixed(1) + 'px';
    });

    /* --- Lambang: siapkan panjang garis untuk animasi "menggambar" --- */
    $$('.e-ring, .e-bar, .e-w').forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len + ' ' + len;
      p.style.strokeDashoffset = len;
      p._len = len;
    });
  }

  /* ======================================================================
     TIMELINE
     ====================================================================== */
  function compose() {
    /* ---------------- S1 · HOOK (0–3) ---------------- */
    scene('#s1', 0, 3.0);
    tl.set('#s1 .blk', { zIndex: 1 }, 0);
    tl.set('.s1-a, .s1-b', { zIndex: 2 }, 0);
    tl.fromTo('#s1 .bg', { scale: 1.32 }, { scale: 1.14, duration: 2.0, ease: 'power2.out' }, 0);
    tl.fromTo('#s1 .bg img', { scale: 1 }, { scale: 1.22, duration: 0.8, ease: 'power2.in' }, 2.0);

    // Frame 0 sudah terbaca: "1 KAPAL." tampil penuh, hanya mengendap dari skala sedikit lebih besar.
    tl.fromTo('.s1-kapal', { scale: 1.07, transformOrigin: '0% 100%' }, { scale: 1, duration: 0.45 }, 0);
    hit(0, 1.0, 'boom');

    tl.fromTo('#s1num', { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5);
    cue(0.5, 'roll', { dur: 0.9 });
    S1_STOP.forEach(function (te, i) { cue(te, 'tick', { amp: 0.6 + i * 0.1 }); });

    tl.fromTo('.s1-ton .bar', { scaleX: 0 }, { scaleX: 1, duration: 0.28 }, 1.5);
    tl.fromTo('.s1-ton span', { scale: 1.9, opacity: 0, rotation: -5 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.32, ease: 'back.out(2)' }, 1.5);
    hit(1.5, 0.85, 'stamp');
    flash(1.5, ORANGE, 0.35, 0.3);

    // Whip ke pertanyaan
    tl.to('.s1-a', { y: -340, opacity: 0, filter: 'blur(18px)', duration: 0.14, ease: 'power2.in' }, 1.87);
    cue(1.98, 'whoosh', { dur: 0.4 });
    tl.fromTo('.s1-who1', { yPercent: 140 }, { yPercent: 0, duration: 0.42 }, 2.0);
    tl.fromTo('.s1-who2', { yPercent: 140 }, { yPercent: 0, duration: 0.48 }, 2.08);
    tl.fromTo('.s1-who2 .dot', { scale: 1.6, rotation: 18, transformOrigin: '50% 80%' },
      { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, 2.5);
    cue(2.5, 'tick', { amp: 0.9 });
    cue(1.9, 'riser', { dur: 0.85 });
    // Jeda gelap sebelum drop
    tl.set('#s1 .blk', { opacity: 0.94 }, 2.75);
    tl.to('.s1-b', { scale: 0.93, duration: 0.25, ease: 'power2.in', transformOrigin: '0% 50%' }, 2.75);

    /* ---------------- S2 · LOGO DROP (3–5) ---------------- */
    scene('#s2', 3.0, 5.0);
    hit(3.0, 1.25, 'drop');
    flash(3.0, '#ffffff', 0.95, 0.4);
    tl.fromTo('#s2 .shock', { scale: 0.45, opacity: 1, borderWidth: 34 },
      { scale: 3.4, opacity: 0, borderWidth: 2, duration: 0.9 }, 3.0);
    tl.fromTo('#s2 .ring', { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, stagger: 0.06 }, 3.0);
    tl.fromTo('#s2 .glow', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0 }, 3.0);
    tl.fromTo('#s2', { scale: 1 }, { scale: 1.06, duration: 2.0, ease: 'none' }, 3.0);
    tl.fromTo('.s2-emblem', { scale: 0.15, rotation: -120, transformOrigin: '50% 50%' },
      { scale: 1, rotation: 0, duration: 0.75, ease: 'back.out(1.5)' }, 3.0);
    tl.to('.e-ring', { strokeDashoffset: 0, duration: 0.55, ease: 'power3.out' }, 3.03);
    tl.fromTo('.e-disc', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 3.08);
    tl.to('.e-bar', { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }, 3.2);
    tl.to('.e-w', { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 3.26);
    tl.fromTo('.e-glint', { x: -10 }, { x: 95, duration: 0.5, ease: 'power2.inOut' }, 3.8);
    cue(3.8, 'shimmer');
    tl.fromTo('.s2-eyebrow', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45 }, 3.32);
    tl.fromTo('.s2-title .m > span', { yPercent: 140 }, { yPercent: 0, duration: 0.6, stagger: 0.09 }, 3.36);
    tl.fromTo('.s2-chips .chip', { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: 0.12 }, 4.0);
    cue(4.0, 'pop'); cue(4.12, 'pop', { pitch: 1.2 });
    tl.fromTo('#leak', { opacity: 0 }, { opacity: 0.7, duration: 0.6, ease: 'power2.out' }, 3.0);
    tl.to('#leak', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 4.7);
    // Keluar: tembus lambang
    tl.to('.s2-emblem', { scale: 9, opacity: 0, duration: 0.25, ease: 'power3.in' }, 4.75);
    tl.to('.s2-text', { opacity: 0, y: 90, filter: 'blur(14px)', duration: 0.22, ease: 'power2.in' }, 4.75);
    cue(4.72, 'whoosh', { dur: 0.32 });

    /* ---------------- S3 · 15 JENIS MUATAN (5–11) ---------------- */
    scene('#s3', 5.0, 11.4);
    S3A.forEach(function (it, i) {
      var tEnd = i < S3A.length - 1 ? S3A[i + 1].t : 7.5;
      scene(it.el, it.t, tEnd);
      var word = $('.word .m > span', it.el);
      if (it.img) {
        var dir = i % 4 === 0 ? 1 : -1;
        tl.fromTo($('.card', it.el), { scale: 1.14, y: 50, rotation: 2.5 * dir },
          { scale: 1, y: 0, rotation: 0, duration: 0.45 }, it.t);
        tl.fromTo($('.card img', it.el), { scale: 1.18 }, { scale: 1.02, duration: 0.5, ease: 'power2.out' }, it.t);
        tl.fromTo($('.bgblur', it.el), { scale: 1.25 }, { scale: 1.05, duration: 0.5, ease: 'power2.out' }, it.t);
        tl.fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.36 }, it.t + 0.04);
        hit(it.t, 0.35, 'swish');
      } else {
        tl.fromTo(word, { scale: 1.4, opacity: 0, transformOrigin: '50% 50%' },
          { scale: 1, opacity: 1, duration: 0.3 }, it.t);
        hit(it.t, 0.55, 'hit');
      }
    });
    scene('#s3 .wallwrap', 7.5, 11.4);
    tl.fromTo('#s3 .wallbg', { scale: 1.2 }, { scale: 1.0, duration: 3.0, ease: 'power1.out' }, 7.5);
    for (var w = 5; w < S3_WALL.length; w++) cue(wallT[w], w === 5 ? 'hit' : 'tick', { amp: w === 5 ? 0.6 : 0.5 + (w - 5) * 0.04 });
    hit(7.5, 0.5);
    // "15"
    tl.set('.s3-fifteen', { visibility: 'visible' }, 10.0);
    tl.fromTo('.s3-fifteen .big', { scale: 2.6, opacity: 0, transformOrigin: '50% 60%' },
      { scale: 1, opacity: 1, duration: 0.38 }, 10.0);
    tl.fromTo('.s3-fifteen .lbl', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 10.14);
    tl.fromTo('.s3-fifteen .sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 10.3);
    tl.to('.s3-count', { opacity: 0, y: -30, duration: 0.25, ease: 'power2.in' }, 9.95);
    hit(10.0, 1.1, 'impact');
    flash(10.0, ORANGE, 0.45, 0.35);

    /* ---------------- S4 · 3 LAYANAN (11–15) ---------------- */
    scene('#s4', 11.0, 15.05);
    tl.fromTo('#s4', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.38, ease: 'expo.inOut' }, 10.9);
    cue(10.9, 'whoosh', { dur: 0.45 });
    tl.fromTo('.s4-eyebrow', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45 }, 11.12);
    tl.fromTo('.s4-title .m > span', { yPercent: 140 }, { yPercent: 0, duration: 0.6, stagger: 0.09 }, 11.15);
    var cards = $$('.s4-card');
    var cardT = [11.5, 12.5, 13.5];
    cards.forEach(function (c, i) {
      var t = cardT[i];
      tl.fromTo(c, { x: 260, opacity: 0, rotation: 3 }, { x: 0, opacity: 1, rotation: 0, duration: 0.55 }, t);
      tl.fromTo($('.ic', c), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, t + 0.08);
      tl.to($('.ic', c), { backgroundColor: ORANGE, duration: 0.2, ease: 'power1.out' }, t + 0.1);
      tl.to($('.ic svg', c), { stroke: '#ffffff', duration: 0.2, ease: 'power1.out' }, t + 0.1);
      if (i < cards.length - 1) {
        tl.to($('.ic', c), { backgroundColor: '#FFF1E2', duration: 0.3, ease: 'power1.out' }, cardT[i + 1] + 0.1);
        tl.to($('.ic svg', c), { stroke: '#D96C0C', duration: 0.3, ease: 'power1.out' }, cardT[i + 1] + 0.1);
      }
      cue(t, 'swoosh'); cue(t + 0.1, 'pop', { pitch: 0.9 + i * 0.15 });
    });
    // Jalur oranye + "muatan" yang berjalan antar layanan
    tl.set('.s4-line', { top: 800, left: 186 }, 11.0);
    tl.set('.s4-puck', { top: 800, left: 190 }, 11.0);
    tl.fromTo('.s4-puck', { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, 11.62);
    tl.to('.s4-puck', { top: 1056, duration: 0.5, ease: 'power2.inOut' }, 12.0);
    tl.to('.s4-line', { height: 256, duration: 0.5, ease: 'power2.inOut' }, 12.0);
    tl.to('.s4-puck', { top: 1312, duration: 0.5, ease: 'power2.inOut' }, 13.0);
    tl.to('.s4-line', { height: 512, duration: 0.5, ease: 'power2.inOut' }, 13.0);
    cue(12.0, 'sweep', { dur: 0.5 }); cue(13.0, 'sweep', { dur: 0.5, pitch: 1.2 });
    tl.fromTo('.s4-tag .m > span', { yPercent: 140 }, { yPercent: 0, duration: 0.55 }, 14.0);
    tl.to(cards, { scale: 1.035, duration: 0.14, ease: 'power2.out', stagger: 0.08, yoyo: true, repeat: 1 }, 14.0);
    cue(14.0, 'tick', { amp: 0.7 });
    // Whip ke kiri
    tl.to('#s4', { x: -1180, duration: 0.3, ease: 'power3.in' }, 14.75);
    cue(14.72, 'whip');

    /* ---------------- S5 · BUKTI (15–19) ---------------- */
    scene('#s5', 14.85, 19.25);
    tl.fromTo('#s5', { x: 1180 }, { x: 0, duration: 0.36, ease: 'power3.out' }, 14.85);
    tl.fromTo('#s5 .photo', { scale: 1.12 }, { scale: 1.0, duration: 4.2, ease: 'none' }, 14.85);
    function stat(sel, t0, t1, to) {
      tl.set(sel, { visibility: 'visible' }, t0 - 0.15);
      tl.fromTo(sel + ' .n', { scale: 1.45, opacity: 0, transformOrigin: '0% 100%' }, { scale: 1, opacity: 1, duration: 0.38 }, t0);
      tl.fromTo(sel + ' .cnt', { innerText: 0 }, { innerText: to, snap: { innerText: 1 }, duration: 0.65, ease: 'expo.out' }, t0);
      tl.fromTo(sel + ' .l .m > span', { yPercent: 140 }, { yPercent: 0, duration: 0.5 }, t0 + 0.1);
      if (t1) {
        tl.to(sel, { y: -90, opacity: 0, duration: 0.2, ease: 'power2.in' }, t1 - 0.05);
        tl.set(sel, { visibility: 'hidden' }, t1 + 0.2);
      }
      hit(t0, 0.85, 'impact', { soft: 1 });
      cue(t0 + 0.02, 'count', { dur: 0.6, n: to });
    }
    stat('#st1', 15.0, 16.0, 26);
    tl.set('.s5-years', { visibility: 'visible' }, 15.1);
    tl.fromTo('.s5-years', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, 15.1);
    tl.fromTo('.s5-years .fillbar', { width: '0%' }, { width: '100%', duration: 0.6, ease: 'power2.inOut' }, 15.15);
    tl.fromTo('.s5-years .pin', { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', stagger: 0.55 }, 15.15);
    cue(15.15, 'sweep', { dur: 0.6 });
    tl.to('.s5-years', { opacity: 0, y: 60, duration: 0.2, ease: 'power2.in' }, 15.95);
    tl.set('.s5-years', { visibility: 'hidden' }, 16.2);

    stat('#st2', 16.0, 17.0, 31);
    tl.set('#s5logos', { visibility: 'visible' }, 16.0);
    tl.fromTo('#s5logos .lg', { scale: 0.3, opacity: 0, y: 80 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: { each: 0.024, from: 'random' } }, 16.05);
    cue(16.05, 'popcorn', { n: 16, dur: 0.4 });
    tl.to('#s5logos .lg', { scale: 0.6, opacity: 0, duration: 0.18, ease: 'power2.in', stagger: { each: 0.008, from: 'center' } }, 16.88);
    tl.set('#s5logos', { visibility: 'hidden' }, 17.2);

    stat('#st3', 17.0, null, 3);
    tl.set('.s5-awards', { visibility: 'visible' }, 17.0);
    tl.fromTo('.s5-awards .a1', { x: -420, rotation: -35, opacity: 0 }, { x: 0, rotation: -10, opacity: 1, duration: 0.55 }, 17.05);
    tl.fromTo('.s5-awards .a3', { x: 420, rotation: 35, opacity: 0 }, { x: 0, rotation: 10, opacity: 1, duration: 0.55 }, 17.13);
    tl.fromTo('.s5-awards .a2', { y: 300, scale: 0.6, opacity: 0 }, { y: -20, scale: 1.04, opacity: 1, duration: 0.6 }, 17.21);
    cue(17.05, 'swoosh'); cue(17.13, 'swoosh', { pitch: 1.1 }); cue(17.21, 'swoosh', { pitch: 1.25 });
    // Sorot Zero Accident
    tl.to('.s5-awards .a1', { x: -120, opacity: 0.35, duration: 0.5, ease: 'expo.out' }, 18.0);
    tl.to('.s5-awards .a3', { x: 120, opacity: 0.35, duration: 0.5, ease: 'expo.out' }, 18.0);
    tl.to('.s5-awards .a2', { scale: 1.2, y: -30, duration: 0.5, ease: 'back.out(2)' }, 18.0);
    tl.set('.s5-za', { visibility: 'visible' }, 18.05);
    tl.fromTo('.s5-za', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 18.05);
    cue(18.0, 'ding');
    hit(18.0, 0.4);

    /* ---------------- S6 · WEBSITE BARU (19–23) ---------------- */
    scene('#s6', 18.85, 23.1);
    tl.fromTo('#s6', { clipPath: 'circle(0% at 50% 62%)' }, { clipPath: 'circle(140% at 50% 62%)', duration: 0.5, ease: 'power3.inOut' }, 18.85);
    tl.to('#s5', { scale: 0.9, opacity: 0.4, duration: 0.45, ease: 'power2.in' }, 18.8);
    cue(18.82, 'whoosh', { dur: 0.5 });
    tl.fromTo('#s6 .eyebrow', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45 }, 19.1);
    tl.fromTo('.laptop', { x: 340, y: -60, rotation: 8, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.8 }, 19.05);
    tl.fromTo('.phone', { y: 1000, rotation: -10 }, { y: 0, rotation: 0, duration: 0.75 }, 19.0);
    cue(19.0, 'swoosh', { pitch: 0.8 });
    // Scroll halaman: 1 px CSS situs = 456/390 px di layar HP
    var k = 498 / 390;
    var flicks = [[19.6, 560], [20.25, 1250], [20.9, 2050], [21.55, 2950]];
    flicks.forEach(function (f) {
      tl.to('.phone .page', { y: -f[1] * k, duration: 0.55, ease: 'expo.out' }, f[0]);
      cue(f[0], 'swipe');
    });
    tl.set('.phone .hdr', { visibility: 'visible' }, 19.62);
    FEATS.forEach(function (f) {
      tl.fromTo(f.el, { scale: 0.4, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' }, f.t);
      cue(f.t, 'pop', { pitch: 1.1 });
    });
    // Ketuk tombol WhatsApp di bar aksi
    tl.set('.phone .tap', { left: 249, top: 1010 }, 19.0);
    tl.fromTo('.phone .tap', { scale: 0.3, opacity: 1 }, { scale: 1.7, opacity: 0, duration: 0.45, ease: 'power2.out' }, 22.2);
    tl.to(FEATS[3].el, { scale: 1.1, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }, 22.2);
    cue(22.2, 'click');
    for (var c = 0; c < URL_TXT.length; c++) cue(19.25 + c * (0.7 / URL_TXT.length), 'type', { amp: 0.5 + ((c * 7) % 5) * 0.08 });
    // Keluar: dorong maju
    tl.to('#s6 .phone, #s6 .laptop, #s6 .s6-head, #s6feats', { scale: 1.18, opacity: 0, filter: 'blur(16px)', duration: 0.24, ease: 'power3.in' }, 22.78);
    cue(22.76, 'whoosh', { dur: 0.3 });

    /* ---------------- S7 · MOTTO (23–25) ---------------- */
    scene('#s7', 23.0, 25.0);
    var lt = [23.0, 23.5, 24.0];
    $$('.s7-line').forEach(function (l, i) {
      tl.fromTo(l, { scale: 2.3, opacity: 0, filter: 'blur(22px)', transformOrigin: '0% 50%' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.3 }, lt[i]);
      if (i < 2) tl.to(l, { opacity: 0.38, duration: 0.15, ease: 'power1.out' }, lt[i + 1]);
      hit(lt[i], i === 2 ? 1.3 : 1.0, 'stomp', { n: i });
    });
    tl.to('.s7-line', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 24.5);
    tl.fromTo('.s7-lines', { scale: 1 }, { scale: 1.05, duration: 0.5, ease: 'power2.out', transformOrigin: '50% 50%' }, 24.5);
    flash(24.5, ORANGE, 0.4, 0.3);
    hit(24.5, 0.7);
    ['.p1', '.p2', '.p3'].forEach(function (p, i) {
      var t0 = lt[i], t1 = i < 2 ? lt[i + 1] : 25.0;
      scene('#s7 .ph' + p, t0, t1);
      tl.fromTo('#s7 .ph' + p + ' img', { scale: 1.18 }, { scale: 1.04, duration: t1 - t0, ease: 'power1.out' }, t0);
    });

    /* ---------------- S8 · CTA (25–29) ---------------- */
    scene('#s8', 25.0, DURATION + 1);
    flash(25.0, '#ffffff', 0.85, 0.35);
    hit(25.0, 0.9, 'impact');
    tl.fromTo('#leak', { opacity: 0 }, { opacity: 0.55, duration: 0.8, ease: 'power2.out' }, 25.0);
    tl.fromTo('.s8-brand', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.55 }, 25.1);
    tl.fromTo('.s8-q .a', { yPercent: 140 }, { yPercent: 0, duration: 0.55 }, 25.05);
    tl.fromTo('.s8-q .b', { yPercent: 140 }, { yPercent: 0, duration: 0.6 }, 25.16);
    tl.fromTo('.s8-card', { y: 140, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.65 }, 25.6);
    cue(25.6, 'swoosh', { pitch: 0.9 });
    tl.fromTo('.s8-row', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.12 }, 25.72);
    cue(25.75, 'tick', { amp: 0.5 }); cue(25.87, 'tick', { amp: 0.55 }); cue(25.99, 'tick', { amp: 0.6 });
    tl.fromTo('.s8-btn', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)' }, 26.25);
    cue(26.25, 'pop', { pitch: 0.85 });
    tl.fromTo('.s8-btn .shine', { x: -260 }, { x: 1100, duration: 0.55, ease: 'power2.inOut' }, 26.6);
    cue(26.6, 'shimmer');
    tl.to('.s8-btn', { scale: 1.05, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, 27.0);
    hit(27.0, 0.75, 'impact', { final: 1 });
    tl.fromTo('.s8-credit', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 27.15);
    tl.fromTo('.s8-btn .shine', { x: -260 }, { x: 1100, duration: 0.55, ease: 'power2.inOut', immediateRender: false }, 27.6);
    tl.fromTo('#s8 .s8-q, #s8 .s8-card, #s8 .s8-btn, #s8 .s8-brand', { scale: 1 }, { scale: 1.025, duration: 1.4, ease: 'none', transformOrigin: '50% 50%' }, 27.0);
    // Loop: kembali ke foto kapal malam yang sama dengan frame 0
    tl.to('#s8 .s8-q, #s8 .s8-card, #s8 .s8-btn, #s8 .s8-brand, #s8 .s8-credit',
      { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' }, 28.4);
    tl.to('#leak', { opacity: 0, duration: 0.4 }, 28.4);
    tl.fromTo('#s8 .loopbg', { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1.32, duration: 0.6, ease: 'power2.in' }, 28.4);
    cue(28.35, 'reverse', { dur: 0.65 });

    /* ---------------- FX global ---------------- */
    // Vinyet dan grain lebih tipis di scene terang
    tl.to('#vignette', { opacity: 0.35, duration: 0.3, ease: 'none' }, 10.95);
    tl.to('#vignette', { opacity: 1, duration: 0.3, ease: 'none' }, 14.85);
    tl.to('#vignette', { opacity: 0.35, duration: 0.3, ease: 'none' }, 18.9);
    tl.to('#vignette', { opacity: 1, duration: 0.2, ease: 'none' }, 22.9);
    tl.to('#grain', { opacity: 0.07, duration: 0.3, ease: 'none' }, 10.95);
    tl.to('#grain', { opacity: 0.11, duration: 0.3, ease: 'none' }, 14.85);
    tl.to('#grain', { opacity: 0.07, duration: 0.3, ease: 'none' }, 18.9);
    tl.to('#grain', { opacity: 0.11, duration: 0.2, ease: 'none' }, 22.9);
  }

  /* ======================================================================
     DERIVED — dihitung ulang dari t di setiap frame
     ====================================================================== */
  var world, stage, grainCtx, grainImg;

  // S1: roll angka
  DERIVED.push(function (t) {
    if (t > 3.1) return;
    var h = s1FontPx;
    s1Cols.forEach(function (c, i) {
      var p = clamp((t - 0.5) / (S1_STOP[i] - 0.5), 0, 1);
      var idx = power3Out(p) * c.target;
      var p2 = clamp((t + 1 / 60 - 0.5) / (S1_STOP[i] - 0.5), 0, 1);
      var vel = (power3Out(p2) * c.target - idx) * 60;   // baris per detik
      c.strip.style.transform = 'translateY(' + (-idx * h).toFixed(2) + 'px)';
      c.strip.style.filter = vel > 0.5 ? 'blur(' + Math.min(14, vel * 0.12).toFixed(2) + 'px)' : 'none';
    });
  });

  // S3: penghitung muatan + dinding kata
  var s3n, s3count, wallEl;
  DERIVED.push(function (t) {
    if (t < 4.9 || t > 11.5) return;
    var n = 0;
    S3A.forEach(function (it, i) { if (t >= it.t) n = i + 1; });
    for (var i = 5; i < wallT.length; i++) if (t >= wallT[i]) n = i + 1;
    s3n.textContent = pad2(Math.max(1, n));
    var lastT = 5.0;
    S3A.forEach(function (it) { if (t >= it.t) lastT = it.t; });
    for (var j = 5; j < wallT.length; j++) if (t >= wallT[j]) lastT = wallT[j];
    var dt = t - lastT;
    s3count.style.transform = 'scale(' + (1 + 0.14 * Math.exp(-dt * 14)).toFixed(4) + ')';

    if (t < 7.45) return;
    // indeks baris aktif
    var k = 5;
    for (var r = 5; r < wallT.length; r++) if (t >= wallT[r]) k = r;
    wallRows.forEach(function (row, i) {
      var ti = wallT[i];
      var op = 0, active = false, x = 0, y = 0;
      if (t >= ti) {
        var p = expoOut(clamp((t - ti) / 0.22, 0, 1));
        if (i < 5) { op = 0.3 * p; y = (1 - p) * 60; }
        else {
          active = (i === k) && t < 10.0;
          op = active ? p : 0.3;
          x = (1 - p) * (i % 2 ? 140 : -140);
        }
      }
      if (t >= 10.0) op = Math.min(op, 0.22);
      row.style.opacity = op.toFixed(3);
      row.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      if (row.classList.contains('out')) {
        row.style.webkitTextStroke = '3px ' + (active ? ORANGE : 'rgba(255,255,255,.9)');
      } else {
        row.style.color = active ? ORANGE : '#fff';
      }
    });
    // kamera dinding
    var target = function (i) { return Math.min(430, 1430 - wallBottom[i]); };
    var pk = expoOut(clamp((t - wallT[k]) / 0.24, 0, 1));
    var y0 = k > 5 ? target(k - 1) : target(5);
    var wy = lerp(y0, target(k), pk);
    var s = 1, blur = 0;
    if (t >= 10.0) {
      var pz = expoOut(clamp((t - 10.0) / 0.45, 0, 1));
      var sz = Math.min(1, 1250 / wallH);
      s = lerp(1, sz, pz);
      wy = lerp(wy, 960 - wallH * sz / 2, pz);
      blur = 5 * pz;
    }
    wallEl.style.transform = 'translateY(' + wy.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
    wallEl.style.filter = blur > 0 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
    // denyut latar tiap ketukan
    var beatT = Math.floor(t * 2) / 2;
    var pulse = 1 + 0.035 * Math.exp(-(t - beatT) * 9);
    $('#s3 .wallbg img').style.transform = 'scale(' + pulse.toFixed(4) + ')';
  });

  // S6: ketikan URL + kursor + HP mengambang
  var urlEl, caretEl, phoneScr;
  DERIVED.push(function (t) {
    if (t < 18.8 || t > 23.2) return;
    var n = clamp(Math.floor((t - 19.25) / 0.7 * URL_TXT.length) + 1, 0, URL_TXT.length);
    if (t < 19.25) n = 0;
    urlEl.textContent = URL_TXT.slice(0, n);
    var typing = t >= 19.25 && t < 19.95;
    caretEl.style.opacity = typing || Math.floor(t * 3) % 2 === 0 ? 1 : 0;
    phoneScr.style.transform = 'translateY(' + (Math.sin((t - 19) * 2.4) * 7).toFixed(2) + 'px)';
  });

  // Whip pan: blur searah gerak (SVG feGaussianBlur dengan deviasi X saja)
  var WHIPS = [{ t0: 14.72, t1: 15.2, sels: ['#s4', '#s5'], max: 70 }];
  var whipBlur;
  DERIVED.push(function (t) {
    WHIPS.forEach(function (w) {
      var on = t > w.t0 && t < w.t1;
      var amt = on ? Math.sin(Math.PI * (t - w.t0) / (w.t1 - w.t0)) * w.max : 0;
      whipBlur.setAttribute('stdDeviation', amt.toFixed(2) + ' 0');
      w.sels.forEach(function (sel) { $(sel).style.filter = on && amt > 0.5 ? 'url(#mbx)' : ''; });
    });
  });

  // Shake + punch + chromatic aberration dari daftar impact
  DERIVED.push(function (t) {
    var x = 0, y = 0, r = 0, s = 0, rgb = 0;
    impacts.forEach(function (im, i) {
      var dt = t - im.t;
      if (dt < 0 || dt > 0.8) return;
      var e = im.amp * Math.exp(-dt * 7.5);
      x += e * 26 * Math.sin(dt * 92 + i * 1.7);
      y += e * 20 * Math.cos(dt * 79 + i * 2.3);
      r += e * 0.85 * Math.sin(dt * 61 + i);
      s += im.amp * 0.045 * Math.exp(-dt * 11);
      rgb += im.amp * 18 * Math.exp(-dt * 11);
    });
    world.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) rotate(' + r.toFixed(3) + 'deg) scale(' + (1 + s).toFixed(4) + ')';
    stage.style.setProperty('--rgb', rgb.toFixed(2));
    stage.style.setProperty('--caa', rgb > 0.4 ? '1' : '0');
  });

  // Film grain — acak tapi deterministik per frame
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  DERIVED.push(function (t) {
    var frame = Math.round(t * FPS);
    var rnd = mulberry32(frame * 7919 + 13);
    var d = grainImg.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = (rnd() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    grainCtx.putImageData(grainImg, 0, 0);
  });

  /* ======================================================================
     API untuk render.js
     ====================================================================== */
  function seek(t) {
    tl.seek(t, false);
    for (var i = 0; i < DERIVED.length; i++) DERIVED[i](t);
  }

  function init() {
    world = $('#world');
    stage = $('#stage');
    s3n = $('#s3n');
    s3count = $('.s3-count');
    wallEl = $('#s3wall');
    urlEl = $('#s6url');
    caretEl = $('.s6-url .caret');
    phoneScr = $('.phone');
    whipBlur = $('#mbxb');
    var cv = $('#grain');
    grainCtx = cv.getContext('2d');
    grainImg = grainCtx.createImageData(cv.width, cv.height);

    build();
    compose();
    // Lewati seluruh timeline sekali lalu kembali ke 0 supaya GSAP mencatat
    // semua nilai awal dengan urutan yang benar (penting untuk seek acak).
    tl.progress(1, true).progress(0, true);
    cues.sort(function (a, b) { return a.t - b.t; });

    window.__duration = DURATION;
    window.__fps = FPS;
    window.__cues = cues;
    window.__impacts = impacts;
    window.__seek = seek;
    seek(0);
    window.__ready = true;

    var q = new URLSearchParams(location.search);
    if (q.has('t')) seek(parseFloat(q.get('t')));
    if (q.has('play')) {
      var t0 = performance.now();
      (function loop(now) {
        seek(((now - t0) / 1000) % DURATION);
        requestAnimationFrame(loop);
      })(t0);
    }
  }

  function waitImages() {
    return Promise.all(Array.prototype.map.call(document.images, function (img) {
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    }));
  }

  document.fonts.ready
    .then(waitImages)
    .then(function () { init(); })
    .catch(function (e) { window.__error = String(e && e.stack || e); });
})();
