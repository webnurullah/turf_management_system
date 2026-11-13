import { R, i, esc, attr, avatar, modal, drawer } from './lib.mjs';
import { BRAND, PUBLIC_NAV, FOOTER, ACCOUNT_NAV, ADMIN_NAV } from './nav.mjs';

const brandMark = (dark = false, sub = true) => `<a class="brand${dark ? ' brand-dark' : ''}" href="${R}index.html" aria-label="${BRAND.name} home"><span class="brand-mark">${i('ball')}</span><span>TurfPro${sub ? `<small>Arena · Dhaka</small>` : ''}</span></a>`;

function head(p) {
  const title = p.title === 'Home' ? `${BRAND.name} — Book Football & Cricket Turf in Dhaka` : `${p.title} | ${BRAND.name}`;
  const desc = p.description || 'Book football turf, futsal, cricket nets and badminton courts in Dhaka with live availability, instant confirmation and secure bKash, Nagad and card payments.';
  const noindex = p.noindex || /^(account|admin)\//.test(p.out);
  const url = `${BRAND.domain}/${p.out.replace(/index\.html$/, '')}`;
  return `<!doctype html>
<html lang="en" data-root="${R}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${url}">\n<link rel="alternate" hreflang="en" href="${url}">\n<link rel="alternate" hreflang="bn" href="${BRAND.domain}/bn/${p.out.replace(/index\.html$/, '')}">`}
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${BRAND.name}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BRAND.domain}/assets/img/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F172A">
<link rel="manifest" href="${R}manifest.webmanifest">
<link rel="icon" href="${R}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${R}assets/img/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&family=Sora:wght@600;700;800&display=swap">
<link rel="stylesheet" href="${R}assets/css/app.css">
${(p.jsonld || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
<!-- Analytics placeholders: GA4 (G-XXXXXXX) and Meta Pixel are loaded only after cookie consent. See README → Tracking. -->
</head>`;
}

const scripts = (p) => ['core', 'i18n', ...(p.scripts || [])].map((s) => `<script src="${R}assets/js/${s}.js" defer></script>`).join('\n');

function headerPublic(p) {
  const nav = PUBLIC_NAV.map((n) => {
    if (n.href) return `<li><a href="${R}${n.href}"${p.nav === n.key ? ' aria-current="page"' : ''} data-i18n="${n.i18n}">${n.label}</a></li>`;
    return `<li><button type="button" class="nav-trigger" data-dropdown aria-expanded="false" aria-haspopup="true"><span data-i18n="${n.i18n}">${n.label}</span>${i('chevron-down')}</button><div class="mega">${n.mega.map(([h, ic, t, s]) => `<a href="${R}${h}"><span class="icon-box icon-box-sm">${i(ic)}</span><span><strong>${t}</strong><span>${s}</span></span></a>`).join('')}</div></li>`;
  }).join('');
  const mobile = PUBLIC_NAV.map((n) => n.href ? `<a href="${R}${n.href}">${i('chevron-right')}<span data-i18n="${n.i18n}">${n.label}</span></a>` : `<div class="mn-group">${n.label}</div>${n.mega.map(([h, ic, t]) => `<a href="${R}${h}">${i(ic)}${t}</a>`).join('')}`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<div class="topbar"><div class="container"><div class="topbar-links"><a href="${BRAND.phoneHref}">${i('phone')} ${BRAND.phone}</a><span class="hide-sm">${i('clock')} ${BRAND.hours}</span></div><div class="topbar-links"><a href="${BRAND.wa}" target="_blank" rel="noopener" class="hide-sm">${i('whatsapp')} WhatsApp</a><a href="${R}admin/login.html">${i('lock')} Staff login</a></div></div></div>
<header class="site-header"><div class="container">
${brandMark()}
<nav class="main-nav" aria-label="Main"><ul>${nav}</ul></nav>
<div class="header-actions">
<div class="lang-toggle" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="bn" aria-pressed="false" lang="bn">বাং</button></div>
<a class="btn btn-outline-light btn-sm hide-lg" href="${R}account/login.html">${i('user')}<span data-i18n="nav.login">Login</span></a>
<a class="btn btn-primary btn-sm" href="${R}booking.html" data-track="cta_book_header"><span data-i18n="nav.book">Book Now</span></a>
<button type="button" class="btn btn-ghost btn-icon nav-toggle" data-open="#mobile-nav" aria-label="Open menu">${i('menu')}</button>
</div></div></header>
<aside class="drawer drawer-left mobile-nav" id="mobile-nav" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-label="Menu">
<div class="drawer-head">${brandMark(false, false)}<button type="button" class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Close menu" style="color:#fff">${i('x')}</button></div>
<div class="drawer-body"><a class="btn btn-primary btn-block mb-4" href="${R}booking.html" style="color:#fff;justify-content:center">${i('calendar')}Book Now</a>${mobile}<div class="mn-group">Account</div><a href="${R}account/login.html">${i('login')}Login / Sign up</a><a href="${R}account/index.html">${i('user')}My account</a><a href="${R}help.html">${i('life-buoy')}Help center</a></div>
</aside>`;
}

function footerPublic() {
  return `<footer class="site-footer"><div class="container">
<div class="footer-grid">
<div class="footer-brand">${brandMark()}<p class="mt-4">${BRAND.address}<br>${BRAND.hours}</p><p><a href="${BRAND.phoneHref}">${BRAND.phone}</a><br><a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
<div class="social"><a href="#" aria-label="Facebook">${i('facebook')}</a><a href="#" aria-label="Instagram">${i('instagram')}</a><a href="#" aria-label="YouTube">${i('youtube')}</a><a href="${BRAND.wa}" aria-label="WhatsApp">${i('whatsapp')}</a></div></div>
${FOOTER.map(([t, k, links]) => `<div><h3 data-i18n="${k}">${t}</h3><ul>${links.map(([l, h]) => `<li><a href="${R}${h}">${l}</a></li>`).join('')}</ul></div>`).join('')}
</div>
<div class="footer-bottom"><span>© <span data-year>2026</span> ${BRAND.name}. <span data-i18n="f.rights">All rights reserved.</span> Trade licence & BIN placeholders.</span>
<div class="pay-logos" aria-label="Accepted payments"><span class="pay-logo">bKash</span><span class="pay-logo">Nagad</span><span class="pay-logo">Rocket</span><span class="pay-logo">VISA</span><span class="pay-logo">Mastercard</span><span class="pay-logo">SSLCommerz</span><span class="pay-logo">AamarPay</span></div></div>
</div></footer>`;
}

const globals = (p) => `
<a class="wa-float no-print" href="${BRAND.wa}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${i('whatsapp')}</a>
<div class="cookie-bar" id="cookie-bar" hidden role="region" aria-label="Cookie consent"><strong>We use cookies</strong><p class="small text-2 mt-2">Essential cookies keep booking working. With your permission we also use analytics and marketing cookies (Google Analytics, Meta Pixel). <a href="${R}cookie-policy.html">Cookie policy</a></p><div class="btn-group"><button type="button" class="btn btn-primary btn-sm" data-cookie="all">Accept all</button><button type="button" class="btn btn-sm" data-cookie="essential">Essential only</button><a class="btn btn-ghost btn-sm" href="${R}cookie-policy.html#preferences">Preferences</a></div></div>
<div class="alert alert-warning" id="offline-banner" hidden style="position:fixed;top:0;left:0;right:0;z-index:999;border-radius:0">${i('wifi')}<div>You're offline. Live availability is paused — we'll refresh when you reconnect.</div></div>`;

export function publicLayout(p) {
  return `${head(p)}
<body class="${p.bodyClass || ''}">
${headerPublic(p)}
<main id="main">
${p.body}
</main>
${footerPublic()}
${globals(p)}
${p.after || ''}
${scripts(p)}
</body></html>`;
}

export function accountLayout(p) {
  const nav = ACCOUNT_NAV.map(([g, items]) => `<div class="an-group">${g}</div>${items.map(([k, h, ic, l, key]) => `<a href="${R}${h}"${p.nav === k ? ' aria-current="page"' : ''}>${i(ic)}<span data-i18n="${key}">${l}</span></a>`).join('')}`).join('');
  return publicLayout({
    ...p,
    body: `<div class="container"><div class="account-layout">
<nav class="account-nav" aria-label="Account">
<div class="row-nowrap" style="padding:.5rem .5rem .75rem">${avatar('Rafiq Hasan', 'avatar')}<div class="grow"><strong class="small">Rafiq Hasan</strong><div class="xs muted">Gold member · 1,240 pts</div></div><button type="button" class="btn btn-ghost btn-icon btn-sm account-nav-toggle" data-account-nav-toggle aria-expanded="false" aria-label="Toggle account menu">${i('menu')}</button></div>
<div class="an-links">${nav}<hr style="margin:.6rem 0"><a href="${R}account/login.html">${i('logout')}<span data-i18n="acc.logout">Log out</span></a></div>
</nav>
<div class="account-main" id="account-main">${p.body}</div>
</div></div>`,
  });
}

export function authLayout(p) {
  return `${head(p)}
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="auth-wrap">
<aside class="auth-side">${brandMark()}
<div><span class="eyebrow">${i('zap')} Instant confirmation</span><h2>Your next match is a few taps away.</h2><ul class="check-list" style="color:#CBD5E1">${['Live slot availability — no phone calls', 'Pay with bKash, Nagad, Rocket or card', 'Earn loyalty points on every booking', 'Split the cost with your team'].map((t) => `<li>${i('check-circle')}${t}</li>`).join('')}</ul></div>
<p class="small" style="color:#94A3B8">“Booked our weekly Thursday slot in under a minute.” — Tanvir, Dhanmondi Strikers</p></aside>
<main class="auth-main" id="main"><div class="row-between">${brandMark(true)}<div class="lang-toggle" role="group" aria-label="Language" style="border-color:var(--border)"><button type="button" data-lang="en" aria-pressed="true" style="color:var(--text-2)">EN</button><button type="button" data-lang="bn" aria-pressed="false" lang="bn" style="color:var(--text-2)">বাং</button></div></div>
<div class="auth-card">${p.body}</div>
<p class="xs muted text-center mt-6">Protected by OTP rate-limiting and device verification · <a href="${R}privacy.html">Privacy</a> · <a href="${R}terms.html">Terms</a></p></main>
</div>
${scripts(p)}
</body></html>`;
}

export function bareLayout(p) {
  return `${head(p)}
<body>
<main id="main" class="state-page">${p.body}</main>
${scripts(p)}
</body></html>`;
}

export function adminLayout(p) {
  const groups = ADMIN_NAV.map(([g, items]) => `<div class="sb-group" data-group="${attr(g)}"><button type="button" aria-expanded="true"><span data-i18n="sb.${attr(g)}">${g}</span>${i('chevron-down')}</button><ul>${items.map(([slug, label, ic, count]) => {
    const c = count ? `<span class="sb-count${String(count).endsWith('!') ? ' is-alert' : ''}">${String(count).replace('!', '')}</span>` : '';
    return `<li><a class="sb-link" href="${R}admin/${slug}.html"${p.nav === slug ? ' aria-current="page"' : ''}>${i(ic)}<span data-i18n="sb.${attr(label)}">${label}</span>${c}</a></li>`;
  }).join('')}</ul></div>`).join('');
  return `${head({ ...p, noindex: true })}
<body class="admin-body">
<a class="skip-link" href="#main">Skip to content</a>
<aside class="admin-sidebar" aria-label="Management navigation">
<div class="sb-brand">${brandMark(false)}<button type="button" class="btn btn-ghost btn-icon btn-sm sb-close" aria-label="Close navigation" style="margin-left:auto;color:#fff">${i('x')}</button></div>
<div class="dropdown"><button type="button" class="sb-branch" data-dropdown aria-expanded="false" aria-haspopup="true"><span class="icon-box icon-box-sm is-dark">${i('building')}</span><span class="grow"><small>Branch</small>Dhanmondi (Main)</span>${i('chevron-down')}</button>
<div class="dropdown-menu" style="left:.75rem;right:.75rem"><button type="button" data-toast="Viewing all branches (consolidated)">${i('layers')}All branches · consolidated</button><button type="button" data-toast="Branch: Dhanmondi">${i('check')}Dhanmondi (Main)</button><button type="button" disabled style="opacity:.55">${i('clock')}Bashundhara · opening 2027</button><hr><a href="${R}admin/branches.html">${i('plus')}Add branch</a></div></div>
<div class="sb-scroll"><div class="sb-search"><label class="sr-only" for="sb-filter">Filter menu</label><input class="input" id="sb-filter" type="search" placeholder="Filter menu…" autocomplete="off"></div>${groups}</div>
<div class="sb-foot">${avatar('Nadia Rahman', 'avatar-sm')}<div class="grow"><strong style="color:#fff">Nadia Rahman</strong><small>Owner · all branches</small></div><a class="btn btn-ghost btn-icon btn-sm" href="${R}admin/login.html" aria-label="Log out" style="color:#94A3B8">${i('logout')}</a></div>
</aside>
<div class="sb-overlay"></div>
<div class="admin-main">
<header class="admin-topbar">
<button type="button" class="btn btn-ghost btn-icon sb-open" aria-label="Open navigation">${i('menu')}</button>
<div class="admin-search input-icon">${i('search')}<input class="input" type="search" placeholder="Search bookings, customers, phone, invoice…" aria-label="Global search" data-cmdk readonly><kbd>Ctrl K</kbd></div>
<div class="topbar-actions">
<span class="badge badge-violet hide-mobile" title="HTML template: actions run on sample data and are not saved to a server">${i('info')}Template · sample data</span>
<a class="btn btn-primary btn-sm hide-mobile" href="${R}admin/booking-new.html">${i('plus')}New booking</a>
<button type="button" class="btn btn-ghost btn-icon show-sm" data-open="#cmdk" aria-label="Search">${i('search')}</button>
<div class="lang-toggle" role="group" aria-label="Language" style="border-color:var(--border)"><button type="button" data-lang="en" aria-pressed="true" style="color:var(--text-2)">EN</button><button type="button" data-lang="bn" aria-pressed="false" lang="bn" style="color:var(--text-2)">বাং</button></div>
<button type="button" class="btn btn-ghost btn-icon" data-theme-toggle aria-label="Toggle dark mode">${i('moon')}</button>
<div class="dropdown"><button type="button" class="btn btn-ghost btn-icon" data-dropdown aria-expanded="false" aria-label="Notifications, 4 unread">${i('bell')}<span class="notif-dot"></span></button>
<div class="dropdown-menu" style="width:340px;max-width:calc(100vw - 2rem)"><div class="row-between" style="padding:.4rem .6rem"><strong class="small">Notifications</strong><a class="xs" href="${R}admin/notifications.html">Settings</a></div>
<a href="${R}admin/payments.html">${i('alert', 'text-red')}<span><strong>Webhook failed</strong><br><span class="xs muted">Nagad callback · TPB-261113-4810 · retry queued</span></span></a>
<a href="${R}admin/stock.html">${i('box', 'text-amber')}<span><strong>Low stock: Football size 5</strong><br><span class="xs muted">3 left · reorder level 6</span></span></a>
<a href="${R}admin/refunds.html">${i('rotate-ccw')}<span><strong>2 refunds awaiting approval</strong><br><span class="xs muted">Above ৳2,000 · manager sign-off</span></span></a>
<a href="${R}admin/weather.html">${i('cloud-rain')}<span><strong>Rain warning 6–9 PM</strong><br><span class="xs muted">Outdoor pitches · 7 bookings affected</span></span></a></div></div>
<div class="dropdown"><button type="button" class="btn btn-ghost" data-dropdown aria-expanded="false" aria-label="Account menu" style="padding:.25rem">${avatar('Nadia Rahman', 'avatar-sm')}</button>
<div class="dropdown-menu"><div style="padding:.5rem .7rem"><strong class="small">Nadia Rahman</strong><div class="xs muted">Owner · 2FA enabled</div></div><hr><a href="${R}admin/users.html">${i('user')}My profile</a><a href="${R}admin/audit-logs.html">${i('history')}My activity</a><a href="${R}index.html" target="_blank">${i('external-link')}View website</a><hr><a href="${R}admin/login.html">${i('logout')}Log out</a></div></div>
</div>
</header>
<main class="admin-content" id="main">
${p.body}
</main>
</div>
${modal({ id: 'cmdk', title: 'Search & jump', body: `<div class="input-icon mb-4">${i('search')}<label class="sr-only" for="cmdk-input">Search pages, bookings or customers</label><input class="input" id="cmdk-input" type="search" placeholder="Type a page, booking ID, phone…" autocomplete="off" aria-controls="cmdk-list"></div><div class="cmdk-list" id="cmdk-list" role="listbox"></div><p class="xs muted mt-4 mb-0"><kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close</p>` })}
${drawer({ id: 'row-drawer', title: '<span id="row-drawer-title">Details</span>', body: '', foot: `<button type="button" class="btn" data-close>Close</button><button type="button" class="btn btn-primary" data-open="#create-drawer">${i('edit')}Edit</button>` })}
${p.after || ''}
${scripts({ ...p, scripts: [...(p.scripts || []), 'admin'] })}
</body></html>`;
}

export const LAYOUTS = { public: publicLayout, account: accountLayout, auth: authLayout, bare: bareLayout, admin: adminLayout };
