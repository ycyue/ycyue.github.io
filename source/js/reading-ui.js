(function () {
  'use strict';

  var postPage = document.querySelector('.post-page');
  var article = postPage && postPage.querySelector('.post-abstract');

  if (!postPage || !article) {
    return;
  }

  var root = document.documentElement;
  var sizeKey = 'plong-reading-size';
  var headings = Array.prototype.slice.call(article.querySelectorAll('h2[id], h3[id]'));

  function create(tag, className, text) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  }

  function addReadingTime() {
    var meta = postPage.querySelector('.post-meta');
    if (!meta || meta.querySelector('.reading-time')) {
      return;
    }

    var text = article.textContent || '';
    var cjkCount = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
    var latinText = text.replace(/[\u3400-\u9fff\uf900-\ufaff]/g, ' ');
    var wordCount = (latinText.trim().match(/[\w'-]+/g) || []).length;
    var minutes = Math.max(1, Math.ceil(cjkCount / 500 + wordCount / 220));
    var item = create('span', 'meta-item reading-time', '约 ' + minutes + ' 分钟阅读');
    meta.appendChild(item);
  }

  function addProgress() {
    var progress = create('div', 'reading-progress');
    progress.setAttribute('aria-hidden', 'true');
    var bar = create('span', 'reading-progress__bar');
    var label = create('span', 'reading-progress__label', '0%');
    progress.appendChild(bar);
    progress.appendChild(label);
    document.body.appendChild(progress);

    var frame = null;
    var idleTimer = null;

    function update() {
      frame = null;
      var rect = article.getBoundingClientRect();
      var articleTop = window.scrollY + rect.top;
      var start = articleTop - 96;
      var max = Math.max(1, article.offsetHeight - window.innerHeight + 160);
      var value = Math.min(1, Math.max(0, (window.scrollY - start) / max));
      var percentage = value * 100;
      var percentageText = Math.round(percentage) + '%';

      progress.style.setProperty('--reading-progress-value', percentage.toFixed(2) + '%');
      label.textContent = percentageText;
    }

    function requestUpdate(showLabel) {
      if (frame === null) {
        frame = window.requestAnimationFrame(update);
      }

      if (!showLabel) {
        return;
      }

      progress.classList.add('is-active');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(function () {
        progress.classList.remove('is-active');
      }, 900);
    }

    window.addEventListener('scroll', function () { requestUpdate(true); }, { passive: true });
    window.addEventListener('resize', function () { requestUpdate(false); });

    if (window.ResizeObserver) {
      new ResizeObserver(function () { requestUpdate(false); }).observe(article);
    }

    requestUpdate(false);
  }

  function addToc() {
    if (!headings.length) {
      return null;
    }

    postPage.classList.add('has-reading-toc');
    var toc = create('aside', 'reading-toc');
    toc.id = 'reading-toc';
    toc.setAttribute('aria-label', '文章目录');
    toc.appendChild(create('p', 'reading-toc__title', '本页目录'));
    var list = create('ol', 'reading-toc__list');

    headings.forEach(function (heading) {
      var item = create('li', 'reading-toc__item reading-toc__item--' + heading.tagName.toLowerCase());
      var link = create('a', '', heading.textContent.trim());
      link.href = '#' + encodeURIComponent(heading.id);
      link.dataset.target = heading.id;
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.appendChild(list);
    postPage.appendChild(toc);

    var overlay = create('button', 'reading-toc-overlay');
    overlay.type = 'button';
    overlay.setAttribute('aria-label', '关闭文章目录');
    document.body.appendChild(overlay);

    function closeToc() {
      toc.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function openToc() {
      toc.classList.add('is-open');
      overlay.classList.add('is-open');
      if (window.innerWidth < 1320) {
        document.body.style.overflow = 'hidden';
      }
    }

    overlay.addEventListener('click', closeToc);
    toc.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        closeToc();
      }
    });

    var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
    var activeId = '';

    function updateActive() {
      var nextId = headings[0].id;
      for (var index = 0; index < headings.length; index += 1) {
        if (headings[index].getBoundingClientRect().top <= 140) {
          nextId = headings[index].id;
        } else {
          break;
        }
      }

      if (nextId === activeId) {
        return;
      }

      activeId = nextId;
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.dataset.target === activeId);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    return { open: openToc, close: closeToc };
  }

  function addCodeCopy() {
    Array.prototype.forEach.call(article.querySelectorAll('figure.highlight'), function (figure) {
      if (figure.querySelector('.code-copy')) {
        return;
      }

      var button = create('button', 'code-copy', '复制');
      button.type = 'button';
      button.setAttribute('aria-label', '复制代码');
      button.addEventListener('click', function () {
        var code = figure.querySelector('.code pre') || figure.querySelector('pre');
        var value = code ? code.innerText : '';

        function done() {
          button.textContent = '已复制';
          window.setTimeout(function () {
            button.textContent = '复制';
          }, 1600);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(done);
        } else {
          var textarea = document.createElement('textarea');
          textarea.value = value;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
          done();
        }
      });
      figure.appendChild(button);
    });
  }

  function wrapTables() {
    Array.prototype.forEach.call(article.querySelectorAll('table'), function (table) {
      if (table.closest('figure.highlight') || table.parentElement.classList.contains('table-scroll')) {
        return;
      }
      var wrapper = create('div', 'table-scroll');
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function addTools(tocController) {
    var tools = create('div', 'reading-tools');
    var group = create('div', 'reading-tools__group');

    if (tocController) {
      var tocButton = create('button', 'reading-tool reading-toc-trigger', '目录');
      tocButton.type = 'button';
      tocButton.setAttribute('aria-label', '打开文章目录');
      tocButton.addEventListener('click', tocController.open);
      group.appendChild(tocButton);
    }

    var smaller = create('button', 'reading-tool', 'A−');
    var larger = create('button', 'reading-tool', 'A+');
    smaller.type = 'button';
    larger.type = 'button';
    smaller.setAttribute('aria-label', '缩小正文字号');
    larger.setAttribute('aria-label', '放大正文字号');
    group.appendChild(smaller);
    group.appendChild(larger);

    var sizes = ['small', 'default', 'large'];
    var stored = 'default';
    try {
      stored = localStorage.getItem(sizeKey) || 'default';
    } catch (error) {}
    if (sizes.indexOf(stored) === -1) {
      stored = 'default';
    }

    function applySize(size) {
      if (size === 'default') {
        root.removeAttribute('data-reading-size');
      } else {
        root.setAttribute('data-reading-size', size);
      }
      try {
        localStorage.setItem(sizeKey, size);
      } catch (error) {}
    }

    applySize(stored);

    function changeSize(offset) {
      var current = root.getAttribute('data-reading-size') || 'default';
      var next = Math.max(0, Math.min(sizes.length - 1, sizes.indexOf(current) + offset));
      applySize(sizes[next]);
    }

    smaller.addEventListener('click', function () { changeSize(-1); });
    larger.addEventListener('click', function () { changeSize(1); });

    var top = create('button', 'reading-tool reading-tool--top', '↑');
    top.type = 'button';
    top.setAttribute('aria-label', '返回文章顶部');
    top.addEventListener('click', function () {
      postPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function updateTop() {
      top.classList.toggle('is-visible', window.scrollY > 560);
    }

    window.addEventListener('scroll', updateTop, { passive: true });
    updateTop();
    tools.appendChild(group);
    tools.appendChild(top);
    document.body.appendChild(tools);
  }

  function addLightbox() {
    var images = Array.prototype.slice.call(article.querySelectorAll('img'));
    if (!images.length) {
      return;
    }

    var lightbox = create('div', 'reading-lightbox');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', '图片预览');
    var preview = document.createElement('img');
    var close = create('button', 'reading-lightbox__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', '关闭图片预览');
    lightbox.appendChild(preview);
    lightbox.appendChild(close);
    document.body.appendChild(lightbox);

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    images.forEach(function (image) {
      if (image.closest('a')) {
        return;
      }
      image.classList.add('reading-zoomable');
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', (image.alt || '文章图片') + '，点击放大');

      function open() {
        preview.src = image.currentSrc || image.src;
        preview.alt = image.alt || '';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        close.focus();
      }

      image.addEventListener('click', open);
      image.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });

    close.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  addReadingTime();
  addProgress();
  addCodeCopy();
  wrapTables();
  addLightbox();
  addTools(addToc());
})();
