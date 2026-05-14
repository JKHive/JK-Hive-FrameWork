/**
 * JKLP — **strip-carrousel** `#jklpStripCarrousel` (`jklp-pole` + `bindPole`).
 *
 * Carrusel «Nuestros clientes»: desplazamiento **continuo** (marquee CSS + clones), ritmo de polea;
 * sin pasos mecánicos detener–mover.
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function gapPx(track) {
    var cs = window.getComputedStyle(track);
    var g = cs.columnGap || cs.gap || '0';
    var v = parseFloat(g);
    return isNaN(v) ? 0 : v;
  }

  function measureLoopWidth(track, originalCount) {
    if (track.children.length <= originalCount || originalCount <= 0) return 0;
    var a = track.children[0];
    var b = track.children[originalCount];
    if (!a || !b) return 0;
    return b.offsetLeft - a.offsetLeft;
  }

  function stripClones(track, originalCount) {
    while (track.children.length > originalCount) {
      track.removeChild(track.lastChild);
    }
  }

  function syncClones(track, originalCount) {
    stripClones(track, originalCount);
    for (var i = 0; i < originalCount; i++) {
      var node = track.children[i];
      if (!node) break;
      var c = node.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('data-jklp-clone', '1');
      var f = c.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      for (var k = 0; k < f.length; k++) {
        f[k].setAttribute('tabindex', '-1');
      }
      track.appendChild(c);
    }
    return measureLoopWidth(track, originalCount);
  }

  function applyTx(track, px, transCss, animate) {
    var sx = Math.round(Number(px) || 0);
    if (animate !== false) {
      track.style.transition = transCss;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = 'translateX(' + -sx + 'px)';
    if (animate === false) {
      void track.offsetHeight;
      track.style.transition = transCss;
    }
  }

  /**
   * @param {HTMLElement} root
   * @param {{ pixelsPerSecond?: number }} opts — velocidad horizontal del marquee (px/s aprox.).
   */
  function bindPole(root, opts) {
    opts = opts || {};
    var viewport = root.querySelector('.jklp-pole__viewport');
    var track = root.querySelector('.jklp-pole__track');
    if (!viewport || !track) return function () {};

    var originalCount = parseInt(track.getAttribute('data-jklp-original-count') || '0', 10);
    if (!Number.isFinite(originalCount) || originalCount < 1) {
      originalCount = track.children.length;
    }

    var trans = 'transform 0.48s linear';
    var loopWidth = 0;
    var rafScheduled = false;
    /** Reintentos cuando offsetWidth / clientWidth aún son 0 (script temprano, fuentes, layout pendiente). */
    var layoutMeasureAttempts = 0;
    var LAYOUT_MEASURE_MAX = 80;
    /** Evita que ResizeObserver sobre el track cancele el autoplay en bucle al duplicar clones. */
    var debounceLayoutId = null;

    var ppsDefault = prefersReducedMotion() ? 26 : 52;
    var pixelsPerSecond =
      opts.pixelsPerSecond != null && Number.isFinite(opts.pixelsPerSecond) && opts.pixelsPerSecond > 0
        ? opts.pixelsPerSecond
        : ppsDefault;

    function stopMarquee() {
      track.classList.remove('jklp-pole__track--strip-marquee');
      track.style.animation = 'none';
      void track.offsetHeight;
      track.style.animation = '';
      root.style.removeProperty('--jklp-strip-marquee-sec');
    }

    function startMarquee() {
      if (loopWidth <= 0) return;
      stopMarquee();
      track.style.transition = 'none';
      track.style.transform = '';
      void track.offsetHeight;
      var sec = loopWidth / pixelsPerSecond;
      sec = Math.max(12, Math.min(95, sec));
      root.style.setProperty('--jklp-strip-marquee-sec', sec.toFixed(2) + 's');
      track.classList.add('jklp-pole__track--strip-marquee');
    }

    function layout() {
      stopMarquee();
      stripClones(track, originalCount);
      /**
       * Celdas reales en el track (sin clones). `data-jklp-original-count` puede ser > DOM;
       * nunca clonar más allá de los nodos existentes.
       */
      var useCount = track.children.length;
      root._jklpPoleKeepCount = useCount;

      applyTx(track, 0, trans, false);

      if (useCount === 0) {
        root.classList.add('jklp-pole--static');
        root.classList.remove('jklp-pole--carousel');
        root.setAttribute('data-jklp-mode', 'static');
        return;
      }

      var gap = gapPx(track);
      var total = 0;
      var i;
      var cell;
      for (i = 0; i < useCount; i++) {
        cell = track.children[i];
        if (!cell) break;
        total += cell.offsetWidth;
        if (i < useCount - 1) total += gap;
      }

      var vw = viewport.clientWidth || 0;
      /**
       * Nunca tratar total===0 como «cabe todo»: en el primer frame los hex pueden medir 0px.
       */
      var measurable = vw > 0 && total > 0;
      if (!measurable) {
        if (layoutMeasureAttempts < LAYOUT_MEASURE_MAX) {
          layoutMeasureAttempts += 1;
          rafScheduled = false;
          window.requestAnimationFrame(scheduleLayout);
        } else {
          root.classList.add('jklp-pole--static');
          root.classList.remove('jklp-pole--carousel');
          root.setAttribute('data-jklp-mode', 'static');
        }
        return;
      }
      layoutMeasureAttempts = 0;

      /**
       * Cinta continua: NO usar «todo el contenido cabe en el viewport» como criterio.
       * En pantalla ancha 7 hex small suelen caber todos → el código antiguo dejaba modo estático
       * y nunca se creaban clones ni autoplay (no era un fallo de «ítems falsos»).
       * Con 2+ celdas reales → carrusel / polea; con 0–1 → estático.
       */
      var fits = useCount < 2;

      root.classList.toggle('jklp-pole--static', fits);
      root.classList.toggle('jklp-pole--carousel', !fits);

      if (fits) {
        root.setAttribute('data-jklp-mode', 'static');
        return;
      }

      loopWidth = syncClones(track, useCount);
      if (loopWidth <= 0) {
        if (layoutMeasureAttempts < LAYOUT_MEASURE_MAX) {
          layoutMeasureAttempts += 1;
          stripClones(track, useCount);
          rafScheduled = false;
          window.requestAnimationFrame(scheduleLayout);
          return;
        }
        root.classList.add('jklp-pole--static');
        root.classList.remove('jklp-pole--carousel');
        root.setAttribute('data-jklp-mode', 'static');
        stripClones(track, useCount);
        return;
      }
      layoutMeasureAttempts = 0;

      root.setAttribute('data-jklp-mode', 'carousel');
      startMarquee();
    }

    function scheduleLayout() {
      if (rafScheduled) return;
      rafScheduled = true;
      window.requestAnimationFrame(function () {
        rafScheduled = false;
        layout();
      });
    }

    function scheduleLayoutFromResize() {
      if (debounceLayoutId !== null) {
        window.clearTimeout(debounceLayoutId);
        debounceLayoutId = null;
      }
      debounceLayoutId = window.setTimeout(function () {
        debounceLayoutId = null;
        scheduleLayout();
      }, 280);
    }

    window.addEventListener('resize', scheduleLayoutFromResize, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(scheduleLayoutFromResize);
      ro.observe(viewport);
    }

    root._jklpPoleSchedule = scheduleLayout;

    scheduleLayout();

    return function destroy() {
      delete root._jklpPoleSchedule;
      var keep =
        typeof root._jklpPoleKeepCount === 'number' && root._jklpPoleKeepCount > 0
          ? root._jklpPoleKeepCount
          : originalCount;
      delete root._jklpPoleKeepCount;
      stopMarquee();
      window.removeEventListener('resize', scheduleLayoutFromResize);
      if (debounceLayoutId !== null) {
        window.clearTimeout(debounceLayoutId);
        debounceLayoutId = null;
      }
      stripClones(track, keep);
      applyTx(track, 0, trans, false);
    };
  }

  function updateWhyCompact(rootWhy) {
    if (!rootWhy) return;
    var w = window.innerWidth || 0;
    var mode = rootWhy.getAttribute('data-jklp-mode') || '';
    var icon =
      w < 420 ||
      (mode === 'carousel' && w < 520) ||
      rootWhy.classList.contains('jklp-why-row--force-icon-tooltip');
    rootWhy.classList.toggle('jklp-why-row--icon-tooltip', icon);
  }

  function stripCarrouselRoot() {
    return document.getElementById('jklpStripCarrousel');
  }

  function relayoutStripCarrousel() {
    var root = stripCarrouselRoot();
    if (root && typeof root._jklpPoleSchedule === 'function') {
      root._jklpPoleSchedule();
    }
  }

  function init() {
    var root = stripCarrouselRoot();

    if (root) {
      bindPole(root, {});
    }

    var roots = [];
    if (root) roots.push(root);

    function onResizeWhyCompact() {
      var i;
      for (i = 0; i < roots.length; i++) {
        updateWhyCompact(roots[i]);
      }
    }

    var i;
    for (i = 0; i < roots.length; i++) {
      updateWhyCompact(roots[i]);
    }
    if (roots.length) {
      window.addEventListener('resize', onResizeWhyCompact, { passive: true });
      if (typeof MutationObserver !== 'undefined') {
        for (i = 0; i < roots.length; i++) {
          (function (rootWhy) {
            var mo = new MutationObserver(function () {
              updateWhyCompact(rootWhy);
            });
            mo.observe(rootWhy, {
              attributes: true,
              attributeFilter: ['data-jklp-mode'],
            });
          })(roots[i]);
        }
      }
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(relayoutStripCarrousel);
      });
    }
  }

  window.addEventListener(
    'load',
    function () {
      relayoutStripCarrousel();
    },
    { passive: true }
  );

  window.addEventListener('pageshow', function (ev) {
    if (ev.persisted) {
      relayoutStripCarrousel();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (document.readyState === 'complete') {
    relayoutStripCarrousel();
  }
})();
