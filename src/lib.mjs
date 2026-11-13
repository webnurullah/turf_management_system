// Shared build-time component helpers. Every page module imports from here,
// so markup for a component lives in exactly one place.
import { icons } from './icons.mjs';

export const R = '{{root}}'; // replaced with the correct relative prefix per page

export function i(name, cls = '') {
  const p = icons[name];
  if (!p) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
}
export const money = (n) => '৳' + Math.round(n).toLocaleString('en-IN');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const attr = (s) => esc(s).replace(/'/g, '&#39;');
export const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
export const map = (arr, fn) => arr.map(fn).join('');

/* ---------- Status badges: icon + text, never colour alone ---------- */
const STATUS = {
  confirmed: ['green', 'check-circle', 'Confirmed'], paid: ['green', 'check-circle', 'Paid'], active: ['green', 'check-circle', 'Active'],
  completed: ['green', 'check', 'Completed'], published: ['green', 'globe', 'Published'], approved: ['green', 'check-circle', 'Approved'],
  resolved: ['green', 'check-circle', 'Resolved'], delivered: ['green', 'check', 'Delivered'], present: ['green', 'check', 'Present'],
  ok: ['green', 'check-circle', 'In stock'], healthy: ['green', 'check-circle', 'Healthy'], verified: ['green', 'shield-check', 'Verified'],
  success: ['green', 'check-circle', 'Success'], won: ['green', 'trophy', 'Won'], live: ['red', 'dot', 'Live'], settled: ['green', 'check', 'Settled'],
  available: ['green', 'check', 'Available'], reconciled: ['green', 'check-circle', 'Reconciled'], enabled: ['green', 'toggle-right', 'Enabled'],
  pending: ['amber', 'clock', 'Pending'], partial: ['amber', 'clock', 'Partial'], due: ['amber', 'alert', 'Due'], held: ['amber', 'lock', 'On hold'],
  scheduled: ['blue', 'calendar', 'Scheduled'], draft: ['outline', 'edit', 'Draft'], review: ['amber', 'eye', 'In review'], late: ['amber', 'clock', 'Late'],
  low: ['amber', 'alert', 'Low stock'], 'in-progress': ['blue', 'refresh', 'In progress'], open: ['blue', 'inbox', 'Open'], sent: ['blue', 'send', 'Sent'],
  'checked-in': ['blue', 'user-check', 'Checked in'], started: ['blue', 'play', 'Started'], upcoming: ['blue', 'calendar', 'Upcoming'],
  processing: ['blue', 'refresh', 'Processing'], waiting: ['blue', 'clock', 'Waiting'], leave: ['violet', 'calendar', 'On leave'], sandbox: ['violet', 'code', 'Sandbox'],
  registration: ['blue', 'user-plus', 'Registration open'], rented: ['blue', 'package', 'Rented out'], trial: ['violet', 'sparkles', 'Trial'],
  failed: ['red', 'x-circle', 'Failed'], cancelled: ['red', 'x-circle', 'Cancelled'], refunded: ['violet', 'rotate-ccw', 'Refunded'], rejected: ['red', 'x-circle', 'Rejected'],
  'no-show': ['red', 'ban', 'No-show'], overdue: ['red', 'alert', 'Overdue'], absent: ['red', 'x', 'Absent'], out: ['red', 'x-circle', 'Out of stock'],
  expired: ['outline', 'clock', 'Expired'], inactive: ['outline', 'minus', 'Inactive'], closed: ['outline', 'archive', 'Closed'], blocked: ['red', 'ban', 'Blocked'],
  suspended: ['red', 'ban', 'Suspended'], damaged: ['red', 'alert', 'Damaged'], urgent: ['red', 'alert-octagon', 'Urgent'], high: ['amber', 'alert', 'High'],
  medium: ['blue', 'minus', 'Medium'], normal: ['outline', 'minus', 'Normal'], disabled: ['outline', 'power', 'Disabled'], down: ['red', 'x-circle', 'Down'],
  degraded: ['amber', 'alert', 'Degraded'], warning: ['amber', 'alert', 'Warning'], reversed: ['violet', 'rotate-ccw', 'Reversed'], escalated: ['red', 'flag', 'Escalated'],
  credit: ['green', 'arrow-down-left', 'Credit'], debit: ['red', 'arrow-up-right', 'Debit'],
};
export function badge(key, label) {
  const k = String(key).toLowerCase();
  const s = STATUS[k] || ['outline', 'dot', key];
  const icon = icons[s[1]] ? s[1] : 'dot';
  return `<span class="badge badge-${s[0]}">${i(icon)}${label || s[2]}</span>`;
}

/* ---------- Media placeholders (swap for real photography) ---------- */
export function art(kind = 'football') {
  const stroke = 'stroke="rgba(255,255,255,.55)" stroke-width="2" fill="none"';
  if (kind === 'cricket') return `<svg class="pitch-art" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><ellipse cx="200" cy="125" rx="185" ry="112" ${stroke}/><ellipse cx="200" cy="125" rx="95" ry="60" ${stroke} stroke-dasharray="6 6"/><rect x="185" y="85" width="30" height="80" fill="rgba(234,179,8,.35)" ${stroke}/><path d="M180 95h40M180 155h40" ${stroke}/></svg>`;
  if (kind === 'court') return `<svg class="pitch-art" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect x="40" y="30" width="320" height="190" ${stroke}/><path d="M200 30v190M40 60h320M40 190h320M120 30v190M280 30v190M120 125h160" ${stroke}/></svg>`;
  return `<svg class="pitch-art" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="stripes" width="50" height="250" patternUnits="userSpaceOnUse"><rect width="25" height="250" fill="rgba(255,255,255,.05)"/></pattern></defs><rect width="400" height="250" fill="url(#stripes)"/><rect x="20" y="20" width="360" height="210" rx="4" ${stroke}/><path d="M200 20v210" ${stroke}/><circle cx="200" cy="125" r="36" ${stroke}/><circle cx="200" cy="125" r="3" fill="rgba(255,255,255,.7)"/><rect x="20" y="75" width="50" height="100" ${stroke}/><rect x="330" y="75" width="50" height="100" ${stroke}/><rect x="20" y="102" width="18" height="46" ${stroke}/><rect x="362" y="102" width="18" height="46" ${stroke}/></svg>`;
}
// Photo slots: drop JPG/WebP files into src/assets/img/photos/<name>.jpg (see README → Images).
// If a file is missing the <img> removes itself and the illustrated turf graphic shows instead.
export const PHOTO_EXT = 'jpg';
export function photo(name, alt = '', eager = false) {
  return name ? `<img class="media-photo" src="${R}assets/img/photos/${name}.${PHOTO_EXT}" alt="${attr(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.remove()">` : '';
}
export function media({ kind = 'football', tone = '', cls = '', tag = '', tagR = '', label = '', alt = '', img = '', eager = false } = {}) {
  const toneCls = tone ? ` media-${tone}` : kind === 'cricket' ? ' media-cricket' : kind === 'court' ? ' media-court' : '';
  const a = alt || label || 'Turf photo';
  return `<div class="media${toneCls}${cls ? ' ' + cls : ''}"${img ? '' : ` role="img" aria-label="${attr(a)}"`}>${art(kind)}${photo(img, a, eager)}${tag ? `<span class="media-tag">${tag}</span>` : ''}${tagR ? `<span class="media-tag-r">${tagR}</span>` : ''}${label ? `<span class="media-label">${label}</span>` : ''}</div>`;
}
export const stars = (n = 5) => `<span class="stars" aria-label="${n} out of 5 stars">${Array.from({ length: 5 }, (_, k) => k < Math.round(n) ? i('star') : i('star', '" style="opacity:.25')).join('')}</span>`;
export const avatar = (name, cls = '') => `<span class="avatar${cls ? ' ' + cls : ''}" aria-hidden="true">${initials(name)}</span>`;

/* ---------- Layout fragments ---------- */
export function crumbs(items) {
  return `<nav aria-label="Breadcrumb"><ol class="breadcrumb">${items.map((c, k) => k === items.length - 1 ? `<li><span aria-current="page">${c[0]}</span></li>` : `<li><a href="${R}${c[1]}">${c[0]}</a></li>`).join('')}</ol></nav>`;
}
export function pageHero({ title, lead = '', eyebrow = '', crumb = [], actions = '' }) {
  return `<section class="page-hero"><div class="container">${crumb.length ? crumbs([['Home', 'index.html'], ...crumb]) : ''}${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h1>${title}</h1>${lead ? `<p class="mb-0">${lead}</p>` : ''}${actions ? `<div class="row mt-6">${actions}</div>` : ''}</div></section>`;
}
export function sectionHead(eyebrow, title, lead = '', action = '') {
  return `<div class="section-head"><div>${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}<h2 class="mb-2">${title}</h2>${lead ? `<p>${lead}</p>` : ''}</div>${action}</div>`;
}
export function adminHead({ title, desc = '', crumb = [], actions = '' }) {
  return `<div class="admin-page-head"><div>${crumb.length ? `<nav aria-label="Breadcrumb"><ol class="breadcrumb">${[['Dashboard', 'admin/dashboard.html'], ...crumb].map((c, k, a) => k === a.length - 1 ? `<li><span aria-current="page">${c[0]}</span></li>` : `<li><a href="${R}${c[1]}">${c[0]}</a></li>`).join('')}</ol></nav>` : ''}<h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div>${actions ? `<div class="btn-group">${actions}</div>` : ''}</div>`;
}
export function pageTitle(title, desc = '', actions = '') {
  return `<div class="page-title"><div><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div>${actions ? `<div class="btn-group">${actions}</div>` : ''}</div>`;
}
export function kpi({ label, value, meta = '', icon = '', tone = '', delta = '' }) {
  const d = delta ? (delta.startsWith('-') ? `<span class="delta-down">${i('trending-down')} ${delta.slice(1)}</span>` : `<span class="delta-up">${i('trending-up')} ${delta.replace('+', '')}</span>`) : '';
  return `<div class="card kpi">${icon ? `<span class="kpi-icon${tone ? ' is-' + tone : ''}">${i(icon)}</span>` : ''}<span class="kpi-label">${label}</span><span class="kpi-value">${value}</span>${meta || d ? `<span class="kpi-meta">${d}${meta}</span>` : ''}</div>`;
}
export function empty({ icon = 'inbox', title, text = '', action = '', tone = '' }) {
  return `<div class="empty"><div class="empty-icon${tone ? ' is-' + tone : ''}">${i(icon)}</div><h3>${title}</h3>${text ? `<p class="muted">${text}</p>` : ''}${action}</div>`;
}
export function alert(type, title, text, icon) {
  const ic = icon || { info: 'info', success: 'check-circle', warning: 'alert', error: 'alert-octagon' }[type];
  return `<div class="alert alert-${type}" role="${type === 'error' ? 'alert' : 'status'}">${i(ic)}<div>${title ? `<strong class="alert-title">${title}</strong>` : ''}${text}</div></div>`;
}
export const templateNote = (text = 'Template preview — actions use sample data and are not connected to a server.') =>
  `<div class="alert alert-info template-note no-print" role="note">${i('info')}<div>${text}</div></div>`;

/* ---------- Forms ---------- */
let fid = 0;
export function field({ label, name, type = 'text', value = '', placeholder = '', required = false, hint = '', options = null, cls = '', rows = 4, attrs = '', id }) {
  const fidv = id || `f-${name || 'x'}-${++fid}`;
  const req = required ? ' required' : '';
  let control;
  if (type === 'select') control = `<select class="select" id="${fidv}" name="${name}"${req} ${attrs}>${(options || []).map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${attr(v)}"${v === value ? ' selected' : ''}>${l}</option>`; }).join('')}</select>`;
  else if (type === 'textarea') control = `<textarea class="textarea" id="${fidv}" name="${name}" rows="${rows}" placeholder="${attr(placeholder)}"${req} ${attrs}>${value}</textarea>`;
  else if (type === 'file') control = `<input class="input" type="file" id="${fidv}" name="${name}" ${attrs}>`;
  else control = `<input class="input" type="${type}" id="${fidv}" name="${name}" value="${attr(value)}" placeholder="${attr(placeholder)}"${req} ${attrs}>`;
  return `<div class="field ${cls}"><label class="label" for="${fidv}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>${control}${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
}
export const check = (label, { checked = false, name = '', id = '', required = false } = {}) =>
  `<label class="check"><input type="checkbox"${name ? ` name="${name}"` : ''}${id ? ` id="${id}"` : ''}${checked ? ' checked' : ''}${required ? ' required' : ''}><span>${label}</span></label>`;
