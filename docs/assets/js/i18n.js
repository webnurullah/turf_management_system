/* ==========================================================================
   EN / BN language switcher.
   Mark text with data-i18n="key" (textContent) or data-i18n-ph="key" (placeholder).
   English text in the HTML is the fallback, so pages render correctly without JS.
   In production, serve each language from the server (/en, /bn) for SEO; this
   client-side switcher is for the template preview and staff UI.
   ========================================================================== */
(function () {
  'use strict';
  var BN = {
    /* Header / nav */
    'nav.home': 'হোম', 'nav.turfs': 'টার্ফ', 'nav.pricing': 'মূল্য', 'nav.booking': 'বুকিং', 'nav.tournaments': 'টুর্নামেন্ট',
    'nav.academy': 'একাডেমি', 'nav.more': 'আরও', 'nav.offers': 'অফার', 'nav.contact': 'যোগাযোগ', 'nav.login': 'লগইন',
    'nav.book': 'এখনই বুক করুন', 'nav.account': 'আমার অ্যাকাউন্ট', 'nav.openmatches': 'ওপেন ম্যাচ', 'nav.memberships': 'মেম্বারশিপ',
    'nav.corporate': 'কর্পোরেট', 'nav.gallery': 'গ্যালারি', 'nav.blog': 'ব্লগ', 'nav.help': 'সহায়তা', 'nav.about': 'আমাদের সম্পর্কে',
    'nav.events': 'ইভেন্ট', 'nav.shop': 'রেন্টাল ও শপ', 'nav.findplayers': 'খেলোয়াড় খুঁজুন',
    /* Hero */
    'hero.eyebrow': 'ঢাকার প্রিমিয়াম টার্ফ', 'hero.title': 'মাত্র কয়েক মিনিটে আপনার পছন্দের টার্ফ বুক করুন',
    'hero.lead': 'লাইভ স্লট দেখুন, পছন্দের সময় বেছে নিন, নিরাপদে পেমেন্ট করুন এবং সাথে সাথে কনফার্মেশন পান।',
    'hero.cta': 'এখনই বুক করুন', 'hero.cta2': 'মূল্য দেখুন',
    /* Search */
    'search.branch': 'শাখা', 'search.sport': 'খেলা', 'search.pitch': 'পিচ', 'search.date': 'তারিখ', 'search.time': 'পছন্দের সময়',
    'search.duration': 'সময়কাল', 'search.check': 'স্লট দেখুন',
    /* Booking */
    'book.step1': 'শাখা, খেলা ও পিচ নির্বাচন', 'book.step2': 'তারিখ ও স্লট নির্বাচন', 'book.step3': 'অ্যাড-অন ও রেন্টাল',
    'book.step4': 'টিম ও খেলোয়াড়ের তথ্য', 'book.step5': 'ছাড় ও ক্রেডিট', 'book.step6': 'নীতি ও ওয়েভার', 'book.step7': 'পেমেন্ট পদ্ধতি',
    'book.summary': 'বুকিং সারাংশ', 'book.subtotal': 'সাবটোটাল', 'book.discount': 'ছাড়', 'book.vat': 'ভ্যাট', 'book.total': 'মোট',
    'book.payable': 'এখন পরিশোধযোগ্য', 'book.due': 'ভেন্যুতে বাকি', 'book.pay': 'নিরাপদে পেমেন্ট করুন', 'book.hold': 'স্লট হোল্ড',
    'book.available': 'খালি', 'book.booked': 'বুকড', 'book.selected': 'নির্বাচিত', 'book.peak': 'পিক', 'book.offpeak': 'অফ-পিক',
    'book.empty': 'এখনও কোনো স্লট নির্বাচন করা হয়নি', 'book.apply': 'প্রয়োগ', 'book.full': 'ফুল পিচ', 'book.half': 'হাফ পিচ',
    /* Account */
    'acc.overview': 'ওভারভিউ', 'acc.bookings': 'আমার বুকিং', 'acc.payments': 'পেমেন্ট ও ইনভয়েস', 'acc.wallet': 'ওয়ালেট ও লয়্যালটি',
    'acc.memberships': 'মেম্বারশিপ ও প্যাকেজ', 'acc.teams': 'আমার টিম', 'acc.invites': 'ওপেন ম্যাচ আমন্ত্রণ', 'acc.referrals': 'রেফারেল',
    'acc.coupons': 'কুপন', 'acc.reviews': 'রিভিউ', 'acc.notifications': 'নোটিফিকেশন', 'acc.profile': 'প্রোফাইল',
    'acc.prefs': 'নোটিফিকেশন পছন্দ', 'acc.security': 'নিরাপত্তা', 'acc.settings': 'সেটিংস', 'acc.export': 'ডেটা এক্সপোর্ট',
    'acc.delete': 'অ্যাকাউন্ট মুছুন', 'acc.logout': 'লগআউট', 'acc.menu': 'অ্যাকাউন্ট মেনু',
    /* Admin groups */
    'sb.Operations': 'অপারেশনস', 'sb.Turf and Facility': 'টার্ফ ও সুবিধা', 'sb.Customers and Marketing': 'গ্রাহক ও মার্কেটিং',
    'sb.Academy and Events': 'একাডেমি ও ইভেন্ট', 'sb.POS and Inventory': 'POS ও ইনভেন্টরি', 'sb.Financials': 'আর্থিক',
    'sb.Human Resources': 'মানবসম্পদ', 'sb.Website Content': 'ওয়েবসাইট কনটেন্ট', 'sb.Reports': 'রিপোর্ট',
    'sb.Configuration and Security': 'কনফিগারেশন ও নিরাপত্তা', 'sb.Marketplace (optional)': 'মার্কেটপ্লেস (ঐচ্ছিক)',
    'sb.Dashboard': 'ড্যাশবোর্ড', 'sb.Bookings': 'বুকিং', 'sb.Calendar': 'ক্যালেন্ডার', 'sb.Walk-ins': 'ওয়াক-ইন', 'sb.Check-in': 'চেক-ইন',
    'sb.Customers': 'গ্রাহক', 'sb.POS': 'POS', 'sb.Expenses': 'খরচ', 'sb.Staff Master': 'কর্মী তালিকা', 'sb.Payroll': 'বেতন',
    /* Common */
    'c.save': 'সংরক্ষণ', 'c.cancel': 'বাতিল', 'c.search': 'খুঁজুন', 'c.export': 'এক্সপোর্ট', 'c.new': 'নতুন', 'c.filter': 'ফিল্টার',
    'c.viewall': 'সব দেখুন', 'c.learn': 'আরও জানুন', 'c.from': 'শুরু', 'c.perhour': '/ঘণ্টা', 'c.today': 'আজ',
    'f.quick': 'দ্রুত লিংক', 'f.play': 'খেলুন', 'f.help': 'সহায়তা', 'f.legal': 'আইনি', 'f.rights': 'সর্বস্বত্ব সংরক্ষিত।',
    'f.newsletter': 'অফার ও টুর্নামেন্ট আপডেট পেতে সাবস্ক্রাইব করুন', 'f.subscribe': 'সাবস্ক্রাইব'
  };
  var EN = {};
  function capture() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (!(k in EN)) EN[k] = el.textContent; });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { var k = 'ph:' + el.getAttribute('data-i18n-ph'); if (!(k in EN)) EN[k] = el.getAttribute('placeholder'); });
  }
  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      el.textContent = lang === 'bn' && BN[k] ? BN[k] : EN[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph');
      el.setAttribute('placeholder', lang === 'bn' && BN[k] ? BN[k] : EN['ph:' + k]);
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    document.dispatchEvent(new CustomEvent('tp:lang', { detail: lang }));
  }
  document.addEventListener('DOMContentLoaded', function () {
    capture();
    var saved = window.TP && TP.store ? TP.store.get('lang', 'en') : 'en';
    if (saved !== 'en') apply(saved);
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]'); if (!b) return;
      var l = b.getAttribute('data-lang'); apply(l); if (window.TP) { TP.store.set('lang', l); TP.toast(l === 'bn' ? 'ভাষা: বাংলা' : 'Language: English'); }
    });
  });
  window.TPi18n = { BN: BN, apply: apply };
})();
