/* design-motion.js — sequencing and counters for the design layer.
   Transform and opacity only. No scroll listeners; IntersectionObserver + CSS. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var seen = new WeakSet();

  function wake(el, cls) {
    if (seen.has(el)) return;
    seen.add(el);
    el.classList.add(cls || 'is-live');
  }

  var targets = [].slice.call(document.querySelectorAll('.flow, .rail, .stat-band, .spec'));
  if (!targets.length || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      wake(en.target);
      if (en.target.classList.contains('stat-band') || en.target.classList.contains('spec')) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.35 });

  targets.forEach(function (t) {
    if (t.classList.contains('rail')) t.style.setProperty('--rail-progress', '100%');
    io.observe(t);
  });

  function countUp(band) {
    [].slice.call(band.querySelectorAll('b')).forEach(function (b) {
      var raw = b.textContent.trim();
      var m = raw.match(/^([\d.,]+)(.*)$/);
      if (!m) return;
      var target = parseFloat(m[1].replace(/,/g, ''));
      if (!isFinite(target)) return;
      var suffix = m[2] || '';
      var t0 = performance.now();
      (function tick(t) {
        var p = Math.min(1, (t - t0) / 900);
        var v = target * (1 - Math.pow(1 - p, 3));
        b.textContent = (target % 1 ? v.toFixed(2) : Math.round(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }
})();
