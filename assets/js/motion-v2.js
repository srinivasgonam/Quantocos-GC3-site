/* ============================================================================
   motion-v2.js — scroll behaviour layer for the Quantocos site
   ----------------------------------------------------------------------------
   Loads on every page. Degrades to nothing if any of these are true:
     * GSAP/ScrollTrigger/Lenis failed to load
     * the reader prefers reduced motion
     * a coarse pointer / small screen (smooth scroll fights touch scrolling)
   Everything it adds is reversible: it sets classes on <html> and inline
   transforms only. No layout markup is created except one spacer that
   ScrollTrigger removes on teardown.

   What it does
     1. Lenis smooth scroll, driven by the GSAP ticker (one RAF loop, not two)
     2. Scroll-progress rail driven by ScrollTrigger instead of scroll events
     3. Hero depart: the hero content lifts and fades as it leaves, background
        layers drift at a different rate (parallax), giving depth without pinning
     4. Header retracts on scroll-down, returns on scroll-up
     5. Magnetic primary buttons (fine pointers only, 6px max)
   ========================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var wide = window.matchMedia('(min-width: 900px)').matches;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var Lenis = window.Lenis;

  if (!gsap || !ScrollTrigger || reduced) return;   // nothing to do — the static site is complete
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add('mv2');

  /* ---------------------------------------------------------------- 1. Lenis */
  var lenis = null;
  if (Lenis && fine && wide) {
    lenis = new Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      syncTouch: false
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    html.classList.add('mv2-lenis');
  }

  /* ------------------------------------------------ 2. scroll progress rail --
     Deliberately not handled here: site.js already paints [data-scroll-rail] by
     setting its height as a percentage on scroll, and Lenis dispatches native
     scroll events, so that code keeps working untouched. Animating scaleX on
     the same node from here produced two competing transforms. */

  /* ------------------------------------------------ 3a. homepage hero hold --
     The homepage hero carries the capability diagram. Pin it for 70% of a
     viewport so the reader sees the network settle before the page moves on;
     desktop only, and it replaces the plain depart effect below. */
  var panel = document.querySelector('.hero--panel');
  var pinned = false;
  if (panel && wide) {
    var diagram = panel.querySelector('.hero-diagram');
    var pills = panel.querySelectorAll('.hero-pills li');
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel, start: 'top top', end: '+=70%',
        pin: true, pinSpacing: true, scrub: 0.5, anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    // first paint must be untouched: the timeline starts at the site's own
    // resting state and only adds movement once the reader scrolls.
    if (diagram) tl.fromTo(diagram, { scale: 1 }, { scale: 1.03, yPercent: -1.5, ease: 'none' }, 0);
    if (pills.length) tl.fromTo(pills, { y: 0 }, { y: -6, stagger: 0.04, ease: 'none' }, 0);
    pinned = true;
  }

  /* ------------------------------------------------------------ 3. hero depart */
  var hero = pinned ? null : document.querySelector('.hero, .ind-hero');
  if (hero) {
    var inner = hero.querySelector('.hero__inner, .ind-hero__title') || hero.firstElementChild;
    if (inner && inner !== hero) {
      gsap.to(inner, {
        yPercent: -6, opacity: 0.55, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    // background layers drift slower than the content — depth cue, not decoration
    var layers = hero.querySelectorAll('.hero__scrim, .hero-panel, .hero__grain, .topo, .hero-diagram');
    layers.forEach(function (el, i) {
      gsap.to(el, {
        yPercent: 6 + i * 3, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }


  /* --------------------------------------------------- 3b. hero headline reveal
     Each direct child of the H1 (text run or <em>) is a block that rises in on
     first paint. Text nodes are wrapped in spans, never split into words, so the
     serif gradient on <em> keeps painting across the whole line. */
  var h1 = document.querySelector('.hero h1, .ind-hero h1, .hero--panel h1');
  if (h1 && !h1.dataset.mvSplit) {
    var kids = Array.prototype.slice.call(h1.childNodes).filter(function (n) {
      return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
    });
    kids.forEach(function (n) {
      if (n.nodeType === 3) {
        var sp = document.createElement('span');
        sp.className = 'mv-block';
        n.parentNode.replaceChild(sp, n);
        sp.appendChild(n);
      } else {
        n.classList.add('mv-block');
      }
    });
    h1.dataset.mvSplit = '1';
    gsap.from(h1.querySelectorAll('.mv-block'), {
      y: 26, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.04
    });
  }

  /* ------------------------------------------------------------- 3c. count-ups
     Only nodes whose entire text is a currency figure — never mid-sentence
     numbers, so a count-up can never misreport a claim. */
  var money = function () {
    var out = [];
    document.querySelectorAll('.band, section').forEach(function (sec) {
      sec.querySelectorAll('*').forEach(function (el) {
        if (el.children.length) return;
        var t = (el.textContent || '').trim();
        if (/^\$\d[\d,]*$/.test(t)) out.push(el);
      });
    });
    return out;
  };
  money().forEach(function (el) {
    var target = +el.textContent.replace(/[$,]/g, '');
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: function () { el.textContent = '$' + Math.round(obj.v).toLocaleString('en-US'); }
    });
  });

  /* ------------------------------------------------------- 4. header retraction */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var lastY = 0;
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: function (self) {
        var y = self.scroll();
        if (self.direction === 1 && y > 200 && y > lastY) hdr.classList.add('hdr--away');
        else hdr.classList.remove('hdr--away');
        lastY = y;
      }
    });
  }

  /* --------------------------------------------------- 5. magnetic primary CTA */
  if (fine) {
    document.querySelectorAll('.btn--primary, .mobile-cta').forEach(function (btn) {
      var rAF = null, tx = 0, ty = 0;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 12;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 12;
        if (rAF) return;
        rAF = requestAnimationFrame(function () {
          gsap.to(btn, { x: Math.max(-6, Math.min(6, tx)), y: Math.max(-6, Math.min(6, ty)), duration: 0.35, ease: 'power2.out' });
          rAF = null;
        });
      });
      btn.addEventListener('pointerleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

  window.__mv2 = { lenis: lenis, triggers: ScrollTrigger.getAll().length };
})();
