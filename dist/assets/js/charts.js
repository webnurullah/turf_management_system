/* ==========================================================================
   Tiny dependency-free SVG charts.
   <div class="chart" data-chart="line|area|bar|stacked|donut"
        data-labels='["Mon","Tue"]'
        data-series='[{"name":"Revenue","color":"#16A34A","data":[1,2]}]'
        data-format="money|number|percent"></div>
   Swap for Chart.js / ECharts in production if richer charts are required.
   ========================================================================== */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function fmt(v, f) {
    if (f === 'money') return '৳' + (v >= 100000 ? (v / 100000).toFixed(1) + 'L' : v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k' : Math.round(v));
    if (f === 'percent') return Math.round(v) + '%';
    return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v * 10) / 10);
  }
  function niceMax(m) { if (m <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(m))); var n = m / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }

  function tip(box) {
    var t = box.querySelector('.chart-tip');
    if (!t) { t = document.createElement('div'); t.className = 'chart-tip'; box.appendChild(t); }
    return t;
  }

  function cartesian(box, type, labels, series, f) {
    var W = box.clientWidth || 600, H = parseInt(box.getAttribute('data-height') || 240, 10);
    var P = { l: 44, r: 10, t: 12, b: 28 };
    var iw = W - P.l - P.r, ih = H - P.t - P.b;
    var stacked = type === 'stacked';
    var max = 0;
    if (stacked) labels.forEach(function (_, i) { var s = 0; series.forEach(function (x) { s += x.data[i] || 0; }); max = Math.max(max, s); });
    else series.forEach(function (s) { s.data.forEach(function (v) { max = Math.max(max, v); }); });
    max = niceMax(max);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': box.getAttribute('aria-label') || 'Chart' });
    for (var g = 0; g <= 4; g++) {
      var y = P.t + ih - (ih * g / 4);
      svg.appendChild(el('line', { x1: P.l, x2: W - P.r, y1: y, y2: y, class: 'ax', 'stroke-dasharray': g ? '3 4' : '' }));
      var tl = el('text', { x: P.l - 8, y: y + 4, 'text-anchor': 'end', class: 'ax-label' }); tl.textContent = fmt(max * g / 4, f); svg.appendChild(tl);
    }
    var step = iw / labels.length;
    var every = Math.ceil(labels.length / Math.max(1, Math.floor(iw / 48)));
    labels.forEach(function (lb, i) {
      if (i % every) return;
      var t = el('text', { x: P.l + step * i + step / 2, y: H - 8, 'text-anchor': 'middle', class: 'ax-label' }); t.textContent = lb; svg.appendChild(t);
    });
    var T = tip(box);
    function show(i, x, y) {
      T.innerHTML = '<strong>' + labels[i] + '</strong><br>' + series.map(function (s) { return '<span style="color:' + s.color + '">●</span> ' + s.name + ': ' + fmt(s.data[i], f); }).join('<br>');
      T.style.left = (x / W * 100) + '%'; T.style.top = y + 'px'; T.style.opacity = 1;
    }
    if (type === 'line' || type === 'area') {
      series.forEach(function (s) {
        var pts = s.data.map(function (v, i) { return [P.l + step * i + step / 2, P.t + ih - (v / max) * ih]; });
        var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
        if (type === 'area' || s.area) {
          var gid = 'g' + Math.random().toString(36).slice(2);
          var defs = el('defs', {}); var lg = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
          lg.appendChild(el('stop', { offset: '0%', 'stop-color': s.color, 'stop-opacity': .28 })); lg.appendChild(el('stop', { offset: '100%', 'stop-color': s.color, 'stop-opacity': 0 }));
          defs.appendChild(lg); svg.appendChild(defs);
          svg.appendChild(el('path', { d: d + ' L' + pts[pts.length - 1][0] + ' ' + (P.t + ih) + ' L' + pts[0][0] + ' ' + (P.t + ih) + ' Z', fill: 'url(#' + gid + ')' }));
        }
        svg.appendChild(el('path', { d: d, fill: 'none', stroke: s.color, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': s.dashed ? '5 5' : '' }));
        pts.forEach(function (p) { svg.appendChild(el('circle', { cx: p[0], cy: p[1], r: 3, fill: s.color })); });
      });
      labels.forEach(function (_, i) {
        var hit = el('rect', { x: P.l + step * i, y: P.t, width: step, height: ih, fill: 'transparent' });
        hit.addEventListener('mouseenter', function () { show(i, P.l + step * i + step / 2, P.t + ih - (series[0].data[i] / max) * ih); });
        hit.addEventListener('mouseleave', function () { T.style.opacity = 0; });
        svg.appendChild(hit);
      });
    } else {
      var n = stacked ? 1 : series.length;
      var bw = Math.min(28, (step * .7) / n);
      labels.forEach(function (_, i) {
        var acc = 0;
        series.forEach(function (s, si) {
          var v = s.data[i] || 0, h = (v / max) * ih;
          var x = P.l + step * i + (step - bw * n) / 2 + (stacked ? 0 : bw * si);
          var y = P.t + ih - h - (stacked ? acc : 0);
          if (stacked) acc += h;
          var r = el('rect', { x: x, y: y, width: Math.max(2, bw - (stacked ? 0 : 2)), height: Math.max(0, h), rx: stacked ? 0 : 4, fill: s.color });
          r.addEventListener('mouseenter', function () { show(i, x + bw / 2, y); });
          r.addEventListener('mouseleave', function () { T.style.opacity = 0; });
          svg.appendChild(r);
        });
      });
    }
    return svg;
  }

  function donut(box, labels, series, f) {
    var data = series[0].data, colors = series[0].colors || [];
    var total = data.reduce(function (a, b) { return a + b; }, 0) || 1;
    var S = 200, R = 80, w = 26, C = 2 * Math.PI * R, off = 0;
    var svg = el('svg', { viewBox: '0 0 ' + S + ' ' + S, role: 'img', 'aria-label': box.getAttribute('aria-label') || 'Chart', style: 'max-width:220px;margin:auto' });
    svg.appendChild(el('circle', { cx: S / 2, cy: S / 2, r: R, fill: 'none', stroke: 'var(--surface-3)', 'stroke-width': w }));
    var T = tip(box);
    data.forEach(function (v, i) {
      var len = (v / total) * C;
      var c = el('circle', { cx: S / 2, cy: S / 2, r: R, fill: 'none', stroke: colors[i], 'stroke-width': w, 'stroke-dasharray': len + ' ' + (C - len), 'stroke-dashoffset': -off, transform: 'rotate(-90 ' + S / 2 + ' ' + S / 2 + ')' });
      c.addEventListener('mouseenter', function () { T.innerHTML = '<strong>' + labels[i] + '</strong>: ' + fmt(v, f) + ' (' + Math.round(v / total * 100) + '%)'; T.style.left = '50%'; T.style.top = '40px'; T.style.opacity = 1; });
      c.addEventListener('mouseleave', function () { T.style.opacity = 0; });
      svg.appendChild(c); off += len;
    });
    // Percentage donuts show the leading segment; value donuts show the total
    var top = data.indexOf(Math.max.apply(null, data));
    var t1 = el('text', { x: S / 2, y: S / 2 - 2, 'text-anchor': 'middle', style: 'font:700 22px Manrope,sans-serif;fill:var(--text)' }); t1.textContent = f === 'percent' ? Math.round(data[top] / total * 100) + '%' : fmt(total, f);
    var t2 = el('text', { x: S / 2, y: S / 2 + 18, 'text-anchor': 'middle', class: 'ax-label' }); t2.textContent = f === 'percent' ? labels[top] : (box.getAttribute('data-center') || 'Total');
    svg.appendChild(t1); svg.appendChild(t2);
    var lg = document.createElement('div'); lg.className = 'chart-legend';
    lg.innerHTML = labels.map(function (l, i) { return '<span><i style="background:' + colors[i] + '"></i>' + l + ' · ' + Math.round(data[i] / total * 100) + '%</span>'; }).join('');
    return [svg, lg];
  }

  function render(box) {
    var type = box.getAttribute('data-chart');
    var labels = JSON.parse(box.getAttribute('data-labels') || '[]');
    var series = JSON.parse(box.getAttribute('data-series') || '[]');
    var f = box.getAttribute('data-format') || 'number';
    Array.prototype.slice.call(box.querySelectorAll('svg, .chart-legend')).forEach(function (n) { n.remove(); });
    if (type === 'donut') { var r = donut(box, labels, series, f); box.appendChild(r[0]); box.appendChild(r[1]); return; }
    box.appendChild(cartesian(box, type, labels, series, f));
    if (series.length > 1) {
      var lg = document.createElement('div'); lg.className = 'chart-legend';
      lg.innerHTML = series.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + s.name + '</span>'; }).join('');
      box.appendChild(lg);
    }
  }
  function all() { document.querySelectorAll('[data-chart]').forEach(render); }
  document.addEventListener('DOMContentLoaded', all);
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(all, 200); });
  window.TPCharts = { render: render, all: all };
})();
