<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'E-commerce avanzado — JK Hive';
$jk_breadcrumb = 'Tienda demo + carrito';
$jk_body_class = 'page-public jkhive-showcase-body';
$jk_hide_demo_modal = true;
$jk_cart_modal = true;
$jk_shopping_cart = true;
$jk_body_top_script =
    '<script>window.JKFW_CART_STORAGE_KEY="jkfw_showcase_cart";window.JKFW_DEMO_CHECKOUT_TOAST=true;window.JKFW_CHECKOUT_URL="#";</script>';

$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/product-gallery.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$catalog = [
    ['id' => 'a1', 'name' => 'Lubricante industrial X200', 'sku' => 'SKU-A-101', 'price' => 34990, 'icon' => '🛢️', 'cat' => 'Lubricantes', 'desc' => 'Texto comercial ficticio para la ficha.'],
    ['id' => 'a2', 'name' => 'Aditivo cerámico Pro', 'sku' => 'SKU-A-088', 'price' => 21990, 'icon' => '⚙️', 'cat' => 'Aditivos', 'desc' => 'Lorem ipsum dolor sit amet — reemplazar por contenido real.'],
    ['id' => 'a3', 'name' => 'Pack mantención flota', 'sku' => 'SKU-A-500', 'price' => 99990, 'icon' => '📦', 'cat' => 'Kits', 'desc' => 'Descripción corta sólo como marcador visual.'],
];
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">Tienda demo (JK Lubs estética)</h1>
        <p class="jkfw-catalog-intro">
          <?= $h('Catálogo + botón hex «Añadir» con toast tipo B y carrito persistente en el navegador (clave aisladas jkfw_showcase_cart). Checkout simulado: toast tipo A, sin servidor.') ?>
        </p>

        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;align-items:center;">
          <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Abrir modal de carrito">
            <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;" onclick="shoppingCart.toggleCart();">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-shopping-cart"></i></div></div>
            </button>
          </div>
          <span style="font-size:0.8rem;color:var(--jk-metal);">Usá el mismo patrón de iconos que en <?= $h('JK Lubs'); ?>: mismo CSS/JS consolidado.</span>
        </div>

        <ul class="jkfw-catalog-list">
<?php foreach ($catalog as $p) :
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
            <div class="jkfw-catalog-actions">
              <div class="jkhive-admoptions-bttn jkhive-bttn-med jkfw-ec-add" data-tooltip="Añadir al carrito demo">
                <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;" data-jkfw-cart-item="<?= $itemAttr ?>">
                  <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-cart-plus"></i></div></div>
                </button>
              </div>
            </div>
          </li>
<?php endforeach; ?>
        </ul>

        <p style="margin-top:1.5rem;font-size:0.88rem;">
          <a href="demo-ecommerce-basic.php" style="color:var(--jk-primary-blue-light);"><?= $h('Volver al catálogo básico') ?></a>
          · <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector') ?></a>
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
})();
JS;

require __DIR__ . '/includes/layout-shell-end.php';
