'use strict';

const headMarkup = `
<link rel="stylesheet" href="/css/theme-toggle.css">
<link rel="stylesheet" href="/css/reading-ui.css">
<script>
(function () {
  var storageKey = 'plong-theme';
  var stored = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch (error) {}

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var mode = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
  var links = document.querySelectorAll('link[rel="stylesheet"]');

  for (var index = 0; index < links.length; index += 1) {
    var link = links[index];
    var href = link.getAttribute('href') || '';
    if (/\\/css\\/style(?:-dark)?\\.css(?:\\?.*)?$/.test(href)) {
      link.id = 'theme-stylesheet';
      link.setAttribute('href', mode === 'dark' ? '/css/style-dark.css' : '/css/style.css');
      break;
    }
  }

  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.style.colorScheme = mode;
})();
</script>`;

const toggleMarkup = `<li class="theme-toggle-item"><button id="theme-toggle" class="theme-toggle" type="button" aria-label="切换夜间模式" aria-pressed="false" title="切换夜间模式"><i class="fa fa-moon-o" aria-hidden="true"></i><span class="theme-toggle-label">夜间</span></button></li>`;

hexo.extend.filter.register('after_render:html', function (html) {
  if (html.indexOf('id="theme-toggle"') !== -1) {
    return html;
  }

  return html
    .replace(/<li><a href="\/(?:css|js)\/[^\"]+"><\/a><\/li>/g, '')
    .replace(
      /<p class="post-abstract">([\s\S]*?)<\/p><\/div><div class="share">/,
      '<div class="post-abstract">$1</div></div><div class="share">'
    )
    .replace('</head>', `${headMarkup}</head>`)
    .replace('<li class="soc">', `${toggleMarkup}<li class="soc">`)
    .replace('</body>', '<script src="/js/theme-toggle.js"></script><script src="/js/reading-ui.js"></script></body>');
});
