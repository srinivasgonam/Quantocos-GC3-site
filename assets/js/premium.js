/* ============================================================================
   premium.js — the last craft layer: pointer light, word scrub, image parallax.
   Everything here is opt-in by markup or by capability and bails out on
   reduced-motion or coarse pointers. No layout is written; only CSS variables
   and transforms.
   ========================================================================= */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;

  /* ------------------------------------------------- 1. pointer light ----- */
  if (fine && !reduced) {
    var fields = [].slice.call(document.querySelectorAll('.hero, .band--deep'));
    var raf = null, last = null;
    function paint() {
      raf = null;
      if (!last) return;
      last.el.style.setProperty('--mx', last.x + 'px');
      last.el.style.setProperty('--my', last.y + 'px');
    }
    function move(e) {
      var host = e.currentTarget;
      var r = host.getBoundingClientRect();
      last = { el: host, x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(paint);
    }
    fields.forEach(function (el) {
      el.addEventListener('pointermove', move, { passive: true });
    });

    /* cards get their own small highlight */
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.card, .ce__item, .pc');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* --------------------------------------------------- 2. word scrub ------ */
  /* Paragraphs marked data-scrub fade in word by word as they cross the
     viewport. Text is wrapped, never rewritten. */
  var scrubs = [].slice.call(document.querySelectorAll('[data-scrub]'));
  if (scrubs.length && !reduced) {
    scrubs.forEach(function (p) {
      var words = p.textContent.trim().split(/\s+/);
      p.textContent = '';
      words.forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'qw';
        s.textContent = w + (i < words.length - 1 ? ' ' : '');
        p.appendChild(s);
      });
    });
    var scrubRaf = null;
    function scrubPaint() {
      scrubRaf = null;
      scrubs.forEach(function (p) {
        var spans = p.querySelectorAll('.qw');
        var r = p.getBoundingClientRect();
        var vh = window.innerHeight;
        var progress = (vh * 0.85 - r.top) / (r.height + vh * 0.25);
        progress = Math.max(0, Math.min(1, progress));
        var lit = Math.round(progress * spans.length);
        for (var i = 0; i < spans.length; i++) {
          spans[i].classList.toggle('is-lit', i < lit);
        }
      });
    }
    function scrubOnScroll() { if (!scrubRaf) scrubRaf = requestAnimationFrame(scrubPaint); }
    window.addEventListener('scroll', scrubOnScroll, { passive: true });
    scrubOnScroll();
  }

  /* ------------------------------------------------ 2b. stat count-ups ------ */
  var stats = [].slice.call(document.querySelectorAll('.stat__num, .card__num'))
    .filter(function (el) { return /^[\d.,]+/.test(el.textContent.trim()); });
  if (stats.length && !reduced) {
    stats.forEach(function (el) {
      var raw = el.textContent.trim();
      var suffix = raw.replace(/^[\d.,]+/, '');
      var target = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (!isFinite(target)) return;
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || seen) return;
          seen = true;
          var t0 = performance.now();
          (function tick(t) {
            var p = Math.min(1, (t - t0) / 900);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
          io.disconnect();
        });
      }, { threshold: 0.6 });
      io.observe(el);
    });
  }

  /* ------------------------------------------------- 3. image parallax ---- */
  var paras = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (paras.length && !reduced && fine) {
    var pRaf = null;
    function paraPaint() {
      pRaf = null;
      var vh = window.innerHeight;
      paras.forEach(function (el) {
        var amount = parseFloat(el.getAttribute('data-parallax')) || 40;
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var mid = (r.top + r.height / 2 - vh / 2) / vh;   // -1 .. 1
        el.style.transform = 'translate3d(0,' + (-mid * amount).toFixed(2) + 'px,0) scale(1.06)';
      });
    }
    function paraOnScroll() { if (!pRaf) pRaf = requestAnimationFrame(paraPaint); }
    window.addEventListener('scroll', paraOnScroll, { passive: true });
    window.addEventListener('resize', paraOnScroll);
    paraOnScroll();
  }
})();
