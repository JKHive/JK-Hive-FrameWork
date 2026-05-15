<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-product-gallery-catalog.php';

$jk_nav = 'standalone';
$jk_page_title = 'Landing pro — Galería catálogo (JK Lubs / JK Hive)';
$jk_breadcrumb = 'Landing pro / Galería';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout catalog-page';
$jk_demo_auth = false;
$jk_hide_demo_modal = true;
$jk_landing_pro_nav_active = 'gallery';
$jk_catalog_public_layout = true;
$jk_cart_modal = true;
$jk_shopping_cart = true;
$jk_gallery_catalog_js = true;
$jk_body_top_script =
    '<script>window.JKFW_CART_STORAGE_KEY="jkfw_showcase_cart";window.JKFW_DEMO_CHECKOUT_TOAST=true;window.JKFW_CHECKOUT_URL="#";</script>';
require_once __DIR__ . '/includes/jkfw-landing-pro-navbar.php';
/** Catálogo JK Lubs: solo gallery-catalog + product-gallery, en ese orden (docs/GALERIA-PRODUCTOS § checklist #2). */
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkhive-gallery-catalog.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/product-gallery.css">' . "\n";

$jk_footer_inline_script = <<<'JS'
(function () {
    window.JKHiveCatalogStock = (function () {
        function getReservedForProduct(productId) {
            if (!window.shoppingCart || !Array.isArray(window.shoppingCart.cart)) return 0;
            var idStr = String(productId || '').trim();
            return window.shoppingCart.cart.reduce(function (sum, item) {
                if (!item) return sum;
                var itemId = String(item.id || '').trim();
                var itemType = String(item.type || 'product').trim();
                if (itemId === idStr && itemType === 'product') {
                    return sum + (item.quantity || 1);
                }
                return sum;
            }, 0);
        }
        function updateItem(el) {
            if (!el) return;
            var baseStock = parseInt(el.getAttribute('data-stock') || '0', 10);
            var id = el.getAttribute('data-id');
            if (!id) return;
            var reserved = getReservedForProduct(id);
            var remaining = baseStock - reserved;
            if (remaining < 0) remaining = 0;
            var badge = el.querySelector('.jkhive-badge');
            var badgeText = badge && badge.querySelector('.jkhive-badge-text');
            var btn = el.querySelector('.jkhive-bttn-item');
            if (!badge || !badgeText || !btn) return;
            if (remaining > 0) {
                badge.classList.remove('jkhive-badge-red');
                badge.classList.add('jkhive-badge-green');
                badgeText.textContent = 'Stock: ' + remaining;
                btn.disabled = false;
                btn.title = 'Añadir al carrito';
                btn.setAttribute('aria-label', 'Añadir al carrito');
            } else {
                badge.classList.remove('jkhive-badge-green');
                badge.classList.add('jkhive-badge-red');
                badgeText.textContent = 'Sin stock';
                btn.disabled = true;
                btn.title = 'No hay stock';
                btn.setAttribute('aria-label', 'No hay stock');
            }
        }
        function updateAll() {
            var items = document.querySelectorAll('.jkhive-product-gallery-item[data-id][data-stock]');
            if (!items || !items.length) return;
            (items.forEach ? items : Array.prototype.slice.call(items)).forEach(updateItem);
        }
        return { updateAll: updateAll, updateItem: updateItem };
    })();
    (function () {
        try {
            var url = new URL(window.location.href);
            var path = (url.pathname || '').replace(/\\/g, '/');
            var leaf = path.split('/').pop() || '';
            var ok = leaf === 'demo-landing-advanced-gallery.php' || leaf === 'demo-landing-advanced-gallery';
            if (!ok) return;
            if (window.matchMedia('(max-width: 768px)').matches) {
                if (!url.searchParams.has('porPagina')) {
                    url.searchParams.set('porPagina', '15');
                    window.location.replace(url.toString());
                }
            } else {
                if (url.searchParams.get('porPagina') === '15') {
                    url.searchParams.delete('porPagina');
                    window.location.replace(url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
                }
            }
        } catch (e) { /* noop */ }
    })();
    document.addEventListener('DOMContentLoaded', function () {
        if (window.JKHiveCatalogStock && typeof window.JKHiveCatalogStock.updateAll === 'function') {
            window.JKHiveCatalogStock.updateAll();
        }
    });
})();
JS;

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$todos = jkfw_demo_catalog_productos();
$categorias = jkfw_demo_tipos_vehiculo();
$familias = jkfw_demo_tipos_producto();
$envases = jkfw_demo_tipos_envase();

$st = jkfw_catalog_normalize_get_params();
$st['porPagina'] = jkfw_catalog_clamp_por_pagina((int) $st['porPagina']);

$filt = jkfw_catalog_aplicar_filtros($todos, [
    'categoria' => $st['categoria'],
    'familia' => $st['familia'],
    'envase' => $st['envase'],
    'buscar' => $st['buscar'],
]);
$meta = jkfw_catalog_paginar($filt, $st['pagina'], $st['porPagina']);
$st['pagina'] = $meta['page'];

$categoriaSel = $st['categoria'];
$familiaSel = $st['familia'];
$envaseSel = $st['envase'];
$tienefiltros = $categoriaSel !== '' || $familiaSel !== '' || $envaseSel !== '';

$anchorId = 'jkfw-advanced-gallery-anchor';

$layoutShowPagination = $meta['pages'] > 1;
?>

<section class="catalog-page-intro-wrap" aria-labelledby="<?= $h($anchorId) ?>" style="margin-bottom:.75rem;">
  <h1 id="<?= $h($anchorId) ?>" class="jkhive-section-title" style="margin-top:0;"><?= $h('Catálogo de productos — demo JK Hive') ?></h1>
  <p style="color:var(--jk-metal-light);max-width:46rem;line-height:1.55;margin:0 0 .75rem;">
    <?= $h('Réplica UI del catálogo JK Lubs (snapshot en xampp…/JKHFW/data/jklubs/www/productos.php): mismos CSS (product-gallery + gallery-catalog), parámetros URL y patrón de tarjeta con stock + carrito.') ?>
  </p>
  <nav class="jkfw-landing-nav" aria-label="Secciones landing pro">
    <a href="demo-landing-advanced.php" data-tooltip="Home">Home</a>
    <a href="demo-landing-advanced-about.php" data-tooltip="About">About</a>
    <a href="demo-landing-advanced-gallery.php" data-tooltip="Galería">Galería</a>
    <a href="demo-landing-advanced-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
  </nav>
</section>

<div class="jkhive-gallery-catalog-toolbar-wrap">
  <div class="jkhive-gallery-catalog-toolbar" id="jkhive-gallery-catalog-toolbar">
    <form class="filters-container" method="get" action="demo-landing-advanced-gallery.php">
      <div class="filters-fields">
        <div class="filter-group">
          <label for="categoria"><?= $h('Tipo de vehículo') ?></label>
          <select name="categoria" id="categoria">
            <option value=""><?= $h('Todos los vehículos') ?></option>
<?php foreach ($categorias as $cat) :
    $cid = (string) (int) $cat['id'];
    ?>
            <option value="<?= $h($cid) ?>" <?= $categoriaSel !== '' && $categoriaSel === $cid ? ' selected' : '' ?>><?= $h((string) ($cat['nombre'] ?? '')) ?></option>
<?php endforeach; ?>
          </select>
        </div>
        <div class="filter-group">
          <label for="familia"><?= $h('Tipo de producto') ?></label>
          <select name="familia" id="familia">
            <option value=""><?= $h('Todos los productos') ?></option>
<?php foreach ($familias as $fam) :
    $fid = (string) (int) $fam['id'];
    ?>
            <option value="<?= $h($fid) ?>" <?= $familiaSel !== '' && $familiaSel === $fid ? ' selected' : '' ?>><?= $h((string) ($fam['nombre'] ?? '')) ?></option>
<?php endforeach; ?>
          </select>
        </div>
        <div class="filter-group">
          <label for="envase"><?= $h('Tipo de envase') ?></label>
          <select name="envase" id="envase">
            <option value=""><?= $h('Todos los envases') ?></option>
<?php foreach ($envases as $e) :
    $eid = (string) (int) $e['id'];
    ?>
            <option value="<?= $h($eid) ?>" <?= $envaseSel !== '' && $envaseSel === $eid ? ' selected' : '' ?>><?= $h((string) ($e['nombre'] ?? '')) ?></option>
<?php endforeach; ?>
          </select>
        </div>
        <div class="filter-group">
          <label for="buscar"><?= $h('Buscar') ?></label>
          <input type="search" name="buscar" id="buscar" value="<?= $h((string) $st['buscar']) ?>" autocomplete="off" placeholder="<?= $h('Nombre, marca…') ?>" style="width:100%;box-sizing:border-box;min-height:38px;background:rgba(30,41,59,.82);border:1px solid var(--jk-primary-blue);color:var(--jk-metal-light);padding:.72rem;border-radius:5px;font:inherit;font-size:.9rem;outline:none;">
        </div>
        <div class="filter-group">
          <label for="porPagina"><?= $h('Por página') ?></label>
          <select name="porPagina" id="porPagina">
<?php foreach ([6, 9, 12, 15, 18, 21, 24] as $__n) :
    ?>
            <option value="<?= (string) $__n ?>"<?= $st['porPagina'] === $__n ? ' selected' : '' ?>><?= (string) $__n ?></option>
<?php endforeach; ?>
          </select>
        </div>
      </div>
      <div class="filter-actions">
        <button type="submit" class="jkhive-bttn-sm d-inline-block" data-tooltip="<?= $h('Filtrar') ?>" title="<?= $h('Filtrar') ?>" aria-label="<?= $h('Filtrar') ?>" style="background: none; border: none; padding: 0; cursor: pointer;">
          <div class="jkhive-hex">
            <div class="jkhive-hex-content jkhive-hex-content-editorial">
              <i class="jkhive-hex-icon fas fa-filter"></i>
            </div>
          </div>
        </button>
        <?php if ($tienefiltros) : ?>
        <a href="demo-landing-advanced-gallery.php" class="jkhive-bttn-sm d-inline-block" data-tooltip="<?= $h('Limpiar filtros') ?>" title="<?= $h('Limpiar filtros') ?>" aria-label="<?= $h('Limpiar filtros') ?>">
          <div class="jkhive-hex">
            <div class="jkhive-hex-content jkhive-hex-content-editorial">
              <i class="jkhive-hex-icon fas fa-times"></i>
            </div>
          </div>
        </a>
        <?php endif; ?>
      </div>
    </form>
<?php if ($layoutShowPagination) :
    jkfw_catalog_render_pagination_jklubs('catalog-pagination-top', true, [
        'total' => $meta['total'],
        'pages' => $meta['pages'],
        'page' => $meta['page'],
        'per' => $meta['per'],
    ], $st, $h);
endif; ?>
  </div>
  <div class="jkhive-gallery-catalog-toolbar-spacer" id="jkhive-gallery-catalog-toolbar-spacer" aria-hidden="true"></div>
</div>

<div class="page-content">
<div class="jkhive-container">
  <div class="jkhive-gallery-catalog-scroll">
    <div class="jkhive-product-gallery">
<?php
jkfw_catalog_render_galeria_items_jklubs([
    'slice' => $meta['slice'],
    'total' => $meta['total'],
    'pages' => $meta['pages'],
    'page' => $meta['page'],
    'per' => $meta['per'],
], $st, $h);
?>
    </div>
  </div>
<?php if ($layoutShowPagination) :
    jkfw_catalog_render_pagination_jklubs('catalog-pagination-bottom', false, [
        'total' => $meta['total'],
        'pages' => $meta['pages'],
        'page' => $meta['page'],
        'per' => $meta['per'],
    ], $st, $h);
endif; ?>
</div>
</div>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
