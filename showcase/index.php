<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-launcher-blocks.php';

$themeActive = jkfw_theme_apply_from_request();
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$themeLabels = [
    'canonical' => 'Canónico',
    'aurora' => 'Aurora',
    'cobalt' => 'Cobalto',
    'ember' => 'Brasas',
];

$jk_page_title = 'JK Hive Framework — Selector de demos';
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

      <section class="jkfw-launcher-section" aria-labelledby="jkfw-sec-landing">
        <h2 id="jkfw-sec-landing" class="jkhive-section-title sm jkfw-launcher-section-heading">Landing page</h2>
        <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery">
          <?= jkfw_launcher_landing_basic_theme_hex($themeLabels, $themeActive) ?>
          <?= jkfw_launcher_hex_link('demo-landing-advanced.php', 'fas fa-layer-group', 'Landing avanzada', 'Misma estructura pero autoadministrable: menú superior JK Hive + panel admin.', 'jkhive-itemgallery-med', 'jkhive-hex-blue-item') ?>
        </div>
      </section>

      <section class="jkfw-launcher-section" aria-labelledby="jkfw-sec-shop">
        <h2 id="jkfw-sec-shop" class="jkhive-section-title sm jkfw-launcher-section-heading">E-commerce</h2>
        <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery">
          <?= jkfw_launcher_hex_link('demo-ecommerce-basic.php', 'fas fa-store', 'E-commerce básico', 'Catálogo y fichas. Sin carrito ni checkout.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('demo-ecommerce-advanced.php', 'fas fa-shopping-cart', 'E-commerce avanzado', 'Catálogo + carrito persistente + cierre simulado.', 'jkhive-itemgallery-med', 'jkhive-hex-blue-item') ?>
        </div>
      </section>

      <section class="jkfw-launcher-section" aria-labelledby="jkfw-sec-web">
        <h2 id="jkfw-sec-web" class="jkhive-section-title sm jkfw-launcher-section-heading">Sistemas web</h2>
        <div class="jkhive-hex-gallery jkhive-hex-gallery-medium jkfw-launcher-hex-gallery">
          <?= jkfw_launcher_hex_link('demo-portal.php', 'fas fa-globe', 'Portal web', 'Home multi-bloque y servicios.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('demo-crm.php', 'fas fa-chart-line', 'CRM', 'Tablero y KPIs hex.', 'jkhive-itemgallery-med', 'jkhive-hex-blue-item') ?>
          <?= jkfw_launcher_hex_link('messaging.php', 'fas fa-headset', 'Centro de mensajes', 'Bandeja y modales JK Hive.', 'jkhive-itemgallery-med', 'jkhive-hex-cyan-item') ?>
          <?= jkfw_launcher_hex_link('framework-demo.php', 'fas fa-flask', 'Showcase técnico', 'Laboratorio de componentes.', 'jkhive-itemgallery-med', 'jkhive-hex-blue-item') ?>
        </div>
      </section>
    </div>
  </div>
  <script src="assets/js/tooltip.js"></script>
</body>
</html>
