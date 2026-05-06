<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-config.php';

$themeActive = jkfw_theme_apply_from_request();
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$themeLabels = [
    'canonical' => 'Canónico',
    'aurora' => 'Aurora',
    'cobalt' => 'Cobalto',
    'ember' => 'Brasas',
];

/**
 * @return string HTML
 */
function jkfw_launcher_hex_link(string $href, string $iconClass, string $title, string $hint = ''): string
{
    $h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $cap = '<div class="jkfw-launcher-hexcap"><strong>' . $h($title) . '</strong>';
    if ($hint !== '') {
        $cap .= '<span>' . $h($hint) . '</span>';
    }
    $cap .= '</div>';

    return '<a class="jkfw-launcher-hexlink" href="' . $h($href) . '">' .
        '<div class="jkhive-admoptions-bttn jkhive-bttn-med-big">' .
        '<span class="jkhive-bttn-inner" style="display:flex;justify-content:center;align-items:center;">' .
        '<div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon ' . $h($iconClass) . '"></i></div></div>' .
        '</span></div>' . $cap . '</a>';
}

$jk_page_title = 'JK Hive Framework — Selector de demos';
?><!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $h($jk_page_title) ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="assets/css/jk-hive.css">
  <link rel="stylesheet" href="assets/css/jkfw-themes.css">
  <link rel="stylesheet" href="assets/css/jkhive-style.css">
  <link rel="stylesheet" href="assets/css/jkhive-elements.css">
  <link rel="stylesheet" href="assets/css/jkfw-launcher.css">
</head>
<body class="jkfw-launcher-body <?= $h(jkfw_theme_body_class_suffix()) ?>">
  <div class="jkfw-launcher" role="application" aria-label="Selector de demostraciones JK Hive">
    <div class="jkfw-launcher__bg" aria-hidden="true"></div>
    <div class="jkfw-launcher__inner">
      <h1 class="jkfw-launcher__title">Elige lo que quieres ver</h1>
      <p class="jkfw-launcher__subtitle">
        Mismo núcleo de CSS y JS del framework. El tema de color se guarda en la sesión (parámetro <code style="font-size:0.85em;">?theme=</code>).
        El acento miel metálico se mantiene en todas las variantes.
      </p>

      <nav class="jkfw-launcher__themes" aria-label="Temas de color">
        <?php foreach (jkfw_valid_theme_slugs() as $tid) :
            $lab = $themeLabels[$tid] ?? $tid;
            $active = $themeActive === $tid ? ' is-active' : '';
            ?>
        <a class="<?= $active ?>" href="index.php?theme=<?= $h($tid) ?>"><?= $h($lab) ?></a>
        <?php endforeach; ?>
      </nav>

      <section class="jkfw-launcher-section" aria-labelledby="jkfw-sec-landing">
        <h2 id="jkfw-sec-landing" class="jkfw-launcher-section__label">Landing page</h2>
        <div class="jkfw-launcher-grid">
          <?= jkfw_launcher_hex_link('demo-landing-simple.php', 'fas fa-leaf', 'Landing básica', 'Sólo portada pública. Sin menú superior ni panel de administración.') ?>
          <?= jkfw_launcher_hex_link('demo-landing-advanced.php', 'fas fa-layer-group', 'Landing avanzada', 'Navbar, login demo, sidebar y pantallas de gestión. Sin carrito de compra.') ?>
        </div>
      </section>

      <section class="jkfw-launcher-section" aria-labelledby="jkfw-sec-shop">
        <h2 id="jkfw-sec-shop" class="jkfw-launcher-section__label">E-commerce</h2>
        <div class="jkfw-launcher-grid">
          <?= jkfw_launcher_hex_link('demo-ecommerce-basic.php', 'fas fa-store', 'E-commerce básico', 'Catálogo y fichas. Sin carrito ni checkout (sólo exploración y favoritos visuales).') ?>
          <?= jkfw_launcher_hex_link('demo-ecommerce-advanced.php', 'fas fa-shopping-cart', 'E-commerce avanzado', 'Catálogo + carrito persistente (local) + cierre de pedido simulado con toast.') ?>
        </div>
      </section>

      <section class="jkfw-launcher-section" aria-labelledby="jkfw-sec-web">
        <h2 id="jkfw-sec-web" class="jkfw-launcher-section__label">Sistemas web</h2>
        <div class="jkfw-launcher-grid">
          <?= jkfw_launcher_hex_link('demo-portal.php', 'fas fa-globe', 'Portal web', 'Home multi-bloque, servicios y área de cuenta (flujo demo). Inspiración portal tipo housesitting.') ?>
          <?= jkfw_launcher_hex_link('demo-crm.php', 'fas fa-chart-line', 'CRM', 'Tablero, KPIs y accesos a listados de gestión con el mismo marco visual.') ?>
          <?= jkfw_launcher_hex_link('messaging.php', 'fas fa-headset', 'Centro de mensajes', 'Bandeja de conversaciones y estados con componentes de mensajería JK Hive.') ?>
          <?= jkfw_launcher_hex_link('framework-demo.php', 'fas fa-flask', 'Showcase técnico', 'Toasts, modales hex y pruebas de laboratorio del framework.') ?>
        </div>
      </section>
    </div>
  </div>
  <script src="assets/js/tooltip.js"></script>
</body>
</html>
