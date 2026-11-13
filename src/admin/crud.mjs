// Generic back-office list/CRUD screen. Each module in modules.mjs is rendered
// with the same accessible structure: KPIs → toolbar → table → create drawer.
import { R, i, kpi, adminHead, toolbar, table, tableFooter, drawer, field, confirmModal, alert, map, cell } from '../lib.mjs';
import { ADMIN_NAV } from '../nav.mjs';

const groupOf = (slug) => { const g = ADMIN_NAV.find(([, items]) => items.some((x) => x[0] === slug)); return g ? [g[0], `admin/${g[1][0][0]}.html`] : ['Admin', 'admin/dashboard.html']; };

export function crudPage(m) {
  const id = `t-${m.slug}`;
  const formFields = (m.form || []).map(([label, name, type = 'text', options, extra = {}]) => field({ label, name, type, options, ...extra })).join('');
  const kpis = m.kpis ? `<div class="kpi-grid">${map(m.kpis, ([label, value, icon, tone, meta, delta]) => kpi({ label, value, icon, tone, meta, delta }))}</div>` : '';
  const rowData = (r) => {
    const d = { __title: String(r[0]).split('|')[0] };
    m.cols.forEach(([l, t], k) => { d[l] = t === 'badge' ? cell('badge', r[k]) : t === 'money' && typeof r[k] === 'number' ? '৳' + r[k].toLocaleString('en-IN') : String(r[k] ?? '—').replace('|', ' · '); });
    return d;
  };
  const body = `${adminHead({ title: m.title, desc: m.desc, crumb: [groupOf(m.slug), [m.title, '']], actions: `${m.actions || ''}${m.create === false ? '' : `<button type="button" class="btn btn-primary" data-open="#create-drawer">${i('plus')}${m.create || 'Add new'}</button>`}` })}
${m.banner || ''}
${kpis}
${m.before || ''}
<section class="card" aria-label="${m.title} list">
${m.tabs ? `<div class="tabs" style="padding:0 1rem" role="group" aria-label="Views">${m.tabs.map((t, k) => `<button type="button" class="tab" aria-selected="${k === 0}" data-toast="Filtered: ${t}">${t}</button>`).join('')}</div>` : ''}
${toolbar({ id, placeholder: m.search || `Search ${m.title.toLowerCase()}…`, filters: m.filters || [] })}
<div class="bulk-bar" data-bulk="${id}"><strong><span data-bulk-count>0</span> selected</strong>${(m.bulk || ['Export selected', 'Archive']).map((b) => `<button type="button" class="btn btn-sm" data-toast="${b}: done">${b}</button>`).join('')}</div>
${table({ id, cols: m.cols, rows: m.rows, select: m.select !== false, rowData, actions: m.rowActions })}
<div data-table-empty hidden>${'<div class="empty"><div class="empty-icon">' + i('search') + '</div><h3>No matching records</h3><p class="muted">Try a different search or clear the filters.</p></div>'}</div>
${tableFooter(id, m.rows.length)}
</section>
${m.after || ''}`;
  const createDrawer = drawer({
    id: 'create-drawer', title: m.create || `New ${m.title}`, cls: 'drawer-sheet',
    body: `<form id="create-form" class="stack" data-validate data-success="${m.saved || 'Saved'} · audit log entry created">${formFields || field({ label: 'Name', name: 'name', required: true })}${m.formNote ? `<p class="xs muted mb-0">${m.formNote}</p>` : ''}</form>`,
    foot: `<button type="button" class="btn" data-close>Cancel</button><button type="submit" form="create-form" class="btn btn-primary">${i('check')}Save</button>`,
  });
  return {
    out: `admin/${m.slug}.html`, title: m.title, layout: 'admin', nav: m.nav || m.slug, scripts: m.scripts || [],
    body, after: `${createDrawer}${confirmModal()}${m.modals || ''}${m.drawerExtra ? `<div id="row-drawer-extra" hidden>${m.drawerExtra}</div>` : ''}`,
  };
}
