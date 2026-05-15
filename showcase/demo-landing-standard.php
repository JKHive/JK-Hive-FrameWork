<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-launcher-blocks.php';

$jk_nav = 'standalone';
$jk_tier = 'standard';
$jk_page_title = 'Landing estándar — JK Hive';
$jk_breadcrumb = 'Escritorio + mantenedores';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_demo_auth = false;
$jk_hide_demo_modal = true;
$jk_landing_std_nav_active = 'home';
require_once __DIR__ . '/includes/jkfw-landing-standard-navbar.php';
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">Landing estándar — escritorio de bienvenida</h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;margin:0 0 1rem;">
          <?= $h('Misma línea pública Home / About / Galería / Contacto que la variante pro, con shell JK Hive y foco en mantenedores de configuración.') ?>
          <?= $h('Incluye acceso al catálogo de productos (stock en listado) sin tableros BI, sin carrusel vitrina grande y sin la gestión de usuarios destacada en la pro.') ?>
        </p>

        <nav class="jkfw-landing-nav" aria-label="Secciones landing estándar">
          <a href="demo-landing-standard.php" data-tooltip="Home">Home</a>
          <a href="demo-landing-advanced-about.php" data-tooltip="About">About</a>
          <a href="demo-landing-advanced-gallery.php" data-tooltip="Galería">Galería</a>
          <a href="demo-landing-advanced-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
        </nav>

        <section id="landing-std-desk" aria-label="Escritorio">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;"><?= $h('Resumen') ?></h2>
          <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;"><?= $h('Vista de bienvenida con enlaces a mantenedores: catálogo de productos (inventario demo en la ficha) y mensajería. La variante pro añade gráficos en panel, carrusel tipo vitrina jkhive y módulo de usuarios.') ?></p>
        </section>

        <section id="landing-std-about">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;">About</h2>
          <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;"><?= $h('Las subpáginas About, Galería y Contacto se comparten con la demo pro en este showcase para no duplicar contenido.') ?></p>
        </section>

        <h2 class="jkhive-section-title sm"><?= $h('Mantenedores') ?></h2>
        <div class="jkfw-portal-grid">
          <div class="jkfw-portal-tile">
            <h3><?= $h('Productos') ?></h3>
            <p><?= $h('Lista de ítems de catálogo con columnas de inventario demo (sin informes ni alertas de stock crítico).') ?></p>
            <p style="margin-top:0.5rem;"><a href="products.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir productos') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Mensajería interna') ?></h3>
            <p><?= $h('Bandeja tipo CRM con el mismo patrón hex que el resto del showcase.') ?></p>
            <p style="margin-top:0.5rem;"><a href="messaging.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir mensajes') ?></a></p>
          </div>
        </div>

        <p style="margin-top:1.5rem;font-size:0.88rem;color:var(--jk-metal);max-width:42rem;">
          <?= $h('Subir de nivel:') ?>
          <a href="demo-landing-advanced.php" style="color:var(--jk-primary-blue-light);"><?= $h('Landing pro (gráficos, carrusel, usuarios)') ?></a>
          · <a href="demo-landing-simple.php" style="color:var(--jk-primary-blue-light);"><?= $h('Landing básica') ?></a>
          · <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector') ?></a>
        </p>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
