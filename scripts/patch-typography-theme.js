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
  const mixinsPath = path.join(themeRoot, 'layout/mixins.pug');

  // Reading must work before JavaScript loads, including with JavaScript disabled.
  for (const template of ['layout/partial/layout.pug', 'layout/partial/sidebar.pug']) {
    const file = path.join(themeRoot, template);
    replaceOnce(file, '.invisible', '');
  }

  const mixins = fs.readFileSync(mixinsPath, 'utf8');
  const pagerStart = mixins.indexOf('mixin make_pager()');
  const pagerEnd = mixins.indexOf('mixin postList()', pagerStart);
  if (pagerStart < 0 || pagerEnd < 0) throw new Error('Missing pagination template');
  fs.writeFileSync(mixinsPath, mixins.slice(0, pagerStart) + `mixin make_pager()
    if page.total > 1
        nav.pagination.no-margin-bottom(aria-label="分页导航")
            if theme.showPageCount
                p= '第 ' + page.current + ' 页 / 共 ' + page.total + ' 页'
            p.clearfix
                if page.prev
                    span.pre.pagbuttons
                        a(href=url_for(page.prev_link), rel="prev", aria-label=__('prev'))= __('prev')
                if page.next
                    span.next.pagbuttons
                        a(href=url_for(page.next_link), rel="next", aria-label=__('next'))= __('next')

` + mixins.slice(pagerEnd));
  const summaryLine = fs.readFileSync(mixinsPath, 'utf8').split('\n').find(line => line.includes('p.post-abstract!= truncate'));
  if (!summaryLine) throw new Error('Missing post summary template');
  replaceOnce(mixinsPath, summaryLine,
    '            p.post-abstract= truncate(strip_html(item.description || item.desc || item.excerpt || item.content.replace(/<nav\\b[^>]*>[\\s\\S]*?<\\/nav>/gi, "").replace(/<pre\\b[^>]*>[\\s\\S]*?<\\/pre>/gi, "")).replace(/\\s+/g, " ").trim(), {length: 160})');

  const listingExpression = "(page.category ? '分类：' + page.category + ' · ' : page.tag ? '标签：' + page.tag + ' · ' : page.archive ? '归档' + (page.year ? ' · ' + page.year + (page.month ? '-' + page.month : '') : '') + ' · ' : '') + config.title + (page.current > 1 ? ' · 第 ' + page.current + ' 页' : '')";
  replaceOnce(headPath, '        = config.title', '        = ' + listingExpression);
  for (const template of ['archive', 'category', 'tag']) {
    const file = path.join(themeRoot, 'layout', template + '.pug');
    const original = fs.readFileSync(file, 'utf8').match(/block site_title\n[^]*?(?=\nblock description)/)[0];
    replaceOnce(file, original, 'block site_title\n    = ' + listingExpression + '\n');
  }
  replaceOnce(headPath, 'if page.keywords',
    `if !is_post()
    - var listingDescription = config.description || 'A Blog Powered By Hexo';
    - var listingCanonical = (config.url || '').replace(/\\/$/, '') + url_for(page.path || '');
    link(rel="canonical", href=listingCanonical)
    meta(property="og:type", content="website")
    meta(property="og:title", content=${listingExpression})
    meta(property="og:description", content=listingDescription)
    meta(property="og:url", content=listingCanonical)
    meta(property="og:site_name", content=config.title)
    meta(name="twitter:card", content="summary")

if page.keywords`);

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
