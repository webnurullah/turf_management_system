/* ==========================================================================
   Booking engine UI (template demo on sample data)
   --------------------------------------------------------------------------
   Mirrors the production rules so the UX can be reviewed end to end:
   • Bookable units per pitch; Pitch A supports FULL + two linked HALVES.
     FULL blocks both halves; any HALF blocks FULL; two halves can run together.
   • 60 / 90 minute durations, interval-overlap conflict checks.
   • Peak / off-peak / weekend (Fri–Sat) / floodlight / holiday rate rules.
   • Multi-slot cart, hold countdown, add-ons, coupon vs membership stacking
     rule, wallet + loyalty credit, VAT, full or advance payment.
   In production every check here is repeated server-side inside a DB
   transaction with an exclusion constraint — this file is presentation only.
   ========================================================================== */
(function () {
  'use strict';
  var TP = window.TP;

  var CFG = {
    open: 6 * 60, close: 24 * 60,            // 06:00 – 24:00
    holdSeconds: 600,                        // 10-minute checkout hold
    vatRate: 0.15,                           // configurable in Settings → Tax
    advanceRate: 0.30,                       // minimum advance
    floodlightFrom: 18 * 60, floodlightFee: 300,
    holidays: ['2026-12-16', '2026-12-25', '2027-02-21', '2027-03-26'],
    allowCouponWithMembership: false,
    walletBalance: 750, loyaltyPoints: 420, pointValue: 1
  };

  var UNITS = {
    'A-FULL': { name: 'Pitch A — Full', short: 'Pitch A Full', sport: 'Football 7-a-side', group: 'A', rates: [3000, 3500, 4500], outdoor: true, cap: '14 players' },
    'A-H1':   { name: 'Pitch A — Half 1 (North)', short: 'A · Half 1', sport: 'Football 5-a-side', group: 'A', rates: [1800, 2000, 2600], outdoor: true, cap: '10 players' },
    'A-H2':   { name: 'Pitch A — Half 2 (South)', short: 'A · Half 2', sport: 'Football 5-a-side', group: 'A', rates: [1800, 2000, 2600], outdoor: true, cap: '10 players' },
    'B':      { name: 'Pitch B — Futsal Indoor', short: 'Pitch B', sport: 'Futsal 5-a-side', group: 'B', rates: [2000, 2400, 3000], outdoor: false, cap: '10 players' },
    'NET1':   { name: 'Cricket Net 1', short: 'Net 1', sport: 'Cricket practice', group: 'N1', rates: [800, 1000, 1200], outdoor: true, cap: '6 players' },
    'NET2':   { name: 'Cricket Net 2', short: 'Net 2', sport: 'Cricket practice', group: 'N2', rates: [800, 1000, 1200], outdoor: true, cap: '6 players' },
    'BAD1':   { name: 'Badminton Court 1', short: 'Court 1', sport: 'Badminton', group: 'C1', rates: [600, 700, 900], outdoor: false, cap: '4 players' }
  };
  // Linked-segment conflict map (server: pitch_segment relation)
  var CONFLICTS = { 'A-FULL': ['A-H1', 'A-H2'], 'A-H1': ['A-FULL'], 'A-H2': ['A-FULL'] };

  var COUPONS = {
    FIRST10: { type: 'pct', value: 10, max: 500, label: 'First booking 10% (max ৳500)' },
    OFFPEAK15: { type: 'pct', value: 15, offpeakOnly: true, label: '15% off off-peak slots' },
    FLAT200: { type: 'flat', value: 200, minSpend: 3000, label: '৳200 off on ৳3,000+' }
  };

  /* ---------- helpers ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function hm(min) { var h = Math.floor(min / 60) % 24, m = min % 60; var ap = h >= 12 ? 'PM' : 'AM'; var h12 = h % 12 || 12; return h12 + ':' + pad(m) + ' ' + ap; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  function dow(dateStr) { return new Date(dateStr + 'T12:00:00').getDay(); }  // 5 = Fri, 6 = Sat
  function isWeekend(dateStr) { var d = dow(dateStr); return d === 5 || d === 6; }
  function overlaps(a1, a2, b1, b2) { return a1 < b2 && b1 < a2; }

  /* Tier: 0 off-peak, 1 standard, 2 peak — rate rule priority:
     special date > holiday > weekend > time band (see Admin → Pricing & Rates) */
  function tier(dateStr, start) {
    if (CFG.holidays.indexOf(dateStr) > -1) return 2;
    if (isWeekend(dateStr)) return start >= 15 * 60 ? 2 : 1;
    if (start >= 17 * 60) return 2;
    if (start < 15 * 60) return 0;
    return 1;
  }
  function priceFor(unit, dateStr, start, dur) {
    var u = UNITS[unit], total = 0, flood = 0, holiday = CFG.holidays.indexOf(dateStr) > -1;
    for (var t = start; t < start + dur; t += 30) {               // price per 30-min block
      total += u.rates[tier(dateStr, t)] / 2;
      if (u.outdoor && t >= CFG.floodlightFrom) flood += CFG.floodlightFee / 2;
    }
    if (holiday) total = Math.round(total * 1.1);
    return { base: Math.round(total), flood: Math.round(flood), tier: tier(dateStr, start), holiday: holiday };
  }

  /* Deterministic sample occupancy so every visitor sees the same calendar */
  var occCache = {};
  function occupancy(dateStr) {
    if (occCache[dateStr]) return occCache[dateStr];
    var list = [];
    function gen(unit, bias) {
      for (var h = CFG.open; h < CFG.close; h += 60) {
        var p = hash(dateStr + unit + h);
        var thr = (h >= 17 * 60 ? .55 : h < 9 * 60 ? .12 : .25) + bias + (isWeekend(dateStr) ? .12 : 0);
        if (p < thr) {
          var blocked = list.some(function (b) { return (b.unit === unit || (CONFLICTS[unit] || []).indexOf(b.unit) > -1) && overlaps(h, h + 60, b.s, b.e); });
          if (!blocked) list.push({ unit: unit, s: h, e: h + 60, kind: p < thr * .12 ? 'hold' : 'booked' });
        }
      }
    }
    gen('A-FULL', -.05); gen('A-H1', -.1); gen('A-H2', -.12); gen('B', 0); gen('NET1', -.08); gen('NET2', -.15); gen('BAD1', -.1);
    // demo maintenance block (spec: maintenance overrides availability)
    if (dow(dateStr) === 2) list.push({ unit: 'NET2', s: 6 * 60, e: 10 * 60, kind: 'maintenance' });
    occCache[dateStr] = list;
    return list;
  }

  /* ---------- state ---------- */
  var S = { unit: 'A-FULL', date: iso(new Date()), dur: 60, cart: [], addons: {}, coupon: null, member: false, wallet: false, points: false, payMode: 'advance', method: 'bkash', holdLeft: 0, timer: null };

  function busyReason(unit, dateStr, s, e) {
    var now = new Date();
    if (dateStr === iso(now) && s < now.getHours() * 60 + now.getMinutes() + 30) return 'past';  // min notice 30 min
    var occ = occupancy(dateStr);
    for (var i = 0; i < occ.length; i++) {
      var b = occ[i];
      if (overlaps(s, e, b.s, b.e)) {
        if (b.unit === unit) return b.kind;
        if ((CONFLICTS[unit] || []).indexOf(b.unit) > -1) return 'linked';
      }
    }
    for (var j = 0; j < S.cart.length; j++) {
      var c = S.cart[j];
      if (c.date === dateStr && overlaps(s, e, c.start, c.start + c.dur)) {
        if (c.unit === unit) return 'mine';
        if ((CONFLICTS[unit] || []).indexOf(c.unit) > -1) return 'linked-cart';
      }
    }
    return null;
  }
  var REASON = { booked: 'Booked', hold: 'On hold', maintenance: 'Maintenance', linked: 'Linked pitch in use', 'linked-cart': 'Conflicts with your selection', past: 'Unavailable', mine: 'Selected' };

  /* ---------- render ---------- */
  var root, el = {};
  function q(s) { return root.querySelector(s); }

  function renderDates() {
    var box = el.dates; if (!box) return;
    var html = '', d = new Date();
    for (var i = 0; i < 21; i++) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i), v = iso(x);
      var wk = isWeekend(v);
      html += '<button type="button" class="date-pill" data-date="' + v + '" aria-pressed="' + (v === S.date) + '" aria-label="' + x.toDateString() + (wk ? ' (weekend rates)' : '') + '">' +
        '<span class="dp-day">' + (i === 0 ? 'Today' : x.toLocaleDateString('en-GB', { weekday: 'short' })) + '</span>' +
        '<span class="dp-num">' + x.getDate() + '</span><span class="dp-mon">' + x.toLocaleDateString('en-GB', { month: 'short' }) + (wk ? ' ·W' : '') + '</span></button>';
    }
    box.innerHTML = html;
  }

  function renderUnits() {
    root.querySelectorAll('[data-unit]').forEach(function (b) {
      var u = b.getAttribute('data-unit');
      b.setAttribute('aria-pressed', u === S.unit ? 'true' : 'false');
    });
    if (el.unitInfo) {
      var u = UNITS[S.unit];
      el.unitInfo.innerHTML = '<strong>' + u.name + '</strong> · ' + u.sport + ' · ' + u.cap + (u.outdoor ? ' · Floodlit outdoor' : ' · Indoor') +
        (CONFLICTS[S.unit] ? '<br><span class="small muted">Linked: booking this blocks ' + CONFLICTS[S.unit].map(function (k) { return UNITS[k].short; }).join(' & ') + ' at the same time.</span>' : '');
    }
  }

  function renderSlots() {
    var box = el.slots; if (!box) return;
    var html = '', any = false;
    for (var s = CFG.open; s + S.dur <= CFG.close; s += S.dur === 90 ? 90 : 60) {
      var e = s + S.dur, why = busyReason(S.unit, S.date, s, e), p = priceFor(S.unit, S.date, s, S.dur);
      var sel = why === 'mine';
      var dis = why && !sel;
      if (!dis) any = true;
      var tierCls = p.tier === 2 ? ' is-peak' : p.tier === 0 ? ' is-offpeak' : '';
      var state = dis ? REASON[why] : sel ? '✓ Selected' : p.tier === 2 ? '▲ Peak' : p.tier === 0 ? '▼ Off-peak' : 'Available';
      html += '<button type="button" class="slot' + tierCls + (why === 'hold' ? ' is-held' : '') + '" data-start="' + s + '"' + (dis ? ' disabled aria-disabled="true"' : '') + ' aria-pressed="' + sel + '"' +
        ' aria-label="' + hm(s) + ' to ' + hm(e) + ', ' + (dis ? REASON[why] : TP.money(p.base + p.flood)) + '">' +
        '<span class="slot-time">' + hm(s) + '</span>' +
        '<span class="slot-price">' + (dis ? '—' : TP.money(p.base + p.flood)) + '</span>' +
        '<span class="slot-state">' + state + '</span></button>';
    }
    box.innerHTML = html;
    if (el.noSlot) el.noSlot.hidden = any;
    if (el.slotCount) {
      var n = box.querySelectorAll('.slot:not([disabled])').length;
      el.slotCount.textContent = n + ' slots available';
    }
  }

  function addonTotal() {
    var t = 0, lines = [];
    root.querySelectorAll('[data-addon]').forEach(function (a) {
      var qty = parseInt((a.querySelector('output, input') || {}).value || 0, 10) || 0;
      var chk = a.querySelector('input[type="checkbox"]');
      if (chk) qty = chk.checked ? 1 : 0;
      if (qty > 0) { var price = parseInt(a.getAttribute('data-price'), 10) * qty; t += price; lines.push({ name: a.getAttribute('data-addon') + (qty > 1 ? ' × ' + qty : ''), price: price }); }
    });
    return { total: t, lines: lines };
  }

  function compute() {
    var sub = 0, flood = 0, offpeak = 0;
    S.cart.forEach(function (c) { sub += c.price.base; flood += c.price.flood; if (c.price.tier === 0) offpeak += c.price.base; });
    var ad = addonTotal();
    var gross = sub + flood + ad.total;
    var coupon = 0, couponMsg = '', member = 0;
    if (S.member) member = Math.round(sub * 0.10);
    if (S.coupon) {
      var c = COUPONS[S.coupon];
      if (c.offpeakOnly) coupon = Math.round(offpeak * c.value / 100);
      else if (c.type === 'pct') coupon = Math.min(Math.round(sub * c.value / 100), c.max || 1e9);
      else if (gross >= (c.minSpend || 0)) coupon = c.value;
      else couponMsg = 'Minimum spend ' + TP.money(c.minSpend) + ' not met.';
      if (c.offpeakOnly && !offpeak) couponMsg = 'This code only applies to off-peak slots.';
    }
    // Stacking rule: incompatible discounts do not stack unless enabled → best one wins
    var stackNote = '';
    if (coupon && member && !CFG.allowCouponWithMembership) {
      if (coupon >= member) { member = 0; stackNote = 'Coupon applied instead of membership discount (they can\'t be combined).'; }
      else { coupon = 0; stackNote = 'Membership discount is better than this coupon, so it was kept.'; }
    }
    var afterDisc = Math.max(0, gross - coupon - member);
    var vat = Math.round(afterDisc * CFG.vatRate);
    var total = afterDisc + vat;
    var wallet = S.wallet ? Math.min(CFG.walletBalance, total) : 0;
    var points = S.points ? Math.min(CFG.loyaltyPoints * CFG.pointValue, total - wallet) : 0;
    var net = total - wallet - points;
    var payNow = S.payMode === 'full' ? net : S.payMode === 'venue' ? 0 : Math.min(net, Math.ceil(total * CFG.advanceRate / 10) * 10);
    return { sub: sub, flood: flood, addons: ad, coupon: coupon, couponMsg: couponMsg, member: member, stackNote: stackNote, vat: vat, total: total, wallet: wallet, points: points, net: net, payNow: payNow, due: net - payNow };
  }

  function line(label, val, cls) { return '<div class="pl ' + (cls || '') + '"><span>' + label + '</span><span class="num">' + val + '</span></div>'; }

  function renderCart() {
    var r = compute();
    if (el.cart) {
      if (!S.cart.length) el.cart.innerHTML = '<div class="empty" style="padding:1.5rem .5rem"><div class="empty-icon"><svg class="i" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div><p class="small mb-0" data-i18n="book.empty">No slots selected yet</p><p class="xs muted mb-0">Pick a pitch, date and time to start.</p></div>';
      else el.cart.innerHTML = S.cart.map(function (c, i) {
        var d = new Date(c.date + 'T12:00:00');
        return '<div class="cart-item"><div><strong>' + UNITS[c.unit].short + '</strong><br><span class="muted xs">' + d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + hm(c.start) + '–' + hm(c.start + c.dur) + ' · ' + c.dur + ' min</span>' +
          (c.price.flood ? '<br><span class="xs muted">incl. floodlight ' + TP.money(c.price.flood) + '</span>' : '') + '</div>' +
          '<div class="row-nowrap"><span class="num">' + TP.money(c.price.base + c.price.flood) + '</span><button type="button" class="btn btn-ghost btn-icon btn-sm" data-remove="' + i + '" aria-label="Remove slot"><svg class="i" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div></div>';
      }).join('');
    }
    if (el.lines) {
      var h = line('Turf (' + S.cart.length + ' slot' + (S.cart.length === 1 ? '' : 's') + ')', TP.money(r.sub));
      if (r.flood) h += line('Floodlight charge', TP.money(r.flood));
      r.addons.lines.forEach(function (a) { h += line(a.name, TP.money(a.price)); });
      if (r.member) h += line('Gold membership −10%', '−' + TP.money(r.member), 'pl-discount');
      if (r.coupon) h += line('Coupon ' + S.coupon, '−' + TP.money(r.coupon), 'pl-discount');
      h += line('VAT (' + Math.round(CFG.vatRate * 100) + '%)', TP.money(r.vat));
      h += line('<strong>Total</strong>', '<strong>' + TP.money(r.total) + '</strong>');
      if (r.wallet) h += line('Wallet credit', '−' + TP.money(r.wallet), 'pl-discount');
      if (r.points) h += line('Loyalty points (' + r.points + ' pts)', '−' + TP.money(r.points), 'pl-discount');
      h += '<div class="pl pl-total"><span>' + (S.payMode === 'full' ? 'Pay now' : S.payMode === 'venue' ? 'Pay at venue' : 'Advance now (30%)') + '</span><span class="num">' + TP.money(S.payMode === 'venue' ? r.net : r.payNow) + '</span></div>';
      if (r.due > 0 && S.payMode !== 'venue') h += line('Balance due at venue', TP.money(r.due));
      el.lines.innerHTML = h;
    }
    if (el.stack) { el.stack.textContent = r.stackNote; el.stack.hidden = !r.stackNote; }
    if (el.couponMsg && S.coupon) { el.couponMsg.textContent = r.couponMsg || ('✓ ' + COUPONS[S.coupon].label); el.couponMsg.className = 'field-error' + (r.couponMsg ? '' : ' text-green'); }
    if (el.mtotal) el.mtotal.textContent = TP.money(r.total);
    if (el.mcount) el.mcount.textContent = S.cart.length + ' slot' + (S.cart.length === 1 ? '' : 's');
    if (el.pay) { el.pay.disabled = !S.cart.length; el.pay.querySelector('[data-pay-amount]') && (el.pay.querySelector('[data-pay-amount]').textContent = TP.money(S.payMode === 'venue' ? 0 : r.payNow)); }
    if (el.walletBal) el.walletBal.textContent = TP.money(CFG.walletBalance);
    return r;
  }

  function renderAll() { renderUnits(); renderSlots(); renderCart(); }

  /* ---------- hold timer ---------- */
  function startHold() {
    if (S.timer) return;
    S.holdLeft = CFG.holdSeconds;
    if (el.hold) el.hold.hidden = false;
    S.timer = setInterval(function () {
      S.holdLeft--;
      if (el.holdText) el.holdText.textContent = pad(Math.floor(S.holdLeft / 60)) + ':' + pad(S.holdLeft % 60);
      if (S.holdLeft === 60) TP.toast('1 minute left on your slot hold');
      if (S.holdLeft <= 0) { stopHold(); S.cart = []; renderAll(); TP.toast('Hold expired — your slots were released.', 'error'); }
    }, 1000);
    if (el.holdText) el.holdText.textContent = pad(Math.floor(S.holdLeft / 60)) + ':00';
  }
  function stopHold() { clearInterval(S.timer); S.timer = null; if (el.hold) el.hold.hidden = true; }

  /* ---------- events ---------- */
  function bind() {
    root.addEventListener('click', function (e) {
      var u = e.target.closest('[data-unit]');
      if (u && !u.disabled) { S.unit = u.getAttribute('data-unit'); renderAll(); return; }
      var d = e.target.closest('[data-date]');
      if (d) { S.date = d.getAttribute('data-date'); root.querySelectorAll('[data-date]').forEach(function (x) { x.setAttribute('aria-pressed', x === d ? 'true' : 'false'); }); renderSlots(); return; }
      var dur = e.target.closest('[data-dur]');
      if (dur) { S.dur = parseInt(dur.getAttribute('data-dur'), 10); root.querySelectorAll('[data-dur]').forEach(function (x) { x.setAttribute('aria-pressed', x === dur ? 'true' : 'false'); }); renderSlots(); return; }
      var sl = e.target.closest('.slot');
      if (sl && !sl.disabled) {
        var s = parseInt(sl.getAttribute('data-start'), 10);
        var idx = -1;
        S.cart.forEach(function (c, i) { if (c.unit === S.unit && c.date === S.date && overlaps(s, s + S.dur, c.start, c.start + c.dur)) idx = i; });
        if (idx > -1) { S.cart.splice(idx, 1); TP.announce('Slot removed'); }
        else { S.cart.push({ unit: S.unit, date: S.date, start: s, dur: S.dur, price: priceFor(S.unit, S.date, s, S.dur) }); TP.announce('Slot ' + hm(s) + ' added. Held for 10 minutes.'); startHold(); }
        if (!S.cart.length) stopHold();
        renderAll(); return;
      }
      var rm = e.target.closest('[data-remove]');
      if (rm) { S.cart.splice(parseInt(rm.getAttribute('data-remove'), 10), 1); if (!S.cart.length) stopHold(); renderAll(); return; }
      if (e.target.closest('#bk-coupon-apply')) {
        var code = (el.coupon.value || '').trim().toUpperCase();
        if (!code) { S.coupon = null; el.couponMsg.textContent = ''; }
        else if (COUPONS[code]) { S.coupon = code; }
        else { S.coupon = null; el.couponMsg.textContent = 'Invalid or expired code.'; el.couponMsg.className = 'field-error'; }
        renderCart(); return;
      }
      if (e.target.closest('#bk-pay')) { e.preventDefault(); pay(); }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.id === 'bk-member') S.member = t.checked;
      if (t.id === 'bk-wallet') S.wallet = t.checked;
      if (t.id === 'bk-points') S.points = t.checked;
      if (t.name === 'paymode') S.payMode = t.value;
      if (t.name === 'method') { S.method = t.value; if (t.value === 'cash') { var v = root.querySelector('input[name="paymode"][value="venue"]'); if (v) { v.checked = true; S.payMode = 'venue'; } } }
      renderCart();
    });
    root.addEventListener('tp:qty', renderCart);
  }

  function pay() {
    var errs = [];
    var name = root.querySelector('#bk-name'), phone = root.querySelector('#bk-phone'), waiver = root.querySelector('#bk-waiver'), terms = root.querySelector('#bk-terms');
    if (!S.cart.length) errs.push('Select at least one slot.');
    if (name && !name.value.trim()) errs.push('Enter the team or booking name.');
    if (phone && !/^(\+?88)?01[3-9]\d{8}$/.test(phone.value.replace(/[\s-]/g, ''))) errs.push('Enter a valid Bangladeshi mobile number (01XXXXXXXXX).');
    if (terms && !terms.checked) errs.push('Accept the booking & cancellation policy.');
    if (waiver && !waiver.checked) errs.push('Accept the digital waiver.');
    var box = root.querySelector('#bk-errors');
    if (errs.length) {
      if (box) { box.hidden = false; box.querySelector('ul').innerHTML = errs.map(function (x) { return '<li>' + x + '</li>'; }).join(''); box.focus(); }
      return;
    }
    if (box) box.hidden = true;
    var r = compute();
    var now = new Date();
    var id = 'TPB-' + String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + Math.floor(1000 + Math.random() * 9000);
    var booking = {
      id: id, createdAt: now.toISOString(), source: root.getAttribute('data-mode') === 'staff' ? (root.querySelector('#bk-source') || {}).value || 'Walk-in' : 'Website',
      name: name ? name.value : '', phone: phone ? phone.value : '', method: S.method, payMode: S.payMode,
      items: S.cart.map(function (c) { return { unit: UNITS[c.unit].name, date: c.date, from: hm(c.start), to: hm(c.start + c.dur), dur: c.dur, amount: c.price.base + c.price.flood }; }),
      totals: r, policyVersion: 'cancellation-v3.2', waiverVersion: 'waiver-v2.0'
    };
    TP.store.set('lastBooking', booking);
    stopHold();
    var target = root.getAttribute('data-success') || 'booking-success.html';
    if (S.payMode === 'venue' || S.method === 'cash') location.href = target + '?status=pending';
    else location.href = (root.getAttribute('data-processing') || 'payment-processing.html') + '?gw=' + S.method;
  }

  function fromQuery() {
    var p = new URLSearchParams(location.search);
    if (p.get('pitch') && UNITS[p.get('pitch')]) S.unit = p.get('pitch');
    if (p.get('date')) S.date = p.get('date');
    if (p.get('dur') === '90') S.dur = 90;
    root.querySelectorAll('[data-dur]').forEach(function (x) { x.setAttribute('aria-pressed', String(parseInt(x.getAttribute('data-dur'), 10) === S.dur)); });
    if (p.get('coupon') && el.coupon) { el.coupon.value = p.get('coupon'); S.coupon = COUPONS[p.get('coupon').toUpperCase()] ? p.get('coupon').toUpperCase() : null; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    root = document.querySelector('[data-booking]');
    if (!root) return;
    el = {
      dates: q('#bk-dates'), slots: q('#bk-slots'), cart: q('#bk-cart'), lines: q('#bk-lines'), unitInfo: q('#bk-unit-info'),
      coupon: q('#bk-coupon'), couponMsg: q('#bk-coupon-msg'), stack: q('#bk-stack'), hold: document.querySelector('#bk-hold'),
      holdText: document.querySelector('#bk-hold-text'), pay: q('#bk-pay'), mtotal: document.querySelector('#bk-mtotal'),
      mcount: document.querySelector('#bk-mcount'), noSlot: q('#bk-noslot'), slotCount: q('#bk-slot-count'), walletBal: q('#bk-wallet-bal')
    };
    fromQuery(); renderDates(); bind(); renderAll();
    document.addEventListener('tp:lang', renderAll);
  });

  /* Exposed for the success page, admin walk-in page and automated tests */
  window.TPBooking = { UNITS: UNITS, CONFLICTS: CONFLICTS, priceFor: priceFor, busyReason: busyReason, state: S, compute: compute, cfg: CFG };
})();
