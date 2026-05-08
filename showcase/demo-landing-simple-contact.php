<?php
declare(strict_types=1);

$jk_page_title = 'Landing básica — Contacto';
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
    <h1 class="jkfw-landing-simple-hero__title"><?= $h('Contáctanos — Landing básica') ?></h1>
    <nav class="jkfw-landing-nav" aria-label="Secciones landing básica">
      <a href="demo-landing-simple.php" data-tooltip="Home">Home</a>
      <a href="demo-landing-simple-about.php" data-tooltip="About">About</a>
      <a href="demo-landing-simple-gallery.php" data-tooltip="Galería">Galería</a>
      <a href="demo-landing-simple-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
    </nav>
    <p class="jkfw-landing-simple-lead">Canal de contacto público para formularios de interés comercial.</p>
    <div class="jkhive-actionbutton-med" style="margin-top:1rem;display:inline-block;">
      <a href="contact.php" data-tooltip="Abrir formulario de contacto" style="text-decoration:none;">
        <div class="jkhive-hex jkhive-hex-honey"><div class="jkhive-hex-content jkhive-hex-content-editorial"><span class="jkhive-hex-text">Formulario</span></div></div>
      </a>
    </div>
  </div>
</section>
<?php
require __DIR__ . '/includes/layout-main-close.php';
require __DIR__ . '/includes/layout-footer.php';
require __DIR__ . '/includes/layout-scripts.php';