export const toggle = (label, checked = false, id = '') =>
  `<label class="switch"><input type="checkbox"${checked ? ' checked' : ''}${id ? ` id="${id}"` : ''}><span class="track" aria-hidden="true"></span><span>${label}</span></label>`;

/* ---------- Tables ---------- */
// cols: [label, type?] where type: text | main | user | money | num | badge | date | muted | html
export function cell(type, v) {
  if (v === null || v === undefined) return '—';
  switch (type) {
    case 'main': { const [a, b] = String(v).split('|'); return `<div class="cell-main">${a}</div>${b ? `<div class="cell-sub">${b}</div>` : ''}`; }
    case 'user': { const [a, b] = String(v).split('|'); return `<div class="cell-user">${avatar(a, 'avatar-sm')}<div><div class="cell-main">${a}</div>${b ? `<div class="cell-sub">${b}</div>` : ''}</div></div>`; }
    case 'money': return typeof v === 'number' ? money(v) : v;
    case 'badge': return String(v).split(',').map((x) => badge(x.trim())).join(' ');
    case 'muted': return `<span class="muted">${v}</span>`;
    case 'code': return `<code>${v}</code>`;
    default: return String(v);
  }
}
export function table({ id, cols, rows, select = false, actions = true, stack = true, rowData = null, compact = false, foot = '' }) {
  const isNum = (t) => t === 'money' || t === 'num';
  return `<div class="table-wrap"><table class="table${stack ? ' table-stack' : ''}${compact ? ' table-compact' : ''}" ${id ? `id="${id}" data-table` : ''}>
<thead><tr>${select ? `<th class="td-check" scope="col"><input type="checkbox" aria-label="Select all rows"></th>` : ''}${cols.map(([l, t]) => `<th scope="col"${isNum(t) ? ' class="t-num"' : ''} data-sortable>${l}</th>`).join('')}${actions ? '<th scope="col" class="td-actions"><span class="sr-only">Actions</span></th>' : ''}</tr></thead>
<tbody>${rows.map((r, ri) => {
    const data = rowData ? rowData(r, ri) : null;
    return `<tr${data ? ` data-row='${attr(JSON.stringify(data))}' tabindex="0"` : ''}>${select ? `<td class="td-check" data-label=""><input type="checkbox" aria-label="Select row ${ri + 1}"></td>` : ''}${cols.map(([l, t], ci) => `<td data-label="${attr(l)}"${isNum(t) ? ' class="t-num"' : ''}>${cell(t, r[ci])}</td>`).join('')}${actions ? `<td class="td-actions" data-label=""><div class="dropdown"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-dropdown aria-haspopup="true" aria-expanded="false" aria-label="Row actions">${i('more-h')}</button><div class="dropdown-menu">${typeof actions === 'string' ? actions : defaultRowActions}</div></div></td>` : ''}</tr>`;
  }).join('\n')}</tbody>${foot}</table></div>`;
}
const defaultRowActions = `<button type="button" data-toast="Opening details">${i('eye')}View</button><button type="button" data-open="#create-drawer">${i('edit')}Edit</button><button type="button" data-toast="Exported row">${i('download')}Export</button><hr><button type="button" data-open="#confirm-modal" class="text-red">${i('archive')}Archive</button>`;

