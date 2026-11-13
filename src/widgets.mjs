// Public-site composite widgets reused across pages.
import { R, i, money, media, stars, avatar, badge, field, map, attr } from './lib.mjs';
import { PITCHES, PLANS, OFFERS, TESTIMONIALS, TOURNAMENTS, POSTS, FAQS, FACILITIES, PACKAGES } from './data.mjs';
import { BRAND } from './nav.mjs';

export function searchPanel({ float = false } = {}) {
  const sel = (label, key, name, opts) => `<div class="field"><label class="label" for="s-${name}" data-i18n="search.${key}">${label}</label><select class="select" id="s-${name}" name="${name}">${opts.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${attr(v)}">${l}</option>`; }).join('')}</select></div>`;
  return `<form class="search-panel${float ? ' search-panel-float' : ''}" action="${R}booking.html" method="get" aria-label="Check availability">
${sel('Branch', 'branch', 'branch', [['dhanmondi', 'Dhanmondi (Main)'], ['bashundhara', 'Bashundhara — coming 2027']])}
${sel('Sport', 'sport', 'sport', ['Football', 'Futsal', 'Cricket', 'Badminton'])}
${sel('Pitch', 'pitch', 'pitch', [['A-FULL', 'Pitch A · Full 7s'], ['A-H1', 'Pitch A · Half 1 (5s)'], ['A-H2', 'Pitch A · Half 2 (5s)'], ['B', 'Pitch B · Futsal'], ['NET1', 'Cricket Net 1'], ['NET2', 'Cricket Net 2'], ['BAD1', 'Badminton Court']])}
<div class="field"><label class="label" for="s-date" data-i18n="search.date">Date</label><input class="input" type="date" id="s-date" name="date"></div>
${sel('Preferred time', 'time', 'time', ['Any time', 'Morning (6–12)', 'Afternoon (12–5)', 'Evening (5–9)', 'Night (9–12)'])}
${sel('Duration', 'duration', 'dur', [['60', '60 minutes'], ['90', '90 minutes']])}
<button class="btn btn-primary btn-lg" type="submit">${i('search')}<span data-i18n="search.check">Check Availability</span></button>
</form>`;
}

export function turfCard(p) {
  const chips = p.sports.map((sp) => `<span class="sport-chip">${i(sp === 'Cricket' ? 'cricket' : sp === 'Badminton' ? 'racket' : 'ball')}${sp}</span>`).join('') + `<span class="sport-chip">${i(p.outdoor ? 'lightbulb' : 'home')}${p.outdoor ? 'Floodlit' : 'Indoor'}</span>`;
  return `<article class="card card-hover turf-card" data-tags="${p.sports.join(' ')} ${p.outdoor ? 'Outdoor' : 'Indoor'}">
