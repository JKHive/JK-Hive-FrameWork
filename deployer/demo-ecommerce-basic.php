<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'E-commerce básico — JK Hive';
$jk_breadcrumb = 'Catálogo demo';
$jk_body_class = 'page-public jkhive-showcase-body';
$jk_hide_demo_modal = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/product-gallery.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$catalog = [
    ['id' => 'b1', 'name' => 'Aceite sintético 5W-30', 'sku' => 'SKU-B-01', 'price' => 18990, 'note' => 'Etiqueta genérica; texto comercial en lorem ipsum.'],
    ['id' => 'b2', 'name' => 'Kit filtros premium', 'sku' => 'SKU-B-22', 'price' => 45990, 'note' => 'Ejemplo de bloque descriptivo corto para fichas de tienda.'],
    ['id' => 'b3', 'name' => 'Grasa alta temperatura', 'sku' => 'SKU-B-09', 'price' => 12990, 'note' => 'Aquí irían especificaciones reales del proyecto industrial.'],
];
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">Catálogo público (básico)</h1>
        <p class="jkfw-catalog-intro">
          <?= $h('Sólo vitrina: grid de productos y acciones locales. Sin carrito, sin checkout, sin llamadas de pago.') ?>
          Compará con la variante avanzada que reutiliza el mismo JS de carrito.
        </p>

        <ul class="jkfw-catalog-list">
<?php foreach ($catalog as $p) :
    $pid = $h($p['id']);
    ?>
          <li class="jkfw-catalog-card">
            <span class="jkfw-compare-chip"><?= $h($p['sku']) ?></span>
            <h2 class="jkfw-catalog-card__title"><?= $h($p['name']) ?></h2>
            <p class="jkfw-catalog-card__meta"><?= $h('$' . number_format((float) $p['price'], 0, ',', '.')) ?> · <?= $h('consultar despacho demo') ?></p>
            <p class="jkfw-catalog-card__descr"><?= $h($p['note']) ?></p>
            <div class="jkfw-catalog-actions">
              <div class="jkhive-admoptions-bttn jkhive-bttn-med" data-tooltip="Sólo marca visual">
                <button type="button" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;" onclick="(function(btn){ btn.classList.toggle('jkfw-fav-on'); if(typeof toast==='function') toast({type:'A',state:'info',message:'Lista de deseos (demo sin persistencia).', autoCloseMs:3000}); })(this.closest('.jkhive-admoptions-bttn'));">
                  <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-heart"></i></div></div>
                </button>
              </div>
            </div>
          </li>
<?php endforeach; ?>
        </ul>

        <p style="margin-top:1.5rem;font-size:0.88rem;">
          <a href="demo-ecommerce-advanced.php" style="color:var(--jk-primary-blue-light);"><?= $h('Ver e-commerce con carrito') ?></a>
          · <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector') ?></a>
        </p>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
