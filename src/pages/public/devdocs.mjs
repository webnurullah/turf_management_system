import { i, map, pageHero, badge } from '../../lib.mjs';

// Planned REST API surface the template screens map to. Kept as a page so
// front-end and back-end developers share one reference while building.
const API = [
  ['Availability & holds', [
    ['GET', '/api/v1/availability?branch=&pitch=&date=&duration=', 'Live slots for a pitch/date incl. price per slot and reason when unavailable', 'public'],
    ['POST', '/api/v1/holds', 'Lock one or more slots for 10 min (Redis lock + DB row). Idempotency-Key header required', 'customer'],
    ['DELETE', '/api/v1/holds/{id}', 'Release a hold early', 'customer'],
  ]],
  ['Bookings', [
    ['POST', '/api/v1/bookings', 'Create booking from a hold (online) or directly (staff). Runs conflict check inside a transaction', 'customer, bookings.create'],
    ['GET', '/api/v1/bookings/{id}', 'Booking with slots, add-ons, payments, status history', 'owner of booking, bookings.view'],
    ['POST', '/api/v1/bookings/{id}/reschedule', 'Secure new slot first, then release old slot atomically', 'customer, bookings.edit'],
    ['GET', '/api/v1/bookings/{id}/refund-preview', 'Policy-version-based refund calculation', 'customer'],
    ['POST', '/api/v1/bookings/{id}/cancel', 'Cancel with reason → refund + ledger reversal', 'customer, bookings.cancel'],
    ['POST', '/api/v1/bookings/{id}/check-in', 'QR token or manual check-in', 'checkin.write'],
    ['POST', '/api/v1/bookings/{id}/status', 'arrived · started · completed · no-show', 'bookings.edit'],
  ]],
  ['Payments', [
    ['POST', '/api/v1/payments/intents', 'Create gateway session (bKash, Nagad, Rocket, SSLCommerz, AamarPay)', 'customer'],
    ['POST', '/api/v1/webhooks/{gateway}', 'Signature-verified, idempotent webhook → queue → confirm booking + ledger', 'gateway signature'],
    ['POST', '/api/v1/payments/manual', 'Cash / bank / manual MFS entry (pending verification)', 'payments.collect'],
    ['POST', '/api/v1/refunds', 'Issue refund within approval limit', 'refunds.issue'],
  ]],
  ['Ledger & finance', [
    ['GET', '/api/v1/ledger?from=&to=&method=', 'Paginated, append-only ledger', 'ledger.view'],
    ['POST', '/api/v1/ledger/{id}/reversal', 'Post a reversal entry (never edit)', 'ledger.reverse'],
    ['POST', '/api/v1/closings', 'Daily closing with cash count and sign-off', 'closing.submit'],
    ['GET', '/api/v1/reports/{report}?format=csv|xlsx|pdf', 'Async report export (job id returned)', 'reports.*'],
  ]],
  ['Customers, CRM & loyalty', [
    ['GET', '/api/v1/customers?q=', 'Search by phone/email/name (PII masked without customers.pii)', 'customers.view'],
    ['POST', '/api/v1/loyalty/{customer}/adjust', 'Points adjustment with reason (audited)', 'loyalty.adjust'],
    ['POST', '/api/v1/coupons/validate', 'Validate coupon against cart, slot, branch, sport and stacking rules', 'customer'],
  ]],
  ['POS & inventory', [
    ['POST', '/api/v1/pos/sales', 'Sale with items → stock movements + ledger', 'pos.sell'],
    ['POST', '/api/v1/stock/movements', 'Purchase, adjustment, damage, loss, transfer', 'stock.adjust'],
    ['POST', '/api/v1/rentals/{id}/return', 'Return with condition, damage charge, deposit refund', 'rentals.manage'],
  ]],
  ['Auth', [
    ['POST', '/api/v1/auth/otp', 'Send OTP (rate-limited per phone & IP)', 'public'],
    ['POST', '/api/v1/auth/otp/verify', 'Verify OTP → session', 'public'],
    ['POST', '/api/v1/staff/login', 'Password + mandatory TOTP for admin roles', 'public'],
  ]],
];

export default {
  out: 'docs-api.html', title: 'API Reference (planned)', noindex: true,
  body: `${pageHero({ eyebrow: 'For developers', title: 'API reference', lead: 'The REST endpoints these template screens are designed to call. Versioned under /api/v1, JSON, cursor pagination, BDT amounts in paisa (integer).' })}
<section class="section"><div class="container stack-lg">
<div class="alert alert-info">${i('info')}<div><strong class="alert-title">Specification, not a running server</strong>This HTML template has no backend. Use this list (and docs/ARCHITECTURE.md in the repository) as the contract when building the API.</div></div>
<div class="grid-3">${map([['shield', 'Auth', 'Customer session cookie (OTP) · staff session + TOTP · API keys with scopes for integrations'], ['refresh', 'Idempotency', 'Idempotency-Key header on POST /holds, /bookings, /payments, /refunds; gateway reference de-duplicates webhooks'], ['lock', 'Conflicts', 'HTTP 409 with alternative slots when a slot is taken; every conflict attempt is logged']], ([ic, t, s]) => `<div class="card card-pad stack-sm"><span class="icon-box">${i(ic)}</span><strong>${t}</strong><span class="small muted">${s}</span></div>`)}</div>
${map(API, ([g, eps]) => `<section class="card"><div class="card-header"><h2>${g}</h2></div><div class="table-wrap"><table class="table table-stack"><thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th><th>Permission</th></tr></thead><tbody>${map(eps, ([m, p, d, perm]) => `<tr><td data-label="Method">${badge(m === 'GET' ? 'open' : m === 'DELETE' ? 'cancelled' : 'active', m)}</td><td data-label="Endpoint"><code>${p}</code></td><td data-label="Purpose" class="small">${d}</td><td data-label="Permission"><code class="xs">${perm}</code></td></tr>`)}</tbody></table></div></section>`)}
<section class="card card-pad"><h2 style="font-size:var(--fs-lg)">Example: create a hold</h2><pre class="code-block">POST /api/v1/holds
Idempotency-Key: 7b1d0c1e-4c2f-4f7a-9a51-1f0e2c3d4b5a
{ "branch": "dhanmondi", "slots": [ { "pitch": "A-FULL", "start": "2026-11-14T20:00:00+06:00", "minutes": 60 } ] }

201 Created
{ "hold_id": "hld_01J…", "expires_at": "2026-11-14T10:50:00+06:00",
  "slots": [ { "pitch": "A-FULL", "price": { "base": 450000, "floodlight": 30000, "currency": "BDT" } } ] }

409 Conflict
{ "error": "slot_unavailable", "reason": "linked_segment_booked", "alternatives": [ … ] }</pre></section>
</div></section>`,
};
