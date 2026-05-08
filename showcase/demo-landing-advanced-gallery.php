<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-launcher-blocks.php';

$jk_nav = 'standalone';
$jk_page_title = 'Landing pro — Galería';
$jk_breadcrumb = 'Landing pro / Galería';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_demo_auth = false;
$jk_hide_demo_modal = true;
$jk_landing_pro_nav_active = 'gallery';
require_once __DIR__ . '/includes/jkfw-landing-pro-navbar.php';
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<h1 id="jkfw-advanced-gallery-anchor" class="jkhive-section-title" style="margin-top:0;"><?= $h('Galería de productos/servicios — Landing pro') ?></h1>
<nav class="jkfw-landing-nav" aria-label="Secciones landing pro">
  <a href="demo-landing-advanced.php" data-tooltip="Home">Home</a>
  <a href="demo-landing-advanced-about.php" data-tooltip="About">About</a>
  <a href="demo-landing-advanced-gallery.php" data-tooltip="Galería">Galería</a>
  <a href="demo-landing-advanced-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
</nav>
<div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery">
  <?= jkfw_launcher_hex_link('demo-landing-advanced-gallery.php#jkfw-advanced-gallery-anchor', 'fas fa-cubes', 'Producto A', 'Hex med + panal oficial.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
  <?= jkfw_launcher_hex_link('demo-landing-advanced-gallery.php#jkfw-advanced-gallery-anchor', 'fas fa-cube', 'Producto B', 'Misma estructura selector.', 'jkhive-itemgallery-med', 'jkhive-hex-blue-item') ?>
  <?= jkfw_launcher_hex_link('demo-landing-advanced-gallery.php#jkfw-advanced-gallery-anchor', 'fas fa-rocket', 'Servicio C', 'Responsive reglas honeycomb.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
  <?= jkfw_launcher_hex_link('demo-landing-advanced-gallery.php#jkfw-advanced-gallery-anchor', 'fas fa-chart-pie', 'Servicio D', 'Desktop y móvil alineados.', 'jkhive-itemgallery-med', 'jkhive-hex-blue-item') ?>
</div>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
