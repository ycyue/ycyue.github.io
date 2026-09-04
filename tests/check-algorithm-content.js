'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const postRoot = path.join(root, 'source', '_posts');
const imageRoot = path.join(root, 'source', 'images', 'algorithms');
const files = fs.readdirSync(postRoot)
  .filter((name) => /^algorithm-\d{2}-.+\.md$/.test(name))
  .sort();
const failures = [];
const requiredHeadings = [
  '这节解决什么问题',
  '从暴力解法开始',
  '核心思想',
  '为什么',
  'Python 模板',
  '手工模拟',
  '复杂度分析',
  '什么时候想到',
  '常见坑',
  'Python 补充',
  '典型练习题',
  '本节你应该掌握',
  '下一节',
];

for (const file of files) {
  const markdown = fs.readFileSync(path.join(postRoot, file), 'utf8');
  const number = Number(file.match(/^algorithm-(\d{2})-/)[1]);
  const links = Array.from(markdown.matchAll(/https:\/\/leetcode\.cn\/problems\/[^/]+\//g), (match) => match[0]);
  const figures = Array.from(markdown.matchAll(/<img src="([^"]+\.svg)" alt="([^"]+)"/g));
  const navCount = (markdown.match(/<nav class="series-nav"/g) || []).length;
  const pythonBlocks = (markdown.match(/```python/g) || []).length;

  if (!markdown.startsWith('---\n')) failures.push(`${file}: missing front matter`);
  for (const heading of requiredHeadings) {
    if (number === 1 && heading === 'Python 模板') continue;
    if (!markdown.includes(heading)) failures.push(`${file}: missing section ${heading}`);
  }
  if (new Set(links).size < 3 || new Set(links).size > 6) {
    failures.push(`${file}: expected 3-6 representative LeetCode links, got ${new Set(links).size}`);
  }
  if (figures.length < 2) failures.push(`${file}: expected at least 2 teaching SVGs`);
  for (const [, source, alt] of figures) {
    const target = path.join(root, 'source', source.replace(/^\//, ''));
    if (!fs.existsSync(target)) failures.push(`${file}: missing image ${source}`);
    if (alt.trim().length < 6) failures.push(`${file}: image alt text too short`);
  }
  if (navCount !== 2) failures.push(`${file}: expected two navigation bars`);
  if (pythonBlocks < 3) failures.push(`${file}: expected brute, template, and answer code blocks`);
  if (!markdown.includes('|---')) failures.push(`${file}: missing execution table`);
  if (!markdown.includes('时间复杂度') || !markdown.includes('空间复杂度')) failures.push(`${file}: missing complexity explanation`);
  if (!markdown.includes('本文讲解、代码组织与图解均为独立编写')) failures.push(`${file}: missing originality note`);
  if (/图片\d|新建图片/.test(markdown)) failures.push(`${file}: non-descriptive image name`);
  if (number > 1 && markdown.length < 4500) failures.push(`${file}: tutorial content unexpectedly short`);
}

const svgFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.svg')) svgFiles.push(full);
  }
}
walk(imageRoot);
if (files.length !== 27) failures.push(`expected 27 tutorials, got ${files.length}`);
if (svgFiles.length !== 55) failures.push(`expected 55 algorithm SVGs, got ${svgFiles.length}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('algorithm content: 27 tutorials, 55 SVGs, required sections, exercises, and metadata passed');
