// Navigation structures shared by the layouts, the HTML sitemap and the
// template index. Paths are relative to the built site root (docs/).

export const BRAND = {
  name: 'TurfPro Arena', tagline: 'Play · Book · Compete', phone: '+880 1711-000000', phoneHref: 'tel:+8801711000000',
  wa: 'https://wa.me/8801711000000', email: 'hello@turfpro.example', address: 'House 12, Road 27, Dhanmondi, Dhaka 1209',
  hours: 'Open daily 6:00 AM – 12:00 AM', domain: 'https://www.turfpro.example',
};

export const PUBLIC_NAV = [
  { key: 'home', label: 'Home', i18n: 'nav.home', href: 'index.html' },
  {
    key: 'turfs', label: 'Turfs', i18n: 'nav.turfs', mega: [
      ['turfs.html', 'grid', 'All turfs & courts', 'Football, futsal, cricket nets, badminton'],
      ['turf-detail.html', 'ball', 'Pitch A — 7-a-side', 'Full or split into two 5-a-side halves'],
      ['arena-overview.html', 'layout', 'Arena overview', 'Floor plan, sizes and surfaces'],
      ['locations.html', 'map-pin', 'Branches & locations', 'Dhanmondi · more coming soon'],
      ['sports.html', 'target', 'Sports', 'Browse by sport'],
      ['amenities.html', 'coffee', 'Facilities & amenities', 'Parking, changing rooms, café, prayer room'],
      ['gallery.html', 'image', 'Gallery', 'Photos and videos'],
      ['rentals-shop.html', 'shopping-bag', 'Rentals & shop', 'Boots, bibs, balls, cricket kits'],
    ],
  },
  { key: 'pricing', label: 'Pricing', i18n: 'nav.pricing', href: 'pricing.html' },
  {
    key: 'play', label: 'Play & Compete', i18n: 'nav.tournaments', mega: [
      ['tournaments.html', 'trophy', 'Tournaments', 'Leagues and knockouts'],
      ['live-scoreboard.html', 'activity', 'Live scoreboard', 'Scores, points table, bracket'],
      ['open-matches.html', 'users', 'Open matches', 'Join a game that needs players'],
      ['find-players.html', 'user-plus', 'Find players', 'Recruit for your team'],
      ['teams-leaderboard.html', 'medal', 'Teams & leaderboard', 'Top teams this season'],
      ['events.html', 'calendar', 'Events', 'Birthdays, schools, corporate days'],
      ['academy.html', 'graduation-cap', 'Academy', 'Football & cricket coaching'],
      ['referral.html', 'gift', 'Refer & earn', 'Give ৳200, get ৳200'],
    ],
  },
  {
    key: 'more', label: 'More', i18n: 'nav.more', mega: [
      ['offers.html', 'percent', 'Offers & promotions', 'Current deals and coupon codes'],
      ['memberships.html', 'star', 'Memberships & packages', 'Save with prepaid hours'],
      ['corporate-booking.html', 'briefcase', 'Corporate & group', 'Monthly invoicing, fixed slots'],
      ['blog.html', 'book-open', 'Blog & news', 'Tips, news and stories'],
      ['reviews.html', 'message-square', 'Reviews', 'What players say'],
      ['about.html', 'info', 'About us', 'Our story and team'],
      ['help.html', 'life-buoy', 'Help center', 'FAQs, guides, support'],
      ['partners.html', 'heart', 'Partners & sponsors', 'Brands we play with'],
    ],
  },
  { key: 'contact', label: 'Contact', i18n: 'nav.contact', href: 'contact.html' },
];

