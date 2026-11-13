/* ==========================================================================
   TurfPro template — core UI behaviours (vanilla JS, no dependencies)
   Classic script (not a module) so pages work when opened from file://.
   ========================================================================== */
(function () {
  'use strict';
  var TP = window.TP = window.TP || {};
  var $ = TP.$ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = TP.$$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Storage (safe) ---------- */
  TP.store = {
    get: function (k, d) { try { var v = localStorage.getItem('tp:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('tp:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- Formatting (BDT, Asia/Dhaka) ---------- */
  var BN_DIGITS = '০১২৩৪৫৬৭৮৯';
  TP.lang = function () { return document.documentElement.lang === 'bn' ? 'bn' : 'en'; };
  TP.bnDigits = function (s) { return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; }); };
  TP.money = function (n) {
    var s = '৳' + Math.round(n).toLocaleString('en-IN');
    return TP.lang() === 'bn' ? TP.bnDigits(s) : s;
  };
  TP.date = function (d, opts) {
    try { return new Intl.DateTimeFormat(TP.lang() === 'bn' ? 'bn-BD' : 'en-GB', Object.assign({ timeZone: 'Asia/Dhaka', day: 'numeric', month: 'short', year: 'numeric' }, opts || {})).format(d); }
    catch (e) { return d.toDateString(); }
  };

  /* ---------- Toasts / live region ---------- */
  var live;
  TP.announce = function (msg) {
    if (!live) { live = document.createElement('div'); live.className = 'sr-only'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live); }
    live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30);
  };
  TP.toast = function (msg, type) {
    var wrap = $('.toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; wrap.setAttribute('role', 'status'); wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'toast' + (type === 'error' ? ' toast-error' : '');
    t.innerHTML = '<svg class="i" viewBox="0 0 24 24">' + (type === 'error' ? '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>' : '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>') + '</svg><span></span>';
    t.querySelector('span').textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 3200);
    setTimeout(function () { t.remove(); }, 3600);
  };

  /* ---------- Overlay layers: modal + drawer with focus trap ---------- */
  var stack = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function overlayEl() {
    var o = $('#tp-overlay');
    if (!o) { o = document.createElement('div'); o.id = 'tp-overlay'; o.className = 'overlay'; o.hidden = true; document.body.appendChild(o); o.addEventListener('click', function () { TP.close(); }); }
    return o;
  }
  TP.open = function (target, opener) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    var o = overlayEl();
    el.hidden = false; o.hidden = false;
    el._opener = opener || document.activeElement;
    requestAnimationFrame(function () { el.classList.add('is-open'); o.classList.add('is-open'); });
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    stack.push(el);
    var f = $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null; });
    var auto = $('[autofocus]', el) || f[1] || f[0];
    setTimeout(function () { auto && auto.focus(); }, 60);
    el.dispatchEvent(new CustomEvent('tp:open'));
  };
  TP.close = function (target) {
    var el = target ? (typeof target === 'string' ? $(target) : target) : stack[stack.length - 1];
    if (!el) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    stack = stack.filter(function (x) { return x !== el; });
    var o = overlayEl();
    if (!stack.length) { o.classList.remove('is-open'); document.body.classList.remove('is-locked'); }
    setTimeout(function () { if (!el.classList.contains('is-open')) el.hidden = true; if (!stack.length) o.hidden = true; }, 200);
    if (el._opener && el._opener.focus) el._opener.focus();
  };
  document.addEventListener('keydown', function (e) {
    var top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); TP.close(); return; }
    if (e.key === 'Tab') {
      var f = $$(FOCUSABLE, top).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Delegated click handlers ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); TP.open(t.getAttribute('data-open'), t); return; }
    t = e.target.closest('[data-close]');
    if (t) { e.preventDefault(); TP.close(t.closest('.modal, .drawer')); return; }
    t = e.target.closest('[data-toast]');
    if (t) { TP.toast(t.getAttribute('data-toast')); }
    t = e.target.closest('[data-copy]');
    if (t) {
      e.preventDefault();
      var txt = t.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(function () {});
      TP.toast('Copied: ' + txt);
    }
    t = e.target.closest('[data-fav]');
    if (t) { e.preventDefault(); var on = t.getAttribute('aria-pressed') !== 'true'; t.setAttribute('aria-pressed', on); TP.toast(on ? 'Saved to favourites' : 'Removed from favourites'); return; }
    t = e.target.closest('[data-print]');
    if (t) { e.preventDefault(); window.print(); }
    /* exclusive toggle groups (chips / segmented / date pills) */
    t = e.target.closest('[data-toggle-group] > button, [data-toggle-group] > .chip');
    if (t && !t.disabled) {
      var g = t.parentElement;
      if (g.hasAttribute('data-multi')) { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }
      else { $$(':scope > [aria-pressed]', g).forEach(function (b) { b.setAttribute('aria-pressed', b === t ? 'true' : 'false'); }); }
      g.dispatchEvent(new CustomEvent('tp:change', { detail: { value: t.getAttribute('data-value') || t.textContent.trim() }, bubbles: true }));
    }
    /* dropdowns */
    t = e.target.closest('[data-dropdown]');
    if (t) {
      e.preventDefault();
      var menu = t.parentElement.querySelector('.dropdown-menu, .mega');
      var openNow = !menu.classList.contains('is-open');
      closeMenus();
      if (openNow) { menu.classList.add('is-open'); t.setAttribute('aria-expanded', 'true'); }
      return;
    }
    if (!e.target.closest('.dropdown-menu, .mega')) closeMenus();
  });
  function closeMenus() {
    $$('.dropdown-menu.is-open, .mega.is-open').forEach(function (m) { m.classList.remove('is-open'); });
    $$('[data-dropdown][aria-expanded="true"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenus(); });

  /* ---------- Tabs (WAI-ARIA) ---------- */
  function initTabs(root) {
    $$('[role="tablist"]', root).forEach(function (list) {
      var tabs = $$('[role="tab"]', list);
      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          var p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t); });
        t.addEventListener('keydown', function (e) {
          var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (n) { e.preventDefault(); var nx = tabs[(i + n + tabs.length) % tabs.length]; nx.focus(); select(nx); }
        });
      });
      var cur = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      if (cur) select(cur);
    });
  }

  /* ---------- Data tables: search, sort, select, paginate ---------- */
  function initTables(root) {
    $$('table[data-table]', root).forEach(function (table) {
      var tbody = table.tBodies[0]; if (!tbody) return;
      var id = table.id;
      var search = id && $('[data-table-search="' + id + '"]');
      var filters = id ? $$('[data-table-filter="' + id + '"]') : [];
      var info = id && $('[data-table-info="' + id + '"]');
      var bulk = id && $('[data-bulk="' + id + '"]');
      var rows = $$('tr', tbody);
      function apply() {
        var q = search ? search.value.trim().toLowerCase() : '';
        var shown = 0;
        rows.forEach(function (r) {
          var txt = r.textContent.toLowerCase();
          var ok = !q || txt.indexOf(q) > -1;
          filters.forEach(function (f) { if (f.value && f.value !== 'all' && txt.indexOf(f.value.toLowerCase()) === -1) ok = false; });
          r.hidden = !ok; if (ok) shown++;
        });
        if (info) info.textContent = 'Showing ' + shown + ' of ' + rows.length + ' records';
        var empty = table.parentElement.parentElement.querySelector('[data-table-empty]');
        if (empty) empty.hidden = shown !== 0;
      }
      if (search) search.addEventListener('input', apply);
      filters.forEach(function (f) { f.addEventListener('change', apply); });
      $$('th[data-sortable]', table).forEach(function (th) {
        th.tabIndex = 0;
        function sort() {
          var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
          var dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
          $$('th[aria-sort]', table).forEach(function (o) { o.removeAttribute('aria-sort'); });
          th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
          rows.sort(function (a, b) {
            var x = (a.children[idx] || {}).textContent || '', y = (b.children[idx] || {}).textContent || '';
            var nx = parseFloat(x.replace(/[^0-9.\-]/g, '')), ny = parseFloat(y.replace(/[^0-9.\-]/g, ''));
            if (!isNaN(nx) && !isNaN(ny) && /\d/.test(x) && /\d/.test(y)) return (nx - ny) * dir;
            return x.localeCompare(y) * dir;
          }).forEach(function (r) { tbody.appendChild(r); });
        }
        th.addEventListener('click', sort);
        th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); } });
      });
      var all = $('thead input[type="checkbox"]', table);
      function syncBulk() {
        var n = $$('tbody input[type="checkbox"]:checked', table).length;
        if (bulk) { bulk.classList.toggle('is-visible', n > 0); var c = $('[data-bulk-count]', bulk); if (c) c.textContent = n; }
      }
      if (all) all.addEventListener('change', function () { $$('tbody tr:not([hidden]) input[type="checkbox"]', table).forEach(function (c) { c.checked = all.checked; }); syncBulk(); });
      table.addEventListener('change', function (e) { if (e.target.matches('tbody input[type="checkbox"]')) syncBulk(); });
      apply();
    });
  }

  /* ---------- Form validation ---------- */
  function initForms(root) {
    $$('form[data-validate]', root).forEach(function (form) {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        $$('[required], [data-pattern], [type="email"]', form).forEach(function (inp) {
          var field = inp.closest('.field') || inp.parentElement;
          var err = field.querySelector('.field-error');
          var v = inp.type === 'checkbox' ? (inp.checked ? 'y' : '') : inp.value.trim();
          var msg = '';
          if (inp.hasAttribute('required') && !v) msg = inp.getAttribute('data-msg') || 'This field is required.';
          else if (v && inp.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = 'Enter a valid email address.';
          else if (v && inp.hasAttribute('data-pattern') && !new RegExp(inp.getAttribute('data-pattern')).test(v)) msg = inp.getAttribute('data-msg') || 'Please check this value.';
          if (msg) {
            field.classList.add('has-error'); inp.setAttribute('aria-invalid', 'true');
            if (!err) { err = document.createElement('span'); err.className = 'field-error'; err.id = (inp.id || ('f' + Math.random().toString(36).slice(2))) + '-err'; field.appendChild(err); }
            err.textContent = msg; inp.setAttribute('aria-describedby', err.id);
            if (!firstBad) firstBad = inp;
          } else {
            field.classList.remove('has-error'); inp.removeAttribute('aria-invalid'); if (err) err.textContent = '';
          }
        });
        if (firstBad) { firstBad.focus(); TP.announce('Please fix the highlighted fields.'); return; }
        var msgOk = form.getAttribute('data-success');
        var go = form.getAttribute('data-redirect');
        if (msgOk) TP.toast(msgOk);
        if (form.closest('.modal, .drawer') && !go) TP.close(form.closest('.modal, .drawer'));
        if (go) setTimeout(function () { location.href = go; }, msgOk ? 600 : 0);
      });
    });
  }

  /* ---------- Small widgets ---------- */
  function initWidgets(root) {
    /* OTP inputs */
    $$('.otp-inputs', root).forEach(function (wrap) {
      var ins = $$('input', wrap);
      ins.forEach(function (inp, i) {
        inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(0, 1); if (inp.value && ins[i + 1]) ins[i + 1].focus(); });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !inp.value && ins[i - 1]) ins[i - 1].focus(); });
        inp.addEventListener('paste', function (e) {
          var d = (e.clipboardData.getData('text') || '').replace(/\D/g, '');
          if (d.length > 1) { e.preventDefault(); ins.forEach(function (x, j) { x.value = d[j] || ''; }); (ins[Math.min(d.length, ins.length) - 1] || inp).focus(); }
        });
      });
    });
    /* countdown: data-countdown="seconds" */
    $$('[data-countdown]', root).forEach(function (el) {
      var s = parseInt(el.getAttribute('data-countdown'), 10);
      var out = $('[data-countdown-text]', el) || el;
      var done = el.getAttribute('data-countdown-done');
      var iv = setInterval(function () {
        s--; if (s < 0) { clearInterval(iv); if (done) { if (done.indexOf('.html') > -1) location.href = done; else out.textContent = done; } return; }
        out.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      }, 1000);
    });
    /* qty stepper */
    $$('.qty', root).forEach(function (q) {
      var out = $('output, input', q);
      $$('button', q).forEach(function (b) {
        b.addEventListener('click', function () {
          var v = parseInt(out.value || out.textContent, 10) || 0;
          v = Math.max(0, v + (b.hasAttribute('data-inc') ? 1 : -1));
          if ('value' in out) out.value = v; out.textContent = v;
          q.dispatchEvent(new CustomEvent('tp:qty', { detail: v, bubbles: true }));
        });
      });
    });
    /* password reveal */
    $$('[data-reveal]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = document.getElementById(b.getAttribute('data-reveal'));
        i.type = i.type === 'password' ? 'text' : 'password';
        b.setAttribute('aria-pressed', i.type === 'text' ? 'true' : 'false');
      });
    });
    /* account nav (mobile) */
    $$('[data-account-nav-toggle]', root).forEach(function (b) {
      b.addEventListener('click', function () { var n = b.closest('.account-nav'); var o = n.classList.toggle('is-open'); b.setAttribute('aria-expanded', o); });
    });
    /* drag & drop zones */
    $$('.dropzone', root).forEach(function (z) {
      ['dragenter', 'dragover'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add('is-over'); }); });
      ['dragleave', 'drop'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.remove('is-over'); }); });
      z.addEventListener('drop', function (e) { var f = e.dataTransfer.files[0]; if (f) TP.toast('Selected: ' + f.name); });
    });
    /* range output */
    $$('input[type="range"][data-out]', root).forEach(function (r) {
      var o = document.getElementById(r.getAttribute('data-out'));
      function u() { o.textContent = (r.getAttribute('data-prefix') || '') + r.value + (r.getAttribute('data-suffix') || ''); }
      r.addEventListener('input', u); u();
    });
  }

  /* ---------- Header / nav ---------- */
  function initHeader() {
    var y = $$('[data-year]'); y.forEach(function (e) { e.textContent = new Date().getFullYear(); });
    /* cookie consent */
    var bar = $('#cookie-bar');
    if (bar && !TP.store.get('cookie', null)) bar.hidden = false;
    $$('[data-cookie]').forEach(function (b) {
      b.addEventListener('click', function () { TP.store.set('cookie', b.getAttribute('data-cookie')); if (bar) bar.hidden = true; TP.toast('Cookie preference saved'); });
    });
    /* theme (admin) */
    var th = TP.store.get('theme', 'light');
    if (document.body.classList.contains('admin-body')) document.documentElement.setAttribute('data-theme', th);
    $$('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', n); TP.store.set('theme', n);
      });
    });
    /* tracking hooks (template placeholders for GA4 / Pixel) */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="tel:"], a[href^="https://wa.me"], [data-track]');
      if (!a) return;
      var ev = a.getAttribute('data-track') || (a.href.indexOf('tel:') === 0 ? 'phone_click' : 'whatsapp_click');
      (window.dataLayer = window.dataLayer || []).push({ event: ev, label: a.textContent.trim() });
    });
  }

  /* ---------- PWA ---------- */
  function initPWA() {
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
      var sw = document.documentElement.getAttribute('data-root') + 'sw.js';
      navigator.serviceWorker.register(sw).catch(function () {});
    }
    var deferred;
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; $$('[data-install]').forEach(function (b) { b.hidden = false; }); });
    $$('[data-install]').forEach(function (b) {
      b.addEventListener('click', function () { if (deferred) { deferred.prompt(); deferred = null; } else TP.toast('Use your browser menu → "Add to Home screen" to install.'); });
    });
    function net() { var b = $('#offline-banner'); if (b) b.hidden = navigator.onLine; }
    window.addEventListener('online', net); window.addEventListener('offline', net);
  }

  TP.init = function (root) { initTabs(root); initTables(root); initForms(root); initWidgets(root); };
  document.addEventListener('DOMContentLoaded', function () {
    initHeader(); TP.init(document); initPWA();
  });
})();
