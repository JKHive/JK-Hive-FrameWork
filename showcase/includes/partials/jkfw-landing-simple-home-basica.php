<?php
declare(strict_types=1);
/**
 * Home landing básica (JK Hive fuente: data/jkhive/www/index.php #ventajas + HomePublicItemsService::defaultWhyItems).
 *
 * — Carrusel big (existente).
 * — ¿Por qué elegirnos?: **strip-gallery** `#jklpStripGallery` (panal canónico, sin pole).
 * — Noticias: hueco reservado.
 * — Nuestros clientes: solo **strip-carrousel** `#jklpStripCarrousel` (`jklp-pole`, marquee continuo en `jklp-galleries.js`).
 * — **Mesa PHP** (`demo-landing-simple.php`): el partial incluye `landingpage/basica/assets/js/jklp-galleries.js` al final (esta copia JKHFW no duplica en `layout-scripts.php`).
 */
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$jk_landing_why_title = isset($jk_landing_why_title) ? (string) $jk_landing_why_title : '¿Por qué elegirnos?';
$jk_landing_why_sub = isset($jk_landing_why_sub)
    ? (string) $jk_landing_why_sub
    : 'Más de 18 años transformando desafíos tecnológicos en soluciones reales y medibles. Respeta «reduced motion».';

$jklp_hexfeature_strip_max = isset($jklp_hexfeature_strip_max)
    ? max(1, min(7, (int) $jklp_hexfeature_strip_max))
    : 7;

