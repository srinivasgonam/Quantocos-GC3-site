/* ui-motion.js — bridges two components whose paint() we do not want to rewrite. */
(function () {
  'use strict';
  window.addEventListener('load', init);
  function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var out = document.querySelector('.pc__out');
  if (!out) { setTimeout(init, 350); return; }
  if (out) {
    new MutationObserver(function () {
      out.classList.remove('is-rolling');
      void out.offsetWidth;              // restart the animation
      out.classList.add('is-rolling');
    }).observe(out, { childList: true, subtree: true, characterData: true });
  }

  var grid = document.querySelector('.ce__grid');
  if (grid) {
    new MutationObserver(function () {
      [].slice.call(grid.children).forEach(function (el, i) {
        if (i > 40) { el.style.animation = 'none'; return; }   // no stagger for the tail
        el.style.animationDelay = Math.min(i * 8, 240) + 'ms';
      });
    }).observe(grid, { childList: true });
  }
  }
})();
