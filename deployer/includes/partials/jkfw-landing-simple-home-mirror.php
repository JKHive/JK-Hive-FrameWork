<?php
declare(strict_types=1);
/**
 * Home simple: destacados (carrusel big) · ventajas · noticias (modal) · CTA.
 */
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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
              <a href="<?= $h('demo-landing-simple-gallery.php') ?>">
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
      <h2 id="jkfw-simple-ventajas-title" class="jkhive-section-title jkhive-index-section-title"><?= $h('¿Por qué elegirnos?') ?></h2>
      <p class="jkhive-index-why-sub">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut purus id libero luctus viverra.</p>
      <div class="jkhive-hex-gallery jkhive-hex-gallery-small jkhive-hex-gallery-display-only jkhive-index-ventajas-gallery">
        <div class="jkhive-itemgallery-small">
          <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><div class="jkhive-hex-gallery-icon jkfw-simple-why-icon-a"><i class="fas fa-layer-group"></i></div><h3 class="jkhive-hex-gallery-title jkfw-simple-why-title-a">Estructura sólida</h3><p class="jkhive-hex-gallery-subtitle jkfw-simple-why-sub">Lorem ipsum dolor</p></div></div>
        </div>
        <div class="jkhive-itemgallery-small">
          <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><div class="jkhive-hex-gallery-icon jkfw-simple-why-icon-b"><i class="fas fa-mobile-screen"></i></div><h3 class="jkhive-hex-gallery-title jkfw-simple-why-title-b">Responsive</h3><p class="jkhive-hex-gallery-subtitle jkfw-simple-why-sub">Lorem ipsum dolor</p></div></div>
        </div>
        <div class="jkhive-itemgallery-small">
          <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><div class="jkhive-hex-gallery-icon jkfw-simple-why-icon-a"><i class="fas fa-shield-halved"></i></div><h3 class="jkhive-hex-gallery-title jkfw-simple-why-title-a">Confiable</h3><p class="jkhive-hex-gallery-subtitle jkfw-simple-why-sub">Lorem ipsum dolor</p></div></div>
        </div>
        <div class="jkhive-itemgallery-small">
          <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><div class="jkhive-hex-gallery-icon jkfw-simple-why-icon-b"><i class="fas fa-headset"></i></div><h3 class="jkhive-hex-gallery-title jkfw-simple-why-title-b">Soporte dedicado</h3><p class="jkhive-hex-gallery-subtitle jkfw-simple-why-sub">Lorem ipsum dolor</p></div></div>
        </div>
        <div class="jkhive-itemgallery-small">
          <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><div class="jkhive-hex-gallery-icon jkfw-simple-why-icon-a"><i class="fas fa-lightbulb"></i></div><h3 class="jkhive-hex-gallery-title jkfw-simple-why-title-a">Innovación continua</h3><p class="jkhive-hex-gallery-subtitle jkfw-simple-why-sub">Lorem ipsum dolor</p></div></div>
        </div>
      </div>
    </section>

    <?php
    $jkfwNewsHref = 'demo-landing-simple-contact.php';
    $jkfwNewsBodyHtml = <<<HTML

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
<p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?</p>
<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
<p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>

