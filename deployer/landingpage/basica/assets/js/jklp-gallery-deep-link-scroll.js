/**
 * Scroll suave a la sección de galería/noticias cuando la URL incluye ?section=servicios|noticias
 * (tras cargar layout y framework de paginación).
 */
(function () {
  'use strict';

  function runScroll() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var sec = params.get('section');
      if (sec === 'noticias') {
        var el = document.getElementById('jklp-about-noticias');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      if (sec === 'servicios') {
        var el2 = document.getElementById('jklp-gallery-servicios');
        if (el2) {
          el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (e) {}
  }

  window.addEventListener('load', function () {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(runScroll);
    });
  });
})();