export const FOOTER = [
  ['Play', 'f.play', [['Book a turf', 'booking.html'], ['Pricing & rates', 'pricing.html'], ['Turfs & courts', 'turfs.html'], ['Open matches', 'open-matches.html'], ['Tournaments', 'tournaments.html'], ['Academy', 'academy.html'], ['Memberships', 'memberships.html'], ['Corporate booking', 'corporate-booking.html']]],
  ['Explore', 'f.quick', [['About us', 'about.html'], ['Locations', 'locations.html'], ['Gallery', 'gallery.html'], ['Offers', 'offers.html'], ['Blog & news', 'blog.html'], ['Reviews', 'reviews.html'], ['Partners', 'partners.html'], ['Partner with us', 'partner-with-us.html']]],
  ['Help', 'f.help', [['Help center', 'help.html'], ['FAQ', 'faq.html'], ['Support ticket', 'support-ticket.html'], ['Ground rules', 'ground-rules.html'], ['Safety & waiver', 'waiver.html'], ['Accessibility', 'accessibility.html'], ['Directions', 'directions.html'], ['Contact', 'contact.html']]],
  ['Legal', 'f.legal', [['Terms & conditions', 'terms.html'], ['Privacy policy', 'privacy.html'], ['Refund policy', 'refund-policy.html'], ['Cancellation policy', 'cancellation-policy.html'], ['Cookie policy', 'cookie-policy.html'], ['Community guidelines', 'community-guidelines.html'], ['Sitemap', 'sitemap.html']]],
];

export const ACCOUNT_NAV = [
  ['My account', [
    ['overview', 'account/index.html', 'home', 'Overview', 'acc.overview'],
    ['bookings', 'account/bookings.html', 'calendar', 'My bookings', 'acc.bookings'],
    ['payments', 'account/payments.html', 'receipt', 'Payments & invoices', 'acc.payments'],
    ['wallet', 'account/wallet.html', 'wallet', 'Wallet & loyalty', 'acc.wallet'],
    ['memberships', 'account/memberships.html', 'star', 'Memberships & packages', 'acc.memberships'],
  ]],
  ['Community', [
    ['teams', 'account/teams.html', 'users', 'My teams', 'acc.teams'],
    ['invites', 'account/open-match-invitations.html', 'user-plus', 'Open match invitations', 'acc.invites'],
    ['referrals', 'account/referrals.html', 'gift', 'Referrals', 'acc.referrals'],
    ['coupons', 'account/coupons.html', 'tag', 'Coupons', 'acc.coupons'],
    ['reviews', 'account/reviews.html', 'message-square', 'Reviews & feedback', 'acc.reviews'],
    ['notifications', 'account/notifications.html', 'bell', 'Notifications', 'acc.notifications'],
  ]],
  ['Settings', [
    ['profile', 'account/profile.html', 'user', 'Profile', 'acc.profile'],
    ['prefs', 'account/notification-preferences.html', 'sliders', 'Notification preferences', 'acc.prefs'],
    ['security', 'account/security.html', 'shield', 'Account security', 'acc.security'],
    ['settings', 'account/settings.html', 'settings', 'Account settings', 'acc.settings'],
    ['export', 'account/data-export.html', 'download', 'Data export', 'acc.export'],
    ['delete', 'account/delete-account.html', 'trash', 'Delete account', 'acc.delete'],
  ]],
];

