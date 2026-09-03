'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const pages = [
  '2026/09/04/python-algorithm-learning-map/index.html',
  '2026/09/04/algorithm-01-two-pointers/index.html',
];

function targetPath(url) {
  const pathname = url.split('#')[0].split('?')[0];
  if (pathname === '/') return path.join(publicRoot, 'index.html');

  const clean = pathname.replace(/^\//, '');
  if (clean.endsWith('/')) return path.join(publicRoot, clean, 'index.html');
  return path.join(publicRoot, clean);
}

const failures = [];

for (const page of pages) {
  const pagePath = path.join(publicRoot, page);
  if (!fs.existsSync(pagePath)) {
    failures.push(`missing page: ${page}`);
    continue;
  }

  const html = fs.readFileSync(pagePath, 'utf8');
  const ids = new Set(Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]));
  const urls = Array.from(html.matchAll(/(?:href|src)="([^"]+)"/g), (match) => match[1]);
  const localLinks = urls.filter((url) => url.startsWith('/') && !url.startsWith('//'));
  const anchors = urls.filter((url) => url.startsWith('#'));

  for (const url of localLinks) {
    if (!fs.existsSync(targetPath(url))) {
      failures.push(`${page}: broken local link ${url}`);
    }
  }

  for (const url of anchors) {
    if (!ids.has(decodeURIComponent(url.slice(1)))) {
      failures.push(`${page}: missing anchor ${url}`);
    }
  }

  if (!html.includes('/css/algorithm-series.css')) {
    failures.push(`${page}: algorithm series stylesheet not injected`);
  }
  if (!html.includes('/js/reading-ui.js')) {
    failures.push(`${page}: reading UI script not injected`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`algorithm series: ${pages.length} pages and all local links passed`);
