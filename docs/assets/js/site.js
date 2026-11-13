/* ==========================================================================
   Public-site page scripts: booking success, payment processing, add-to-
   calendar (.ics), share, QR placeholder, refund preview, waitlist, filters.
   ========================================================================== */
(function () {
  'use strict';
  var TP = window.TP, $ = TP.$, $$ = TP.$$;

  /* Deterministic QR-style placeholder. Replace with a real QR encoder
     (e.g. "qrcode" npm package server-side) that encodes the signed check-in token. */
  TP.qr = function (box, text) {
    var n = 25, s = '', h = 0;
    for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    function rnd() { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; }
    function finder(x, y) { s += '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#0F172A"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#0F172A"/>'; }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inF && rnd() > .52) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="#0F172A"/>';
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    box.innerHTML = '<svg viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" role="img" aria-label="Check-in QR code for ' + text + '">' + s + '</svg>';
  };

  function ics(b) {
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TurfPro//Booking//EN'];
    b.items.forEach(function (it, i) {
      function toUtc(date, t) {
        var m = t.match(/(\d+):(\d+) (AM|PM)/); var hh = (+m[1] % 12) + (m[3] === 'PM' ? 12 : 0);
        var d = new Date(date + 'T' + String(hh).padStart(2, '0') + ':' + m[2] + ':00+06:00');
        return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      }
      lines.push('BEGIN:VEVENT', 'UID:' + b.id + '-' + i + '@turfpro.example', 'DTSTAMP:' + toUtc(it.date, it.from), 'DTSTART:' + toUtc(it.date, it.from), 'DTEND:' + toUtc(it.date, it.to),
        'SUMMARY:' + it.unit + ' — ' + b.id, 'LOCATION:TurfPro Arena\\, Road 27\\, Dhanmondi\\, Dhaka', 'DESCRIPTION:Booking ' + b.id + '. Show the QR code at the front desk.', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function success() {
    var root = $('[data-success-page]'); if (!root) return;
    var b = TP.store.get('lastBooking', null);
    if (!b) {
      b = { id: 'TPB-261113-4821', name: 'Dhanmondi Strikers', phone: '01711-000000', method: 'bkash', payMode: 'advance', items: [{ unit: 'Pitch A — Full', date: new Date().toISOString().slice(0, 10), from: '8:00 PM', to: '9:00 PM', dur: 60, amount: 4800 }], totals: { total: 5520, payNow: 1660, due: 3860 } };
    }
    var pending = /status=pending/.test(location.search);
    $$('[data-b="id"]').forEach(function (e) { e.textContent = b.id; });
    $('[data-b="name"]') && ($('[data-b="name"]').textContent = b.name || '—');
    $('[data-b="method"]') && ($('[data-b="method"]').textContent = ({ bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', ssl: 'Card (SSLCommerz)', aamar: 'AamarPay', bank: 'Bank transfer', cash: 'Cash at venue', wallet: 'Wallet' })[b.method] || b.method);
    $('[data-b="paid"]') && ($('[data-b="paid"]').textContent = TP.money(pending ? 0 : b.totals.payNow || b.totals.net || 0));
    $('[data-b="due"]') && ($('[data-b="due"]').textContent = TP.money(pending ? (b.totals.net || b.totals.total) : (b.totals.due || 0)));
    $('[data-b="total"]') && ($('[data-b="total"]').textContent = TP.money(b.totals.total));
    var list = $('[data-b="items"]');
    if (list) list.innerHTML = b.items.map(function (it) {
      var d = new Date(it.date + 'T12:00:00');
      return '<li><div class="date-box"><small>' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</small><b>' + d.getDate() + '</b></div><div class="grow"><strong>' + it.unit + '</strong><br><span class="small muted">' + d.toLocaleDateString('en-GB', { weekday: 'long' }) + ' · ' + it.from + ' – ' + it.to + ' (' + it.dur + ' min)</span></div><span class="num">' + TP.money(it.amount) + '</span></li>';
    }).join('');
    if (pending) { var h = $('[data-b="headline"]'); if (h) h.textContent = 'Booking reserved — payment pending'; var st = $('[data-b="status"]'); if (st) st.innerHTML = '<span class="badge badge-amber">◷ Payment pending</span>'; }
    var q = $('#qr'); if (q) TP.qr(q, b.id);
    var dl = $('#add-cal');
    if (dl) dl.addEventListener('click', function () {
      var blob = new Blob([ics(b)], { type: 'text/calendar' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = b.id + '.ics'; a.click();
      TP.toast('Calendar file downloaded');
    });
    var sh = $('#share-booking');
    if (sh) sh.addEventListener('click', function () {
      var text = 'Game on! ' + b.items[0].unit + ' · ' + b.items[0].date + ' ' + b.items[0].from + '. Booking ' + b.id;
      if (navigator.share) navigator.share({ title: 'Our turf booking', text: text, url: location.href }).catch(function () {});
      else { navigator.clipboard && navigator.clipboard.writeText(text); TP.toast('Booking details copied — paste in your team chat'); }
    });
    var wa = $('#wa-share');
    if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent('Game on! ' + b.items[0].unit + ' ' + b.items[0].date + ' ' + b.items[0].from + ' — booking ' + b.id);
  }

  function processing() {
    var root = $('[data-processing]'); if (!root) return;
    var gw = (new URLSearchParams(location.search).get('gw')) || 'bkash';
    var names = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', ssl: 'SSLCommerz', aamar: 'AamarPay', bank: 'Bank transfer', wallet: 'Wallet' };
    $$('[data-gw]').forEach(function (e) { e.textContent = names[gw] || gw; });
    var steps = $$('[data-proc-step]'), i = 0;
    var iv = setInterval(function () {
      if (steps[i]) steps[i].classList.add('is-done');
      i++;
      if (i >= steps.length) { clearInterval(iv); if (!root.hasAttribute('data-stay')) location.href = root.getAttribute('data-next'); }
    }, 900);
  }

  /* Cancellation refund preview (policy: >24h 100%, 12–24h 50%, <12h 0% of advance) */
  function refund() {
    var root = $('[data-refund-preview]'); if (!root) return;
    function run() {
      var hours = +$('#rf-hours').value, paid = +root.getAttribute('data-paid');
      var pct = hours >= 24 ? 100 : hours >= 12 ? 50 : 0;
      var dest = ($('input[name="rf-dest"]:checked') || {}).value || 'original';
      var amt = Math.round(paid * pct / 100);
      if (dest === 'wallet' && pct < 100) amt = Math.round(paid * Math.min(100, pct + 20) / 100);
      $('#rf-pct').textContent = pct + '%' + (dest === 'wallet' && pct < 100 ? ' + 20% wallet bonus' : '');
      $('#rf-amt').textContent = TP.money(amt);
      $('#rf-fee').textContent = TP.money(paid - amt);
      $('#rf-hours-out').textContent = hours + ' hours before start';
    }
    root.addEventListener('input', run); root.addEventListener('change', run); run();
  }

  /* Listing filters (turfs / tournaments / blog) */
  function listFilter() {
    $$('[data-filter-list]').forEach(function (bar) {
      var target = $(bar.getAttribute('data-filter-list'));
      bar.addEventListener('tp:change', function (e) {
        var v = e.detail.value;
        $$('[data-tags]', target).forEach(function (c) { c.hidden = v !== 'All' && c.getAttribute('data-tags').indexOf(v) === -1; });
        var vis = $$('[data-tags]:not([hidden])', target).length;
        var empty = $('[data-filter-empty]'); if (empty) empty.hidden = vis > 0;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () { success(); processing(); refund(); listFilter(); });
})();
