/**
 * Hero Honeycomb Bar - Panal de 6 hexágonos alrededor del logo (centro).
 * Logo al centro; Catálogo, Ingresar, About, Contact, FAQ, Políticas en los 6 lados.
 * Dependencias: tooltip.js debe cargarse antes (navbar-scripts) para JKHiveTooltipAttach.
 * Hover, animaciones de icono y tooltips se mantienen por hero-honeycomb-bar.css y jkhive-elements.css.
 */
(function() {
  'use strict';

  /* hexSize, offsetY, logoOffset. gap: separación entre hexágonos del honeycomb (px). */
  var CONFIG = {
    desktop: {
      hexSize: 43.56,
      offsetY: -38,
      logoOffsetX: 21.5,
      logoOffsetY: 27,
      gap: 1.5
    },
    mobile: {
      hexSize: 32,
      /* inner centrado en barra por CSS; cy = mitad del inner sin desplazar */
      offsetY: 0,
      logoOffsetX: 15.5,
      logoOffsetY: 23.5,
      gap: 1.5
    }
  };

  var aboutEl = null;
  var contactEl = null;
  var faqEl = null;
  var policiesEl = null;
  var transitionEndTimeout = null;

  function getConfig() {
    return window.matchMedia('(max-width: 768px)').matches ? CONFIG.mobile : CONFIG.desktop;
  }

  function createAboutEl() {
    var div = document.createElement('div');
    div.className = 'jkhive-bttn-big hero-cta-item hero-cta-about';
    div.innerHTML = '<a href="about.php" data-tooltip="Quiénes somos"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-info-circle"></i></div></div></a>';
    return div;
  }

  function createContactEl() {
    var div = document.createElement('div');
    div.className = 'jkhive-bttn-big hero-cta-item hero-cta-contact';
    div.innerHTML = '<a href="contact.php" data-tooltip="Contacto"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-envelope"></i></div></div></a>';
    return div;
  }

  function createFaqEl() {
    var div = document.createElement('div');
    div.className = 'jkhive-bttn-big hero-cta-item hero-cta-faq';
    div.innerHTML = '<a href="faq.php" data-tooltip="Preguntas frecuentes"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-circle-question"></i></div></div></a>';
    return div;
  }

  function createPoliciesEl() {
    var div = document.createElement('div');
    div.className = 'jkhive-bttn-big hero-cta-item hero-cta-policies';
    div.innerHTML = '<a href="privacy.php" data-tooltip="Políticas de privacidad"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-shield-halved"></i></div></div></a>';
    return div;
  }

  function setPos(el, left, top) {
    if (!el) return;
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function applyPositions() {
    var hero = document.getElementById('inicio');
    if (!hero || !hero.classList.contains('hero-collapsed')) return;

    var inner = hero.querySelector('.hero-inner');
    if (!inner) return;

    if (!aboutEl || !aboutEl.parentNode) {
      aboutEl = null;
      contactEl = null;
      faqEl = null;
      policiesEl = null;
    }
    if (!aboutEl) {
      aboutEl = createAboutEl();
      contactEl = createContactEl();
      faqEl = createFaqEl();
      policiesEl = createPoliciesEl();
      inner.appendChild(aboutEl);
      inner.appendChild(contactEl);
      inner.appendChild(faqEl);
      inner.appendChild(policiesEl);
    }

    var cfg = getConfig();
    var d = cfg.hexSize;
    var radius = d + (cfg.gap || 0); /* centro a centro de cada hex = hexSize + gap */
    var cx = inner.offsetWidth / 2;
    var cy = inner.offsetHeight / 2 + (cfg.offsetY || 0);

    var r = inner.querySelector('.hero-cta-registro-cliente');
    var ic = inner.querySelector('.hero-cta-ingresar-cliente');
    var logo = null;
    for (var i = 0; i < inner.children.length; i++) {
      if (inner.children[i].classList && inner.children[i].classList.contains('hero-logo-wrapper')) {
        logo = inner.children[i];
        break;
      }
    }

    if (!r || !ic || !logo) return;

    /* 6 posiciones alrededor del centro con gap (radius = hexSize + gap) */
    var sqrt3_2 = Math.sqrt(3) / 2;
    var positions = [
      { x: cx + radius,           y: cy },                    /* 0° right: Catálogo */
      { x: cx + radius / 2,       y: cy + radius * sqrt3_2 }, /* 60° bottom-right: Ingresar */
      { x: cx - radius / 2,       y: cy + radius * sqrt3_2 }, /* 120° bottom-left: Contacto */
      { x: cx - radius,           y: cy },                     /* 180° left: Políticas */
      { x: cx - radius / 2,       y: cy - radius * sqrt3_2 }, /* 240° top-left: FAQ */
      { x: cx + radius / 2,       y: cy - radius * sqrt3_2 }  /* 300° top-right: About */
    ];

    setPos(r, positions[0].x, positions[0].y);           /* Catálogo */
    setPos(ic, positions[1].x, positions[1].y);          /* Ingresar */
    setPos(contactEl, positions[2].x, positions[2].y);    /* Contacto */
    setPos(policiesEl, positions[3].x, positions[3].y);    /* Políticas */
    setPos(faqEl, positions[4].x, positions[4].y);        /* FAQ */
    setPos(aboutEl, positions[5].x, positions[5].y);      /* About */
    /* z-index 5 en los 6 ítems para que hover, tooltip y clic funcionen (logo queda en 2). */
    [r, ic, contactEl, policiesEl, faqEl, aboutEl].forEach(function(el) {
      if (el && el.style) el.style.zIndex = '5';
    });

    /* Enlazar tooltips (tipo JK Hive) a todos los [data-tooltip] del panal. Requiere tooltip.js cargado antes (navbar-scripts).
       Ejecutar tras paint para que hover, tooltip text y animaciones de icono (jkhive-elements) funcionen. */
    function attachBarTooltips() {
      if (typeof window.JKHiveTooltipAttach === 'function') window.JKHiveTooltipAttach(inner);
    }
    requestAnimationFrame(function() {
      requestAnimationFrame(attachBarTooltips);
    });
    setTimeout(attachBarTooltips, 150);
    /* Tras la animación de revelado de la barra, re-enlazar por si el DOM no estaba listo. */
    setTimeout(attachBarTooltips, 500);
    setTimeout(attachBarTooltips, 800);
    setTimeout(attachBarTooltips, 1200);

    logo.style.setProperty('left', (cx + (cfg.logoOffsetX || 0)) + 'px', 'important');
    logo.style.setProperty('top', (cy + (cfg.logoOffsetY || 0)) + 'px', 'important');
    logo.style.zIndex = '2';
  }

  function onExpand() {
    if (transitionEndTimeout) {
      clearTimeout(transitionEndTimeout);
      transitionEndTimeout = null;
    }
    var h = document.getElementById('inicio');
    var inn = h && h.querySelector('.hero-inner');
    if (inn) {
      var selectors = ['.hero-cta-registro-cliente', '.hero-cta-ingresar-cliente', '.hero-logo-wrapper', '.hero-cta-about', '.hero-cta-contact', '.hero-cta-faq', '.hero-cta-policies'];
      selectors.forEach(function(sel) {
        var els = inn.querySelectorAll(sel);
        for (var i = 0; i < els.length; i++) {
          els[i].style.left = '';
          els[i].style.top = '';
          els[i].style.zIndex = '';
        }
      });
    }
    if (aboutEl && aboutEl.parentNode) aboutEl.parentNode.removeChild(aboutEl);
    if (contactEl && contactEl.parentNode) contactEl.parentNode.removeChild(contactEl);
    if (faqEl && faqEl.parentNode) faqEl.parentNode.removeChild(faqEl);
    if (policiesEl && policiesEl.parentNode) policiesEl.parentNode.removeChild(policiesEl);
    aboutEl = null;
    contactEl = null;
    faqEl = null;
    policiesEl = null;
  }

  function scheduleApplyAfterTransition(hero) {
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
        scheduleApplyAfterTransition(hero);
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
      if (document.getElementById('inicio') && document.getElementById('inicio').classList.contains('hero-collapsed')) {
        applyPositions();
      }
    });
    if (document.getElementById('inicio') && document.getElementById('inicio').classList.contains('hero-collapsed')) {
      scheduleApplyAfterTransition(document.getElementById('inicio'));
    }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
