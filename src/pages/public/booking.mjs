import { R, i, money, map, field, check, alert, crumbs, badge } from '../../lib.mjs';

const unitBtn = (u, name, meta, cls = '') => `<button type="button" class="pitch-opt ${cls}" data-unit="${u}" aria-pressed="false"><span class="po-name">${name}</span><span class="po-meta">${meta}</span></button>`;

export const bookingForm = (staff = false) => `
<div class="booking-layout" data-booking ${staff ? 'data-mode="staff" data-success="../booking-success.html" data-processing="../payment-processing.html"' : ''}>
<div class="stack-lg">

<!-- Step 1 -->
<section class="card card-pad book-step" id="step-1" aria-labelledby="s1"><div class="book-step-head"><span class="book-step-num">1</span><h2 id="s1" data-i18n="book.step1">Select branch, sport & pitch</h2></div>
<div class="form-grid mb-4">${field({ label: 'Branch', name: 'branch', type: 'select', options: [['dhanmondi', 'Dhanmondi (Main) · 6 AM – 12 AM'], ['bashundhara', 'Bashundhara — opening 2027']] })}
${field({ label: 'Sport', name: 'sport', type: 'select', options: ['All sports', 'Football', 'Futsal', 'Cricket', 'Badminton'] })}</div>
<fieldset><legend>Pitch / court</legend>
<div class="pitch-map" role="group" aria-label="Choose a pitch. Pitch A can be booked full or as two halves.">
${unitBtn('A-FULL', `${i('ball')} Pitch A — Full 7s`, '60 × 40 m · outdoor · floodlit · 14 players', 'is-full')}
${unitBtn('A-H1', 'A · Half 1 (North)', '5-a-side · 10 players')}
${unitBtn('A-H2', 'A · Half 2 (South)', '5-a-side · 10 players')}
${unitBtn('B', `${i('zap')} Pitch B — Futsal`, 'Indoor · rain-proof')}
${unitBtn('BAD1', `${i('racket')} Badminton Court`, 'Indoor · 4 players')}
${unitBtn('NET1', `${i('cricket')} Cricket Net 1`, 'Bowling machine')}
${unitBtn('NET2', `${i('cricket')} Cricket Net 2`, 'Astro wicket')}
</div></fieldset>
<p class="small mt-4 mb-0" id="bk-unit-info" aria-live="polite"></p>
</section>

<!-- Step 2 -->
<section class="card card-pad book-step" id="step-2" aria-labelledby="s2"><div class="book-step-head"><span class="book-step-num">2</span><h2 id="s2" data-i18n="book.step2">Choose date & time</h2><span class="grow"></span><span class="badge badge-green" id="bk-slot-count" aria-live="polite"></span></div>
<div class="date-strip mb-4" id="bk-dates" role="group" aria-label="Choose a date"></div>
<div class="row-between mb-4"><div class="segmented" role="group" aria-label="Slot duration"><button type="button" data-dur="60" aria-pressed="true">60 min</button><button type="button" data-dur="90" aria-pressed="false">90 min</button></div>
<div class="slot-legend" aria-hidden="true"><span><i></i><span data-i18n="book.available">Available</span></span><span><i class="lg-sel"></i><span data-i18n="book.selected">Selected</span></span><span><i class="lg-peak"></i><span data-i18n="book.peak">Peak</span></span><span><i class="lg-off"></i><span data-i18n="book.booked">Booked / held</span></span></div></div>
<div class="slot-grid" id="bk-slots" aria-live="polite"></div>
<div id="bk-noslot" hidden class="mt-4">${alert('warning', 'No slots left on this date', `Try another date or pitch, or <a href="${R}no-slot.html">join the waitlist</a> and we’ll notify you the moment a slot opens.`)}</div>
<details class="mt-4"><summary class="small bold" style="cursor:pointer">${i('repeat')} Make this a recurring weekly booking</summary><div class="form-grid mt-4">${field({ label: 'Repeat every', name: 'rec', type: 'select', options: ['Week', '2 weeks'] })}${field({ label: 'For', name: 'rec-n', type: 'select', options: ['4 weeks', '8 weeks', '12 weeks', 'Until cancelled (members)'] })}</div><p class="xs muted mt-2 mb-0">We check every future date for conflicts before you pay and list any clashes so you can pick alternatives.</p></details>
</section>

<!-- Step 3 -->
<section class="card card-pad book-step" id="step-3" aria-labelledby="s3"><div class="book-step-head"><span class="book-step-num">3</span><h2 id="s3" data-i18n="book.step3">Add-ons, rentals & services</h2></div>
<div class="grid-2">${map([['Football (size 5)', 150, 'ball', 'Per booking'], ['Bib set (14)', 200, 'shirt', 'Per booking'], ['Boots rental', 150, 'shirt', 'Per pair · ৳500 deposit'], ['Cricket kit', 400, 'cricket', 'Bat, pads, gloves, helmet'], ['Shin guards', 50, 'shield', 'Per pair'], ['Water (500 ml)', 30, 'droplet', 'Delivered pitch-side']], ([n, p, ic, s]) => `<div class="addon" data-addon="${n}" data-price="${p}"><span class="icon-box icon-box-sm">${i(ic)}</span><div class="grow"><strong class="small">${n}</strong><div class="xs muted">${money(p)} · ${s}</div></div><div class="qty"><button type="button" data-dec aria-label="Decrease ${n}">−</button><output aria-live="polite">0</output><button type="button" data-inc aria-label="Increase ${n}">+</button></div></div>`)}
${map([['Referee', 800, 'whistle', 'Certified, per match'], ['Coach session', 1500, 'graduation-cap', 'Skills drill, 60 min'], ['Photographer', 2500, 'camera', '60 edited photos']], ([n, p, ic, s]) => `<label class="addon" data-addon="${n}" data-price="${p}" style="cursor:pointer"><span class="icon-box icon-box-sm is-blue">${i(ic)}</span><span class="grow"><strong class="small">${n}</strong><span class="xs muted" style="display:block">${money(p)} · ${s}</span></span><input type="checkbox" style="width:22px;height:22px;accent-color:var(--primary)" aria-label="Add ${n}"></label>`)}
</div></section>

<!-- Step 4 -->
<section class="card card-pad book-step" id="step-4" aria-labelledby="s4"><div class="book-step-head"><span class="book-step-num">4</span><h2 id="s4" data-i18n="book.step4">Team & player details</h2></div>
<div class="form-grid">
${staff ? field({ label: 'Booking source', name: 'source', id: 'bk-source', type: 'select', options: ['Walk-in', 'Phone', 'WhatsApp', 'Facebook', 'Corporate', 'Staff (internal)'] }) + field({ label: 'Find existing customer', name: 'cust', placeholder: 'Search phone or name…', hint: 'Or fill below to create a quick customer profile.' }) : ''}
${field({ label: 'Team / booking name', name: 'team', id: 'bk-name', required: true, placeholder: 'e.g. Dhanmondi Strikers', value: staff ? '' : 'Dhanmondi Strikers' })}
${field({ label: 'Mobile number', name: 'phone', id: 'bk-phone', type: 'tel', required: true, placeholder: '01XXXXXXXXX', value: staff ? '' : '01711234567', hint: 'Confirmation & OTP are sent here.' })}
${field({ label: 'Players', name: 'players', type: 'number', value: '12', attrs: 'min="2" max="22"' })}
${field({ label: 'Email (optional)', name: 'email', type: 'email', placeholder: 'For invoice & calendar invite' })}
${field({ label: 'Emergency contact', name: 'emg', placeholder: 'Name & phone' })}
${field({ label: 'Saved team', name: 'saved', type: 'select', options: ['— none —', 'Dhanmondi Strikers (14 players)', 'Office Thursday 5s (9 players)'] })}
${field({ label: 'Special requests / notes', name: 'notes', type: 'textarea', rows: 2, cls: 'span-2', placeholder: 'e.g. extra goalkeeper gloves, wheelchair access for a spectator' })}
${field({ label: 'Medical notes (optional, private)', name: 'med', type: 'textarea', rows: 2, cls: 'span-2', hint: 'Visible only to the duty manager and first-aid staff. Encrypted at rest.' })}
</div>
<div class="row mt-4">${check('Split the cost with my team (each player gets a payment link)')}${check('List this as an open match — I need more players')}</div>
</section>

<!-- Step 5 -->
<section class="card card-pad book-step" id="step-5" aria-labelledby="s5"><div class="book-step-head"><span class="book-step-num">5</span><h2 id="s5" data-i18n="book.step5">Discounts & credits</h2></div>
<div class="field"><label class="label" for="bk-coupon">Coupon code</label><div class="input-group"><input class="input" id="bk-coupon" placeholder="Try FIRST10, OFFPEAK15 or FLAT200" autocomplete="off" style="text-transform:uppercase"><button type="button" class="btn btn-dark" id="bk-coupon-apply" data-i18n="book.apply">Apply</button></div><span id="bk-coupon-msg" class="field-error" aria-live="polite"></span></div>
<div class="stack-sm mt-4">
<label class="check"><input type="checkbox" id="bk-member"><span><strong>Gold membership</strong> — 10% off turf fees ${badge('active')}</span></label>
<label class="check"><input type="checkbox" id="bk-wallet"><span><strong>Use wallet credit</strong> — balance <span class="num" id="bk-wallet-bal">৳750</span></span></label>
<label class="check"><input type="checkbox" id="bk-points"><span><strong>Redeem 420 loyalty points</strong> — worth ৳420</span></label>
${staff ? `<label class="check"><input type="checkbox"><span><strong>Manual discount / price override</strong> — requires reason and manager PIN; logged to audit trail</span></label>` : ''}
</div>
<p class="xs muted mt-4 mb-0" id="bk-stack" hidden aria-live="polite"></p>
</section>

<!-- Step 6 -->
<section class="card card-pad book-step" id="step-6" aria-labelledby="s6"><div class="book-step-head"><span class="book-step-num">6</span><h2 id="s6" data-i18n="book.step6">Policies & digital waiver</h2></div>
<div class="alert alert-info mb-4">${i('info')}<div><strong class="alert-title">Cancellation policy v3.2</strong>100% refund of advance 24+ h before · 50% at 12–24 h · none under 12 h. Rain cancellations: free reschedule, refund or wallet credit. <a href="${R}cancellation-policy.html" target="_blank">Read full policy</a></div></div>
<div class="stack-sm">
<label class="check"><input type="checkbox" id="bk-terms"><span>I accept the <a href="${R}terms.html" target="_blank">terms</a>, <a href="${R}cancellation-policy.html" target="_blank">cancellation & refund policy</a> and <a href="${R}ground-rules.html" target="_blank">ground rules</a>.</span></label>
<label class="check"><input type="checkbox" id="bk-waiver"><span>On behalf of my team I accept the <a href="${R}waiver.html" target="_blank">digital waiver v2.0</a> (assumption of risk for contact sports).</span></label>
<label class="check"><input type="checkbox" checked><span>Send me booking updates on WhatsApp (you can opt out anytime).</span></label>
</div></section>

<!-- Step 7 -->
<section class="card card-pad book-step" id="step-7" aria-labelledby="s7"><div class="book-step-head"><span class="book-step-num">7</span><h2 id="s7" data-i18n="book.step7">Payment</h2></div>
<fieldset class="mb-6"><legend>How much do you want to pay now?</legend><div class="radio-cards">
<label class="radio-card"><input type="radio" name="paymode" value="advance" checked>${i('percent')}<span>Advance 30%<br><span class="xs muted">Rest at venue</span></span><span class="rc-check">${i('check-circle')}</span></label>
<label class="radio-card"><input type="radio" name="paymode" value="full">${i('check-circle')}<span>Pay in full<br><span class="xs muted">Faster check-in</span></span><span class="rc-check">${i('check-circle')}</span></label>
${staff ? `<label class="radio-card"><input type="radio" name="paymode" value="venue">${i('banknote')}<span>Collect later<br><span class="xs muted">Mark as due</span></span><span class="rc-check">${i('check-circle')}</span></label>` : ''}
</div></fieldset>
<fieldset><legend>Payment method</legend><div class="radio-cards">
${map([['bkash', 'bKash', 'smartphone'], ['nagad', 'Nagad', 'smartphone'], ['rocket', 'Rocket', 'smartphone'], ['ssl', 'Card (SSLCommerz)', 'credit-card'], ['aamar', 'AamarPay', 'credit-card'], ['bank', 'Bank transfer', 'building'], ...(staff ? [['cash', 'Cash at desk', 'banknote']] : [])], ([v, l, ic], k) => `<label class="radio-card"><input type="radio" name="method" value="${v}"${k === 0 ? ' checked' : ''}>${i(ic)}<span>${l}</span><span class="rc-check">${i('check-circle')}</span></label>`)}
</div></fieldset>
<p class="xs muted mt-4 mb-0">${i('lock')} You’ll be redirected to the gateway’s secure hosted page. We never see or store your card or PIN. <span class="badge badge-violet">${i('code')}Sandbox mode</span></p>
</section>
</div>

<!-- Summary -->
<aside class="booking-summary" aria-labelledby="sum-title">
<div class="card"><div class="card-header"><h2 id="sum-title" data-i18n="book.summary">Booking summary</h2><span class="hold-timer" id="bk-hold" hidden role="timer" aria-live="off">${i('clock')}<span data-i18n="book.hold">Hold</span> <span id="bk-hold-text">10:00</span></span></div>
<div class="card-body"><div id="bk-cart"></div><div class="price-lines mt-4" id="bk-lines" aria-live="polite"></div>
<div class="alert alert-error mt-4" id="bk-errors" hidden tabindex="-1" role="alert">${i('alert-octagon')}<div><strong class="alert-title">Please complete the following</strong><ul class="mb-0" style="padding-left:1rem"></ul></div></div>
<button type="button" class="btn btn-primary btn-lg btn-block mt-4" id="bk-pay" disabled>${i('lock')}<span data-i18n="book.pay">Pay securely</span> <span data-pay-amount class="num"></span></button>
<p class="xs muted text-center mt-2 mb-0">Booking source: ${staff ? 'staff entry' : 'website'} · Policy v3.2 · Prices incl. floodlight, excl. VAT</p></div></div>
<div class="card card-pad mt-4 small"><div class="row-nowrap">${i('shield-check', 'i-lg text-green')}<div><strong>No double bookings.</strong> Slots are locked the moment you select them and released automatically if payment isn’t completed in 10 minutes.</div></div></div>
</aside>
</div>
<div class="mobile-cta"><div class="mc-info"><span class="xs muted" id="bk-mcount">0 slots</span><strong id="bk-mtotal">৳0</strong></div><a class="btn btn-primary" href="#step-7">Continue to pay</a></div>`;

export default [
  {
    out: 'booking.html', title: 'Book a Turf Slot', nav: 'booking', bodyClass: 'has-mobile-cta', scripts: ['booking'],
    description: 'Live turf availability for Pitch A (full or half), indoor futsal, cricket nets and badminton. Select slots, add rentals and pay with bKash, Nagad or card.',
    body: `<section class="page-hero" style="padding:var(--sp-8) 0"><div class="container">${crumbs([['Home', 'index.html'], ['Booking', 'booking.html']])}<h1 class="mb-2">Book your slot</h1><p class="mb-0">Live availability · instant confirmation · secure payment</p></div></section>
<div class="container" style="padding-block:var(--sp-6) var(--sp-12)">${bookingForm(false)}</div>`,
  },
];
