/* ==========================================================================
   estimator.js — Instant Discharge Estimator.
   Cargo + tonnage + equipment  →  productivity band and days alongside,
   then one tap to send the whole spec as a quote request.

   Rate bands live in assets/data/content.js (WIC.equipment[].rate) and are
   multiplied by the cargo's flowability factor (WIC.cargo[].factor).
   ========================================================================== */
(function () {
  'use strict';

  var MIN_TON = 100;
  var MAX_TON = 200000;

  function init() {
    var root = document.querySelector('[data-estimator]');
    if (!root || !window.WIC || !WIC.cargo) return;

    var elCargo = root.querySelector('[data-est-cargo]');
    var elTon = root.querySelector('[data-est-ton]');
    var elEquipWrap = root.querySelector('[data-est-equip]');
    var elSubmit = root.querySelector('[data-est-submit]');
    var elResult = root.querySelector('[data-est-result]');
    var elEmpty = root.querySelector('[data-est-empty]');
    var elErr = root.querySelector('[data-est-error]');

    var outRate = root.querySelector('[data-est-rate]');
    var outDays = root.querySelector('[data-est-days]');
    var outMethod = root.querySelector('[data-est-method]');
    var outCargo = root.querySelector('[data-est-cargoname]');
    var outTon = root.querySelector('[data-est-tonout]');
    var ctaWa = root.querySelector('[data-est-wa]');
    var ctaForm = root.querySelector('[data-est-toform]');

    var last = null;

    /* ---------- populate ---------- */
    function fillCargo() {
      var keep = elCargo.value;
      elCargo.innerHTML =
        '<option value="" disabled' + (keep ? '' : ' selected') + '>' + WIC.s('rfq.cargoPh') + '</option>' +
        WIC.cargo.map(function (c) {
          return '<option value="' + c.id + '">' + WIC.t(c.name) + '</option>';
        }).join('');
      if (keep) elCargo.value = keep;
    }

    /* Only offer equipment that actually suits the selected cargo */
    function fillEquipment() {
      var cargo = WIC.cargo.find(function (c) { return c.id === elCargo.value; });
      var allowed = cargo ? cargo.equipment : WIC.equipment.map(function (e) { return e.id; });
      var keep = currentEquip();

      elEquipWrap.innerHTML = WIC.equipment
        .filter(function (e) { return allowed.indexOf(e.id) !== -1; })
        .map(function (e, i) {
          var id = 'eq-' + e.id;
          var checked = (keep === e.id || (!keep && i === 0)) ? ' checked' : '';
          return '' +
            '<div class="segmented__opt">' +
              '<input type="radio" name="est-equip" id="' + id + '" value="' + e.id + '"' + checked + '>' +
              '<label for="' + id + '">' +
                '<span class="dotmark" aria-hidden="true"></span>' +
                '<span>' + WIC.t(e.name) + '<small>' + WIC.t(e.note) + '</small></span>' +
              '</label>' +
            '</div>';
        }).join('');
    }

    function currentEquip() {
      var checked = elEquipWrap.querySelector('input[name="est-equip"]:checked');
      return checked ? checked.value : '';
    }

    /* ---------- calculate ---------- */
    function calculate() {
      var cargo = WIC.cargo.find(function (c) { return c.id === elCargo.value; });
      var ton = parseFloat(elTon.value);
      var equipId = currentEquip();
      var equip = WIC.equipment.find(function (e) { return e.id === equipId; });

      if (!cargo) return err(WIC.s('est.errCargo'));
      if (isNaN(ton) || ton < MIN_TON || ton > MAX_TON) return err(WIC.s('est.errTon'));
      if (!equip) return err(WIC.s('est.errEquip'));

      err(null);

      var rateLo = Math.round(equip.rate[0] * cargo.factor);
      var rateHi = Math.round(equip.rate[1] * cargo.factor);
      // Faster rate → fewer days, and vice versa
      var daysLo = Math.max(1, Math.ceil(ton / rateHi));
      var daysHi = Math.max(daysLo, Math.ceil(ton / rateLo));

      last = {
        cargo: cargo, ton: ton, equip: equip,
        rateLo: rateLo, rateHi: rateHi, daysLo: daysLo, daysHi: daysHi
      };
      render();
    }

    function err(msg) {
      if (!elErr) return;
      elErr.textContent = msg || '';
      elErr.hidden = !msg;
    }

    /* ---------- render ---------- */
    function render() {
      if (!last) return;
      if (elEmpty) elEmpty.hidden = true;
      elResult.hidden = false;
      elResult.classList.remove('pop-in');
      void elResult.offsetWidth; // restart the entry animation
      elResult.classList.add('pop-in');

      countTo(outRate, last.rateLo, last.rateHi);
      countTo(outDays, last.daysLo, last.daysHi, true);

      if (outMethod) outMethod.textContent = WIC.t(last.equip.name);
      if (outCargo) outCargo.textContent = WIC.t(last.cargo.name);
      if (outTon) outTon.textContent = last.ton.toLocaleString('id-ID') + ' MT';

      syncCtas();
    }

    /* Animated range readout: "4.000 – 6.000" */
    function countTo(el, lo, hi, plain) {
      if (!el) return;
      var fmt = function (n) { return plain ? String(n) : Math.round(n).toLocaleString('id-ID'); };
      if (WIC.reduceMotion) { el.textContent = fmt(lo) + ' – ' + fmt(hi); return; }

      var dur = 900, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(lo * eased) + ' – ' + fmt(hi * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(lo) + ' – ' + fmt(hi);
      }
      requestAnimationFrame(step);
    }

    function buildMessage() {
      if (!last) return '';
      var en = WIC.lang() === 'en';
      var L = en
        ? { h: 'QUOTE REQUEST (from the online estimator)', c: 'Cargo', t: 'Tonnage', m: 'Method', r: 'Estimated rate', d: 'Estimated duration', dd: 'working days', q: 'Please confirm availability and provide a formal quotation.', f: 'Sent from wicstevedoring.com' }
        : { h: 'PERMINTAAN PENAWARAN (dari kalkulator online)', c: 'Muatan', t: 'Tonase', m: 'Metode', r: 'Estimasi produktivitas', d: 'Estimasi lama bongkar', dd: 'hari kerja', q: 'Mohon konfirmasi ketersediaan dan penawaran resminya.', f: 'Dikirim dari wicstevedoring.com' };

      return [
        '*' + L.h + '*',
        '',
        L.c + ': ' + WIC.t(last.cargo.name),
        L.t + ': ' + last.ton.toLocaleString('id-ID') + ' MT',
        L.m + ': ' + WIC.t(last.equip.name),
        '',
        L.r + ': ' + last.rateLo.toLocaleString('id-ID') + ' – ' + last.rateHi.toLocaleString('id-ID') + ' MT/' + (en ? 'day' : 'hari'),
        L.d + ': ' + last.daysLo + ' – ' + last.daysHi + ' ' + L.dd,
        '',
        L.q,
        '',
        L.f
      ].join('\n');
    }

    function syncCtas() {
      if (ctaWa && WIC.waLink) ctaWa.setAttribute('href', WIC.waLink(buildMessage()));
    }

    /* Hand the estimate over to the full RFQ form */
    if (ctaForm) {
      ctaForm.addEventListener('click', function (e) {
        if (!last || !WIC.prefillRfq) return;
        e.preventDefault();
        WIC.prefillRfq({
          cargo: WIC.t(last.cargo.name),
          tonnage: String(last.ton)
        });
      });
    }

    /* ---------- events ---------- */
    elCargo.addEventListener('change', function () { fillEquipment(); if (last) calculate(); });
    elEquipWrap.addEventListener('change', function () { if (last) calculate(); });
    elTon.addEventListener('input', function () { if (last) calculate(); });
    elTon.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    });
    elSubmit.addEventListener('click', calculate);

    document.addEventListener('wic:langchange', function () {
      fillCargo();
      fillEquipment();
      if (last) {
        // Re-resolve the objects so names swap language
        last.cargo = WIC.cargo.find(function (c) { return c.id === last.cargo.id; });
        last.equip = WIC.equipment.find(function (e) { return e.id === last.equip.id; });
        render();
      }
    });

    fillCargo();
    fillEquipment();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
