/* ==========================================================================
   lead.js — WhatsApp / email deep links + the 3-step quote request form.
   No backend: every enquiry is handed to WhatsApp (primary) or mailto
   (fallback) with the whole request pre-written.
   ========================================================================== */
window.WIC = window.WIC || {};

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Deep-link builders
     ------------------------------------------------------------------ */
  function waLink(message) {
    var num = (WIC.company && WIC.company.whatsapp) || '';
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(message);
  }

  function mailLink(subject, body) {
    var to = (WIC.company && WIC.company.email) || '';
    return 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  WIC.waLink = waLink;
  WIC.mailLink = mailLink;

  /* Wire any element with data-wa="<message key or literal>" */
  function initStaticWaLinks() {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      function sync() {
        var msg = el.getAttribute('data-wa');
        // Allow a dictionary key with the wa: prefix
        el.setAttribute('href', waLink(msg));
      }
      sync();
      document.addEventListener('wic:langchange', sync);
    });
  }

  /* ------------------------------------------------------------------
     3-step RFQ form
     ------------------------------------------------------------------ */
  function initRfq() {
    var form = document.querySelector('[data-rfq]');
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll('[data-rfq-step]'));
    var dots = Array.prototype.slice.call(form.querySelectorAll('[data-rfq-dot]'));
    var btnNext = form.querySelector('[data-rfq-next]');
    var btnBack = form.querySelector('[data-rfq-back]');
    var actionsFinal = form.querySelector('[data-rfq-final]');
    var counter = form.querySelector('[data-rfq-counter]');
    var reviewBox = form.querySelector('[data-rfq-review]');
    var waBtn = form.querySelector('[data-rfq-wa]');
    var mailBtn = form.querySelector('[data-rfq-mail]');
    var cargoSelect = form.querySelector('[name="cargo"]');
    var otherWrap = form.querySelector('[data-rfq-other]');

    var idx = 0;

    /* Populate the cargo dropdown from content.js */
    function fillCargo() {
      if (!cargoSelect || !WIC.cargo) return;
      var keep = cargoSelect.value;
      cargoSelect.innerHTML =
        '<option value="" disabled' + (keep ? '' : ' selected') + '>' + WIC.s('rfq.cargoPh') + '</option>' +
        WIC.cargo.map(function (c) {
          return '<option value="' + WIC.t(c.name) + '">' + WIC.t(c.name) + '</option>';
        }).join('') +
        '<option value="__other">' + WIC.s('rfq.other') + '…</option>';
      if (keep) cargoSelect.value = keep;
    }

    function toggleOther() {
      if (!otherWrap || !cargoSelect) return;
      var isOther = cargoSelect.value === '__other';
      otherWrap.hidden = !isOther;
      var input = otherWrap.querySelector('input');
      if (input) input.required = isOther;
    }

    function show(n) {
      idx = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach(function (s, i) { s.hidden = i !== idx; });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === idx);
        d.classList.toggle('is-done', i < idx);
      });
      if (counter) {
        counter.textContent = WIC.s('rfq.step') + ' ' + (idx + 1) + ' ' + WIC.s('rfq.of') + ' ' + steps.length;
      }
      if (btnBack) btnBack.hidden = idx === 0;
      var last = idx === steps.length - 1;
      if (btnNext) btnNext.hidden = last;
      if (actionsFinal) actionsFinal.hidden = !last;
      if (last) buildReview();

      // Keep the form in view when stepping on mobile
      var top = form.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top + 200) window.scrollTo({ top: top, behavior: 'smooth' });
    }

    /* Validate only the fields inside the current step */
    function validateStep() {
      var ok = true;
      steps[idx].querySelectorAll('input, select, textarea').forEach(function (input) {
        if (input.hidden || input.closest('[hidden]')) return;
        var field = input.closest('.field');
        var bad = input.required && !String(input.value).trim();
        if (input.type === 'number' && input.value) {
          var v = parseFloat(input.value);
          if (isNaN(v) || v <= 0) bad = true;
        }
        if (field) field.classList.toggle('has-error', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      return ok;
    }

    function data() {
      var fd = new FormData(form);
      var o = {};
      fd.forEach(function (v, k) {
        if (o[k]) { o[k] = [].concat(o[k], v); } else { o[k] = v; }
      });
      if (o.cargo === '__other') o.cargo = o.cargoOther || '—';
      return o;
    }

    /* The message that lands in WhatsApp */
    function buildMessage() {
      var d = data();
      var L = WIC.lang() === 'en'
        ? { h: 'QUOTE REQUEST — PT. Wirama Indah Cigading', cargo: 'Cargo', ton: 'Tonnage', svc: 'Services', vessel: 'Vessel', eta: 'ETA', port: 'Port', notes: 'Notes', from: 'From', co: 'Company', ph: 'Phone', em: 'Email', foot: 'Sent from wicstevedoring.com' }
        : { h: 'PERMINTAAN PENAWARAN — PT. Wirama Indah Cigading', cargo: 'Muatan', ton: 'Tonase', svc: 'Layanan', vessel: 'Kapal', eta: 'ETA', port: 'Pelabuhan', notes: 'Catatan', from: 'Dari', co: 'Perusahaan', ph: 'Telepon', em: 'Email', foot: 'Dikirim dari wicstevedoring.com' };

      var svc = [].concat(d.service || []).join(', ');
      // null = omit this line entirely; '' = deliberate blank line
      var lines = [
        '*' + L.h + '*',
        '',
        L.cargo + ': ' + (d.cargo || '—'),
        L.ton + ': ' + (d.tonnage ? Number(d.tonnage).toLocaleString('id-ID') + ' MT' : '—'),
        L.svc + ': ' + (svc || '—'),
        '',
        L.vessel + ': ' + (d.vessel || '—'),
        L.eta + ': ' + (d.eta || '—'),
        L.port + ': ' + (d.port || 'Cigading'),
        d.notes ? '' : null,
        d.notes ? L.notes + ': ' + d.notes : null,
        '',
        '---',
        L.from + ': ' + (d.name || '—'),
        L.co + ': ' + (d.company || '—'),
        L.ph + ': ' + (d.phone || '—'),
        d.email ? L.em + ': ' + d.email : null,
        '',
        L.foot
      ];
      return lines.filter(function (l) { return l !== null; }).join('\n');
    }

    function buildReview() {
      if (!reviewBox) return;
      var d = data();
      var svc = [].concat(d.service || []).join(', ');
      var rows = [
        [WIC.s('rfq.cargoType'), d.cargo],
        [WIC.s('rfq.tonnage'), d.tonnage ? Number(d.tonnage).toLocaleString('id-ID') + ' MT' : ''],
        [WIC.s('rfq.service'), svc],
        [WIC.s('rfq.vessel'), d.vessel],
        [WIC.s('rfq.eta'), d.eta]
      ].filter(function (r) { return r[1]; });

      reviewBox.innerHTML = rows.map(function (r) {
        return '<div class="review__row"><dt>' + r[0] + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>';
      }).join('') || '<p class="muted">—</p>';
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function syncLinks() {
      var msg = buildMessage();
      if (waBtn) waBtn.setAttribute('href', waLink(msg));
      if (mailBtn) {
        var subj = WIC.lang() === 'en'
          ? 'Quote Request — ' + (data().cargo || 'Cargo Handling')
          : 'Permintaan Penawaran — ' + (data().cargo || 'Bongkar Muat');
        mailBtn.setAttribute('href', mailLink(subj, msg));
      }
    }

    /* --- events --- */
    if (btnNext) btnNext.addEventListener('click', function () {
      if (validateStep()) show(idx + 1);
    });
    if (btnBack) btnBack.addEventListener('click', function () { show(idx - 1); });

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('has-error');
      if (idx === steps.length - 1) { buildReview(); }
      syncLinks();
    });
    form.addEventListener('change', function (e) {
      if (e.target === cargoSelect) toggleOther();
      syncLinks();
    });

    // Stop the form ever doing a native submit — links do the work
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    [waBtn, mailBtn].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        if (!validateStep()) { e.preventDefault(); return; }
        syncLinks();
      });
    });

    document.addEventListener('wic:langchange', function () {
      fillCargo();
      show(idx);
      syncLinks();
    });

    /* Allow other modules (the estimator) to pre-fill and jump here */
    WIC.prefillRfq = function (values) {
      Object.keys(values).forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        if (!el) return;
        if (el.tagName === 'SELECT') {
          var match = Array.prototype.find.call(el.options, function (o) { return o.value === values[k]; });
          el.value = match ? values[k] : el.value;
        } else {
          el.value = values[k];
        }
      });
      toggleOther();
      syncLinks();
      form.scrollIntoView({ behavior: WIC.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };

    fillCargo();
    toggleOther();
    show(0);
    syncLinks();
  }

  function boot() {
    initStaticWaLinks();
    initRfq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
