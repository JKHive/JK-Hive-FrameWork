<?php
declare(strict_types=1);
$jk_nav = 'framework-demo';
$jk_page_title = 'JK Hive Showcase — Demo técnica';
$jk_breadcrumb = 'Demo técnica';
$jk_body_class = 'page-public jkhive-showcase-body jkhive-index-home';
$jk_hub_hero = true;
$jk_hero_title = 'JK Hive Framework';
$jk_hero_tagline = 'Barra honeycomb completa arriba: al hacer scroll se colapsa en el panal fijo JK (hero-collapse + honeycomb-bar). Los satélites animan desde el hex central (jkhive-hub-hero-animation.js). Debajo: demos de sistemas.';
$jk_extra_css = '';
require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
require __DIR__ . '/includes/partials/layout-hero-jkhive-hub.php';
?>
        <section id="contexto-servicio" class="jkhive-index-page" aria-label="Demos de componentes">
        <p class="jkhive-index-lead" style="margin-top:0;">
          Esta zona queda enlazada con el comportamiento del hero al colapsar (scroll desde la barra; ver <code>hero-collapse.js</code>).
          Navegación lateral y pie desde <code>config/navigation.json</code>. Volver al <a href="index.php" style="color:var(--jk-primary-blue-light);">selector de demos</a>.
        </p>

        <h2 class="jkhive-section-title jkhive-index-section-title" style="font-size:1.15rem;margin-top:0.25rem;">Toasts y errores</h2>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.75rem;align-items:center;">
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Toast barra directo (showToastBar)">
            <button type="button" id="showcase-btn-toast" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-bell"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Misma acción vía API unificada tipo A">
            <button type="button" id="showcase-btn-toast-unified" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-layer-group"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Toast inline tipo B (showToastInline)">
            <button type="button" id="showcase-btn-inline" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-info-circle"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Tipo B vía toast({ type: 'B', state: 'neutral' })">
            <button type="button" id="showcase-btn-inline-unified" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-code"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Toast persistente (panel detalle + ticket UI)">
            <button type="button" id="showcase-btn-persistent" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-database"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Provocar error capturado (error-handler.js)">
            <button type="button" id="showcase-btn-throw" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-bug"></i></div></div>
            </button>
          </div>
        </div>

        <h2 class="jkhive-section-title" style="font-size:1.1rem;margin-top:1.75rem;">Modal hex + variantes botón (tokens)</h2>
        <div class="jkfw-btn-scope" style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:0.75rem;align-items:center;">
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big jkfw-variant-primary" data-tooltip="Modal administrativo hex (JK Hive)">
            <button type="button" id="showcase-btn-open-modal" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-window-maximize"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big jkfw-variant-secondary" data-tooltip="Variante secondary (token demo)">
            <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-leaf"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big jkfw-variant-danger" data-tooltip="Variante danger (token demo)">
            <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-exclamation-triangle"></i></div></div>
            </button>
          </div>
        </div>

        <h2 class="jkhive-section-title" style="font-size:1.1rem;margin-top:1.75rem;">Listados administración</h2>
        <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;margin:0.5rem 0 0;">
          Tablas con botones <code>.jkhive-bttn-table</code>, toggles ON/OFF, lista desplegable hex y paginación: <a href="users.php" style="color:var(--jk-primary-blue-light);">Usuarios</a> ·
          <a href="products.php" style="color:var(--jk-primary-blue-light);">Productos</a>.
        </p>
        </section>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
