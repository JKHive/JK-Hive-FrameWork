<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-launcher-blocks.php';

$jk_nav = 'standalone';
$jk_landing_simple_nav_active = 'home';
$jk_tier = 'basic';
$jk_page_title = 'Landing pública básica — JK Hive';
$jk_breadcrumb = 'Landing básica · CANON';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout jkfw-landing-basic-body';
$jk_hide_top_navbar = true;
$jk_hide_demo_modal = true;
$jk_footer_minimal = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/jkfw-landing-simple-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$jk_landing_simple_hero_id = 'jkfw-landing-basic-hero-title';
$jk_landing_simple_hero_title = 'Landing básica CANON';
$jk_landing_simple_hero_subtitle = 'Versión simple de Home con identidad JK Hive y foco comercial.';
?>

        <?php require __DIR__ . '/includes/jkfw-landing-simple-hero.php'; ?>

        <?php require __DIR__ . '/includes/partials/jkfw-landing-simple-home-mirror.php'; ?>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