/** Ítems CMS fallback (JK Hive — HomePublicItemsService::defaultWhyItems + séptimo showcase). */
$jkfw_jkhive_why_catalog = [
    ['icon' => 'fa-award', 'h' => '+18 Años', 's' => 'Experiencia', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-certificate', 'h' => 'Certificado', 's' => 'Google & otros', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-users', 'h' => 'Confianza', 's' => '100+ clientes', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-globe-americas', 'h' => 'Remoto', 's' => 'Work expert', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-rocket', 'h' => 'Innovación', 's' => 'Constante', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-handshake', 'h' => 'Compromiso', 's' => 'Total', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-shield-halved', 'h' => 'Seguridad', 's' => 'Buenas prácticas', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
];

$jklp_why_items = array_slice($jkfw_jkhive_why_catalog, 0, $jklp_hexfeature_strip_max);

$jklp_client_items = [
    ['icon' => 'fa-handshake', 'h' => 'Compromiso', 's' => 'Total', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-building', 'h' => 'Cliente A', 's' => 'Sector servicios', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-industry', 'h' => 'Cliente B', 's' => 'Industria', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-store', 'h' => 'Cliente C', 's' => 'Retail', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-landmark', 'h' => 'Cliente D', 's' => 'Institucional', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-heart-pulse', 'h' => 'Cliente E', 's' => 'Salud', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-graduation-cap', 'h' => 'Cliente F', 's' => 'Educación', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-truck-fast', 'h' => 'Cliente G', 's' => 'Logística', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
    ['icon' => 'fa-server', 'h' => 'Cliente H', 's' => 'Tech', 'c1' => 'var(--jk-primary-blue)', 'c2' => 'var(--jk-accent-honey)'],
    ['icon' => 'fa-leaf', 'h' => 'Cliente I', 's' => 'Sustentable', 'c1' => 'var(--jk-accent-honey)', 'c2' => 'var(--jk-primary-blue)'],
];

/**
 * Ítem small editorial canónico (strip y variantes de tema).
 *
 * @param array{icon:string,h:string,s:string,c1?:string,c2?:string} $b
 */
$jklp_render_small_editorial_hex = static function (array $b) use ($h): string {
    $c1 = isset($b['c1']) ? (string) $b['c1'] : 'var(--jk-accent-honey)';
    $c2 = isset($b['c2']) ? (string) $b['c2'] : 'var(--jk-primary-blue)';

    return '<div class="jkhive-itemgallery-small">' .
        '<div class="jkhive-hex">' .
          '<div class="jkhive-hex-content jkhive-hex-content-editorial">' .
            '<div class="jkhive-hex-gallery-icon" style="font-size: 1.91rem; color: ' . $h($c1) . ';"><i class="fas ' . $h((string) $b['icon']) . '" aria-hidden="true"></i></div>' .
            '<h3 class="jkhive-hex-gallery-title" style="font-size: 1rem; color: ' . $h($c2) . ';">' . $h((string) $b['h']) . '</h3>' .
            '<p class="jkhive-hex-gallery-subtitle" style="font-size: 0.675rem; color: var(--jk-metal-light);">' . $h((string) $b['s']) . '</p>' .
          '</div>' .
        '</div>' .
      '</div>';
};

$jklp_render_ventajas_item_jkhive = $jklp_render_small_editorial_hex;
?>
<div class="jkhive-content-wrap">
  <div class="jkhive-page-container jkhive-index-page jkfw-landing-simple-home-page">

    <section id="servicios-destacados" class="jkhive-index-section jkhive-index-section--destacados" aria-labelledby="jkfw-simple-servicios-destacados-title">
      <h2 id="jkfw-simple-servicios-destacados-title" class="jkhive-section-title jkhive-index-section-title"><?= $h('Servicios destacados') ?></h2>
      <?php
      $jkfwFeatured = [
          ['titulo' => 'Servicio 1', 'txt' => 'Demostración de ítem destacado.', 'icon' => 'fa-cubes'],
          ['titulo' => 'Servicio 2', 'txt' => 'Demostración de ítem destacado.', 'icon' => 'fa-box'],
          ['titulo' => 'Servicio 3', 'txt' => 'Demostración de ítem destacado.', 'icon' => 'fa-gem'],
          ['titulo' => 'Servicio 4', 'txt' => 'Demostración de ítem destacado.', 'icon' => 'fa-rocket'],
      ];
      ?>
      <div id="jkfwSimpleFeaturedCarousel" class="jkfw-carousel-hex-big" aria-roledescription="carrusel" aria-labelledby="jkfw-simple-servicios-destacados-title">
        <div class="jkfw-simple-featured-carousel-row">
          <button type="button" class="jkfw-simple-featured-nav-btn carousel-nav carousel-nav-prev jkfw-simple-carousel-prev" aria-label="<?= $h('Anterior ítems destacados') ?>">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          <div class="jkfw-simple-featured-window">
            <div class="jkfw-simple-featured-window-xclip">
            <div class="service-carousel-wrapper jkfw-simple-featured-track">
            <?php foreach ($jkfwFeatured as $row) : ?>
            <article class="jkhive-carouselitem-big">
              <a href="<?= $h('landingpage/basica/about.html') ?>">
                <div class="jkhive-hex">
                  <div class="jkhive-hex-content">
                    <span class="service-icon" aria-hidden="true"><i class="fas <?= $h($row['icon']) ?>"></i></span>
                    <h3 class="service-title"><?= $h($row['titulo']) ?></h3>
                    <p class="service-description"><?= $h($row['txt']) ?></p>
                  </div>
                </div>
              </a>
            </article>
            <?php endforeach; ?>
            </div>
            </div>
          </div>
          <button type="button" class="jkfw-simple-featured-nav-btn carousel-nav carousel-nav-next jkfw-simple-carousel-next" aria-label="<?= $h('Siguiente ítems destacados') ?>">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </section>

    <section id="ventajas" class="jkhive-index-section jkhive-index-section--ventajas" aria-labelledby="jkfw-simple-ventajas-title">
      <h2 id="jkfw-simple-ventajas-title" class="jkhive-section-title jkhive-index-section-title"><?= $h($jk_landing_why_title) ?></h2>
      <p class="jkhive-index-why-sub"><?= $h($jk_landing_why_sub) ?></p>
      <div
        id="jklpStripGallery"
        class="jklp-strip-gallery jkhive-hex-gallery jkhive-hex-gallery-small jkhive-hex-gallery-display-only jkhive-index-ventajas-gallery jkhive-hexfeature-strip jkhive-itemgallery-small-hover-v2"
        data-jkhive-hexfeature-max="<?= $h((string) $jklp_hexfeature_strip_max) ?>"
        style="--jkhive-hexfeature-strip-max: <?= $h((string) $jklp_hexfeature_strip_max) ?>;"
        aria-label="<?= $h('Refuerzos — strip-gallery') ?>"
      >
        <?php foreach ($jklp_why_items as $b) : ?>
          <?= $jklp_render_ventajas_item_jkhive($b) ?>
        <?php endforeach; ?>
      </div>
    </section>

    <section id="jklp-noticias" class="jklp-section jklp-section--news jkhive-index-section" aria-labelledby="jklp-news-heading">
      <h2 id="jklp-news-heading" class="jkhive-section-title jkhive-index-section-title"><?= $h('Noticias') ?></h2>
      <p class="jklp-news-lead"><?= $h('Canal de novedades: la galería hexagonal de noticias se integrará aquí en la siguiente iteración.') ?></p>
      <div class="jklp-news-placeholder" role="status"><?= $h('Sin ítems por ahora.') ?></div>
    </section>

    <section id="jklp-nuestros-clientes" class="jklp-section jklp-section--clients jkhive-index-section" aria-labelledby="jklp-clients-heading">
      <h2 id="jklp-clients-heading" class="jkhive-section-title jkhive-index-section-title"><?= $h('Nuestros clientes') ?></h2>
      <p class="jklp-clients-lead"><?= $h('Marcas en strip-carrousel (polea). Respeta «reduced motion».') ?></p>
      <div
        id="jklpStripCarrousel"
        class="jklp-strip-carrousel jkhive-hex-gallery jkhive-hex-gallery-small jkhive-hex-gallery-display-only jkhive-hexfeature-strip jklp-pole jkhive-itemgallery-small-hover-v2"
        data-jkhive-hexfeature-max="<?= $h((string) count($jklp_client_items)) ?>"
        style="--jkhive-hexfeature-strip-max: <?= $h((string) count($jklp_client_items)) ?>;"
        aria-roledescription="<?= $h('cinta') ?>"
        aria-label="<?= $h('Marcas — strip-carrousel') ?>"
      >
        <div class="jklp-pole__viewport">
          <div class="jklp-pole__track" data-jklp-original-count="<?= $h((string) count($jklp_client_items)) ?>">
            <?php foreach ($jklp_client_items as $b) : ?>
              <div class="jklp-pole__cell"><?= $jklp_render_small_editorial_hex($b) ?></div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    </section>

    <section id="cta" class="cta-section-hex jkhive-index-section jkhive-index-section--cta jklp-section jklp-section--cta jklp-cta-emphasis" aria-labelledby="jklp-cta-heading">
      <h2 id="jklp-cta-heading" class="jkhive-section-title"><?= $h('¿Listo para comenzar?') ?></h2>
      <div class="jkhive-index-cta-html"><p class="jkhive-lead-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contáctanos para una propuesta personalizada.</p></div>
      <div class="cta-buttons-hex">
        <div class="jkhive-bttn-big">
          <a href="<?= $h('landingpage/basica/about.html') ?>" data-tooltip="About"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-briefcase"></i></div></div></a>
        </div>
        <div class="jkhive-bttn-big">
          <a href="<?= $h('landingpage/basica/contact.html') ?>" data-tooltip="Contacto"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-envelope"></i></div></div></a>
        </div>
      </div>
    </section>
  </div>
</div>
<script>
(function () {
  'use strict';
  var root = document.getElementById('jkfwSimpleFeaturedCarousel');
  if (!root) return;
  var viewport = root.querySelector('.jkfw-simple-featured-window');
  var track = root.querySelector('.jkfw-simple-featured-track');
  var prevBtn = root.querySelector('.jkfw-simple-carousel-prev');
  var nextBtn = root.querySelector('.jkfw-simple-carousel-next');
  if (!viewport || !track || !prevBtn || !nextBtn) return;

  var originalCount = track.children.length;
  if (originalCount === 0) return;

  var reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STEP_HOLD_MS = reduceMotion ? 3600 : 750;
  var TRANS = reduceMotion
    ? 'transform 0.28s linear'
    : 'transform 0.42s linear';

  var page = 0;
  var loopWidth = 0;
  var pauseHover = false;
  var pauseFocusInside = false;
  var pendingLoopSnap = false;
  var autoEnabled = false;
  var autoTimeoutId = null;

  function slidesPerPage() {
    var vw = viewport.clientWidth;
    var c0 = track.children[0];
    var c1 = originalCount > 1 ? track.children[1] : c0;
    var w0 = c0.offsetWidth || 520;
    var gapApprox =
      originalCount > 1 ? c1.offsetLeft - c0.offsetLeft - w0 : 0;
    if (gapApprox < 0) gapApprox = 3;
    return vw >= w0 + gapApprox + (c1.offsetWidth || w0) - 2 ? 2 : 1;
  }

  function maxPageOrig() {
    var spp = slidesPerPage();
    return Math.max(0, Math.ceil(originalCount / spp) - 1);
  }

  function offsetForPage(p) {
    var spp = slidesPerPage();
    var idx = Math.min(p * spp, originalCount - 1);
    if (idx <= 0) return 0;
    return (
      track.children[idx].offsetLeft - track.children[0].offsetLeft
    );
  }

  function measureLoopWidth() {
    if (track.children.length <= originalCount) return 0;
    return (
      track.children[originalCount].offsetLeft - track.children[0].offsetLeft
    );
  }

  function syncClones() {
    while (track.children.length > originalCount) {
      track.removeChild(track.lastChild);
    }
    for (var i = 0; i < originalCount; i++) {
      var node = track.children[i];
      var c = node.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      var k;
      var f = c.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]'
      );
      for (k = 0; k < f.length; k++) {
        f[k].setAttribute('tabindex', '-1');
      }
      track.appendChild(c);
    }
    loopWidth = measureLoopWidth();
  }

  function applyTx(px, animate) {
    if (animate !== false) {
      track.style.transition = TRANS;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = 'translateX(' + -px + 'px)';
    if (animate === false) {
      void track.offsetHeight;
      track.style.transition = TRANS;
    }
  }

  function onTrackTransitionEnd(ev) {
    if (ev.target !== track) return;
    var prop = ev.propertyName || '';
    if (prop !== 'transform' && prop !== '-webkit-transform') return;
    if (pendingLoopSnap) {
      pendingLoopSnap = false;
      page = 0;
      applyTx(0, false);
    }
    if (autoEnabled && canAuto()) {
      scheduleAutoStep();
    }
  }

  track.addEventListener('transitionend', onTrackTransitionEnd);

  function advanceForward() {
    var m = maxPageOrig();
    if (m <= 0 || loopWidth <= 0) return;
    if (page < m) {
      page += 1;
      applyTx(offsetForPage(page), true);
    } else {
      pendingLoopSnap = true;
      applyTx(loopWidth, true);
    }
  }

  function stopAuto() {
    autoEnabled = false;
    if (autoTimeoutId !== null) {
      window.clearTimeout(autoTimeoutId);
      autoTimeoutId = null;
    }
  }

  function canAuto() {
    if (document.hidden) return false;
    if (pauseHover || pauseFocusInside) return false;
    return maxPageOrig() > 0 && loopWidth > 0;
  }

  function scheduleAutoStep() {
    if (autoTimeoutId !== null) {
      window.clearTimeout(autoTimeoutId);
      autoTimeoutId = null;
    }
    if (!autoEnabled || !canAuto()) return;
    autoTimeoutId = window.setTimeout(function () {
      autoTimeoutId = null;
      advanceForward();
    }, STEP_HOLD_MS);
  }

  function enableAutoDeferToTransition() {
    if (!canAuto()) {
      stopAuto();
      return;
    }
    autoEnabled = true;
  }

  function startAuto() {
    if (!canAuto()) {
      stopAuto();
      return;
    }
    autoEnabled = true;
    scheduleAutoStep();
  }

  var layoutScheduled = false;
  function scheduleLayout() {
    if (layoutScheduled) return;
    layoutScheduled = true;
    window.requestAnimationFrame(function () {
      layoutScheduled = false;
      var prevPage = page;
      var wasAuto = autoEnabled;
      pendingLoopSnap = false;
      syncClones();
      var m = maxPageOrig();
      if (m <= 0) {
        page = 0;
        applyTx(0, false);
      } else {
        if (prevPage > m) prevPage = m;
        page = prevPage;
        applyTx(offsetForPage(page), false);
      }
      stopAuto();
      if (wasAuto) startAuto();
    });
  }

  function goNextManual() {
    stopAuto();
    advanceForward();
    enableAutoDeferToTransition();
  }

  function goPrev() {
    var m = maxPageOrig();
    if (m <= 0) return;
    pendingLoopSnap = false;
    stopAuto();
    if (page > 0) {
      page -= 1;
    } else {
      page = m;
    }
    applyTx(offsetForPage(page), true);
    enableAutoDeferToTransition();
  }

  nextBtn.addEventListener('click', goNextManual);
  prevBtn.addEventListener('click', goPrev);
  window.addEventListener('resize', scheduleLayout, { passive: true });
  if (typeof ResizeObserver !== 'undefined') {
    var roFeatured = new ResizeObserver(scheduleLayout);
    roFeatured.observe(viewport);
    roFeatured.observe(track);
  }

  root.addEventListener('mouseenter', function () {
    pauseHover = true;
    stopAuto();
  });
  root.addEventListener('mouseleave', function () {
    pauseHover = false;
    startAuto();
  });
  root.addEventListener('focusin', function () {
    pauseFocusInside = true;
    stopAuto();
  });
  root.addEventListener('focusout', function () {
    window.requestAnimationFrame(function () {
      pauseFocusInside = root.contains(document.activeElement);
      if (!pauseFocusInside) startAuto();
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  syncClones();
  page = 0;
  applyTx(0, false);
  autoEnabled = true;
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      scheduleLayout();
    });
  });
})();
</script>
<script src="landingpage/basica/assets/js/jklp-galleries.js"></script>
