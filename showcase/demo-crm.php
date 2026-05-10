<?php
declare(strict_types=1);

$jk_nav = 'demo-crm';
$jk_page_title = 'CRM — JK Hive';
$jk_breadcrumb = 'Tablero demo';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_demo_auth = false;
$jk_hide_demo_modal = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkhive-dashboard-hex-charts.css">' . "\n";
$jk_footer_inline_script = <<<'JS'
(function () {
  var el = document.getElementById('jkhive-hexcharts-demo');
  if (!el) return;
  var sc = document.createElement('script');
  sc.src = 'assets/js/jkhive-dashboard-hex-charts.js';
  sc.onload = function () {
    if (window.JKHiveHexCharts) window.JKHiveHexCharts.mount('jkhive-hexcharts-demo');
  };
  document.body.appendChild(sc);
})();
JS;

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>

        <h1 class="jkhive-section-title" style="margin-top:0;"><?= $h('Panel CRM') ?></h1>
        <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.55;">
          <?= $h('Resumen ejecutivo ficticio con métricas placeholder. Las acciones enlazan a pantallas reales del showcase (usuarios, productos, mensajería).') ?>
        </p>

        <div class="jkfw-crm-kpi-row" role="group" aria-label="Indicadores demo">
          <div class="jkfw-crm-kpi"><strong>128</strong><span><?= $h('Oportunidades abiertas') ?></span></div>
          <div class="jkfw-crm-kpi"><strong>94%</strong><span><?= $h('SLA respuesta (demo)') ?></span></div>
          <div class="jkfw-crm-kpi"><strong>36</strong><span><?= $h('Tareas vencidas simuladas') ?></span></div>
        </div>

        <h2 class="jkhive-section-title" style="font-size:1.05rem;"><?= $h('Dashboard hex — prototipos de gráficos') ?></h2>
        <p style="color:var(--jk-metal-light);max-width:48rem;line-height:1.5;font-size:0.92rem;margin-bottom:0.75rem;">
          <?= $h('Pie por sectores angulares con recorte hexagonal (las proporciones son por ángulo, equivalente al diagrama circular enmascarado — no por área de sector hex). Radar de seis ejes; barras con segmentos en forma hex apilados (vertical / horizontal).') ?>
        </p>
        <div id="jkhive-hexcharts-demo" class="jkhive-hexcharts-demo-grid" aria-label="<?= $h('Gráficos hex demo') ?>"></div>

        <h2 class="jkhive-section-title" style="font-size:1.05rem;"><?= $h('Accesos rápidos') ?></h2>
        <div class="jkfw-portal-grid">
          <div class="jkfw-portal-tile">
            <h3><?= $h('Cuentas y contactos') ?></h3>
            <p>CRUD de usuarios con modales hex y tabla estándar JK Hive.</p>
            <p style="margin-top:0.5rem;"><a href="users.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir lista de usuarios') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Catálogo') ?></h3>
            <p>Vista de administración de productos genéricos.</p>
            <p style="margin-top:0.5rem;"><a href="products.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir productos') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Conversaciones') ?></h3>
            <p>Bandeja alineada al patrón de mensajería consolidado.</p>
            <p style="margin-top:0.5rem;"><a href="messaging.php" style="color:var(--jk-primary-blue-light);"><?= $h('Ir a mensajes') ?></a></p>
          </div>
        </div>

        <p style="margin-top:1.5rem;font-size:0.88rem;">
          <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector de demos') ?></a>
        </p>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
