/**
 * Hero collapse on scroll.
 * Hysteresis evita oscilación. Espaciador = altura real del hero.
 * Igual que jklubs/www/public/assets/js/hero-collapse.js (README: jklubs/www/views/partials/README-hero.md).
 */
(function() {
  'use strict';

  var THRESHOLD_COLLAPSE = 150;
  var THRESHOLD_EXPAND = 100;

  function updateHeroState() {
    var hero = document.getElementById('inicio');
    var spacer = document.getElementById('hero-spacer');
    if (!hero || !hero.classList.contains('hero-section')) return;

    var scrolled = window.scrollY || document.documentElement.scrollTop;
    var collapsed = hero.classList.contains('hero-collapsed');

    if (scrolled > THRESHOLD_COLLAPSE) {
      if (!collapsed) {
        var heroHeight = hero.offsetHeight;
        hero.classList.add('hero-collapsed');
        document.body.classList.add('hero-scrolled');
        if (spacer) spacer.style.height = heroHeight + 'px';

        /* Posicionar scroll para que la sección siguiente sea visible bajo la barra */
        setTimeout(function() {
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              var section = document.getElementById('contexto-servicio');
              if (section) {
                var rect = section.getBoundingClientRect();
                var sectionDocTop = rect.top + (window.scrollY || document.documentElement.scrollTop);
                var heroBar = document.getElementById('inicio');
                var isMobile = window.matchMedia('(max-width: 768px)').matches;
                /* Borde inferior real de la barra fija (navbar + hero colapsado; coincide con CSS) */
                var barBottom =
                  heroBar && heroBar.classList.contains('hero-collapsed')
                    ? heroBar.getBoundingClientRect().bottom
                    : isMobile
                      ? 175
                      : 230;
                var isIndexHome = document.body.classList.contains('jkhive-index-home');
                /* Home index: más aire para título, línea ::after y margen antes del lead (~76/68 compensa barra + mitad del h2) */
                var gap = isIndexHome ? (isMobile ? 68 : 76) : 24;
                var targetScroll = sectionDocTop - barBottom - gap;
                var minScroll = THRESHOLD_EXPAND + 10;
                window.scrollTo({ top: Math.max(minScroll, targetScroll), behavior: 'auto' });
              }
            });
          });
        }, 450);
      }
    } else if (scrolled < THRESHOLD_EXPAND) {
      if (collapsed) {
        hero.classList.remove('hero-collapsed');
        document.body.classList.remove('hero-scrolled');
        if (spacer) spacer.style.height = '';
        if (window.heroHoneycombBar && typeof window.heroHoneycombBar.onExpand === 'function') {
          window.heroHoneycombBar.onExpand();
        }
      }
    }
  }

  function init() {
    window.addEventListener('scroll', function() { requestAnimationFrame(updateHeroState); }, { passive: true });
    window.addEventListener('resize', updateHeroState);
    updateHeroState();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
