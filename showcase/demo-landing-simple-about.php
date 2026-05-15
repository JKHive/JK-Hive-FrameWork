<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_landing_simple_nav_active = 'about';
$jk_tier = 'basic';
$jk_landing_basic_minimal_head = true;
$jk_top_navbar_search_only = true;
$jk_top_navbar_brand_href = 'demo-landing-simple.php';
$jk_page_title = 'Landing básica — About';
$jk_breadcrumb = 'Landing básica · About';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout jkfw-landing-basic-body';
$jk_hide_top_navbar = true;
$jk_hide_demo_modal = true;
$jk_footer_minimal = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n" .
    '<link rel="stylesheet" href="landingpage/basica/assets/css/jklp-basic-local.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/jkfw-landing-simple-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$jk_landing_simple_hero_id = 'jkfw-landing-about-hero-title';
$jk_landing_simple_hero_title = 'About';
$jk_landing_simple_hero_subtitle = 'Contenido institucional para la versión pública mínima JK Hive.';
?>

        <?php require __DIR__ . '/includes/jkfw-landing-simple-hero.php'; ?>

        <div class="jkhive-content-wrap">
          <div class="jkhive-page-container">
            <section class="jkfw-landing-basic-section" aria-labelledby="jkfw-about-lead-title">
              <h2 id="jkfw-about-lead-title" class="jkhive-section-title"><?= $h('Quiénes somos') ?></h2>
              <div class="jkhive-lead-wrap">
                <p class="jkhive-lead-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Esta landing básica concentra identidad JK Hive y foco comercial sin autoadministración.</p>
              </div>
              <p class="jkfw-landing-basic-prose">Texto genérico de segundo párrafo para reemplazar por contenido real en tu proyecto.</p>
              <p class="jkfw-landing-basic-prose" style="margin-top:1.25rem;">La vitrina de medios está en <a class="jkhive-link-inline" href="landingpage/basica/gallery.html"><?= $h('Galería') ?></a>.</p>
            </section>
          </div>
        </div>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
