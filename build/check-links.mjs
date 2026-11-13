#!/usr/bin/env node
// Crawls dist/ and verifies every internal href/src points to a real file.
// Optional photo slots (assets/img/photos/*) are listed separately: they fall
// back to illustrations when missing, so they are not errors.
import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
async function walk(d) { const o = []; for (const e of await readdir(d, { withFileTypes: true })) { const p = join(d, e.name); e.isDirectory() ? o.push(...await walk(p)) : o.push(p); } return o; }
const exists = (p) => access(p).then(() => true, () => false);

const files = (await walk(DIST)).filter((f) => f.endsWith('.html'));
const broken = []; const photoSlots = new Set(); let checked = 0;
for (const f of files) {
  const html = await readFile(f, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const url = m[1];
    if (!url || /^(https?:|mailto:|tel:|data:|javascript:|blob:)/.test(url)) continue;
    if (url.startsWith('#')) { if (url.length > 1 && !ids.has(url.slice(1))) broken.push(`${relative(DIST, f)} → ${url} (missing anchor)`); continue; }
    const clean = url.split(/[?#]/)[0];
    if (!clean) continue;
    const target = resolve(dirname(f), clean);
    checked++;
    if (relative(DIST, target).startsWith('assets/img/photos/')) { if (!(await exists(target))) photoSlots.add(relative(DIST, target)); continue; }
    if (!(await exists(target))) broken.push(`${relative(DIST, f)} → ${url}`);
  }
}
console.log(`Checked ${checked} internal links across ${files.length} pages.`);
if (photoSlots.size) console.log(`Optional photo slots without a file yet (illustration fallback shown): ${photoSlots.size}\n  ${[...photoSlots].sort().join('\n  ')}`);
if (broken.length) { console.error(`\n${broken.length} broken link(s):\n  ${broken.join('\n  ')}`); process.exit(1); }
console.log('No broken links.');
