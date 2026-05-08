<?php
declare(strict_types=1);

require_once __DIR__ . '/jkfw-config.php';

/** Cabecera HTML + navbar. Variables: $jk_page_title, $jk_breadcrumb, $jk_extra_css (HTML opcional), $jk_body_class */
$jk_page_title = $jk_page_title ?? 'JK Hive Showcase';
$jk_breadcrumb = $jk_breadcrumb ?? '';
$jk_extra_css = $jk_extra_css ?? '';
$jk_body_top_script = isset($jk_body_top_script) ? (string) $jk_body_top_script : '';
$jk_body_class = trim((string) (($jk_body_class ?? 'page-public jkhive-showcase-body')) . ' ' . jkfw_theme_body_class_suffix());
$jk_hub_hero = ! empty($jk_hub_hero);
$jk_hide_top_navbar = ! empty($jk_hide_top_navbar);
$jk_hide_sidebar = ! empty($jk_hide_sidebar);
$jk_demo_auth = ! empty($jk_demo_auth);
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$jk_admin_shell = ! empty($jk_admin_navbar_suite)
    || strpos($jk_body_class, 'admin-layout') !== false
    || strpos($jk_body_class, 'crm-layout') !== false;
$jk_shell_ssr = jkfw_shell_ssr_auth_payload();
$jk_shell_ssr_json = json_encode($jk_shell_ssr, JSON_UNESCAPED_UNICODE);
if ($jk_shell_ssr_json === false) {
    $jk_shell_ssr_json = '{"authenticated":false,"user":null}';
}
$jk_navbar_display = isset($jk_navbar_title_override) && is_string($jk_navbar_title_override) && $jk_navbar_title_override !== ''
    ? $jk_navbar_title_override
    : jkfw_navbar_title();
$t_slug = jkfw_theme_resolve();
?><!DOCTYPE html>
<html lang="es" data-jkfw-theme="<?= $h($t_slug) ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $h($jk_page_title) ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="assets/css/jk-hive.css">
  <link rel="stylesheet" href="assets/css/jkfw-themes.css">
  <link rel="stylesheet" href="assets/css/jkhive-hex-gallery-mobile-honey-1col.css">
  <link rel="stylesheet" href="assets/css/jkhive-hex-item-layout.css">
  <link rel="stylesheet" href="assets/css/jkhive-style.css">
  <link rel="stylesheet" href="assets/css/jkhive-elements.css">
  <link rel="stylesheet" href="assets/css/jkhive-navbar.css">
<?php if ($jk_admin_shell || ! empty($jk_hide_sidebar)) : ?>
  <link rel="stylesheet" href="assets/css/jkfw-showcase-shell.css">
<?php endif; ?>
  <link rel="stylesheet" href="assets/css/jkhive-sidebar.css">
  <link rel="stylesheet" href="assets/css/hero-hex-animation.css">
  <link rel="stylesheet" href="assets/css/hero-honeycomb-bar.css">
  <link rel="stylesheet" href="assets/css/krauss-mobile.css">
  <link rel="stylesheet" href="assets/css/modals.css">
  <link rel="stylesheet" href="assets/css/jkhive-modals.css">
  <link rel="stylesheet" href="assets/css/system-messages.css">
  <link rel="stylesheet" href="assets/css/jkfw-button-tokens.css">
<?php if ($jk_hub_hero) : ?>
  <link rel="stylesheet" href="assets/css/jkhive-hub-hero-animation.css">
  <link rel="stylesheet" href="assets/css/jkhive-index-home-responsive.css">
<?php endif; ?>
  <?= $jk_extra_css ?>
</head>
<body class="<?= $h($jk_body_class) ?>">
  <?= $jk_body_top_script ?>
  <script>
window.JKHIVE_AUTH_STATUS_URL = 'api/auth/status.php';
window.JKHIVE_MESSAGES_INBOX_URL = 'messaging.php';
window.JKHIVE_SHOWCASE_SHELL = <?= $jk_admin_shell ? 'true' : 'false' ?>;
<?php if ($jk_admin_shell) : ?>
window.JKHIVE_SHOWCASE_DASHBOARD_URL = 'demo-crm.php';
window.JKHIVE_SHOWCASE_PROFILE_URL = 'users.php';
<?php endif; ?>
window.JKHIVE_SSR_AUTH = <?= $jk_shell_ssr_json ?>;
window.JKHIVE_NO_PUBLIC_REGISTER = true;
<?php if ($jk_demo_auth) : ?>
window.JKHIVE_SHOWCASE_DEMO_AUTH = true;
<?php endif; ?>
  </script>

<?php if (! $jk_hide_top_navbar) : ?>
  <nav class="jkhive-navbar<?= $jk_admin_shell ? ' jkhive-navbar--showcase-shell' : '' ?>">
    <div class="jkhive-navbar-left">
      <h1 class="jkhive-navbar-title"><?= $h($jk_navbar_display) ?></h1>
      <div class="jkhive-navbar-breadcrumb"><span><?= $h($jk_breadcrumb) ?></span></div>
    </div>
    <div class="jkhive-navbar-right">
      <?php require __DIR__ . '/partials/navbar-hex-cluster.php'; ?>
      <?php if ($jk_admin_shell) :
          require __DIR__ . '/partials/navbar-crm-suite.php';
      endif; ?>
      <?php if ($jk_demo_auth) :
          require __DIR__ . '/partials/navbar-demo-auth.php';
      endif; ?>
    </div>
  </nav>
<?php endif; ?>
