# TurfPro — Turf Website & Turf Management System (HTML template)

A complete, responsive **HTML/CSS/JavaScript template** for a Bangladesh-based sports turf business. One
product covers the public website, online booking, customer accounts, and a back office that runs the
whole business: bookings, front desk, POS, inventory, CRM, tournaments, academy, finance, HR, maintenance,
CMS, settings and security.

> **This is a front-end template.** Every screen and interaction is built, but it runs on sample data
> in the browser. There is no server, database or live payment/SMS/WhatsApp connection yet. Buttons that
> would call a server show a confirmation toast instead. See [What is real vs. demo](#what-is-real-vs-demo).

- **188 pages**: 69 public, 20 customer account, 7 sign-in, 90 back-office, 2 standalone
- **English / বাংলা** switcher, BDT (৳) formatting, Asia/Dhaka time, Bangladeshi mobile validation
- **Mobile-first, accessible** (keyboard, focus states, screen-reader labels, status by icon + text, reduced motion)
- **Installable PWA** (manifest, service worker, offline page)
- **No dependencies at runtime.** Pages open straight from disk (`file://`).

## Live site (GitHub Pages)

**https://webnurullah.github.io/turf_management_system/**

The built website lives in the `docs/` folder of the `main` branch, which GitHub Pages publishes directly.
One-time setup in GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch →
Branch: `main` / folder: `/docs` → Save**. The link above goes live within a minute or two, and every
later push to `main` updates it automatically.

| Live page | What you'll see |
|-----------|-----------------|
| [Home](https://webnurullah.github.io/turf_management_system/) | Public website |
| [All pages](https://webnurullah.github.io/turf_management_system/template-index.html) | Every screen, grouped |
| [Booking](https://webnurullah.github.io/turf_management_system/booking.html) | Booking engine |
| [Customer account](https://webnurullah.github.io/turf_management_system/account/index.html) | Customer dashboard |
| [Management system](https://webnurullah.github.io/turf_management_system/admin/dashboard.html) | Back office |

## Folder layout

| Folder | Contents |
|--------|----------|
| `docs/` | **The built website** (what GitHub Pages serves). Generated, so don't edit by hand |
| `src/` | Editable source: pages, styles, scripts, images |
| `build/` | Build, link-check and local preview scripts |
| `documentation/` | Developer & staff guides |

## Quick start (offline)

Download the repo and open `docs/index.html` in a browser. That's it.

Other entry points:

| Open | What you'll see |
|------|-----------------|
| `docs/template-index.html` | Links to every page, grouped |
| `docs/booking.html` | The booking engine (live slots, split pitch, cart, coupons, payment) |
| `docs/account/index.html` | Customer dashboard |
| `docs/admin/dashboard.html` | Management dashboard |
| `docs/style-guide.html` | Design system: colours, type, components |
| `docs/docs-api.html` | Planned REST API the screens map to |

To test the PWA and service worker, serve over HTTP:

```bash
npm run serve
```

Then visit http://localhost:8080.

## Editing the template

Pages are generated from small source modules so the header, footer, sidebar and components live in one place.

```bash
npm run build
```

```bash
npm run check
```

`build` writes the website to `docs/` (Node 18+, no npm install needed). `check` verifies every internal link and asset.

```
src/
  assets/css/        01-tokens (colours, fonts, spacing) → 02-base → 03-components → 04-public → 05-admin
  assets/js/         core.js (modals, tabs, tables, forms, toasts) · i18n.js · booking.js · charts.js · admin.js · site.js
  assets/img/        favicon, PWA icons, photos/ (see "Images")
  static/            manifest.webmanifest, sw.js
  lib.mjs            Shared components: badge, kpi, table, field, modal, drawer, chart, media…
  layouts.mjs        public · account · auth · admin · bare layouts
  nav.mjs            Main menu, footer, account menu, admin sidebar (spec §44)
  data.mjs           Sample business data (pitches, plans, offers, customers…)
  widgets.mjs        Public-site composite widgets (turf card, search panel, plans…)
  admin/modules.mjs  Declarative config for ~50 back-office list screens
  admin/crud.mjs     Generator for those list screens (KPIs, filters, table, create drawer)
  pages/             One module per page group: public/, account/, admin/
build/
  build.mjs          Assembles pages → docs/ (the folder GitHub Pages publishes)
  check-links.mjs    Fails on any broken internal link
  serve.mjs          Tiny static server for PWA testing
```

**Common changes**

- *Brand colours and fonts*: `src/assets/css/01-tokens.css`
- *Business name, phone, address*: `BRAND` in `src/nav.mjs`
- *Prices, pitches, plans, offers*: `src/data.mjs` (display), plus `UNITS`/`CFG` in `src/assets/js/booking.js` (booking engine demo)
- *Add a back-office list screen*: add an entry to `src/admin/modules.mjs` and a sidebar item in `src/nav.mjs`
- *Bangla text*: add keys to `BN` in `src/assets/js/i18n.js` and mark elements with `data-i18n="key"`

## Images

Every image area accepts a real photo. Drop JPGs into `src/assets/img/photos/` using the file names listed in
[`src/assets/img/photos/README.md`](src/assets/img/photos/README.md), then run `npm run build`. Missing photos fall back
to an illustrated turf graphic, so nothing ever shows as broken. Use your own photography or images you hold a
licence for. Don't copy images from Google search results.

## What is real vs. demo

| Works in the template (client-side) | Needs the backend to be real |
|---|---|
| Slot grid with full/half-pitch conflict rules, 60/90-min slots, peak/off-peak/weekend/holiday/floodlight pricing | Authoritative availability and **database-level** double-booking prevention |
| Multi-slot cart, 10-min hold countdown and auto-release, add-ons, coupons, membership/coupon stacking rule, wallet & points, VAT, advance vs. full | Holds stored in Redis/DB; coupon & wallet validation on the server |
| Validation, success page with booking ID, QR placeholder, `.ics` calendar download, share | Real QR token, SMS/WhatsApp/email confirmations |
| POS cart with stock limits, daily-closing cash count, pricing simulator, import wizard steps, permission matrix UI, score entry | Persisting stock, ledger, payroll, imports, permissions |
| EN/BN switch, dark mode for staff, PWA install + offline page | Server-rendered `/bn/` pages for SEO |

**Payments, SMS, WhatsApp and email are not connected.** Gateway screens are labelled *Sandbox*. To go
live you need merchant accounts and credentials. See [`documentation/INTEGRATIONS.md`](documentation/INTEGRATIONS.md).

**Legal pages contain placeholder text** and must be reviewed by a qualified Bangladeshi lawyer before launch.

## Documentation

- [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md): recommended production stack, data model, booking/payment/refund state machines, conflict-prevention design, permissions
- [`documentation/INTEGRATIONS.md`](documentation/INTEGRATIONS.md): payment gateways, SMS, WhatsApp, email, maps, analytics: what each needs
- [`documentation/STAFF-GUIDE.md`](documentation/STAFF-GUIDE.md): front-desk and administrator quick guide
- [`docs/docs-api.html`](docs/docs-api.html): planned REST endpoints

## Quality checks run on this template

- `npm run check`: 0 broken links across all pages
- Automated browser sweep of all 188 pages at 360 px and 1440 px: no JavaScript errors, no horizontal scrolling, one `<h1>` per page, every form control labelled, every image has `alt`
- Scripted flows: full pitch blocks both halves; two halves coexist; a half blocks the full pitch; hold timer; discount stacking; VAT; validation; payment → success; EN↔BN; modal focus trap + Esc; POS stock decrement and over-sell guard; daily-closing difference; staff walk-in with cash; table search; row drawer; mobile menu

## Browser support

Latest Chrome, Edge, Firefox and Safari (desktop and mobile). Uses CSS `:has()` for radio-card highlighting, with a graceful fallback.