export function toolbar({ id, placeholder = 'Search…', filters = [], extra = '' }) {
  return `<div class="toolbar"><div class="input-icon">${i('search')}<input class="input" type="search" placeholder="${attr(placeholder)}" data-table-search="${id}" aria-label="Search table"></div>${filters.map((f) => `<label class="sr-only" for="flt-${id}-${attr(f[0])}">${f[0]}</label><select class="select" id="flt-${id}-${attr(f[0])}" data-table-filter="${id}"><option value="all">${f[0]}: All</option>${f[1].map((o) => `<option>${o}</option>`).join('')}</select>`).join('')}${extra}<div class="grow"></div><div class="dropdown"><button type="button" class="btn btn-sm" data-dropdown aria-expanded="false">${i('download')}<span data-i18n="c.export">Export</span></button><div class="dropdown-menu"><button type="button" data-toast="Excel export queued — you'll get a download link">${i('file-text')}Excel (.xlsx)</button><button type="button" data-toast="CSV export downloaded">${i('file')}CSV</button><button type="button" data-toast="PDF report generated">${i('file-text')}PDF</button><button type="button" data-print>${i('printer')}Print view</button></div></div></div>`;
}
export function tableFooter(id, total) {
  return `<div class="table-footer"><span data-table-info="${id}">Showing ${total} records</span><nav class="pagination" aria-label="Pagination"><a href="#" aria-label="Previous page">${i('chevron-left')}</a><a href="#" aria-current="page">1</a><a href="#">2</a><a href="#">3</a><span>…</span><a href="#">12</a><a href="#" aria-label="Next page">${i('chevron-right')}</a></nav></div>`;
}

