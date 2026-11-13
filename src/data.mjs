// Sample business data used across the template. In production these come
// from the database (see docs/DATA-MODEL.md); keep shapes aligned.

export const PITCHES = [
  { id: 'A-FULL', img: 'pitch-a', was: 3500, slug: 'pitch-a', name: 'Pitch A — Premier 7s', sport: 'Football', sports: ['Football', 'Cricket'], kind: 'football', size: '60 × 40 m', surface: 'FIFA Quality Pro artificial grass, 50 mm', cap: '14 players (7-a-side)', split: 'Full or 2 × 5-a-side halves', from: 3000, peak: 4500, rating: 4.9, reviews: 312, outdoor: true, tag: 'Most booked', tone: '' },
  { id: 'A-H1', img: 'pitch-a-half', was: 0, slug: 'pitch-a', name: 'Pitch A — Half 1 (North)', sport: 'Football', sports: ['Football'], kind: 'football', size: '40 × 30 m', surface: 'Artificial grass, 50 mm', cap: '10 players (5-a-side)', split: 'Linked half of Pitch A', from: 1800, peak: 2600, rating: 4.8, reviews: 140, outdoor: true, tag: '', tone: '' },
  { id: 'B', img: 'futsal-indoor', was: 2400, slug: 'pitch-b-futsal', name: 'Pitch B — Indoor Futsal', sport: 'Futsal', sports: ['Futsal'], kind: 'football', size: '40 × 20 m', surface: 'Rubberised sports floor', cap: '10 players (5-a-side)', split: 'Full only', from: 2000, peak: 3000, rating: 4.8, reviews: 201, outdoor: false, tag: 'Rain-proof', tone: 'night' },
  { id: 'NET1', img: 'cricket-nets', was: 0, slug: 'cricket-nets', name: 'Cricket Nets 1 & 2', sport: 'Cricket', sports: ['Cricket'], kind: 'cricket', size: '30 × 4 m lanes', surface: 'Astro-turf wicket + bowling machine', cap: '6 per lane', split: 'Book per lane', from: 800, peak: 1200, rating: 4.7, reviews: 96, outdoor: true, tag: 'Bowling machine', tone: '' },
  { id: 'BAD1', img: 'badminton', was: 0, slug: 'badminton-court', name: 'Badminton Court 1', sport: 'Badminton', sports: ['Badminton'], kind: 'court', size: 'BWF standard 13.4 × 6.1 m', surface: 'PU synthetic mat', cap: '4 players', split: 'Full only', from: 600, peak: 900, rating: 4.6, reviews: 58, outdoor: false, tag: 'New', tone: '' },
];

export const SPORTS = [
  ['Football', 'ball', '7-a-side & 5-a-side', 'football'], ['Futsal', 'zap', 'Indoor 5-a-side', 'futsal'], ['Cricket', 'cricket', 'Nets & box cricket', 'cricket'],
  ['Badminton', 'racket', 'Indoor court', 'badminton'], ['Academy', 'graduation-cap', 'Coaching for ages 6–18', 'academy'], ['Tournaments', 'trophy', 'Leagues & knockouts', 'tournaments'],
];

export const FACILITIES = [
  ['car', 'Free parking', '40 cars, 80 bikes'], ['bath', 'Washrooms', 'Separate, cleaned hourly'], ['shirt', 'Changing rooms', 'With lockers'], ['mosque', 'Prayer room', 'Men & women'],
  ['droplet', 'Drinking water', 'Filtered, free'], ['armchair', 'Spectator seating', '120 seats'], ['coffee', 'Café', 'Snacks & drinks'], ['cctv', 'CCTV', '24/7 monitored'],
  ['first-aid', 'First aid', 'Trained staff on duty'], ['lock', 'Lockers', 'Digital PIN lockers'], ['wifi', 'Free Wi-Fi', 'Guest network'], ['package', 'Equipment rental', 'Balls, bibs, boots'], ['lightbulb', 'Floodlights', 'LED, 500 lux'],
];

export const PLANS = [
  { name: 'Starter', price: 0, per: 'free', blurb: 'Pay as you play', perks: ['Online booking & instant confirmation', 'Earn 1 point per ৳100', 'Open-match access', 'Standard cancellation policy'], cta: 'Sign up free' },
  { name: 'Gold', price: 1500, per: '/month', blurb: 'For regular weekly teams', perks: ['10% off every turf booking', '2× loyalty points', 'Book 21 days ahead (vs 14)', 'Free bib set rental', 'Priority waitlist'], cta: 'Get Gold', featured: true },
  { name: 'Platinum', price: 3500, per: '/month', blurb: 'Clubs and serious squads', perks: ['15% off bookings', '3× loyalty points', 'Fixed recurring slot guarantee', 'Free referee once a month', 'Free reschedule up to 6 h before'], cta: 'Get Platinum' },
];

export const PACKAGES = [
  { name: '10-Hour Football Pack', price: 30000, save: '14%', valid: '90 days', note: 'Any time Sun–Thu before 5 PM', icon: 'ball' },
  { name: 'Night Owl Pack', price: 18000, save: '18%', valid: '60 days', note: '5 hours · 10 PM – 12 AM slots', icon: 'moon' },
  { name: 'Cricket Nets 8 Sessions', price: 7200, save: '10%', valid: '45 days', note: 'Bowling machine included', icon: 'cricket' },
  { name: 'Birthday Party Package', price: 12500, save: '', valid: 'Single event', note: '2 h pitch + decor + referee + snacks for 20', icon: 'gift' },
];