<div style="position:relative"><a class="card-link" href="${R}turf-detail.html?pitch=${p.slug}" tabindex="-1" aria-hidden="true">${media({ kind: p.kind, tone: p.tone, img: p.img, tag: p.tag ? `<span class="badge badge-lime">${p.tag}</span>` : '', alt: p.name })}</a><button type="button" class="fav-btn" data-fav aria-pressed="false" aria-label="Save ${p.name} to favourites">${i('heart')}</button></div>
<div class="tc-body stack-sm"><div class="row-between"><h3 class="mb-0" style="font-size:1.1rem"><a href="${R}turf-detail.html?pitch=${p.slug}" style="color:inherit">${p.name}</a></h3><span class="small nowrap">${i('star', 'text-amber')} <strong>${p.rating}</strong> <span class="muted">(${p.reviews})</span></span></div>
<div class="tc-meta"><span>${i('map-pin')} Dhanmondi, Dhaka</span><span>${i('layout')} ${p.size}</span><span>${i('users')} ${p.cap}</span></div>
<div class="sport-chips">${chips}</div>
<div class="price-from"><strong>${money(p.from)}</strong> <span data-i18n="c.perhour">/ hour</span>${p.was ? `<span class="price-was">${money(p.was)}</span>` : ''}</div>
<div class="grid-2" style="gap:.5rem;grid-template-columns:1fr 1fr"><a class="btn btn-sm" href="${R}reviews.html">View reviews</a><a class="btn btn-primary btn-sm" href="${R}booking.html?pitch=${p.id}" data-i18n="nav.book">Book Now</a></div></div></article>`;
}

export function planCards() {
  return `<div class="grid-3">${map(PLANS, (p) => `<div class="card plan-card${p.featured ? ' is-featured' : ''}">${p.featured ? `<span class="ribbon badge badge-lime">${i('star')} Most popular</span>` : ''}<div><h3 class="mb-2">${p.name}</h3><p class="muted small mb-0">${p.blurb}</p></div><div class="plan-price">${p.price ? money(p.price) : 'Free'}<small> ${p.price ? p.per : ''}</small></div><ul class="check-list small">${map(p.perks, (x) => `<li>${i('check-circle')}${x}</li>`)}</ul><a class="btn ${p.featured ? 'btn-primary' : ''} btn-block mt-4" href="${R}${p.price ? 'memberships.html#join' : 'account/signup.html'}" style="margin-top:auto">${p.cta}</a></div>`)}</div>`;
}

export function packageCards() {
  return `<div class="grid-4">${map(PACKAGES, (p) => `<div class="card card-pad card-hover stack"><span class="icon-box">${i(p.icon)}</span><div><h3 style="font-size:1.05rem" class="mb-2">${p.name}</h3><p class="small muted mb-0">${p.note}</p></div><div class="row-between"><span class="num" style="font-size:1.35rem">${money(p.price)}</span>${p.save ? `<span class="badge badge-green">Save ${p.save}</span>` : ''}</div><p class="xs muted mb-0">${i('clock')} Valid ${p.valid}</p><a class="btn btn-block" href="${R}memberships.html#packages">Buy package</a></div>`)}</div>`;
}

export function offerCards() {
  return `<div class="grid-3">${map(OFFERS, (o) => `<div class="offer-card"><div class="grow"><span class="badge badge-lime">${i('percent')} Offer</span><h3 class="mt-2 mb-2" style="color:#fff;font-size:1.1rem">${o.title}</h3><p class="small mb-2" style="color:#CBD5E1">${o.text}</p><span class="xs" style="color:#94A3B8">Valid until ${o.until}</span></div><div class="stack-sm text-center"><span class="offer-code">${o.code}</span><button type="button" class="btn btn-lime btn-sm" data-copy="${o.code}">${i('copy')}Copy</button></div></div>`)}</div>`;
}

export function testimonialCards(n = 3) {
  return `<div class="grid-3">${map(TESTIMONIALS.slice(0, n), ([name, role, q, s]) => `<figure class="card testimonial" style="margin:0">${stars(s)}<blockquote>“${q}”</blockquote><figcaption class="row-nowrap" style="margin-top:auto">${avatar(name)}<div><strong class="small">${name}</strong><div class="xs muted">${role}</div></div></figcaption></figure>`)}</div>`;
}

export function tournamentCard(t) {
  return `<article class="card card-hover" data-tags="${t.sport} ${t.status}">${media({ tone: 'event', kind: t.sport === 'Cricket' ? 'cricket' : 'football', tag: badge(t.status), cls: 'media-wide', alt: t.name })}<div class="card-body stack-sm"><span class="xs muted">${t.sport} · ${t.format}</span><h3 style="font-size:1.1rem" class="mb-0"><a href="${R}tournament-detail.html?t=${t.slug}" style="color:inherit">${t.name}</a></h3><div class="tc-meta small muted row"><span>${i('calendar')} ${t.dates}</span><span>${i('users')} ${t.teams}</span></div><div class="row-between mt-4"><div><span class="xs muted">Entry</span> <span class="num">${money(t.fee)}</span></div><a class="btn btn-sm ${t.status === 'registration' ? 'btn-primary' : ''}" href="${R}tournament-detail.html?t=${t.slug}">${t.status === 'registration' ? 'Register' : 'View'}</a></div></div></article>`;
}

export function postCard(p) {
  return `<article class="card card-hover" data-tags="${p.cat}"><a href="${R}blog-article.html?p=${p.slug}" class="card-link">${media({ tone: p.tone, alt: p.title })}</a><div class="card-body stack-sm"><span class="badge badge-outline">${p.cat}</span><h3 style="font-size:1.05rem" class="mb-0"><a href="${R}blog-article.html?p=${p.slug}" style="color:inherit">${p.title}</a></h3><span class="xs muted">${p.date} · ${p.read} read</span></div></article>`;
}

export function faqList(items = FAQS) {
  return `<div class="accordion">${map(items, ([q, a], k) => `<details${k === 0 ? ' open' : ''}><summary>${q}</summary><div class="acc-body"><p class="mb-0">${a}</p></div></details>`)}</div>`;
}
export const faqJsonLd = (items = FAQS) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

export function facilityGrid(n = 13) {
  return `<div class="grid-4">${map(FACILITIES.slice(0, n), ([ic, t, s]) => `<div class="facility"><span class="icon-box icon-box-sm">${i(ic)}</span><div><div>${t}</div><div class="xs muted">${s}</div></div></div>`)}</div>`;
}

export function mapBlock(h = '') {
  return `<div class="map-embed" ${h ? `style="aspect-ratio:auto;height:${h}"` : ''} role="img" aria-label="Map showing TurfPro Arena in Dhanmondi, Dhaka"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="250" fill="#E8EEF4"/><path d="M0 170 Q120 140 200 160 T400 130" stroke="#BFDBFE" stroke-width="22" fill="none"/><path d="M60 0v250M180 0v250M300 0v250M0 60h400M0 210h400" stroke="#fff" stroke-width="9"/><path d="M0 110h400M240 0v250" stroke="#FDE68A" stroke-width="6"/><rect x="190" y="92" width="44" height="30" rx="4" fill="#BBF7D0" stroke="#16A34A"/></svg><span class="map-pin">${i('map-pin')}</span><div style="position:absolute;left:1rem;bottom:1rem;right:1rem" class="card card-pad row-between"><div><strong>${BRAND.name}</strong><div class="xs muted">${BRAND.address}</div></div><a class="btn btn-sm btn-primary" href="https://maps.google.com/?q=Dhanmondi+Road+27+Dhaka" target="_blank" rel="noopener">${i('map')}Directions</a></div></div>`;
}

export function newsletter() {
  return `<div class="newsletter"><div><span class="eyebrow" style="color:var(--green-800)">${i('mail')} Newsletter</span><h2 class="mb-2" data-i18n="f.newsletter">Get offers & tournament updates first</h2><p class="mb-0">One email a fortnight. No spam. Unsubscribe anytime.</p></div>
