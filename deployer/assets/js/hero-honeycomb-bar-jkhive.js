/**
 * Barra colapsada JK Hive: logo JK HIVE al centro + 6 hex de emprendimientos alrededor.
 * Misma geometría honeycomb que hero-honeycomb-bar.js (JK Lubs), otros selectores.
 */
(function() {
  'use strict';

  /* logoOffset 0: centro del panal = (cx, cy). offsetY suma a innerHeight/2: menos negativo = panal más abajo en la barra. */
  var CONFIG = {
    desktop: { hexSize: 43.56, offsetY: -10, logoOffsetX: 0, logoOffsetY: 0, gap: 1.5 },
    mobile: { hexSize: 32, offsetY: 6, logoOffsetX: 0, logoOffsetY: 0, gap: 1.5 }
  };

  var transitionEndTimeout = null;

  function getConfig() {
    return window.matchMedia('(max-width: 768px)').matches ? CONFIG.mobile : CONFIG.desktop;
  }

  function setPos(el, left, top) {
    if (!el) return;
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function getRingItems(inner) {
    return inner ? inner.querySelectorAll('.hero-hub-ring-item') : [];
  }

  function applyPositions() {
    var hero = document.getElementById('inicio');
    if (!hero || !hero.classList.contains('hero-collapsed')) return;

    var inner = hero.querySelector('.hero-inner');
    if (!inner) return;

    var items = getRingItems(inner);
    if (items.length < 6) return;

    var cfg = getConfig();
    var d = cfg.hexSize;
    var radius = d + (cfg.gap || 0);
    var cx = inner.offsetWidth / 2;
    var cy = inner.offsetHeight / 2 + (cfg.offsetY || 0);

    var sqrt3_2 = Math.sqrt(3) / 2;
    var positions = [
      { x: cx + radius, y: cy },
      { x: cx + radius / 2, y: cy + radius * sqrt3_2 },
      { x: cx - radius / 2, y: cy + radius * sqrt3_2 },
      { x: cx - radius, y: cy },
      { x: cx - radius / 2, y: cy - radius * sqrt3_2 },
      { x: cx + radius / 2, y: cy - radius * sqrt3_2 }
    ];

    var logo = inner.querySelector('.hero-logo-wrapper');
    if (!logo) return;

    for (var i = 0; i < 6; i++) {
      setPos(items[i], positions[i].x, positions[i].y);
      if (items[i].style) items[i].style.zIndex = '5';
    }

    logo.style.setProperty('left', (cx + (cfg.logoOffsetX || 0)) + 'px', 'important');
    logo.style.setProperty('top', (cy + (cfg.logoOffsetY || 0)) + 'px', 'important');
    logo.style.zIndex = '2';

    function attachBarTooltips() {
      if (typeof window.JKHiveTooltipAttach === 'function') window.JKHiveTooltipAttach(inner);
    }
    requestAnimationFrame(function() { requestAnimationFrame(attachBarTooltips); });
    setTimeout(attachBarTooltips, 150);
    setTimeout(attachBarTooltips, 500);
  }

  function onExpand() {
    if (transitionEndTimeout) {
      clearTimeout(transitionEndTimeout);
      transitionEndTimeout = null;
    }
    var h = document.getElementById('inicio');
    var inn = h && h.querySelector('.hero-inner');
    if (!inn) return;
    var items = getRingItems(inn);
    for (var i = 0; i < items.length; i++) {
      items[i].style.left = '';
      items[i].style.top = '';
      items[i].style.zIndex = '';
    }
    var logo = inn.querySelector('.hero-logo-wrapper');
    if (logo) {
      logo.style.left = '';
      logo.style.top = '';
      logo.style.zIndex = '';
    }
  }

  function scheduleApplyAfterTransition() {
    if (transitionEndTimeout) clearTimeout(transitionEndTimeout);
    transitionEndTimeout = setTimeout(function() {
      transitionEndTimeout = null;
      applyPositions();
    }, 400);
  }

  function observe() {
    var hero = document.getElementById('inicio');
    if (!hero) return;
    var observer = new MutationObserver(function() {
      if (hero.classList.contains('hero-collapsed')) {
        scheduleApplyAfterTransition();
      } else {
        onExpand();
      }
    });
    observer.observe(hero, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    window.heroHoneycombBar = { onExpand: onExpand };
    observe();
    window.addEventListener('resize', function() {
      var h = document.getElementById('inicio');
      if (h && h.classList.contains('hero-collapsed')) applyPositions();
    });
    if (document.getElementById('inicio') && document.getElementById('inicio').classList.contains('hero-collapsed')) {
      scheduleApplyAfterTransition();
    }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
