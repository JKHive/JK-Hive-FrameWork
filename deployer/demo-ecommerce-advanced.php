<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'E-commerce avanzado — JK Hive';
$jk_breadcrumb = 'Tienda demo · panel emprendedor';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_hide_demo_modal = true;
$jk_cart_modal = true;
$jk_shopping_cart = true;
$jk_body_top_script =
    '<script>window.JKFW_CART_STORAGE_KEY="jkfw_showcase_cart";window.JKFW_DEMO_CHECKOUT_TOAST=true;window.JKFW_CHECKOUT_URL="#";</script>';

$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/product-gallery.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkhive-dashboard-hex-charts.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$catalog = [
    ['id' => 'a1', 'name' => 'Lubricante industrial X200', 'sku' => 'SKU-A-101', 'price' => 34990, 'icon' => '🛢️', 'cat' => 'Lubricantes', 'desc' => 'SKU ancla con stock saludable y rotación alta (mock).', 'stock' => 128, 'reorder_point' => 24],
    ['id' => 'a2', 'name' => 'Aditivo cerámico Pro', 'sku' => 'SKU-A-088', 'price' => 21990, 'icon' => '⚙️', 'cat' => 'Aditivos', 'desc' => 'Stock por debajo del punto de reposición sin entrar en corte.', 'stock' => 18, 'reorder_point' => 26],
    ['id' => 'a3', 'name' => 'Pack mantención flota', 'sku' => 'SKU-A-500', 'price' => 99990, 'icon' => '📦', 'cat' => 'Kits', 'desc' => 'Dispara alerta por stock crítico y repone automáticamente en demo.', 'stock' => 4, 'reorder_point' => 14],
];

$stockTone = static function (int $stock, int $rp): array {
    if ($stock <= 5) {
        return ['label' => 'Crítico', 'class' => 'jkfw-ec-stock-critical'];
    }
    if ($stock < $rp) {
        return ['label' => 'Por debajo del mín.', 'class' => 'jkfw-ec-stock-warn'];
    }

    return ['label' => 'OK', 'class' => 'jkfw-ec-stock-ok'];
};
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">E-commerce avanzado (demo)</h1>
        <p class="jkfw-catalog-intro">
          <?= $h('Vitrina pública con carrito persistente + checkout simulado. Esta capa agrega datos de inventario mock, avisos de stock y tableros hex que comparan ventas de los últimos 6 meses con el mismo período del año anterior, todo sin servidor de datos real.') ?>
          Los números son ficticios pero el layout replica el comportamiento esperado cuando el proyecto vaya a base de datos.
        </p>

        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;align-items:center;">
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="<?= $h('Abrir modal de carrito'); ?>">
            <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;" onclick="shoppingCart.toggleCart();">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-shopping-cart"></i></div></div>
            </button>
          </div>
          <span style="font-size:0.8rem;color:var(--jk-metal);"><?= $h('Administrá alertas desde el panel inferior sin salir del flujo de cliente.'); ?></span>
        </div>

        <ul class="jkfw-catalog-list">
