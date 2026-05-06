<?php
declare(strict_types=1);
$jk_nav = 'about';
$jk_page_title = 'JK Hive Showcase - About';
$jk_breadcrumb = 'About';
$jk_extra_css = '';
require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
?>
        <h1 class="jkhive-section-title" style="margin-top:0;">About</h1>
        <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.6;">Lorem ipsum dolor sit amet. Página genérica sobre la grilla completa (navbar, sidebar, contenido, footer).</p>
        <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.6;margin-top:0.85rem;">
          El <strong>hero completo</strong>, la <strong>barra honeycomb colapsada</strong> al hacer scroll y la <strong>animación hub</strong> (satélites hex) están en <a href="index.php" style="color:var(--jk-primary-blue-light);text-decoration:none;">Home</a> — misma implementación que en JK Lubs / jkhive (<code>hero-collapse.js</code>, <code>hero-honeycomb-bar-jkhive.js</code>, <code>jkhive-hub-hero-animation.js</code>).
        </p>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
