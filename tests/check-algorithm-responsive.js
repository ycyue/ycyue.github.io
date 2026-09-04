#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const algorithmCss = fs.readFileSync(path.join(root, 'source/css/algorithm-series.css'), 'utf8');
const readingCss = fs.readFileSync(path.join(root, 'source/css/reading-ui.css'), 'utf8');
const readingJs = fs.readFileSync(path.join(root, 'source/js/reading-ui.js'), 'utf8');

const checks = [
  ['mobile breakpoint', /@media\s*\(max-width:\s*640px\)/.test(algorithmCss)],
  ['responsive figures', /\.algorithm-figure img[\s\S]*?max-width:\s*100%[\s\S]*?height:\s*auto/.test(algorithmCss)],
  ['two-column mobile navigation', /@media\s*\(max-width:\s*640px\)[\s\S]*?\.series-nav\s*{[\s\S]*?grid-template-columns:\s*1fr 1fr/.test(algorithmCss)],
  ['full-width map link', /\.series-nav__map\s*{[\s\S]*?grid-column:\s*1 \/ -1/.test(algorithmCss)],
  ['long navigation text wrapping', /overflow-wrap:\s*anywhere/.test(algorithmCss)],
  ['dark-mode SVG treatment', /html\[data-theme='dark'\][\s\S]*?img\[src\$='\.svg'\][\s\S]*?filter:/.test(algorithmCss)],
  ['scrollable tables', /\.table-scroll\s*{[\s\S]*?overflow-x:\s*auto/.test(readingCss)],
  ['table wrapper script', /querySelectorAll\('table'\)[\s\S]*?create\('div', 'table-scroll'\)/.test(readingJs)],
  ['mobile reading progress', /@media\s*\(max-width:\s*(?:640|768)px\)[\s\S]*?\.reading-progress/.test(readingCss)],
];

const failures = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failures.length) {
  console.error(`responsive checks failed: ${failures.join(', ')}`);
  process.exit(1);
}

console.log(`responsive checks: ${checks.length} mobile, overflow, dark-mode, and reading UI rules passed`);
