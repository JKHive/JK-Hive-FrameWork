/**
 * Animación hub JK Hive: hexágonos clonados desde sidebar [data-hub-satellite="1"]
 * o, si no hay satélites en el menú público, desde .hero-hub-ring-item del hero.
 * Posiciones finales: mismo hueco horizontal (G) entre logo JK/HIVE y el primer clone y entre clones
 * (los ítems -0.5/+0.5 del modelo antiguo quedaban detrás del logo por z-index y tamaño del hex central).
 */
(function() {
  'use strict';

  function HubHeroAnimation() {
    this.animationContainer = null;
    this.animationInterval = null;
    this.isAnimating = false;
    this.menuItems = [];
    this.heroHex = null;
    this.heroHexContent = null;
    this.config = {
      interval: 5000,
      expandDuration: 2000,
      holdDuration: 1500,
      contractDuration: 2000,
      staggerMs: 80,
      hexSize: 90
    };
    this.updateConfigForScreenSize();
    window.addEventListener('resize', this.onViewportResize.bind(this));
    this.init();
  }

  /** Debe coincidir con CSS .hero-jkhive-hub .jkhive-editorial-hero-logo .jkhive-hex (anchos por breakpoint) */
  HubHeroAnimation.prototype.getLogoHexWidth = function() {
    var w = window.innerWidth;
    if (w <= 400) return 50;
    if (w <= 480) return 54;
    if (w <= 576) return 58;
    if (w <= 768) return 66;
    if (w <= 992) return 76;
    return 90;
  };

  HubHeroAnimation.prototype.updateConfigForScreenSize = function() {
    var w = window.innerWidth;
    /* Mismo px que el hex JK/HIVE central en cada breakpoint (CSS .jkhive-hex-jkhive-face) */
    this.config.hexSize = this.getLogoHexWidth();

    var mobile = w <= 768;
    this.config.expandDuration = mobile ? 1650 : 2000;
    this.config.contractDuration = mobile ? 1650 : 2000;
    this.config.holdDuration = mobile ? 1200 : 1500;
    this.config.staggerMs = mobile ? 48 : 80;
  };

  HubHeroAnimation.prototype.syncAnimationContainerLayout = function() {
    if (!this.animationContainer) return;
    var w = window.innerWidth;
    var hex = this.config.hexSize || 90;
    var hexH = Math.round(hex * 1.1547);
    var ch = Math.max(hexH + 36, w > 768 ? 200 : 130);
    ch = Math.min(ch, 240);
    var cw = Math.min(Math.round(w * 1.92), 1400);
    this.animationContainer.style.width = cw + 'px';
    this.animationContainer.style.maxWidth = '1400px';
    this.animationContainer.style.height = ch + 'px';
  };

  HubHeroAnimation.prototype.onViewportResize = function() {
    this.updateConfigForScreenSize();
    this.syncAnimationContainerLayout();
  };

  /** Reserva lateral del layout JK Hive (sidebar + vértice con navbar). Coherente con jk-hive.css */
  HubHeroAnimation.prototype.getSidebarReservePx = function() {
    var w = window.innerWidth;
    if (w <= 768) return 101;
    return 140;
  };

  /**
   * Hueco horizontal entre bordes de hex adyacentes, proporcional al tamaño del hex.
   * Antes: min(H*0.22, 14) con mínimo 6 → en móvil (H≈66) G seguía siendo 14 como en desktop.
   * Referencia desktop: ~14px con H=90 → G ≈ round(14 * H / 90).
   */
  HubHeroAnimation.prototype.getHorizontalGapPx = function(H) {
    var w = window.innerWidth;
    var g = Math.round((14 * H) / 90);
    if (w <= 480) {
      g = Math.round(g * 0.88);
    }
    if (w <= 400) {
      g = Math.round(g * 0.85);
    }
    return Math.max(2, g);
  };

  /**
   * Desde el centro del logo: mitad ítems a la izquierda, mitad a la derecha (orden data-hub-order).
   * firstOffset = mitad logo + G + mitad clone; paso entre centros de clones = H + G (mismo G entre bordes).
   */
  HubHeroAnimation.prototype.getExpandedPixelXs = function() {
    var n = this.menuItems.length;
    var H = this.config.hexSize;
    var logoW = this.getLogoHexWidth();
    var w = window.innerWidth;
    var G = this.getHorizontalGapPx(H);
    var firstOffset = logoW / 2 + G + H / 2;
    var step = H + G;
    var xs = [];
    var i;
    if (n < 1) return xs;
    if (n % 2 !== 0) {
      var mid = (n - 1) / 2;
      var tuck = w <= 480 ? 0.7 : (w <= 768 ? 0.78 : (w <= 992 ? 0.82 : 0.85));
      var fallback = Math.max(step, firstOffset * tuck);
      for (i = 0; i < n; i++) {
        xs.push((i - mid) * fallback);
      }
    } else {
      var n2 = n / 2;
      for (i = 0; i < n2; i++) {
        xs.push(-(firstOffset + (n2 - 1 - i) * step));
      }
      for (i = 0; i < n2; i++) {
        xs.push(firstOffset + i * step);
      }
    }
    this.clampXsToViewport(xs, H);
    return xs;
  };

  /**
   * Escala xs para que ningún centro de clon supere el medio ancho ÚTIL (viewport menos sidebar).
   * El logo está centrado en main, no en el viewport completo.
   */
  HubHeroAnimation.prototype.clampXsToViewport = function(xs, H) {
    if (!xs.length) return;
    var w = window.innerWidth;
    var sw = this.getSidebarReservePx();
    var usable = Math.max(w - sw, 160);
    var halfUsable = usable * 0.5;
    var maxAbs = 0;
    for (var i = 0; i < xs.length; i++) {
      var ax = Math.abs(xs[i]);
      if (ax > maxAbs) maxAbs = ax;
    }
    var pad = w <= 400 ? 10 : (w <= 768 ? 14 : 24);
    /* Aire respecto al borde del área de contenido (padding típico .jkhive-content-wrap mobile) */
    var contentPad = w <= 768 ? 10 : 8;
    var budget = Math.max(halfUsable - pad - contentPad - H / 2, H * 0.45);
    if (maxAbs > budget && budget > 6) {
      var f = budget / maxAbs;
      for (var j = 0; j < xs.length; j++) {
        xs[j] *= f;
      }
    }
  };

  HubHeroAnimation.prototype.init = function() {
    var self = this;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { self.setup(); });
    } else {
      this.setup();
    }
  };

  HubHeroAnimation.prototype.getHubNodes = function() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('.jkhive-nav-item[data-hub-satellite="1"]'));
    if (nodes.length === 0) {
      nodes = Array.prototype.slice.call(document.querySelectorAll('.hero-section.hero-jkhive-hub .hero-hub-ring-item'));
    }
    nodes.sort(function(a, b) {
      var oa = parseInt(a.getAttribute('data-hub-order') || '0', 10);
      var ob = parseInt(b.getAttribute('data-hub-order') || '0', 10);
      return oa - ob;
    });
    return nodes;
  };

  HubHeroAnimation.prototype.setup = function() {
    var heroSection = document.querySelector('.hero-section.hero-jkhive-hub') || document.getElementById('inicio');
    if (!heroSection) return;

    this.heroHex = heroSection.querySelector('.jkhive-editorial-hero-logo');
    if (!this.heroHex) return;

    var heroHexInner = this.heroHex.querySelector('.jkhive-hex');
    if (heroHexInner) {
      this.heroHexContent = heroHexInner.querySelector('.jkhive-hex-content');
      /* Por encima del contenedor de animación: los clones no deben tapar JK/HIVE al expandir desde el centro */
      heroHexInner.style.position = 'relative';
      heroHexInner.style.zIndex = '3';
    }

    this.animationContainer = document.createElement('div');
    this.animationContainer.className = 'hero-hex-animation-container jkhive-hub-hero-anim';
    this.animationContainer.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:1;overflow:visible;';
    this.syncAnimationContainerLayout();

    var heroHexParent = this.heroHex.parentElement;
    if (heroHexParent) heroHexParent.style.position = 'relative';
    this.heroHex.style.position = 'relative';
    this.heroHex.style.zIndex = '2';
    this.heroHex.appendChild(this.animationContainer);

    this.menuItems = this.getHubNodes();
    if (this.menuItems.length === 0) return;

    this.startAnimation();
  };

  HubHeroAnimation.prototype.startAnimation = function() {
    var self = this;
    if (this.animationInterval) clearInterval(this.animationInterval);
    setTimeout(function() { self.animate(); }, 2000);
    this.animationInterval = setInterval(function() {
      if (!self.isAnimating) self.animate();
    }, this.config.interval);
  };

  HubHeroAnimation.prototype.stopAnimation = function() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  };

  HubHeroAnimation.prototype.animate = function() {
    if (this.isAnimating || !this.animationContainer || this.menuItems.length === 0) return;
    this.updateConfigForScreenSize();
    this.syncAnimationContainerLayout();
    this.isAnimating = true;
    this.clearAnimation();
    var hexElements = this.createHexElements();
    var self = this;
    this.expand(hexElements, function() {
      setTimeout(function() {
        self.contract(hexElements, function() {
          self.clearAnimation();
          self.isAnimating = false;
        });
      }, self.config.holdDuration);
    });
  };

  HubHeroAnimation.prototype.createHexElements = function() {
    var hexElements = [];
    var self = this;

    this.menuItems.forEach(function(item, i) {
      var el = self.createHexElement(item, i);
      self.animationContainer.appendChild(el);
      hexElements.push(el);
    });
    return hexElements;
  };

  HubHeroAnimation.prototype.createHexElement = function(item, index) {
    var hexWrapper = document.createElement('div');
    hexWrapper.className = 'hero-hex-animated jkhive-hub-hero-anim';
    hexWrapper.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;pointer-events:none;transition:transform ' + this.config.expandDuration + 'ms cubic-bezier(0.4, 0, 0.2, 1),opacity ' + this.config.expandDuration + 'ms cubic-bezier(0.4, 0, 0.2, 1);';

    var menuHex = item.querySelector('.jkhive-hex');
    if (!menuHex) return hexWrapper;
    menuHex = menuHex.cloneNode(true);
    menuHex.style.pointerEvents = 'none';
    var links = menuHex.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].style.pointerEvents = 'none';
      links[i].removeAttribute('href');
    }
    var hexContent = menuHex.querySelector('.jkhive-hex-content');
    if (hexContent && !hexContent.classList.contains('jkhive-hex-content-editorial')) {
      hexContent.classList.add('jkhive-hex-content-editorial');
    }
    var hexSize = this.config.hexSize;
    menuHex.classList.add('jkhive-hub-anim-clone-hex');
    /* Vencer .jkhive-hex (var(--hex-size) global), hero-hex-animation 90px y márgenes honeycomb */
    menuHex.style.setProperty('--hub-anim-hex', hexSize + 'px');
    menuHex.style.setProperty('width', hexSize + 'px', 'important');
    menuHex.style.setProperty('height', 'calc(' + hexSize + 'px * 1.1547)', 'important');
    menuHex.style.setProperty('margin', '0', 'important');
    menuHex.style.setProperty('position', 'relative', 'important');
    menuHex.style.setProperty('transform-origin', 'center', 'important');
    menuHex.style.setProperty('pointer-events', 'none', 'important');
    menuHex.style.setProperty('box-sizing', 'border-box', 'important');

    /* Tipografía e interior proporcionales al hex (misma relación que logo 90px: main ~1.5rem, sub ~0.5rem, divisor 2px) */
    var scale = hexSize / 90;
    var padPx = Math.max(0, Math.round(2 * scale));
    var vw = window.innerWidth;
    if (hexContent) {
      hexContent.style.setProperty('display', 'flex', 'important');
      hexContent.style.setProperty('flex-direction', 'column', 'important');
      hexContent.style.setProperty('align-items', 'center', 'important');
      hexContent.style.setProperty('justify-content', 'center', 'important');
      /* Mobile: mismo padding que .jkhive-hex-content del logo central (jk-hive.css); si no, la barra queda desalineada. */
      if (vw <= 768) {
        hexContent.style.setProperty('padding', 'var(--jk-spacing-md)', 'important');
      } else {
        hexContent.style.setProperty('padding', padPx + 'px ' + Math.max(1, padPx) + 'px', 'important');
      }
      hexContent.style.setProperty('line-height', '1', 'important');
      hexContent.style.setProperty('gap', '0', 'important');
      hexContent.style.setProperty('width', '100%', 'important');
      hexContent.style.setProperty('height', '100%', 'important');
      hexContent.style.setProperty('position', 'relative', 'important');
      hexContent.style.setProperty('top', 'auto', 'important');
      hexContent.style.setProperty('left', 'auto', 'important');
      hexContent.style.setProperty('transform', 'none', 'important');
    }
    var hm = menuHex.querySelector('.jkhive-logo-main');
    if (hm) {
      hm.style.setProperty('font-size', Math.max(6, Math.round(24 * scale)) + 'px', 'important');
      hm.style.setProperty('margin', '0', 'important');
      hm.style.setProperty('padding', '0', 'important');
    }
    var hs = menuHex.querySelector('.jkhive-logo-sub');
    if (hs) {
      hs.style.setProperty('font-size', Math.max(5, Math.round(8 * scale)) + 'px', 'important');
      hs.style.setProperty('letter-spacing', hexSize < 44 ? '0.06em' : '0.12em', 'important');
      hs.style.setProperty('margin', '0', 'important');
      hs.style.setProperty('padding', '0', 'important');
    }
    var divEl = menuHex.querySelector('.jkhive-logo-divider');
    if (divEl) {
      /* Mobile: misma barra que logo central (2px + 0.12rem) — coherente con jkhive-hub-hero-animation.css */
      if (vw <= 768) {
        divEl.style.setProperty('height', '2px', 'important');
        divEl.style.setProperty('min-height', '2px', 'important');
        divEl.style.setProperty('width', '100%', 'important');
        divEl.style.setProperty('margin', '0.12rem 0 0 0', 'important');
      } else {
        var divH = Math.max(1, Math.round(2 * scale));
        divEl.style.setProperty('height', divH + 'px', 'important');
        divEl.style.setProperty('min-height', divH + 'px', 'important');
        divEl.style.setProperty('width', '100%', 'important');
        divEl.style.setProperty('margin', Math.max(1, Math.round(3 * scale)) + 'px 0 0 0', 'important');
      }
    }

    hexWrapper.appendChild(menuHex);
    hexWrapper.dataset.hexIndex = String(index);
    return hexWrapper;
  };

  HubHeroAnimation.prototype.expand = function(hexElements, callback) {
    var self = this;
    var xs = this.getExpandedPixelXs();
    hexElements.forEach(function(hexEl, index) {
      var x = xs[index] != null ? xs[index] : 0;
      var stagger = self.config.staggerMs || 80;
      setTimeout(function() {
        hexEl.style.transition = 'transform ' + self.config.expandDuration + 'ms cubic-bezier(0.34, 1.56, 0.64, 1),opacity ' + self.config.expandDuration + 'ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        hexEl.style.transform = 'translate(calc(-50% + ' + x + 'px), -50%) scale(1)';
        hexEl.style.opacity = '0.9';
      }, index * stagger);
    });
    if (callback) {
      var st = this.config.staggerMs || 80;
      setTimeout(callback, this.config.expandDuration + (hexElements.length * st) + 100);
    }
  };

  HubHeroAnimation.prototype.contract = function(hexElements, callback) {
    var self = this;
    hexElements.forEach(function(hexEl, index) {
      setTimeout(function() {
        hexEl.style.transition = 'all ' + self.config.contractDuration + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
        hexEl.style.transform = 'translate(-50%, -50%) scale(0.3)';
        hexEl.style.opacity = '0';
      }, (hexElements.length - index - 1) * (self.config.staggerMs || 80));
    });
    if (callback) {
      var st = this.config.staggerMs || 80;
      setTimeout(callback, this.config.contractDuration + (hexElements.length * st) + 100);
    }
  };

  HubHeroAnimation.prototype.clearAnimation = function() {
    if (!this.animationContainer) return;
    var animated = this.animationContainer.querySelectorAll('.hero-hex-animated');
    for (var i = 0; i < animated.length; i++) animated[i].remove();
  };

  var inst = null;
  function boot() {
    if (document.querySelector('.jkhive-hub-hero-anim-enabled')) {
      inst = new HubHeroAnimation();
      window.jkhiveHubHeroAnimation = inst;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