/* ---------- Modals / drawers ---------- */
export function modal({ id, title, body, foot = '', size = '' }) {
  return `<div class="modal${size ? ' modal-' + size : ''}" id="${id}" hidden aria-hidden="true"><div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="${id}-title"><div class="modal-head"><h2 id="${id}-title">${title}</h2><button type="button" class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Close">${i('x')}</button></div><div class="modal-body">${body}</div>${foot ? `<div class="modal-foot">${foot}</div>` : ''}</div></div>`;
}
export function drawer({ id, title, body, foot = '', cls = '' }) {
  return `<aside class="drawer ${cls}" id="${id}" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="${id}-title"><div class="drawer-head"><h2 id="${id}-title">${title}</h2><button type="button" class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Close">${i('x')}</button></div><div class="drawer-body" id="${id}-body">${body}</div>${foot ? `<div class="drawer-foot">${foot}</div>` : ''}</aside>`;
}
export const confirmModal = (title = 'Archive this record?', text = 'Records are soft-deleted and kept for audit. This action is logged with your name and the reason.') =>
  modal({ id: 'confirm-modal', title, body: `<p class="text-2">${text}</p>${field({ label: 'Reason', name: 'reason', type: 'textarea', rows: 2, required: true, placeholder: 'Required for the audit log' })}`, foot: `<button type="button" class="btn" data-close>Cancel</button><button type="button" class="btn btn-danger" data-close data-toast="Archived · audit entry created">Confirm</button>` });

