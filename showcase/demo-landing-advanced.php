<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-launcher-blocks.php';

$jk_nav = 'standalone';
$jk_page_title = 'Landing avanzada — JK Hive';
$jk_breadcrumb = 'Landing pro + administración';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_demo_auth = false;
$jk_hide_demo_modal = true;
$jk_landing_pro_nav_active = 'home';
require_once __DIR__ . '/includes/jkfw-landing-pro-navbar.php';
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

$themeActiveLanding = jkfw_theme_apply_from_request();
$themeLabelsAdmin = [
    'canonical' => 'Canónico',
    'aurora' => 'Aurora',
    'cobalt' => 'Cobalto',
    'ember' => 'Brasas',
];

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">Landing pro con autoadministración</h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;margin:0 0 1rem;">
          <?= $h('Misma estructura tipo jkhive: Home / About / Galería / Contáctanos, pero con login demo y capa de administración activa.') ?>
          <?= $h('Incluye selector visual para recorrer estilos administrativos del framework sin salir del showcase.') ?>
        </p>

        <nav class="jkfw-landing-nav" aria-label="Secciones landing pro">
          <a href="demo-landing-advanced.php" data-tooltip="Home">Home</a>
          <a href="demo-landing-advanced-about.php" data-tooltip="About">About</a>
          <a href="demo-landing-advanced-gallery.php" data-tooltip="Galería">Galería</a>
          <a href="demo-landing-advanced-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
        </nav>

        <section id="landing-home">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;">Home (pro)</h2>
          <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">Bloque principal de propuesta de valor y CTA administrables con el shell JK Hive activo.</p>
        </section>

        <section id="landing-about">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;">About</h2>
          <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">Sección informativa editable en versión real mediante módulo de contenido.</p>
        </section>

        <section id="landing-gallery" aria-labelledby="jkfw-adv-pro-gallery-h">
          <h2 id="jkfw-adv-pro-gallery-h" class="jkhive-section-title" style="font-size:1.05rem;"><?= $h('Galería de productos / servicios') ?></h2>
          <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">
            <?= $h('Catálogo con panal canónico, filtros, buscador, paginación e ítems por página está en la vista dedicada.') ?>
          </p>
          <p style="margin-top:0.65rem;"><a href="demo-landing-advanced-gallery.php" style="color:var(--jk-primary-blue-light);font-weight:600;"><?= $h('Abrir galería interactiva (demo)') ?></a></p>
        </section>

        <section id="landing-contact">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;">Contáctanos</h2>
          <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">Formulario público + seguimiento desde mensajería interna.</p>
          <p><a href="contact.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir formulario de contacto') ?></a></p>
        </section>

        <h2 class="jkhive-section-title sm">Selector visual administrativo</h2>
        <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">Temas sobre pantallas autoadministrables (solo esta variante tiene selector en panel; Landing básica lo lleva dentro de su hex en el selector).</p>
        <div class="jkfw-admin-theme-hexh-row"><?php foreach (jkfw_valid_theme_slugs() as $__tid) :
            echo jkfw_admin_theme_horizontal_link($__tid, $themeLabelsAdmin[$__tid] ?? $__tid, $themeActiveLanding === $__tid);
        endforeach; ?></div>

        <h2 class="jkhive-section-title" style="font-size:1.05rem;">Pantallas de gestión</h2>
        <div class="jkfw-portal-grid">
          <div class="jkfw-portal-tile">
            <h3><?= $h('Lista de usuarios') ?></h3>
            <p>Tabla con toggles, modales hex y paginación JK Hive.</p>
            <p style="margin-top:0.5rem;"><a href="users.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir usuarios') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Productos') ?></h3>
            <p>Gestión demo de ítems de catálogo genéricos.</p>
            <p style="margin-top:0.5rem;"><a href="products.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir productos') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Mensajería interna') ?></h3>
            <p>Bandeja tipo CRM con estados y conversación.</p>
            <p style="margin-top:0.5rem;"><a href="messaging.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir mensajes') ?></a></p>
          </div>
        </div>

        <p style="margin-top:1.5rem;font-size:0.88rem;color:var(--jk-metal);max-width:42rem;">
          <?= $h('Esta variante no muestra flujo de tienda (sin carrito).') ?>
          <a href="demo-ecommerce-advanced.php" style="color:var(--jk-primary-blue-light);"><?= $h('Ir al e-commerce avanzado') ?></a>
          · <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector principal') ?></a>
        </p>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
