/**
 * =============================================================================
 * JK Hive - Gallery Catalog Layout (jkhive-gallery-catalog.js)
 * =============================================================================
 *
 * Cuando el hero colapsa (body.hero-scrolled), fija la barra de filtros +
 * paginación superior debajo del hero y mantiene el hueco en el layout con
 * un spacer. La paginación inferior ya es sticky vía CSS.
 *
 * REQUISITOS:
 * - hero-collapse.js (o lógica que añada/quite body.hero-scrolled).
 * - En la página: elemento con id="jkhive-gallery-catalog-toolbar" y
 *   id="jkhive-gallery-catalog-toolbar-spacer" (ver jkhive-gallery-catalog.css).
 *
 * USO EN CUALQUIER SITIO JK HIVE:
 * Incluir este script después de hero-collapse.js. No hace falta inicializar:
 * si existen los IDs, se observa body y se actúa en consecuencia.
 *
 * DEPENDENCIAS: ninguna. Compatible con cualquier base path.
 * =============================================================================
 */

(function() {
  'use strict';

  var TOOLBAR_ID = 'jkhive-gallery-catalog-toolbar';
  var SPACER_ID = 'jkhive-gallery-catalog-toolbar-spacer';

  var toolbar = null;
  var spacer = null;

  function getElements() {
    if (!toolbar) toolbar = document.getElementById(TOOLBAR_ID);
    if (!spacer) spacer = document.getElementById(SPACER_ID);
    return toolbar && spacer;
  }

  function setSpacerHeight(height) {
    if (!spacer) return;
    if (height == null || height <= 0) {
      spacer.style.height = '';
    } else {
      spacer.style.height = height + 'px';
    }
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }

  function updateSpacer() {
    if (!getElements()) return;
    var isScrolled = document.body.classList.contains('hero-scrolled');
    /* En mobile la barra no es fija: scroll con la página, no reservar espacio. */
    if (isScrolled && !isMobile()) {
      setSpacerHeight(toolbar.offsetHeight);
    } else {
      setSpacerHeight(0);
    }
  }

  function onResize() {
    if (!getElements()) return;
    if (document.body.classList.contains('hero-scrolled') && !isMobile()) {
      setSpacerHeight(toolbar.offsetHeight);
    } else {
      setSpacerHeight(0);
    }
  }

  function init() {
    if (!getElements()) return;

    /* Observar cambios de clase en body (hero-scrolled lo añade hero-collapse.js) */
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'class') {
          updateSpacer();
          break;
        }
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    /* Estado inicial por si la página se cargó ya scrolleada */
    updateSpacer();

    window.addEventListener('resize', function() {
      requestAnimationFrame(onResize);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
