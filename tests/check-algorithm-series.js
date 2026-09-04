'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const postRoot = path.join(root, 'source', '_posts');
const articleSources = fs.readdirSync(postRoot)
  .filter((name) => /^algorithm-\d{2}-.+\.md$/.test(name))
  .sort();
const articlePermalinks = articleSources.map((name) => {
  const markdown = fs.readFileSync(path.join(postRoot, name), 'utf8');
  const match = markdown.match(/^permalink:\s*(.+)$/m);
  if (!match) throw new Error(`${name}: missing permalink`);
  return match[1].trim();
});
const pages = [
  '2026/09/04/python-algorithm-learning-map/index.html',
  ...articlePermalinks.map((permalink) => `${permalink}index.html`),
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

  if (page.includes('/algorithm-')) {
    const figureCount = (html.match(/class="algorithm-figure"/g) || []).length;
    const navCount = (html.match(/class="series-nav"/g) || []).length;
    if (figureCount < 2) failures.push(`${page}: expected at least 2 algorithm figures`);
    if (navCount !== 2) failures.push(`${page}: expected top and bottom series navigation`);
    if (!html.includes('/2026/09/04/python-algorithm-learning-map/')) {
      failures.push(`${page}: missing learning map navigation`);
    }
  }
}

const mapHtml = fs.readFileSync(path.join(publicRoot, pages[0]), 'utf8');
const mapArticleLinks = new Set(Array.from(
  mapHtml.matchAll(/href="\/2026\/09\/04\/(algorithm-\d{2}-[^/]+)\/"/g),
  (match) => match[1],
));
if (articleSources.length !== 28) failures.push(`expected 28 article sources, got ${articleSources.length}`);
if (mapArticleLinks.size !== 28) failures.push(`learning map links ${mapArticleLinks.size}/28 articles`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`algorithm series: ${pages.length} pages, 28 map links, figures, navigation, and all local links passed`);
