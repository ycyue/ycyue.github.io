import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const postRoot = path.join(root, 'source', '_posts');
const files = fs.readdirSync(postRoot)
  .filter(name => /^algorithm-\d{2}-.+\.md$/.test(name) || name === 'python-algorithm-learning-map.md');
const urls = new Set();

for (const file of files) {
  const markdown = fs.readFileSync(path.join(postRoot, file), 'utf8');
  for (const match of markdown.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)) urls.add(match[1]);
}

const queue = [...urls];
const failures = [];
const warnings = [];
const statuses = new Map();

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'Mozilla/5.0 algorithm-series-link-check' },
        signal: AbortSignal.timeout(20000),
      });
      statuses.set(response.status, (statuses.get(response.status) || 0) + 1);
      if (response.status === 404 || response.status === 410 || response.status >= 500) {
        failures.push(`${response.status} ${url}`);
      }
      await response.body?.cancel();
    } catch (error) {
      warnings.push(`${url}: ${error.name}`);
    }
  }
}

await Promise.all(Array.from({ length: 8 }, worker));

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const statusSummary = [...statuses].sort((a, b) => a[0] - b[0]).map(([code, count]) => `${code}:${count}`).join(', ');
console.log(`external links: ${urls.size} checked; statuses ${statusSummary}; transport warnings ${warnings.length}`);
if (warnings.length) console.log(warnings.join('\n'));
