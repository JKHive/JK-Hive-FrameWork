/**
 * JK Lubs - Navbar Loader
 * El navbar ya viene pre-renderizado por PHP (layout-navbar.php).
 * Solo disparamos el evento para que los demás scripts se inicialicen.
 */

(function() {
  'use strict';

  function initNavbar() {
    const navbarRight = document.querySelector('.jkhive-navbar-right');
    if (!navbarRight) return;
    
    // Si ya tiene contenido, no necesitamos hacer fetch
    navbarRight.setAttribute('data-loaded', 'true');
    document.dispatchEvent(new CustomEvent('navbarLoaded', { detail: { container: navbarRight } }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();

