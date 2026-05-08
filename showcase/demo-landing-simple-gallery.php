<?php
declare(strict_types=1);

$jk_page_title = 'Landing básica — Galería';
$jk_breadcrumb = '';
$jk_body_class = 'jkhive-showcase-body jkfw-landing-simple-body';
$jk_hide_top_navbar = true;
$jk_hide_demo_modal = true;
$jk_main_extra_class = 'jkfw-main-fullbleed';
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<section class="jkfw-landing-simple-hero">
  <div class="jkfw-landing-simple-hero__inner">
    <h1 class="jkfw-landing-simple-hero__title"><?= $h('Galería — Landing básica') ?></h1>
    <nav class="jkfw-landing-nav" aria-label="Secciones landing básica">
      <a href="demo-landing-simple.php" data-tooltip="Home">Home</a>
      <a href="demo-landing-simple-about.php" data-tooltip="About">About</a>
      <a href="demo-landing-simple-gallery.php" data-tooltip="Galería">Galería</a>
      <a href="demo-landing-simple-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
    </nav>
  </div>
</section>
<section class="jkfw-landing-simple-band" aria-label="Galería de servicios">
  <div class="jkfw-launcher-grid">
    <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio 1"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-layer-group"></i></div></div></span></div>
    <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio 2"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-swatchbook"></i></div></div></span></div>
    <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio 3"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-bullhorn"></i></div></div></span></div>
    <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio 4"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-gears"></i></div></div></span></div>
  </div>
</section>
<?php
require __DIR__ . '/includes/layout-main-close.php';
require __DIR__ . '/includes/layout-footer.php';
require __DIR__ . '/includes/layout-scripts.php';