export const OFFERS = [
  { title: 'First booking 10% off', code: 'FIRST10', text: 'New players save up to ৳500 on their first booking.', until: '31 Dec 2026' },
  { title: 'Off-peak 15% off', code: 'OFFPEAK15', text: 'Sunday–Thursday slots before 3 PM.', until: 'Ongoing' },
  { title: '৳200 off ৳3,000+', code: 'FLAT200', text: 'Any pitch, any day. One use per customer.', until: '15 Jan 2027' },
];

export const TESTIMONIALS = [
  ['Tanvir Ahmed', 'Captain, Dhanmondi Strikers', 'We used to spend an hour on WhatsApp confirming slots. Now the whole team sees availability and splits the cost in the app.', 5],
  ['Sharmin Akter', 'Parent, Academy U-12', 'Attendance updates and fee reminders come straight to my phone. The coaches are excellent and the pitch is always clean.', 5],
  ['Imran Chowdhury', 'HR Lead, Brac IT', 'Monthly invoicing for our Friday corporate league is seamless. Finance loves the consolidated statement.', 5],
  ['Arif Hossain', 'Weekend cricketer', 'The bowling machine nets are the best in Dhanmondi. Booking 90-minute sessions is super easy.', 4],
];

export const TOURNAMENTS = [
  { slug: 'dhaka-7s-winter-cup', name: 'Dhaka 7s Winter Cup 2026', sport: 'Football 7-a-side', format: 'Groups + knockout', teams: '16 teams', fee: 12000, prize: '৳1,50,000 prize pool', dates: '12 Dec – 27 Dec 2026', status: 'registration', spots: '4 spots left' },
  { slug: 'corporate-futsal-league', name: 'Corporate Futsal League S3', sport: 'Futsal', format: 'Round-robin league', teams: '10 companies', fee: 25000, prize: 'Trophy + ৳80,000', dates: 'Every Friday · Jan–Mar 2027', status: 'upcoming', spots: '2 spots left' },
  { slug: 'u15-cricket-sixes', name: 'U-15 Cricket Sixes', sport: 'Cricket', format: 'Knockout', teams: '12 teams', fee: 5000, prize: 'Medals + kits', dates: '6 Nov – 8 Nov 2026', status: 'completed', spots: 'Finished' },
];

export const POSTS = [
  { slug: '5-a-side-tactics', title: '7 five-a-side tactics that win more games', cat: 'Tips', date: '8 Nov 2026', read: '6 min', tone: '' },
  { slug: 'winter-cup-announced', title: 'Dhaka 7s Winter Cup 2026: registration now open', cat: 'News', date: '2 Nov 2026', read: '3 min', tone: 'event' },
  { slug: 'turf-care', title: 'How we keep our turf match-ready every single day', cat: 'Behind the scenes', date: '24 Oct 2026', read: '5 min', tone: 'night' },
  { slug: 'kids-football-benefits', title: 'Why football is the best sport for your child’s confidence', cat: 'Academy', date: '15 Oct 2026', read: '4 min', tone: 'warm' },
];

export const FAQS = [
  ['How do I book a slot?', 'Choose your pitch, date and time on the booking page, add any rentals, and pay the advance or full amount with bKash, Nagad, Rocket, card or bank. You get an instant SMS and email confirmation with a QR code.'],
  ['Do I need to pay the full amount online?', 'No. You can pay a 30% advance online and settle the balance at the front desk in cash or mobile banking. Some peak and tournament slots require full payment.'],
  ['What is your cancellation policy?', 'Cancel 24+ hours before start for a 100% refund of your advance, 12–24 hours for 50%, and under 12 hours the advance is forfeited. Refunds to wallet earn a 20% bonus. The exact policy version you accepted is shown on your booking.'],
  ['Can we book half of the pitch?', 'Yes. Pitch A can be booked as a full 7-a-side pitch or as two independent 5-a-side halves. When someone books the full pitch both halves are blocked automatically, and vice-versa.'],
  ['What happens if it rains?', 'Indoor Pitch B is unaffected. For outdoor pitches our staff can issue a rain cancellation: you choose a free reschedule, a full refund, or wallet credit with a bonus.'],
  ['Is there parking and a prayer room?', 'Yes — free parking for 40 cars and 80 bikes, separate prayer rooms, changing rooms with lockers, and a café.'],
  ['Can companies get a monthly invoice?', 'Yes. Corporate accounts get negotiated rates, fixed recurring slots, purchase-order numbers on invoices and 30-day payment terms.'],
  ['How do loyalty points work?', 'Earn 1 point per ৳100 spent (2× for Gold, 3× for Platinum). Redeem 1 point = ৳1 on future bookings. Points expire after 12 months of inactivity.'],
];

export const CUSTOMERS = [
  ['Rafiq Hasan', '01711-234567', 'Gold', 46, 168400, '11 Nov 2026', 'VIP,Regular'],
  ['Tanvir Ahmed', '01819-552211', 'Platinum', 72, 284100, '12 Nov 2026', 'Captain,Regular'],
  ['Brac IT Ltd.', '01730-100200', 'Corporate', 38, 412000, '7 Nov 2026', 'Corporate'],
  ['Sharmin Akter', '01912-778899', 'Starter', 9, 21600, '2 Nov 2026', 'Academy parent'],
  ['Mehedi Islam', '01556-443322', 'Starter', 3, 8400, '14 Sep 2026', 'Inactive'],
  ['Arif Hossain', '01611-998877', 'Gold', 21, 52300, '10 Nov 2026', 'Cricket'],
  ['Nusrat Jahan', '01799-121212', 'Starter', 1, 3200, '12 Nov 2026', 'New'],
  ['Kamrul Hasan', '01822-656565', 'Gold', 15, 61900, '29 Oct 2026', 'Birthday this month'],
];
