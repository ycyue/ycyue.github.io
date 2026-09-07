'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { syncGenerated } = require('../tools/sync-generated');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-sync-'));
function write(file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}
try {
  write('public/index.html', 'new');
  write('page/9/index.html', 'old');
  write('source/_posts/keep.md', 'source');
  write('images/manual.svg', 'manual');
  write('.generated-files.json', JSON.stringify(['page/9/index.html']));
  syncGenerated(root);
  assert.equal(fs.existsSync(path.join(root, 'page/9/index.html')), false);
  assert.equal(fs.readFileSync(path.join(root, 'source/_posts/keep.md'), 'utf8'), 'source');
  assert.equal(fs.readFileSync(path.join(root, 'images/manual.svg'), 'utf8'), 'manual');
  write('.generated-files.json', JSON.stringify(['source/_posts/keep.md']));
  assert.throws(() => syncGenerated(root), /allowlist/);
  assert.equal(fs.existsSync(path.join(root, 'source/_posts/keep.md')), true);
  console.log('Generated sync: stale output removed; source and unowned files preserved; unsafe manifest rejected.');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
