'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../public');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
let references = 0;
const pages = walk(root).filter(file => file.endsWith('.html') && !file.endsWith('/images/test.html'));
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const current = new URL(path.relative(root, file).replace(/index\.html$/, ''), 'https://ycyue.github.io/');
  assert.match(html, /rel="canonical"/, `${file}: canonical missing`);
  assert.doesNotMatch(html, /class="[^"]*\binvisible\b/, `${file}: hidden content`);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    if (/^(?:javascript:|mailto:|data:)/.test(link)) continue;
    const url = new URL(link.replace(/&amp;/g, '&'), current);
    if (url.origin !== current.origin) continue;
    let target = path.join(root, decodeURIComponent(url.pathname));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert.ok(fs.existsSync(target), `${file}: missing ${url.pathname}`);
    references++;
  }
  const pager = html.match(/<nav class="pagination[^]*?<\/nav>/)?.[0];
  if (pager) {
    const [, currentPage, total] = pager.match(/第 (\d+) 页 \/ 共 (\d+) 页/);
    assert.equal(pager.includes('rel="prev"'), Number(currentPage) > 1, `${file}: previous page`);
    assert.equal(pager.includes('rel="next"'), Number(currentPage) < Number(total), `${file}: next page`);
    for (const [, href] of pager.matchAll(/href="([^"]+)"/g)) assert.notEqual(new URL(href, current).href, current.href);
  }
  if (!html.includes('class="post-page"')) {
    for (const [, summary] of html.matchAll(/<p class="post-abstract">([^]*?)<\/p>/g)) {
      assert.doesNotMatch(summary, /←|→|扩展篇完成|这节仍然从最容易想到/);
    }
  }
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const totalPages = Number(home.match(/第 1 页 \/ 共 (\d+) 页/)?.[1] || 1);
if (totalPages > 1) {
  const last = fs.readFileSync(path.join(root, `page/${totalPages}/index.html`), 'utf8');
  assert.notEqual(home.match(/<title>(.*?)<\/title>/)[1], last.match(/<title>(.*?)<\/title>/)[1]);
}
console.log(`Blog output: ${pages.length} pages and ${references} internal references passed; metadata, summaries, visibility and pagination passed.`);
