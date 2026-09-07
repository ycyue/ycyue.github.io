'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const manifestName = '.generated-files.json';
function allowed(file) {
  return typeof file === 'string' && !file.includes('..') && !file.includes('\\') &&
    /^(?:(?:\d{4}|archives|categories|tags|page|css|js|images|fonts)\/|(?:index\.html|404\.html|atom\.xml|sitemap\.xml|robots\.txt)$)/.test(file);
}
function walk(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${relative}`);
    return entry.isDirectory() ? walk(path.join(directory, entry.name), relative + '/') : [relative];
  });
}
function syncGenerated(root) {
  const output = path.join(root, 'public');
  if (!fs.existsSync(path.join(output, 'index.html'))) throw new Error('Build output is missing index.html');
  const files = walk(output).sort();
  const manifest = path.join(root, manifestName);
  // On first use, only adopt tracked HTML explicitly marked as Hexo output.
  const previous = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) :
    execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(file =>
      allowed(file) && file.endsWith('.html') && fs.existsSync(path.join(root, file)) &&
      /<meta name="generator" content="Hexo /.test(fs.readFileSync(path.join(root, file), 'utf8')));
  if (!Array.isArray(previous) || [...files, ...previous].some(file => !allowed(file))) {
    throw new Error('Refusing to sync paths outside the generated-site allowlist');
  }
  // Validate all destinations before changing anything.
  for (const file of [...files, ...previous]) {
    let parent = root;
    for (const part of file.split('/')) {
      parent = path.join(parent, part);
      if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error(`Symlink destination: ${file}`);
    }
  }
  const next = new Set(files);
  const stale = previous.filter(file => !next.has(file));
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.copyFileSync(path.join(output, file), path.join(root, file));
  }
  for (const file of stale) fs.rmSync(path.join(root, file), { force: true });
  fs.writeFileSync(manifest, JSON.stringify(files, null, 2) + '\n');
  fs.writeFileSync(path.join(root, '.nojekyll'), '\n');
  console.log(`Published ${files.length} generated files; removed ${stale.length} stale files.`);
}
if (require.main === module) syncGenerated(path.resolve(__dirname, '..'));
module.exports = { syncGenerated };