HTML;

    $jkfwNewsItems = [
        ['title' => 'Noticia 1', 'subtitle' => '', 'headerIconClass' => 'fa-newspaper', 'skin' => 'jkhive-hex-cyan-item', 'hint' => 'Resumen breve de contenido relacionado.'],
        ['title' => 'Noticia 2', 'subtitle' => '', 'headerIconClass' => 'fa-rss', 'skin' => 'jkhive-hex-cyan-item', 'hint' => 'Resumen breve de contenido relacionado.'],
        ['title' => 'Noticia 3', 'subtitle' => '', 'headerIconClass' => 'fa-bullhorn', 'skin' => 'jkhive-hex-cyan-item', 'hint' => 'Resumen breve de contenido relacionado.'],
        ['title' => 'Noticia 4', 'subtitle' => '', 'headerIconClass' => 'fa-file-lines', 'skin' => 'jkhive-hex-cyan-item', 'hint' => 'Resumen breve de contenido relacionado.'],
    ];
    $jkfwNewsIconsPool = ['fa-newspaper', 'fa-rss', 'fa-bullhorn', 'fa-file-lines', 'fa-radio', 'fa-tower-broadcast'];
    for ($jkfwNewsN = 5; $jkfwNewsN <= 54; $jkfwNewsN++) {
        $jkfwNewsItems[] = [
            'title' => 'Noticia ' . (string) $jkfwNewsN,
            'subtitle' => '',
            'headerIconClass' => $jkfwNewsIconsPool[($jkfwNewsN - 1) % count($jkfwNewsIconsPool)],
            'skin' => 'jkhive-hex-cyan-item',
            'hint' => 'Resumen breve de contenido relacionado.',
        ];
    }
    $jkfwNewsPayload = [
        'contactHref' => $jkfwNewsHref,
        'sharedBodyHtml' => $jkfwNewsBodyHtml,
        'items' => array_map(
            static fn (array $it): array => [
                'title' => $it['title'],
                'subtitle' => $it['subtitle'],
                'headerIconClass' => $it['headerIconClass'],
            ],
            $jkfwNewsItems
        ),
    ];
    ?>
    <section id="noticias-destacadas" class="jkhive-index-section jkhive-section-dashboard jkhive-index-section--jkfw-simple-noticias" aria-labelledby="jkfw-simple-noticias-title">
      <h2 id="jkfw-simple-noticias-title" class="jkhive-section-title jkhive-index-section-title"><?= $h('Noticias destacadas') ?></h2>
      <div class="jkhive-lead-wrap jkhive-index-lead">
        <p class="jkhive-lead-text">Canal ficticio de novedades: abre el detalle con el botón hexagonal de cada tarjeta.</p>
      </div>
      <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery jkhive-gallery-align-center" style="margin-top: 2rem;" data-jkhive-paginate="true">
        <?php
        // Anti-cronológico: las más nuevas primero; `true` preserva índices para `data-jkfw-news-idx` ↔ JSON del modal.
        foreach (array_reverse($jkfwNewsItems, true) as $jkfwIdx => $jkfwNewsItem) :
            ?>
        <?= jkfw_launcher_hex_news_item(
            (int) $jkfwIdx,
            (string) $jkfwNewsItem['title'],
            (string) $jkfwNewsItem['hint'],
            (string) $jkfwNewsItem['headerIconClass'],
            'jkhive-itemgallery-med',
            (string) $jkfwNewsItem['skin']
        ) ?>
        <?php endforeach; ?>
      </div>
    </section>

    <section id="cta" class="cta-section-hex jkhive-index-section jkhive-index-section--cta">
      <h2 class="jkhive-section-title"><?= $h('¿Listo para comenzar?') ?></h2>
      <div class="jkhive-index-cta-html"><p class="jkhive-lead-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contáctanos para una propuesta personalizada.</p></div>
      <div class="cta-buttons-hex">
        <div class="jkhive-bttn-big">
          <a href="demo-landing-simple-gallery.php" data-tooltip="Ver galería"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-briefcase"></i></div></div></a>
        </div>
        <div class="jkhive-bttn-big">
          <a href="demo-landing-simple-contact.php" data-tooltip="Contacto"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-envelope"></i></div></div></a>
        </div>
      </div>
    </section>
  </div>

  <div id="jkfwSimpleNewsModal" class="jkhive-modal jkhive-modal-formulario jkfw-simple-news-modal" style="display:none" role="dialog" aria-modal="true" aria-labelledby="jkfwSimpleNewsTitle" aria-hidden="true" data-contact-href="<?= $h($jkfwNewsHref) ?>">
    <div class="jkhive-modal-overlay jkfw-simple-news-overlay" tabindex="-1" aria-hidden="true"></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin" style="max-width: 520px; width: 92%;">
      <div class="jkhive-modal-header">
        <div class="jkhive-modal-header-top">
          <span class="jkhive-modal-icon" id="jkfwSimpleNewsIcon" style="font-size: 2.75rem;" aria-hidden="true"></span>
        </div>
        <div class="jkhive-modal-header-bottom">
          <h2 class="jkhive-modal-title" id="jkfwSimpleNewsTitle"></h2>
          <p class="jkhive-modal-subtitle" id="jkfwSimpleNewsSubtitle"></p>
        </div>
        <button type="button" class="jkhive-modal-close jkfw-simple-news-close" aria-label="<?= $h('Cerrar') ?>">&times;</button>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content jkhive-hub-detail-body" id="jkfwSimpleNewsBody"></div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb">
          <div class="jkhive-modal-admin-footer-row1">
            <div class="jkhive-bttn-med" data-tooltip="<?= $h('Contacto') ?>">
              <a href="<?= $h($jkfwNewsHref) ?>" class="jkhive-modal-footer-hex-link" id="jkfwSimpleNewsContactBtn" aria-label="<?= $h('Ir a contacto') ?>">
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-envelope" aria-hidden="true"></i></div></div>
              </a>
            </div>
            <div class="jkhive-bttn-med jkhive-bttn-modal-exit jkhive-btn-cart-exit" data-tooltip="<?= $h('Salir') ?>">
              <button type="button" class="jkfw-simple-news-close" aria-label="<?= $h('Salir') ?>">
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script type="application/json" id="jkfw-simple-news-modal-data"><?php
    echo json_encode($jkfwNewsPayload, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?></script>

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
  /** Espera tras terminar cada deslizamiento antes del siguiente paso (autoplay) */
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

  /** Segunda hilera idéntica: la cinta puede seguir enrollándose siempre en el mismo sentido sin “devolverse”. */
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

  /**
   * Avance solo hacia delante (polea): al cerrar ciclo anima hasta la copia y reengancha en 0 sin salto visible.
   */
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
<script>
(function () {
  'use strict';
  var dataEl = document.getElementById('jkfw-simple-news-modal-data');
  var modal = document.getElementById('jkfwSimpleNewsModal');
  if (!dataEl || !modal) return;
  var cfg;
  try {
    cfg = JSON.parse(dataEl.textContent || '{}');
  } catch (e) {
    return;
  }
  if (!cfg.items || !Array.isArray(cfg.items) || cfg.items.length === 0) return;

  var titleEl = document.getElementById('jkfwSimpleNewsTitle');
  var subEl = document.getElementById('jkfwSimpleNewsSubtitle');
  var bodyEl = document.getElementById('jkfwSimpleNewsBody');
  var iconWrap = document.getElementById('jkfwSimpleNewsIcon');
  var contactBtn = document.getElementById('jkfwSimpleNewsContactBtn');
  var contactHref =
    modal.getAttribute('data-contact-href') || cfg.contactHref || 'demo-landing-simple-contact.php';
  var modalOpen = false;

  function safeFa(name) {
    var s = String(name || '').trim();
    return /^fa-[a-z0-9-]+$/i.test(s) ? s : 'fa-newspaper';
  }

  function openModal(idx) {
    var it = cfg.items[idx];
    if (!it) return;
    modalOpen = true;
    if (titleEl) titleEl.textContent = it.title || '';
    if (subEl) {
      var st = String(it.subtitle || '').trim();
      subEl.textContent = st;
      subEl.style.display = st ? '' : 'none';
    }
    if (bodyEl) {
      bodyEl.innerHTML = String(cfg.sharedBodyHtml || '').trim() || '';
    }
    if (iconWrap) {
      iconWrap.textContent = '';
      var ic = document.createElement('i');
      ic.className = 'fas ' + safeFa(it.headerIconClass || it.iconClass);
      ic.setAttribute('aria-hidden', 'true');
      iconWrap.appendChild(ic);
    }
    if (contactBtn) contactBtn.href = contactHref;

    document.body.classList.add('jkhive-hub-detail-modal-open');
    modal.style.display = 'flex';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modalOpen = false;
    document.body.classList.remove('jkhive-hub-detail-modal-open');
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.jkfw-simple-news-open[data-jkfw-news-idx]').forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      var n = parseInt(btn.getAttribute('data-jkfw-news-idx') || '-1', 10);
      if (n >= 0) openModal(n);
    });
  });

  modal.querySelectorAll('.jkfw-simple-news-close').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  modal.querySelectorAll('.jkfw-simple-news-overlay').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && modalOpen) closeModal();
  });
})();
</script>
