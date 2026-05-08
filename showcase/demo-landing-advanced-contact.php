<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'Landing pro — Contacto';
$jk_breadcrumb = 'Landing pro / Contacto';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_demo_auth = false;
$jk_hide_demo_modal = true;
$jk_landing_pro_nav_active = 'contact';
require_once __DIR__ . '/includes/jkfw-landing-pro-navbar.php';
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<h1 class="jkhive-section-title" style="margin-top:0;"><?= $h('Contáctanos — Landing pro') ?></h1>
<nav class="jkfw-landing-nav" aria-label="Secciones landing pro">
  <a href="demo-landing-advanced.php" data-tooltip="Home">Home</a>
  <a href="demo-landing-advanced-about.php" data-tooltip="About">About</a>
  <a href="demo-landing-advanced-gallery.php" data-tooltip="Galería">Galería</a>
  <a href="demo-landing-advanced-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
</nav>
<p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">Canal de contacto público con seguimiento en mensajería y administración del panel.</p>
<div class="jkhive-actionbutton-med" style="margin-top:1rem;">
  <a href="contact.php" data-tooltip="Abrir formulario contacto" style="text-decoration:none;">
    <div class="jkhive-hex jkhive-hex-honey"><div class="jkhive-hex-content jkhive-hex-content-editorial"><span class="jkhive-hex-text">Formulario</span></div></div>
  </a>
</div>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
