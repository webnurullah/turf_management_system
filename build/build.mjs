#!/usr/bin/env node
// Zero-dependency static build: assembles src/pages/**/*.mjs into dist/ as
// standalone HTML files that work from file:// or any static host.
import { readdir, readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const { LAYOUTS } = await import(pathToFileURL(join(SRC, 'layouts.mjs')));
const { BRAND } = await import(pathToFileURL(join(SRC, 'nav.mjs')));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const started = Date.now();
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

/* 1. Collect pages ------------------------------------------------------- */
const pages = [];
for (const f of (await walk(join(SRC, 'pages'))).filter((f) => f.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(f));
  const list = Array.isArray(mod.default) ? mod.default : [mod.default];
  for (const p of list) pages.push({ ...p, src: relative(ROOT, f) });
}
const seen = new Map();
for (const p of pages) {
  if (!p.out || !p.title || p.body === undefined) throw new Error(`Page in ${p.src} is missing out/title/body`);
  if (seen.has(p.out)) throw new Error(`Duplicate output ${p.out} (${p.src} and ${seen.get(p.out)})`);
  seen.set(p.out, p.src);
}

/* 2. Render -------------------------------------------------------------- */
for (const p of pages) {
  const depth = p.out.split('/').length - 1;
  const prefix = depth ? '../'.repeat(depth) : '';
  const layout = LAYOUTS[p.layout || 'public'];
  if (!layout) throw new Error(`Unknown layout ${p.layout} in ${p.src}`);
  const body = typeof p.body === 'function' ? p.body() : p.body;
  let html = layout({ ...p, body });
  html = html.replaceAll('{{root}}', prefix);
  if (html.includes('{{')) {
    const m = html.match(/\{\{\s*(root|>)[^}]*\}\}/); // template variables like {{pitch}} in SMS templates are allowed
    if (m) throw new Error(`Unresolved placeholder ${m[0]} in ${p.out}`);
  }
  const dest = join(DIST, p.out);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, html);
}

/* 3. Assets -------------------------------------------------------------- */
await cp(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true });
const cssDir = join(SRC, 'assets', 'css');
const cssFiles = (await readdir(cssDir)).filter((f) => f.endsWith('.css')).sort();
let css = `/* TurfPro template — generated from src/assets/css/*.css. Edit the sources, then run npm run build. */\n`;
for (const f of cssFiles) css += `\n/* ---- ${f} ---- */\n` + (await readFile(join(cssDir, f), 'utf8'));
await writeFile(join(DIST, 'assets', 'css', 'app.css'), css);
await cp(join(SRC, 'static'), DIST, { recursive: true });

/* 4. SEO files ----------------------------------------------------------- */
const publicPages = pages.filter((p) => !p.noindex && !/^(account|admin)\//.test(p.out) && (p.layout || 'public') === 'public');
const today = new Date().toISOString().slice(0, 10);
await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${publicPages.map((p) => { const u = `${BRAND.domain}/${p.out.replace(/index\.html$/, '')}`; return `  <url><loc>${u}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="bn" href="${BRAND.domain}/bn/${p.out.replace(/index\.html$/, '')}"/></url>`; }).join('\n')}
</urlset>
`);
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /account/\nDisallow: /*?*\n\nSitemap: ${BRAND.domain}/sitemap.xml\n`);

/* 5. Page manifest (used by the link checker + template index) ---------- */
await writeFile(join(DIST, 'assets', 'pages.json'), JSON.stringify(pages.map((p) => ({ out: p.out, title: p.title, layout: p.layout || 'public', group: p.group || '' })), null, 1));

const counts = pages.reduce((a, p) => ((a[p.layout || 'public'] = (a[p.layout || 'public'] || 0) + 1), a), {});
console.log(`Built ${pages.length} pages in ${Date.now() - started} ms →`, counts);