<form data-validate data-success="Subscribed! Check your inbox to confirm (double opt-in)." class="stack-sm"><div class="input-group"><label class="sr-only" for="nl-email">Email address</label><input class="input" id="nl-email" type="email" required placeholder="you@example.com"><button class="btn btn-dark" type="submit" data-i18n="f.subscribe">Subscribe</button></div><label class="check xs"><input type="checkbox" required data-msg="Please confirm marketing consent."><span>I agree to receive marketing emails. <a href="${R}privacy.html" style="color:var(--navy);text-decoration:underline">Privacy policy</a></span></label></form></div>`;
}

export const sportsFacilityLd = {
  '@context': 'https://schema.org', '@type': ['SportsActivityLocation', 'LocalBusiness'], name: BRAND.name, telephone: BRAND.phone, email: BRAND.email,
  address: { '@type': 'PostalAddress', streetAddress: 'House 12, Road 27', addressLocality: 'Dhanmondi, Dhaka', postalCode: '1209', addressCountry: 'BD' },
  geo: { '@type': 'GeoCoordinates', latitude: 23.7461, longitude: 90.3742 }, openingHours: 'Mo-Su 06:00-24:00', priceRange: '৳600 – ৳4,500 per hour', currenciesAccepted: 'BDT',
  url: BRAND.domain, image: `${BRAND.domain}/assets/img/og-default.png`, aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '807' },
};
export { PITCHES, TOURNAMENTS, POSTS };