<?php foreach ($catalog as $p) :
    $tone = $stockTone((int) $p['stock'], (int) $p['reorder_point']);
    $json = json_encode([
        'id' => $p['id'],
        'type' => 'product',
        'name' => $p['name'],
        'price' => (float) $p['price'],
        'icon' => $p['icon'],
        'description' => $p['desc'],
        'category' => $p['cat'],
        'quantity' => 1,
    ], JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        continue;
    }
    $itemAttr = htmlspecialchars($json, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    ?>
          <li class="jkfw-catalog-card">
            <span class="jkfw-compare-chip"><?= $h($p['sku']) ?></span>
            <h2 class="jkfw-catalog-card__title"><?= $h($p['name']) ?></h2>
            <p class="jkfw-catalog-card__meta"><?= $h('$' . number_format((float) $p['price'], 0, ',', '.')) ?></p>
            <p class="jkfw-catalog-card__descr"><?= $h($p['desc']) ?></p>
            <div class="<?= $h($tone['class']) ?> jkfw-ec-stock-row">
              <span><?= $h('Stock físico demo: ') ?><strong><?= $h((string) $p['stock']) ?></strong> <?= $h('u.') ?></span>
              <span>· <?= $h('Reposición al ') ?> <strong><?= $h((string) $p['reorder_point']) ?></strong><?= $h(' — ') ?><strong><?= $h($tone['label']) ?></strong></span>
            </div>
            <div class="jkfw-catalog-actions">
              <div class="jkhive-admoptions-bttn jkhive-bttn-med jkfw-ec-add" data-tooltip="<?= $h('Añadir al carrito demo'); ?>">
                <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;" data-jkfw-cart-item="<?= $itemAttr ?>">
                  <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-cart-plus"></i></div></div>
                </button>
              </div>
            </div>
          </li>
<?php endforeach; ?>
        </ul>

        <section class="jkfw-ec-admin-panel" aria-labelledby="jkfw-ec-admin-title">
          <h2 id="jkfw-ec-admin-title" class="jkhive-section-title" style="font-size:1.05rem;"><?= $h('Panel vendedor — inventario y KPI (mock)'); ?></h2>
          <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;font-size:0.92rem;margin:0;">
            <?= $h('Este bloque aparece dentro de la demo avanzada para que cualquier proyecto pueda aislar vistas storefront vs backoffice usando el mismo tema JK Hive.') ?>
          </p>
          <div class="jkfw-crm-kpi-row" style="margin-top:1rem;" role="group" aria-label="<?= $h('Resumen rápido'); ?>">
            <div class="jkfw-crm-kpi"><strong>3</strong><span><?= $h('SKUs demo activos'); ?></span></div>
            <div class="jkfw-crm-kpi"><strong>2</strong><span><?= $h('Alertas reposición'); ?></span></div>
            <div class="jkfw-crm-kpi"><strong>24%</strong><span><?= $h('Margen medio simulado'); ?></span></div>
          </div>
          <ul style="margin:1rem 0 0;color:var(--jk-metal-light);font-size:0.88rem;line-height:1.45;padding-left:1.25rem;">
            <li><?= $h('SKU-A-088 baja del punto seguro (~26 u.) — orden sugerida a proveedor interno demo.'); ?></li>
            <li><?= $h('SKU-A-500 en rojo (<5 u.). Dispara notificación tipo “Stock crítico” y muestra mensaje destacado hasta reponer.'); ?></li>
            <li><?= $h('Los gráficos estrella paralelos muestran el contraste solicitado entre el semestre móvil y el mismo período año anterior.'); ?></li>
          </ul>

          <div class="jkfw-ec-kpi-pair">
            <figure class="jkfw-ec-kpi-col">
              <figcaption><?= $h('Ventas normalizadas — últimos 6 meses (curso actual)'); ?></figcaption>
              <div id="jkfw-ec-star-current" role="img" aria-label="<?= $h('Radar hex meses vigentes'); ?>"></div>
            </figure>
            <figure class="jkfw-ec-kpi-col">
              <figcaption><?= $h('Ventas normalizadas — mismos meses año anterior'); ?></figcaption>
              <div id="jkfw-ec-star-prev" role="img" aria-label="<?= $h('Radar hex año anterior'); ?>"></div>
            </figure>
          </div>
        </section>

        <p style="margin-top:1.85rem;font-size:0.88rem;">
          <a href="demo-ecommerce-basic.php" style="color:var(--jk-primary-blue-light);"><?= $h('Volver al e-commerce básico'); ?></a>
          · <a href="demo-crm.php" style="color:var(--jk-primary-blue-light);"><?= $h('CRM con más gráficos hex'); ?></a>
          · <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector'); ?></a>
        </p>

<?php
$jk_footer_inline_script = <<<'JS'
(function () {
  document.querySelectorAll('[data-jkfw-cart-item]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      try {
        var raw = this.getAttribute('data-jkfw-cart-item');
        if (!raw || typeof addToCart !== 'function') return;
        var item = JSON.parse(raw);
        addToCart(item, 'product', this.closest('.jkfw-ec-add'));
      } catch (e) {}
    });
  });

  function mountRetailCharts() {
    if (!window.JKHiveHexCharts) return;
    var labels = ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];
    var c = document.getElementById('jkfw-ec-star-current');
    var p = document.getElementById('jkfw-ec-star-prev');
    if (c) {
      window.JKHiveHexCharts.renderStar6(c, labels, [0.88, 0.79, 0.94, 0.71, 0.77, 0.83]);
    }
    if (p) {
      window.JKHiveHexCharts.renderStar6(p, labels, [0.57, 0.63, 0.61, 0.7, 0.52, 0.56]);
    }
  }

  var sc = document.createElement('script');
  sc.src = 'assets/js/jkhive-dashboard-hex-charts.js';
  sc.onload = mountRetailCharts;
  document.body.appendChild(sc);
})();
JS;

require __DIR__ . '/includes/layout-shell-end.php';
