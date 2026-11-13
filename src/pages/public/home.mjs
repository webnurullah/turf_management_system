import { R, i, money, media, map, sectionHead, badge, photo } from '../../lib.mjs';
import { searchPanel, turfCard, planCards, packageCards, offerCards, testimonialCards, tournamentCard, postCard, faqList, faqJsonLd, facilityGrid, mapBlock, newsletter, sportsFacilityLd, PITCHES, TOURNAMENTS, POSTS } from '../../widgets.mjs';
import { SPORTS, FAQS } from '../../data.mjs';

const nowSlots = [['6:00 PM', 'Pitch A · Half 2', 2600, 'peak'], ['7:00 PM', 'Pitch B · Futsal', 3000, 'peak'], ['8:30 PM', 'Cricket Net 1', 1200, 'peak'], ['10:00 PM', 'Pitch A · Full', 4500, 'peak'], ['Tomorrow 7:00 AM', 'Pitch A · Full', 3000, 'off'], ['Tomorrow 9:00 AM', 'Badminton Court', 600, 'off']];

const body = `
<!-- 2. Hero -->
<section class="hero" aria-labelledby="hero-title"><div class="hero-bg" aria-hidden="true">${photo('hero-bg', '', true)}</div><div class="container"><div class="hero-grid">
<div>
<span class="eyebrow">${i('zap')} <span data-i18n="hero.eyebrow">Dhaka's premium turf · Dhanmondi</span></span>
<h1 id="hero-title" data-i18n="hero.title">Book Your Perfect Turf in Minutes</h1>
<p class="hero-lead" data-i18n="hero.lead">Check live availability, select your preferred slot, pay securely and receive instant confirmation.</p>
<div class="row mt-6"><a class="btn btn-primary btn-lg" href="${R}booking.html" data-track="cta_book_hero">${i('calendar')}<span data-i18n="hero.cta">Book Now</span></a><a class="btn btn-outline-light btn-lg" href="${R}pricing.html"><span data-i18n="hero.cta2">View Pricing</span>${i('arrow-right')}</a></div>
<div class="hero-trust"><div><strong>25,000+</strong>bookings played</div><div><strong>4.8 ★</strong>807 reviews</div><div><strong>&lt; 60 s</strong>to confirm a slot</div></div>
</div>
<div class="hero-visual">${media({ cls: 'media-night', img: 'hero-night', eager: true, alt: 'Floodlit 7-a-side football turf at night' })}
<div class="hero-float" style="left:1rem;top:1rem"><span class="dot pulse" style="color:var(--green-500)"></span><div><strong>6 slots open tonight</strong><div class="xs muted">Updated live</div></div></div>
<div class="hero-float" style="right:1rem;bottom:1rem"><span class="icon-box icon-box-sm">${i('check-circle')}</span><div><strong>Booking confirmed</strong><div class="xs muted">TPB-261113-4821 · Pitch A · 8 PM</div></div></div></div>
</div></div></section>

<!-- 3. Live booking search -->
<section aria-label="Search availability"><div class="container">${searchPanel({ float: true })}</div></section>

<!-- 4. Trust indicators -->
<section class="section" style="padding-bottom:0" aria-label="Why book with us"><div class="container"><div class="trust-strip">
${map([['zap', 'Instant confirmation', 'SMS + email + QR in seconds'], ['shield-check', 'Secure payments', 'bKash, Nagad, Rocket, cards'], ['lock', 'No double booking', 'Live slot locks during checkout'], ['rotate-ccw', 'Fair refunds', 'Transparent, automatic policy']], ([ic, t, s]) => `<div class="trust-item"><span class="icon-box">${i(ic)}</span><div><strong>${t}</strong><span class="muted small">${s}</span></div></div>`)}
</div></div></section>

<!-- 5. Sport categories -->
<section class="section"><div class="container">${sectionHead('Sports', 'Pick your game', 'Football, futsal, cricket nets and badminton under one roof — with coaching and tournaments for every level.')}
<div class="grid-6">${map(SPORTS, ([n, ic, s, slug]) => `<a class="sport-card" href="${R}sport-detail.html?sport=${slug}"><span class="icon-box">${i(ic)}</span>${n}<span class="xs muted" style="font-weight:400">${s}</span></a>`)}</div></div></section>

<!-- 6. Featured turf -->
<section class="section section-alt"><div class="container"><div class="split split-even" style="align-items:center">
<div>${media({ cls: 'media-square', img: 'pitch-a-aerial', alt: 'Pitch A aerial view', tag: '<span class="badge badge-lime">Featured</span>' })}</div>
<div class="stack"><span class="eyebrow">Featured pitch</span><h2>Pitch A — Premier 7s</h2><p class="text-2">FIFA Quality Pro artificial grass, LED floodlights and a shock-pad base. Book the full 60 × 40 m pitch, or one of two independent 5-a-side halves.</p>
<div class="grid-2">${map([['layout', '60 × 40 m', 'Full pitch'], ['git-branch', 'Split pitch', '2 × 5-a-side halves'], ['lightbulb', 'LED floodlights', '500 lux, 6 PM onwards'], ['shield', 'Shock pad', 'Lower injury risk']], ([ic, a, b]) => `<div class="row-nowrap"><span class="icon-box icon-box-sm">${i(ic)}</span><div><strong class="small">${a}</strong><div class="xs muted">${b}</div></div></div>`)}</div>
<div class="row"><a class="btn btn-primary" href="${R}booking.html?pitch=A-FULL">Book Pitch A</a><a class="btn" href="${R}turf-detail.html?pitch=pitch-a">See details</a></div></div>
</div></div></section>

<!-- 7. Current availability -->
<section class="section"><div class="container">${sectionHead('Live availability', 'Open slots right now', 'Grab them before they go. Held slots are locked for 10 minutes while you pay.', `<a class="btn" href="${R}booking.html">See full calendar ${i('arrow-right')}</a>`)}
<div class="grid-3">${map(nowSlots, ([t, p, pr, k]) => `<a class="card card-pad card-hover card-link row-between" href="${R}booking.html"><div><span class="badge ${k === 'peak' ? 'badge-amber' : 'badge-green'}">${k === 'peak' ? i('trending-up') + 'Peak' : i('trending-down') + 'Off-peak'}</span><h3 class="mt-2 mb-0" style="font-size:1.05rem">${t}</h3><span class="small muted">${p} · 60 min</span></div><div class="text-right"><span class="num" style="font-size:1.2rem">${money(pr)}</span><div class="xs" style="color:var(--green-700);font-weight:600">${i('check')} Available</div></div></a>`)}</div></div></section>

<!-- 8. Pricing summary -->
<section class="section section-alt"><div class="container">${sectionHead('Pricing', 'Simple, transparent rates', 'Prices are per hour and include changing rooms and parking. Floodlight charge ৳300/h applies to outdoor pitches after 6 PM. VAT extra.', `<a class="btn" href="${R}pricing.html">Full rate card ${i('arrow-right')}</a>`)}
<div class="card"><div class="table-wrap"><table class="table table-stack"><caption class="sr-only">Hourly rates by pitch</caption><thead><tr><th scope="col">Pitch</th><th scope="col" class="t-num">Off-peak<br><span class="xs" style="text-transform:none">Sun–Thu before 3 PM</span></th><th scope="col" class="t-num">Standard</th><th scope="col" class="t-num">Peak<br><span class="xs" style="text-transform:none">After 5 PM · Fri–Sat after 3 PM</span></th></tr></thead><tbody>
${map([['Pitch A — Full (7-a-side)', 3000, 3500, 4500], ['Pitch A — Half (5-a-side)', 1800, 2000, 2600], ['Pitch B — Indoor futsal', 2000, 2400, 3000], ['Cricket net (per lane)', 800, 1000, 1200], ['Badminton court', 600, 700, 900]], ([n, a, b, c]) => `<tr><td data-label="Pitch"><strong>${n}</strong></td><td data-label="Off-peak" class="t-num">${money(a)}</td><td data-label="Standard" class="t-num">${money(b)}</td><td data-label="Peak" class="t-num">${money(c)}</td></tr>`)}
</tbody></table></div></div></div></section>

<!-- 9. Popular packages -->
<section class="section"><div class="container">${sectionHead('Packages', 'Popular booking packages', 'Prepaid hours that save your team money. Remaining hours are tracked in your dashboard.')}${packageCards()}</div></section>

<!-- 10. How booking works -->
<section class="section section-dark"><div class="container">${sectionHead('How it works', 'Booked in four steps', 'No calls, no WhatsApp back-and-forth.')}
<div class="grid-4">${map([['map-pin', 'Choose pitch & date', 'Pick your branch, sport and pitch — full or half.'], ['clock', 'Select live slots', 'See real-time availability. Your slot is held for 10 minutes.'], ['credit-card', 'Pay securely', 'Advance or full payment with bKash, Nagad, Rocket or card.'], ['qr', 'Show your QR', 'Instant confirmation by SMS, email and WhatsApp. Check in with QR.']], ([ic, t, s], k) => `<div class="card card-dark how-step"><span class="step-num" style="color:rgba(183,243,74,.15)">0${k + 1}</span><span class="icon-box is-dark mb-4">${i(ic)}</span><h3 style="font-size:1.05rem">${t}</h3><p class="small mb-0" style="color:#94A3B8">${s}</p></div>`)}</div></div></section>

<!-- 11. Offers -->
<section class="section"><div class="container">${sectionHead('Offers', 'Current promotions', 'Apply the code at checkout. Offers can’t be combined with membership discounts unless stated.', `<a class="btn" href="${R}offers.html">All offers ${i('arrow-right')}</a>`)}${offerCards()}</div></section>

<!-- 12. Facilities -->
<section class="section section-alt"><div class="container">${sectionHead('Facilities', 'Everything your team needs', '', `<a class="btn" href="${R}amenities.html">All amenities ${i('arrow-right')}</a>`)}${facilityGrid(12)}</div></section>

<!-- 13. Tournaments -->
<section class="section"><div class="container">${sectionHead('Tournaments & events', 'Compete for glory', 'Leagues, knockouts and corporate cups with live scores and points tables.', `<a class="btn" href="${R}tournaments.html">All tournaments ${i('arrow-right')}</a>`)}<div class="grid-3">${map(TOURNAMENTS, tournamentCard)}</div></div></section>

<!-- 14–16. Corporate, academy, open matches -->
<section class="section section-alt"><div class="container"><div class="grid-3">
<div class="card card-pad stack card-accent"><span class="icon-box">${i('briefcase')}</span><h3>Corporate & group booking</h3><p class="text-2 small">Fixed weekly slots, negotiated rates, monthly invoices with PO numbers, and team-building events for 20–200 people.</p><ul class="check-list small"><li>${i('check-circle')}Credit terms & consolidated invoice</li><li>${i('check-circle')}Dedicated account manager</li></ul><a class="btn btn-primary" href="${R}corporate-booking.html">Get a corporate quote</a></div>
<div class="card card-pad stack card-accent"><span class="icon-box is-blue">${i('graduation-cap')}</span><h3>Football & cricket academy</h3><p class="text-2 small">Licensed coaches, age-grouped batches (6–18), progress reports and guardian updates by SMS.</p><ul class="check-list small"><li>${i('check-circle')}Free trial class</li><li>${i('check-circle')}Monthly fee from ৳3,500</li></ul><a class="btn btn-primary" href="${R}academy.html">Book a free trial</a></div>
<div class="card card-pad stack card-accent"><span class="icon-box is-amber">${i('users')}</span><h3>Open matches</h3><p class="text-2 small">Short of players? Post an open match or join one near you. Captains approve requests; phone numbers stay private.</p><ul class="check-list small"><li>${i('check-circle')}12 open matches this week</li><li>${i('check-circle')}Split cost automatically</li></ul><a class="btn btn-primary" href="${R}open-matches.html">Find a match</a></div>
</div></div></section>

<!-- 17. Memberships -->
<section class="section"><div class="container">${sectionHead('Memberships', 'Play more, pay less', 'Cancel anytime. Membership discounts apply automatically at checkout.')}${planCards()}</div></section>

<!-- 18. Testimonials -->
<section class="section section-gray"><div class="container">${sectionHead('Reviews', 'Loved by 5,000+ players', '4.8 average from 807 verified bookings.', `<a class="btn" href="${R}reviews.html">Read reviews ${i('arrow-right')}</a>`)}${testimonialCards(3)}</div></section>

<!-- 19. Gallery preview -->
<section class="section"><div class="container">${sectionHead('Gallery', 'See the arena', '', `<a class="btn" href="${R}gallery.html">Open gallery ${i('arrow-right')}</a>`)}
<div class="gallery-grid"><div class="g-wide">${media({ cls: 'media-night', img: 'gallery-night-match', alt: 'Night match under floodlights' })}</div>${media({ kind: 'cricket', img: 'cricket-nets', alt: 'Cricket nets' })}${media({ kind: 'court', img: 'badminton', alt: 'Badminton court' })}${media({ tone: 'event', img: 'tournament', alt: 'Tournament final' })}${media({ tone: 'warm', img: 'birthday', alt: 'Birthday party' })}</div></div></section>

<!-- 20. PWA promotion -->
<section class="section" style="padding-top:0"><div class="container"><div class="app-promo"><div class="stack"><span class="eyebrow">${i('smartphone')} Install the app</span><h2 style="color:#fff">Book faster from your home screen</h2><p style="color:#CBD5E1">Install TurfPro as an app — no app store needed. Get booking reminders, show your QR at check-in, and manage your team on the go. Works even on slow connections.</p><div class="row"><button type="button" class="btn btn-lime btn-lg" data-install>${i('download')}Install app</button><a class="btn btn-outline-light btn-lg" href="${R}help-article.html?a=install-app">How it works</a></div></div><div class="phone-mock" aria-hidden="true"><div class="pm-bar"></div><div class="pm-slot"></div><div class="pm-slot is-sel"></div><div class="pm-slot"></div><div class="pm-slot"></div><div class="pm-slot is-sel"></div><div class="pm-slot"></div><div class="pm-bar" style="margin-top:auto;background:var(--green-600)"></div></div></div></div></section>

<!-- 21. Blog -->
<section class="section section-alt"><div class="container">${sectionHead('Blog & news', 'From the touchline', '', `<a class="btn" href="${R}blog.html">All articles ${i('arrow-right')}</a>`)}<div class="grid-4">${map(POSTS, postCard)}</div></div></section>

<!-- 22. FAQ -->
<section class="section"><div class="container"><div class="split split-even"><div>${sectionHead('FAQ', 'Questions, answered', 'Can’t find what you need? Our front desk replies on WhatsApp within 10 minutes, 9 AM–11 PM.')}<div class="row"><a class="btn" href="${R}faq.html">All FAQs</a><a class="btn btn-ghost" href="${R}support-ticket.html">${i('life-buoy')}Contact support</a></div></div><div>${faqList(FAQS.slice(0, 5))}</div></div></div></section>

<!-- 23. Map -->
<section class="section section-alt"><div class="container"><div class="split split-even" style="align-items:center"><div class="stack"><span class="eyebrow">Location</span><h2>Find us in Dhanmondi</h2><p class="text-2">House 12, Road 27, Dhanmondi, Dhaka 1209 — 5 minutes from Shankar bus stand. Free parking on site.</p><ul class="check-list"><li>${i('clock')}Open daily 6:00 AM – 12:00 AM</li><li>${i('phone')}<a href="tel:+8801711000000">+880 1711-000000</a></li><li>${i('whatsapp')}<a href="https://wa.me/8801711000000">WhatsApp the front desk</a></li></ul><a class="btn" href="${R}directions.html">${i('map')}Directions & transport</a></div>${mapBlock()}</div></div></section>

<!-- 24. Newsletter -->
<section class="section"><div class="container">${newsletter()}</div></section>

<!-- Sticky mobile booking action -->
<div class="mobile-cta"><div class="mc-info"><span class="xs muted">Pitches from</span><strong>${money(600)}<span class="xs muted">/hour</span></strong></div><a class="btn btn-primary" href="${R}booking.html">Book Now</a></div>`;

export default {
  out: 'index.html', title: 'Home', nav: 'home', bodyClass: 'has-mobile-cta', scripts: [],
  description: 'Book football turf, futsal, cricket nets and badminton courts in Dhanmondi, Dhaka. Live availability, instant confirmation, bKash/Nagad/card payments.',
  jsonld: [sportsFacilityLd, faqJsonLd(FAQS.slice(0, 5))], body,
};