/* ---------- Chart helpers ---------- */
export function chart(type, labels, series, { height = 240, format = 'number', label = 'Chart', center = '' } = {}) {
  return `<div class="chart" data-chart="${type}" data-height="${height}" data-format="${format}" aria-label="${attr(label)}"${center ? ` data-center="${attr(center)}"` : ''} data-labels='${attr(JSON.stringify(labels))}' data-series='${attr(JSON.stringify(series))}' style="min-height:${height}px"></div>`;
}
export function heatmap(rows, cols, valueFn) {
  let h = `<div class="heatmap" style="grid-template-columns:48px repeat(${cols.length},minmax(0,1fr))" role="img" aria-label="Occupancy heatmap by day and hour"><span></span>${cols.map((c) => `<span class="hm-label" style="justify-content:center">${c}</span>`).join('')}`;
  rows.forEach((r, ri) => {
    h += `<span class="hm-label">${r}</span>`;
    cols.forEach((c, ci) => { const v = valueFn(ri, ci); h += `<span class="hm-cell" title="${r} ${c}: ${v}% occupied" style="background:rgba(22,163,74,${(0.08 + v / 110).toFixed(2)})">${v}</span>`; });
  });
  return h + '</div>';
}
export const C = { green: '#16A34A', emerald: '#10B981', navy: '#0F172A', lime: '#84CC16', amber: '#F59E0B', red: '#EF4444', blue: '#0EA5E9', violet: '#8B5CF6', gray: '#94A3B8' };
