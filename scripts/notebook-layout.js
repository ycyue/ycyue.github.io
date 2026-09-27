'use strict';

// Keep the redesign in the source pipeline so every Hexo build reproduces it.
hexo.extend.filter.register('after_render:html', function (html, data) {
  if (html.includes('notebook-layout.css')) return html;
  const isHome = data && (data.path === 'index.html' || data.path === '');
  const home = `<header class="notebook-intro"><p class="notebook-eyebrow">PLONG / NOTES</p><h1>潜的笔记<span>思考，实践，持续记录。</span></h1><p>关于 Python、算法与软件测试的学习笔记。</p></header><a class="notebook-series" href="/2026/09/04/python-algorithm-learning-map/"><div><span class="notebook-eyebrow">系统学习</span><h2>Python 基础算法学习地图</h2><p>27 节主线 + 扩展篇，从双指针到动态规划。</p></div><span class="series-link">查看学习路线 <span aria-hidden="true">↗</span></span></a><div class="notebook-list-heading"><h2>最新文章</h2><a href="/archives/">全部归档 ↗</a></div>`;
  html = html.replace('</head>', '<link rel="stylesheet" href="/css/notebook-layout.css"></head>')
    .replace('<body>', '<body><a class="skip-content" href="#main-container">跳至正文</a>')
    .replace('id="main-container"', 'id="main-container" tabindex="-1" role="main"')
    .replace('id="site-nav"', 'id="site-nav" role="navigation" aria-label="主导航"')
    .replace('<script src="/js/typography.js"></script>', '');
  if (isHome) html = html.replace('<div class="content">', '<div class="content notebook-home">' + home);
  return html;
}, 20);