// Management sidebar — spec §44, plus a few operational extras (marked *)
export const ADMIN_NAV = [
  ['Operations', [
    ['dashboard', 'Dashboard', 'grid'], ['bookings', 'Bookings', 'calendar', 12], ['calendar', 'Calendar', 'calendar-plus'], ['walk-ins', 'Walk-ins', 'log-in-door'],
    ['check-in', 'Check-in', 'qr'], ['front-desk', 'Front Desk Mode', 'tablet'], ['waitlist', 'Waitlist', 'clock', 5], ['open-matches', 'Open Matches', 'users'], ['support-tickets', 'Support Tickets', 'life-buoy', '3!'],
  ]],
  ['Turf and Facility', [
    ['branches', 'Branches', 'building'], ['turf-master', 'Turf Master', 'layout'], ['block-slots', 'Block Slots', 'calendar-x'], ['pricing', 'Pricing and Rates', 'tag'],
    ['facilities', 'Facilities', 'coffee'], ['maintenance', 'Maintenance', 'tool', 2], ['assets', 'Assets', 'archive'], ['incidents', 'Incidents', 'first-aid'], ['weather', 'Weather Board', 'cloud-rain'],
  ]],
  ['Customers and Marketing', [
    ['customers', 'Customers', 'users'], ['teams', 'Teams', 'shirt'], ['corporate-accounts', 'Corporate Accounts', 'briefcase'], ['loyalty', 'Loyalty', 'star'],
    ['memberships', 'Memberships', 'medal'], ['packages', 'Packages', 'package'], ['coupons', 'Coupons', 'percent'], ['campaigns', 'Campaigns', 'megaphone'],
    ['reviews', 'Reviews', 'message-square'], ['referrals', 'Referrals', 'gift'],
  ]],
  ['Academy and Events', [
    ['academy', 'Academy', 'graduation-cap'], ['coaches', 'Coaches', 'whistle'], ['students', 'Students', 'user'], ['events', 'Events', 'sparkles'],
    ['tournaments', 'Tournaments', 'trophy'], ['fixtures', 'Fixtures', 'git-branch'], ['live-scoreboard', 'Live Scoreboard', 'activity'], ['sponsors', 'Sponsors', 'heart'],
  ]],
  ['POS and Inventory', [
    ['pos', 'POS', 'shopping-cart'], ['items', 'Items', 'box'], ['stock', 'Stock', 'layers', '4!'], ['suppliers', 'Suppliers', 'truck'],
    ['purchase-orders', 'Purchase Orders', 'file-text'], ['rentals', 'Rentals', 'package'],
  ]],
  ['Financials', [
    ['ledger', 'Collections Ledger', 'book-open'], ['payments', 'Payments', 'credit-card'], ['refunds', 'Refunds', 'rotate-ccw', 2], ['wallets', 'Wallets', 'wallet'],
    ['expenses', 'Expenses', 'receipt'], ['corporate-invoices', 'Corporate Invoices', 'file-text'], ['daily-closing', 'Daily Closing', 'lock'], ['reports', 'Financial Reports', 'bar-chart'],
  ]],
  ['Human Resources', [
    ['staff', 'Staff Master', 'user-check'], ['shifts', 'Shifts', 'clock'], ['attendance', 'Attendance', 'check-circle'], ['leave', 'Leave', 'calendar'],
    ['payroll', 'Payroll', 'banknote'], ['tasks', 'Tasks', 'list'],
  ]],
  ['Website Content', [
    ['cms-pages', 'Pages', 'file'], ['cms-homepage', 'Homepage', 'home'], ['cms-gallery', 'Gallery & Media', 'image'], ['cms-blog', 'Blog', 'book-open'],
    ['cms-faq', 'FAQ', 'help-circle'], ['cms-testimonials', 'Reviews', 'star'], ['cms-offers', 'Offers', 'percent'], ['cms-legal', 'Legal Pages', 'shield'], ['cms-seo', 'SEO', 'globe'],
  ]],
  ['Configuration and Security', [
    ['settings-business', 'Business Settings', 'settings'], ['settings-branch', 'Branch Settings', 'building'], ['booking-rules', 'Booking Rules', 'sliders'],
    ['payment-gateways', 'Payment Gateways', 'credit-card'], ['notifications', 'Notifications', 'bell'], ['integrations', 'Integrations & API', 'plug'],
    ['users', 'Users', 'users'], ['roles', 'Roles', 'shield'], ['permissions', 'Permissions', 'key'], ['audit-logs', 'Audit Logs', 'history'],
    ['data-import', 'Data Import', 'upload'], ['backups', 'Backups', 'database'], ['system-health', 'System Health', 'server'],
  ]],
  ['Marketplace (optional)', [
    ['mp-partners', 'Partners', 'building'], ['mp-applications', 'Partner Applications', 'inbox'], ['mp-commission', 'Commission & Settlement', 'percent'], ['mp-payouts', 'Payouts', 'banknote'],
  ]],
];
