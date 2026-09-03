'use strict';

const fs = require('node:fs');
const path = require('node:path');

function replaceOnce(filePath, source, replacement) {
  const current = fs.readFileSync(filePath, 'utf8');

  if (!current.includes(source)) {
    throw new Error(`Expected template fragment was not found in ${filePath}`);
  }

  fs.writeFileSync(filePath, current.replace(source, replacement));
}

function patchTypographyTheme(themeRoot) {
  const headPath = path.join(themeRoot, 'layout/partial/head.pug');
  const postPath = path.join(themeRoot, 'layout/post.pug');

  replaceOnce(
    headPath,
    'meta(name="author", content= theme.author)',
    'meta(name="author", content= config.author ? config.author : theme.author)'
  );
  replaceOnce(
    headPath,
    'meta(content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",name="viewport")',
    'meta(content="width=device-width, initial-scale=1.0", name="viewport")'
  );
  replaceOnce(
    headPath,
    'link(rel="short icon", href="images/favicon.png",type="image/x-icon")',
    'link(rel="icon", href= url_for("images/favicon.png"), type="image/x-icon")'
  );

  replaceOnce(
    postPath,
    `block description
    - var desc = page.desc || strip_html(page.content).replace(/^\\s*/, '').replace(/\\s*$/, '').substring(0, 150);
    meta(name="description", content=desc)
    meta(name="og:description", content=desc)
    meta(name="twitter:site", content=config.title)
    meta(name="twitter:title", content=page.title)
    meta(name="twitter:card", content="summary")`,
    `block description
    - var desc = page.description || page.desc || strip_html(page.content).replace(/^\\s*/, '').replace(/\\s*$/, '').substring(0, 150);
    - var canonical = (config.url || '').replace(/\\\/$/, '') + url_for(page.path);
    meta(name="description", content=desc)
    link(rel="canonical", href=canonical)
    meta(property="og:type", content="article")
    meta(property="og:title", content=page.title)
    meta(property="og:description", content=desc)
    meta(property="og:url", content=canonical)
    meta(property="og:site_name", content=config.title)
    meta(name="twitter:title", content=page.title)
    meta(name="twitter:description", content=desc)
    meta(name="twitter:card", content="summary")`
  );
}

if (require.main === module) {
  const themeRoot = path.resolve(process.argv[2] || 'themes/typography');
  patchTypographyTheme(themeRoot);
  console.log(`Patched Typography theme in ${themeRoot}`);
}

module.exports = { patchTypographyTheme };
