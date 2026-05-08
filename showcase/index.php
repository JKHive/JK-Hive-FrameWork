<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-launcher-blocks.php';

$themeActive = jkfw_theme_apply_from_request();
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$themeLabels = [
    'canonical' => 'CANON',
    'elegant' => 'ELEGANT',
    'ember' => 'Brasas',
    'nature' => 'NATURE',
];

$jk_page_title = 'JK Hive — Selector de demos';
?><!DOCTYPE html>
<html lang="es" data-jkfw-theme="<?= $h(jkfw_theme_resolve()) ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $h($jk_page_title) ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="assets/css/jk-hive.css">
  <link rel="stylesheet" href="assets/css/jkhive-hex-item-layout.css">
  <link rel="stylesheet" href="assets/css/jkfw-themes.css">
  <link rel="stylesheet" href="assets/css/jkhive-style.css">
  <link rel="stylesheet" href="assets/css/jkhive-elements.css">
  <link rel="stylesheet" href="assets/css/jkfw-button-tokens.css">
  <link rel="stylesheet" href="assets/css/jkfw-launcher-dashboard-gallery.css">
  <link rel="stylesheet" href="assets/css/jkfw-launcher.css">
</head>
<body class="jkfw-launcher-body <?= $h(jkfw_theme_body_class_suffix()) ?>">
  <div class="jkfw-launcher" role="application" aria-label="Selector de demostraciones JK Hive">
    <div class="jkfw-launcher__bg" aria-hidden="true"></div>
    <div class="jkfw-launcher__inner">
      <h1 class="jkfw-launcher__title">Elige lo que quieres ver</h1>
      <p class="jkfw-launcher__subtitle">
        Galerías de demos JK Hive con ítems hexagonales. La selección pública de juego de color se ofrece solo para Landing básica.
      </p>

      <main class="jkfw-launcher-hive-main">
      <section class="jkfw-launcher-section jkhive-section-dashboard" aria-labelledby="jkfw-sec-landing">
        <h2 id="jkfw-sec-landing" class="jkhive-section-title sm jkfw-launcher-section-heading">Landing page</h2>
        <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery jkhive-gallery-align-center">
          <?= jkfw_launcher_landing_basic_theme_hex($themeLabels, $themeActive) ?>
          <?= jkfw_launcher_hex_link('demo-landing-standard.php', 'fas fa-window-maximize', 'Landing estándar', 'Página web autoadministrable. html5, php, js, mysql.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('demo-landing-advanced.php', 'fas fa-layer-group', 'Landing pro', 'Lo mismo de la estándar + gestión de usuarios, mensajería, gráfico de tráfico.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
        </div>
      </section>

      <section class="jkfw-launcher-section jkhive-section-dashboard" aria-labelledby="jkfw-sec-shop">
        <h2 id="jkfw-sec-shop" class="jkhive-section-title sm jkfw-launcher-section-heading">E-commerce</h2>
        <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery jkhive-gallery-align-center">
          <?= jkfw_launcher_hex_link('demo-ecommerce-basic.php', 'fas fa-store', 'E-commerce básico', 'Como landing pro + mantenedor de stock + carrito y checkout.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('demo-ecommerce-standard.php', 'fas fa-boxes-stacked', 'E-commerce estándar', 'Lo mismo del básico + informes de ventas y de stock.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('demo-ecommerce-advanced.php', 'fas fa-shopping-cart', 'E-commerce pro', 'Todo lo anterior + BI de ventas/KPI + alertas de stock crítico.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
        </div>
      </section>

      <section class="jkfw-launcher-section jkhive-section-dashboard" aria-labelledby="jkfw-sec-web">
        <h2 id="jkfw-sec-web" class="jkhive-section-title sm jkfw-launcher-section-heading">Sistemas web</h2>
        <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery jkhive-gallery-align-center">
          <?= jkfw_launcher_hex_link('demo-portal.php', 'fas fa-globe', 'Portal web', 'Home multi-bloque y servicios, responsive. html5+php+js+mysql.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('demo-crm.php', 'fas fa-chart-line', 'CRM', 'Tablero y KPIs hex, responsive. html5+php+js+mysql.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('messaging.php', 'fas fa-headset', 'Sistema de tickets', 'Tickets, estados y seguimiento, responsive. html5+php+js+mysql.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link_with_inline_link('framework-demo.php', 'fas fa-flask', 'E-market ML', 'Marketplace 100% integrado a', 'MercadoLibre', 'https://www.mercadolibre.com/', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
        </div>
      </section>
      </main>
    </div>

    <footer class="jkhive-footer jkfw-launcher-footer-simple" role="contentinfo">
      <div class="jkhive-footer-inner">
        <div class="footer-right">
          <div class="footer-corporate">
            <p class="small footer-copyright-line">
              <span class="footer-copyright-muted">&copy; </span>
              <a href="https://jkhive.work" class="footer-link" target="_blank" rel="noopener noreferrer">JK Hive 2016</a>
            </p>
            <p class="small">
              <span class="footer-copyright-muted">Desarrollado por </span>
              <a href="https://webs.jkhive.work" class="footer-link" target="_blank" rel="noopener noreferrer">JK WebS</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
  <script src="assets/js/tooltip.js"></script>
</body>
</html>
