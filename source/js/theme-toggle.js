(function () {
  'use strict';

  var storageKey = 'plong-theme';
  var toggle = document.getElementById('theme-toggle');
  var stylesheet = document.getElementById('theme-stylesheet');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  if (!toggle || !stylesheet) {
    return;
  }

  function readPreference() {
    try {
      var value = localStorage.getItem(storageKey);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function savePreference(mode) {
    try {
      localStorage.setItem(storageKey, mode);
    } catch (error) {}
  }

  function updateControl(mode) {
    var dark = mode === 'dark';
    var icon = toggle.querySelector('.fa');
    var label = toggle.querySelector('.theme-toggle-label');
    var action = dark ? '切换日间模式' : '切换夜间模式';

    toggle.setAttribute('aria-label', action);
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    toggle.setAttribute('title', action);

    if (icon) {
      icon.className = dark ? 'fa fa-sun-o' : 'fa fa-moon-o';
    }
    if (label) {
      label.textContent = dark ? '日间' : '夜间';
    }
  }

  function applyTheme(mode, persist) {
    stylesheet.setAttribute('href', mode === 'dark' ? '/css/style-dark.css' : '/css/style.css');
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.style.colorScheme = mode;
    updateControl(mode);

    if (persist) {
      savePreference(mode);
    }
  }

  var initial = document.documentElement.getAttribute('data-theme') || 'light';
  updateControl(initial);

  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  if (media) {
    var followSystem = function (event) {
      if (!readPreference()) {
        applyTheme(event.matches ? 'dark' : 'light', false);
      }
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', followSystem);
    } else if (typeof media.addListener === 'function') {
      media.addListener(followSystem);
    }
  }
})();
