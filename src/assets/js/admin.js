/* ==========================================================================
   Back-office behaviours: sidebar, command palette, CRUD drawers, POS,
   check-in, calendar, daily closing, permission matrix, pricing simulator.
   ========================================================================== */
(function () {
  'use strict';
  var TP = window.TP, $ = TP.$, $$ = TP.$$;

  function sidebar() {
    var sb = $('.admin-sidebar'), ov = $('.sb-overlay');
    if (!sb) return;
    function open() { sb.classList.add('is-open'); ov.classList.add('is-open'); var f = $('.sb-link', sb); f && f.focus(); }
    function close() { sb.classList.remove('is-open'); ov.classList.remove('is-open'); }
    $$('.sb-open').forEach(function (b) { b.addEventListener('click', open); });
    $$('.sb-close').forEach(function (b) { b.addEventListener('click', close); });
    ov && ov.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    var collapsed = TP.store.get('sbCollapsed', {});
    $$('.sb-group', sb).forEach(function (g) {
      var key = g.getAttribute('data-group'), btn = $('button', g);
      var hasCurrent = !!$('[aria-current="page"]', g);
      if (collapsed[key] && !hasCurrent) { g.classList.add('is-collapsed'); btn.setAttribute('aria-expanded', 'false'); }
      btn.addEventListener('click', function () {
        var c = g.classList.toggle('is-collapsed'); btn.setAttribute('aria-expanded', String(!c));
        collapsed[key] = c; TP.store.set('sbCollapsed', collapsed);
      });
    });
    var cur = $('.sb-link[aria-current="page"]', sb);
    if (cur) cur.scrollIntoView({ block: 'center' });
    var f = $('#sb-filter');
    if (f) f.addEventListener('input', function () {
      var v = f.value.toLowerCase();
      $$('.sb-group', sb).forEach(function (g) {
        var any = false;
        $$('li', g).forEach(function (li) { var ok = li.textContent.toLowerCase().indexOf(v) > -1; li.hidden = !ok; if (ok) any = true; });
        g.hidden = !any; if (v) g.classList.remove('is-collapsed');
      });
    });
  }

  /* Command palette (Ctrl/⌘ + K) */
  function palette() {
    var m = $('#cmdk'); if (!m) return;
    var input = $('#cmdk-input', m), list = $('#cmdk-list', m);
    var links = $$('.admin-sidebar .sb-link').map(function (a) { return { href: a.getAttribute('href'), text: a.textContent.trim(), group: a.closest('.sb-group').getAttribute('data-group') }; });
    var extra = [
      { href: document.documentElement.getAttribute('data-root') + 'admin/booking-new.html', text: 'New booking (walk-in / phone)', group: 'Action' },
      { href: document.documentElement.getAttribute('data-root') + 'admin/pos.html', text: 'Open POS sale', group: 'Action' },
      { href: document.documentElement.getAttribute('data-root') + 'admin/expenses.html#new', text: 'Record an expense', group: 'Action' }
    ];
    var all = extra.concat(links), active = 0, shown = [];
    function draw() {
      var v = input.value.toLowerCase();
      shown = all.filter(function (l) { return !v || (l.text + ' ' + l.group).toLowerCase().indexOf(v) > -1; }).slice(0, 12);
      active = Math.min(active, shown.length - 1);
      list.innerHTML = shown.map(function (l, i) { return '<a href="' + l.href + '" class="' + (i === active ? 'is-active' : '') + '" role="option" aria-selected="' + (i === active) + '">' + l.text + '<small>' + l.group + '</small></a>'; }).join('') || '<p class="muted small" style="padding:.75rem">No matches. Try a booking ID like TPB-261113-4821 or a phone number.</p>';
    }
    input.addEventListener('input', function () { active = 0; draw(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, shown.length - 1); draw(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); draw(); }
      if (e.key === 'Enter' && shown[active]) { location.href = shown[active].href; }
    });
    m.addEventListener('tp:open', function () { input.value = ''; active = 0; draw(); });
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); TP.open(m); }
    });
    $$('[data-cmdk]').forEach(function (b) { b.addEventListener('focus', function () { b.blur(); TP.open(m); }); b.addEventListener('click', function () { TP.open(m); }); });
  }

  /* Row → detail drawer. Rows carry data-row='{"Label":"Value"}' */
  function rowDrawer() {
    document.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-row]');
      if (!tr || e.target.closest('input, button, a, label')) return;
      openRow(tr);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches && e.target.matches('tr[data-row]')) openRow(e.target);
    });
    function openRow(tr) {
      var d = $('#row-drawer'); if (!d) return;
      var data = JSON.parse(tr.getAttribute('data-row'));
      $('#row-drawer-title').textContent = data.__title || 'Details';
      var dl = '<dl class="dl">';
      Object.keys(data).forEach(function (k) { if (k.indexOf('__') !== 0) dl += '<dt>' + k + '</dt><dd>' + data[k] + '</dd>'; });
      $('#row-drawer-body').innerHTML = dl + '</dl>' + ($('#row-drawer-extra') ? $('#row-drawer-extra').innerHTML : '');
      TP.open(d, tr);
    }
    if (location.hash === '#new' && $('#create-drawer')) setTimeout(function () { TP.open('#create-drawer'); }, 200);
  }

  /* POS terminal */
  function pos() {
    var root = $('[data-pos]'); if (!root) return;
    var cart = {}, items = {};
    $$('.pos-item', root).forEach(function (b) { items[b.getAttribute('data-sku')] = { name: b.getAttribute('data-name'), price: +b.getAttribute('data-price'), stock: +b.getAttribute('data-stock'), el: b }; });
    var discount = 0;
    function draw() {
      var list = $('#pos-lines'), sub = 0, h = '';
      Object.keys(cart).forEach(function (k) {
        var it = items[k], q = cart[k], amt = it.price * q; sub += amt;
        h += '<div class="cart-item"><div><strong>' + it.name + '</strong><br><span class="xs muted">' + TP.money(it.price) + ' × ' + q + ' · stock after sale: ' + (it.stock - q) + '</span></div><div class="row-nowrap"><div class="qty"><button type="button" data-pos-dec="' + k + '" aria-label="Decrease">−</button><output>' + q + '</output><button type="button" data-pos-inc="' + k + '" aria-label="Increase">+</button></div><span class="num">' + TP.money(amt) + '</span></div></div>';
      });
      list.innerHTML = h || '<p class="muted small text-center" style="padding:2rem 0">Cart is empty — tap an item or scan a barcode.</p>';
      var turf = $('#pos-turf') && $('#pos-turf').checked ? +$('#pos-turf').value : 0;
      var gross = sub + turf, disc = Math.round(gross * discount / 100), vat = Math.round((gross - disc) * .15), total = gross - disc + vat;
      $('#pos-sub').textContent = TP.money(gross); $('#pos-disc').textContent = '−' + TP.money(disc); $('#pos-vat').textContent = TP.money(vat); $('#pos-total').textContent = TP.money(total);
      $('#pos-charge').textContent = TP.money(total);
      var tendered = +($('#pos-tendered').value || 0); $('#pos-change').textContent = TP.money(Math.max(0, tendered - total));
      root.setAttribute('data-total', total);
    }
    root.addEventListener('click', function (e) {
      var it = e.target.closest('.pos-item');
      if (it) { var k = it.getAttribute('data-sku'); if ((cart[k] || 0) >= items[k].stock) { TP.toast('Not enough stock for ' + items[k].name, 'error'); return; } cart[k] = (cart[k] || 0) + 1; draw(); return; }
      var inc = e.target.closest('[data-pos-inc]'), dec = e.target.closest('[data-pos-dec]');
      if (inc) { var a = inc.getAttribute('data-pos-inc'); if (cart[a] < items[a].stock) cart[a]++; draw(); }
      if (dec) { var b = dec.getAttribute('data-pos-dec'); cart[b]--; if (cart[b] <= 0) delete cart[b]; draw(); }
      var kp = e.target.closest('.pos-keypad button');
      if (kp) { var t = $('#pos-tendered'); var v = kp.textContent.trim(); t.value = v === 'C' ? '' : v === '⌫' ? t.value.slice(0, -1) : t.value + v; draw(); }
      if (e.target.closest('#pos-clear')) { cart = {}; draw(); }
      if (e.target.closest('#pos-complete')) {
        if (!Object.keys(cart).length && !($('#pos-turf') && $('#pos-turf').checked)) { TP.toast('Add at least one item', 'error'); return; }
        Object.keys(cart).forEach(function (k) { items[k].stock -= cart[k]; items[k].el.setAttribute('data-stock', items[k].stock); var s = $('.pi-stock', items[k].el); if (s) s.textContent = items[k].stock + ' in stock'; items[k].el.classList.toggle('is-low', items[k].stock <= 5); });
        TP.toast('Sale INV-' + Math.floor(10000 + Math.random() * 89999) + ' completed · stock updated · ledger entry posted');
        cart = {}; draw(); TP.open('#receipt-modal');
      }
    });
    root.addEventListener('input', function (e) { if (e.target.id === 'pos-tendered') draw(); if (e.target.id === 'pos-search') { var v = e.target.value.toLowerCase(); $$('.pos-item', root).forEach(function (b) { b.hidden = b.getAttribute('data-name').toLowerCase().indexOf(v) === -1 && b.getAttribute('data-sku').toLowerCase().indexOf(v) === -1; }); } });
    root.addEventListener('change', function (e) { if (e.target.id === 'pos-discount') { discount = +e.target.value; if (discount > 10) TP.toast('Discounts above 10% need manager approval (PIN).'); } draw(); });
    root.addEventListener('tp:change', function (e) {
      var c = e.detail.value; if (!e.target.closest('#pos-cats')) return;
      $$('.pos-item', root).forEach(function (b) { b.hidden = c !== 'All' && b.getAttribute('data-cat') !== c; });
    });
    draw();
  }

  /* Daily closing: live difference */
  function closing() {
    var root = $('[data-closing]'); if (!root) return;
    function calc() {
      var expected = 0;
      $$('[data-exp]', root).forEach(function (i) { expected += (+i.getAttribute('data-sign')) * (+i.value || 0); });
      var counted = 0;
      $$('[data-denom]', root).forEach(function (i) { var n = +i.value || 0; counted += n * (+i.getAttribute('data-denom')); var o = $('#den-' + i.getAttribute('data-denom')); if (o) o.textContent = TP.money(n * (+i.getAttribute('data-denom'))); });
      $('#cl-expected').textContent = TP.money(expected); $('#cl-counted').textContent = TP.money(counted);
      var diff = counted - expected, d = $('#cl-diff');
      d.textContent = (diff > 0 ? '+' : '') + TP.money(diff).replace('৳-', '−৳');
      d.className = 'kpi-value ' + (diff === 0 ? 'text-green' : 'text-red');
      $('#cl-diff-note').textContent = diff === 0 ? '✓ Balanced' : diff > 0 ? '▲ Excess cash — explain below' : '▼ Shortage — explanation and manager approval required';
    }
    root.addEventListener('input', calc); calc();
  }

  /* Check-in */
  function checkin() {
    var root = $('[data-checkin]'); if (!root) return;
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-checkin-btn]');
      if (b) {
        var row = b.closest('tr');
        var st = row.querySelector('[data-status]');
        st.innerHTML = '<span class="badge badge-blue"><svg class="i" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>Checked in</span>';
        b.outerHTML = '<button type="button" class="btn btn-sm" data-toast="Marked as started — timer running">Start</button>';
        TP.toast('Checked in at ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' }));
      }
      if (e.target.closest('#simulate-scan')) {
        var r = $('#scan-result'); r.hidden = false; TP.toast('QR verified: TPB-261113-4821'); r.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* Calendar: click empty cell → quick booking modal */
  function calendar() {
    var tl = $('[data-timeline]'); if (!tl) return;
    tl.addEventListener('click', function (e) {
      var ev = e.target.closest('.tl-event');
      if (ev) { $('#ev-title').textContent = ev.getAttribute('data-title'); $('#ev-body').innerHTML = ev.getAttribute('data-body'); TP.open('#event-modal', ev); return; }
      var c = e.target.closest('.tl-cell');
      if (c) { $('#qb-pitch').value = c.getAttribute('data-pitch'); $('#qb-time').value = c.getAttribute('data-time'); TP.open('#quick-book', c); }
    });
    $$('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-view');
        $$('[data-view-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-view-panel') !== v; });
      });
    });
  }

  /* Pricing simulator */
  function pricing() {
    var root = $('[data-price-sim]'); if (!root || !window.TPBooking) return;
    function run() {
      var unit = $('#ps-unit').value, date = $('#ps-date').value, time = $('#ps-time').value.split(':'), dur = +$('#ps-dur').value;
      var start = (+time[0]) * 60 + (+time[1] || 0);
      var p = TPBooking.priceFor(unit, date, start, dur);
      var tiers = ['Off-peak (weekday 06:00–15:00)', 'Standard', 'Peak (weekday 17:00+, weekend 15:00+, holidays)'];
      var vat = Math.round((p.base + p.flood) * TPBooking.cfg.vatRate);
      $('#ps-out').innerHTML = '<div class="price-lines">' +
        '<div class="pl"><span>Matched rule</span><span class="bold">' + tiers[p.tier] + (p.holiday ? ' + Holiday +10%' : '') + '</span></div>' +
        '<div class="pl"><span>Base rate</span><span class="num">' + TP.money(p.base) + '</span></div>' +
        '<div class="pl"><span>Floodlight</span><span class="num">' + TP.money(p.flood) + '</span></div>' +
        '<div class="pl"><span>VAT 15%</span><span class="num">' + TP.money(vat) + '</span></div>' +
        '<div class="pl pl-total"><span>Customer pays</span><span class="num">' + TP.money(p.base + p.flood + vat) + '</span></div></div>';
    }
    root.addEventListener('input', run); root.addEventListener('change', run);
    $('#ps-date').value = new Date().toISOString().slice(0, 10); run();
  }

  /* Permission matrix: column select-all */
  function perms() {
    $$('[data-perm-col]').forEach(function (b) {
      b.addEventListener('change', function () {
        var i = b.getAttribute('data-perm-col');
        $$('.perm-matrix tbody td:nth-child(' + (+i + 1) + ') input').forEach(function (c) { if (!c.disabled) c.checked = b.checked; });
      });
    });
  }

  /* Import wizard / generic step wizards */
  function wizard() {
    $$('[data-wizard]').forEach(function (w) {
      var steps = $$('[data-step]', w), nav = $$('.stepper li', w), i = 0;
      function show() {
        steps.forEach(function (s, j) { s.hidden = j !== i; });
        nav.forEach(function (n, j) { n.className = j < i ? 'is-done' : j === i ? 'is-current' : ''; if (j === i) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current'); });
      }
      w.addEventListener('click', function (e) {
        if (e.target.closest('[data-next]')) { i = Math.min(i + 1, steps.length - 1); show(); w.scrollIntoView({ block: 'start' }); }
        if (e.target.closest('[data-prev]')) { i = Math.max(i - 1, 0); show(); }
      });
      show();
    });
  }

  /* Live score entry */
  function score() {
    var root = $('[data-score]'); if (!root) return;
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-goal]'); if (!b) return;
      var s = $('#score-' + b.getAttribute('data-goal')); s.textContent = +s.textContent + 1;
      var log = $('#score-log'); var li = document.createElement('li');
      li.innerHTML = '<time>' + ($('#match-min').value || "45") + "'</time> ⚽ Goal — " + b.getAttribute('data-team') + ' (' + ($('#scorer').value || 'Unassigned') + ')';
      log.prepend(li); TP.toast('Score published to live scoreboard');
    });
  }

  document.addEventListener('DOMContentLoaded', function () { sidebar(); palette(); rowDrawer(); pos(); closing(); checkin(); calendar(); pricing(); perms(); wizard(); score(); });
})();
