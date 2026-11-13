import { R, i, money, map, field, alert, empty, badge } from '../../lib.mjs';
import { searchPanel, turfCard, PITCHES } from '../../widgets.mjs';

const state = ({ icon, tone = '', code = '', title, text, actions, extra = '' }) => `<div class="state-page"><div class="state-card">${code ? `<div class="state-code">${code}</div>` : `<div class="empty-icon${tone ? ' is-' + tone : ''}" style="width:88px;height:88px">${i(icon, 'i-xl')}</div>`}<h1 style="font-size:var(--fs-3xl)">${title}</h1><p class="text-2">${text}</p><div class="row" style="justify-content:center">${actions}</div>${extra}</div></div>`;
const btn = (h, t, cls = '') => `<a class="btn ${cls}" href="${R}${h}">${t}</a>`;

export default [
  {
    out: 'booking-success.html', title: 'Booking Confirmed', scripts: ['site'], noindex: true,
    body: `<div class="container" data-success-page style="padding-block:var(--sp-10) var(--sp-16)">
<div class="text-center stack-sm mb-8"><div class="empty-icon" style="width:84px;height:84px">${i('check-circle', 'i-xl')}</div><span data-b="status">${badge('confirmed')}</span><h1 style="font-size:var(--fs-3xl)" data-b="headline">You’re booked! See you on the pitch.</h1><p class="text-2 mb-0">Confirmation sent by SMS, email and WhatsApp. Booking ID <strong class="num" data-b="id">TPB-…</strong></p></div>
<div class="split">
<div class="stack">
<div class="card"><div class="card-header"><h2>Your slots</h2><span class="small muted" data-b="name"></span></div><ul class="list list-pad" data-b="items"></ul></div>
<div class="card card-pad"><h2 style="font-size:var(--fs-lg)">Payment</h2><dl class="dl"><dt>Method</dt><dd data-b="method">bKash</dd><dt>Total</dt><dd class="num" data-b="total">—</dd><dt>Paid now</dt><dd class="num text-green" data-b="paid">—</dd><dt>Due at venue</dt><dd class="num" data-b="due">—</dd></dl>
<div class="row mt-4"><a class="btn btn-sm" href="${R}account/invoice.html">${i('download')}Download receipt</a><a class="btn btn-sm btn-ghost" href="${R}account/booking-detail.html">Manage booking ${i('arrow-right')}</a></div></div>
<div class="card card-pad"><h2 style="font-size:var(--fs-lg)">Share with your team</h2><p class="small text-2">Send the match details — teammates can pay their share via the split-cost link.</p><div class="row"><a class="btn btn-sm" id="wa-share" href="#" target="_blank" rel="noopener">${i('whatsapp')}WhatsApp</a><button type="button" class="btn btn-sm" id="share-booking">${i('share')}Share</button><button type="button" class="btn btn-sm" data-copy="https://www.turfpro.example/split/TPB-261113-4821">${i('link')}Copy split-cost link</button></div></div>
</div>
<aside class="stack"><div class="card card-pad text-center"><h2 style="font-size:var(--fs-lg)">Check-in QR</h2><div class="qr mx-auto" id="qr" style="margin-inline:auto"></div><p class="xs muted mt-2">Show this at the front desk. QR placeholder — production encodes a signed check-in token.</p><button type="button" class="btn btn-primary btn-block" id="add-cal">${i('calendar-plus')}Add to calendar (.ics)</button></div>
<div class="card card-pad small"><strong>Before you arrive</strong><ul class="check-list mt-2"><li>${i('clock')}Arrive 10 min early; grace period 10 min.</li><li>${i('shirt')}Studs ≤ 13 mm, no metal studs.</li><li>${i('rotate-ccw')}Free cancellation until 24 h before.</li></ul></div></aside>
</div></div>`,
  },
  {
    out: 'payment-processing.html', title: 'Processing Payment', scripts: ['site'], noindex: true,
    body: `<div class="state-page" data-processing data-next="${R}booking-success.html"><div class="state-card card card-pad" style="max-width:480px"><div class="spinner mb-6" role="status" aria-label="Processing payment"></div><h1 style="font-size:var(--fs-2xl)">Confirming your <span data-gw>bKash</span> payment…</h1><p class="text-2">Please don’t close this window or press back. This usually takes under 10 seconds.</p>
<ol class="timeline text-left mt-6" style="text-align:left">${map(['Redirected to <span data-gw>gateway</span> sandbox', 'Payment authorised by customer', 'Webhook received & signature verified', 'Ledger entry posted · slot confirmed'], (s) => `<li class="is-muted" data-proc-step>${s}</li>`)}</ol>
<p class="xs muted mb-0">Idempotency key protects you from double charges if you refresh.</p></div></div>
<style>[data-proc-step].is-done::after{border-color:var(--primary);background:var(--primary)}</style>`,
  },
  {
    out: 'payment-failed.html', title: 'Payment Failed', noindex: true,
    body: state({ icon: 'x-circle', tone: 'red', title: 'Payment didn’t go through', text: 'Your bank or wallet declined the transaction. No money was taken. Your slots are still held for <strong class="num" data-countdown="420"><span data-countdown-text>07:00</span></strong>.', actions: `${btn('booking.html#step-7', i('refresh') + 'Try again', 'btn-primary')}${btn('booking.html#step-7', 'Use another method')}`, extra: `<div class="mt-6 text-left">${alert('info', 'Common reasons', 'Insufficient balance · wrong PIN/OTP · daily limit reached · session timed out at the gateway. Reference: <code>PAY-ATT-88213</code>')}</div>` }),
  },
  {
    out: 'payment-pending.html', title: 'Payment Pending', noindex: true,
    body: state({ icon: 'clock', tone: 'amber', title: 'Payment is being verified', text: 'The gateway hasn’t confirmed your payment yet. We’ll update your booking automatically when the webhook arrives — usually within a few minutes. You won’t be charged twice.', actions: `${btn('account/bookings.html', 'View my bookings', 'btn-primary')}${btn('support-ticket.html', 'Contact support')}`, extra: `<p class="xs muted mt-6">Booking TPB-261113-4821 · status: <span class="badge badge-amber">${i('clock')}Payment pending</span></p>` }),
  },
  {
    out: 'payment-cancelled.html', title: 'Payment Cancelled', noindex: true,
    body: state({ icon: 'x', title: 'You cancelled the payment', text: 'No problem — nothing was charged. Your selected slots will be released when the hold timer ends.', actions: `${btn('booking.html', 'Return to booking', 'btn-primary')}${btn('index.html', 'Back to home')}` }),
  },
  {
    out: 'reschedule.html', title: 'Reschedule Booking', noindex: true, scripts: ['booking'],
    body: `<div class="container" style="padding-block:var(--sp-8) var(--sp-12)"><a href="${R}account/booking-detail.html" class="small">${i('arrow-left')} Back to booking</a><h1 class="mt-4" style="font-size:var(--fs-3xl)">Reschedule TPB-261113-4821</h1>
${alert('info', 'Your current slot stays booked until the new one is secured', 'We lock the new slot first, then release the old one in a single step — you can never end up with neither. Free reschedule until 6 hours before start; price difference is charged or credited to wallet.')}
<div class="grid-2 mt-6"><div class="card card-pad"><span class="badge badge-outline">Current</span><h2 class="mt-2" style="font-size:var(--fs-lg)">Pitch A — Full · Fri 14 Nov, 8:00–9:00 PM</h2><p class="small muted mb-0">Paid ৳1,660 advance · total ৳5,520</p></div><div class="card card-pad"><span class="badge badge-green">New</span><h2 class="mt-2" style="font-size:var(--fs-lg)">Choose below</h2><p class="small muted mb-0">Price difference shown before you confirm.</p></div></div>
<p class="mt-6"><a class="btn btn-primary btn-lg" href="${R}booking.html?pitch=A-FULL">${i('calendar')}Pick a new slot</a></p></div>`,
  },
  {
    out: 'cancel-booking.html', title: 'Cancel Booking', noindex: true, scripts: ['site'],
    body: `<div class="container" style="padding-block:var(--sp-8) var(--sp-12);max-width:820px"><a href="${R}account/booking-detail.html" class="small">${i('arrow-left')} Back to booking</a><h1 class="mt-4" style="font-size:var(--fs-3xl)">Cancel booking</h1>
<div class="card card-pad stack" data-refund-preview data-paid="1660"><div class="row-between"><div><strong>Pitch A — Full · Fri 14 Nov, 8:00 PM</strong><div class="small muted">TPB-261113-4821 · advance paid ৳1,660 via bKash · policy v3.2 (accepted 13 Nov 2026, 10:42)</div></div>${badge('confirmed')}</div>
<div class="field"><label class="label" for="rf-hours">Preview: time before start <span id="rf-hours-out" class="muted"></span></label><input type="range" id="rf-hours" min="0" max="72" value="33" style="accent-color:var(--primary)"></div>
<fieldset><legend>Refund to</legend><div class="radio-cards"><label class="radio-card"><input type="radio" name="rf-dest" value="original" checked>${i('smartphone')}<span>Original method (bKash)<br><span class="xs muted">3–7 working days</span></span></label><label class="radio-card"><input type="radio" name="rf-dest" value="wallet">${i('wallet')}<span>TurfPro wallet<br><span class="xs muted">Instant · +20% bonus on partial refunds</span></span></label></div></fieldset>
<div class="grid-3"><div class="card kpi"><span class="kpi-label">Refund %</span><span class="kpi-value" id="rf-pct">—</span></div><div class="card kpi"><span class="kpi-label">You get back</span><span class="kpi-value text-green" id="rf-amt">—</span></div><div class="card kpi"><span class="kpi-label">Cancellation charge</span><span class="kpi-value" id="rf-fee">—</span></div></div>
${field({ label: 'Reason for cancelling', name: 'reason', type: 'select', options: ['Team not available', 'Weather', 'Found another time', 'Price', 'Other'] })}
<div class="row"><a class="btn btn-danger" href="${R}refund-status.html">${i('x-circle')}Confirm cancellation</a><a class="btn" href="${R}reschedule.html">Reschedule instead</a></div></div></div>`,
  },
  {
    out: 'refund-status.html', title: 'Refund Status', noindex: true,
    body: `<div class="container" style="padding-block:var(--sp-10) var(--sp-12);max-width:720px"><h1 style="font-size:var(--fs-3xl)">Refund RF-20931</h1><p class="text-2">For booking TPB-261113-4821 · ${badge('processing')}</p>
<div class="card card-pad"><ol class="timeline">${map([['Cancellation requested', '13 Nov 2026, 11:02 AM'], ['Refund calculated by policy v3.2 — 100% of ৳1,660', '13 Nov 2026, 11:02 AM'], ['Approved automatically (under ৳2,000)', '13 Nov 2026, 11:03 AM'], ['Sent to bKash — reference BKR8823XQ', '13 Nov 2026, 11:05 AM']], ([t, d]) => `<li>${t}<time>${d}</time></li>`)}<li class="is-muted">Credited to your account<time>Expected by 18 Nov 2026</time></li></ol></div>
<p class="small muted mt-4">Questions? <a href="${R}support-ticket.html">Raise a refund ticket</a> and quote RF-20931.</p></div>`,
  },
  {
    out: 'review-feedback.html', title: 'Rate Your Game', noindex: true,
    body: `<div class="container" style="padding-block:var(--sp-10) var(--sp-12);max-width:640px"><div class="card card-pad stack"><h1 style="font-size:var(--fs-2xl)">How was your game on Pitch A?</h1><p class="text-2 mb-0">Fri 14 Nov · 8:00 PM · Dhanmondi Strikers</p>
<form class="stack" data-validate data-success="Thanks! You earned 20 loyalty points." data-redirect="${R}account/reviews.html"><fieldset><legend>Overall rating</legend><div class="segmented" data-toggle-group role="group">${map([1, 2, 3, 4, 5], (n) => `<button type="button" aria-pressed="${n === 5}">${n} ★</button>`)}</div></fieldset>
<div class="grid-3">${map(['Turf quality', 'Staff', 'Cleanliness'], (l) => field({ label: l, name: l, type: 'select', options: ['Excellent', 'Good', 'Okay', 'Poor'] }))}</div>
${field({ label: 'Tell us more', name: 'review', type: 'textarea', required: true, placeholder: 'What went well? What could be better?' })}
<label class="check"><input type="checkbox" checked><span>Publish my review with first name only</span></label><button class="btn btn-primary" type="submit">Submit review</button></form></div></div>`,
  },
  {
    out: 'search-results.html', title: 'Search Results', noindex: true,
    body: `<div class="container" style="padding-block:var(--sp-8) var(--sp-12)"><h1 style="font-size:var(--fs-2xl)">Results for “football night”</h1><p class="muted">3 pitches · 1 tournament · 2 articles</p>${searchPanel()}<h2 class="mt-8" style="font-size:var(--fs-xl)">Pitches</h2><div class="grid-3">${map(PITCHES.slice(0, 3), turfCard)}</div></div>`,
  },
  {
    out: 'no-results.html', title: 'No Results', noindex: true,
    body: `<div class="container">${state({ icon: 'search', title: 'No results for “tennis”', text: 'We don’t offer that yet. Try football, futsal, cricket or badminton — or tell us what you’d like to play.', actions: `${btn('turfs.html', 'Browse all turfs', 'btn-primary')}${btn('contact.html', 'Suggest a sport')}` })}</div>`,
  },
  {
    out: 'no-slot.html', title: 'No Available Slot', noindex: true,
    body: `<div class="container" style="padding-block:var(--sp-10) var(--sp-12);max-width:720px"><h1 class="sr-only">No available slot</h1>${empty({ icon: 'calendar-x', tone: 'amber', title: 'Fully booked on Fri 14 Nov, 7–10 PM', text: 'Join the waitlist — if a slot opens (cancellation or released hold) we notify you instantly by SMS and WhatsApp. First to confirm gets it.' })}
<form class="card card-pad stack" data-validate data-success="You’re #3 on the waitlist. We’ll text you the moment a slot opens."><div class="form-grid">${field({ label: 'Pitch', name: 'p', type: 'select', options: ['Any pitch', 'Pitch A — Full', 'Pitch A — Half', 'Pitch B'] })}${field({ label: 'Preferred window', name: 'w', type: 'select', options: ['7–10 PM', '6–8 PM', 'Any evening'] })}${field({ label: 'Mobile', name: 'm', type: 'tel', required: true, placeholder: '01XXXXXXXXX' })}${field({ label: 'Notify via', name: 'n', type: 'select', options: ['SMS + WhatsApp', 'SMS', 'Email'] })}</div><button class="btn btn-primary" type="submit">${i('bell')}Join waitlist</button></form>
<h2 class="mt-8" style="font-size:var(--fs-lg)">Nearest alternatives</h2><div class="grid-3">${map([['Fri 6:00 PM', 'Pitch A · Half 2', 2600], ['Fri 10:00 PM', 'Pitch A · Full', 4500], ['Sat 7:00 AM', 'Pitch A · Full', 3500]], ([t, p, pr]) => `<a class="card card-pad card-hover card-link" href="${R}booking.html"><strong>${t}</strong><div class="small muted">${p}</div><span class="num">${money(pr)}</span></a>`)}</div></div>`,
  },
  {
    out: 'session-expired.html', title: 'Session Expired', noindex: true,
    body: state({ icon: 'clock', tone: 'amber', title: 'Your session has expired', text: 'For your security we sign you out after 30 minutes of inactivity. Any slot holds have been released.', actions: `${btn('account/login.html', i('login') + 'Log in again', 'btn-primary')}${btn('index.html', 'Home')}` }),
  },
  {
    out: 'access-denied.html', title: 'Access Denied', noindex: true,
    body: state({ code: '403', title: 'You don’t have access to this page', text: 'Your role doesn’t include this permission. If you think this is a mistake, ask your branch manager or the owner to update your role.', actions: `${btn('admin/dashboard.html', 'Go to dashboard', 'btn-primary')}${btn('index.html', 'Home')}`, extra: '<p class="xs muted mt-4">Request ID 7f3a-91c2 · this attempt was logged.</p>' }),
  },
  {
    out: '404.html', title: 'Page Not Found', noindex: true,
    body: state({ code: '404', title: 'This page is offside', text: 'The page you’re looking for doesn’t exist or has moved. Let’s get you back in play.', actions: `${btn('index.html', 'Home', 'btn-primary')}${btn('booking.html', 'Book a slot')}${btn('sitemap.html', 'Sitemap', 'btn-ghost')}` }),
  },
  {
    out: '500.html', title: 'Something Went Wrong', noindex: true,
    body: state({ code: '500', title: 'Something went wrong on our side', text: 'Our team has been notified automatically. If you were paying, don’t retry yet — check My bookings first so you’re not charged twice.', actions: `${btn('account/bookings.html', 'Check my bookings', 'btn-primary')}${btn('index.html', 'Home')}`, extra: '<p class="xs muted mt-4">Error ID 5e21-aa07 · 13 Nov 2026 14:22 BST</p>' }),
  },
  {
    out: 'maintenance.html', title: 'Scheduled Maintenance', noindex: true, layout: 'bare',
    body: `<div class="state-card"><div class="empty-icon is-amber" style="width:88px;height:88px">${i('tool', 'i-xl')}</div><h1 style="font-size:var(--fs-3xl)">We’re upgrading the booking system</h1><p class="text-2">Back by <strong>3:00 AM</strong> (Asia/Dhaka). Existing bookings are safe and the venue is open as usual.</p><p>Need help now? Call <a href="tel:+8801711000000">+880 1711-000000</a> or <a href="https://wa.me/8801711000000">WhatsApp us</a>.</p></div>`,
  },
  {
    out: 'offline.html', title: 'You Are Offline', noindex: true, layout: 'bare',
    body: `<div class="state-card"><div class="empty-icon is-blue" style="width:88px;height:88px">${i('wifi', 'i-xl')}</div><h1 style="font-size:var(--fs-3xl)">You’re offline</h1><p class="text-2">Live availability and payments need a connection. Your saved bookings and QR codes are still available in the app.</p><div class="row" style="justify-content:center"><button type="button" class="btn btn-primary" onclick="location.reload()">${i('refresh')}Try again</button><a class="btn" href="${R}account/bookings.html">My bookings</a></div></div>`,
  },
];
