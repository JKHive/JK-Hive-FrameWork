<?php
declare(strict_types=1);
$jk_nav = 'products';
$jk_page_title = 'JK Hive Showcase - Productos';
$jk_breadcrumb = 'Gestión de productos';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_crud_modal = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-showcase-crud.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/crm.css">' . "\n";
require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$rows = [
    ['name' => 'Lubricante demo A', 'sku' => 'SKU-001', 'cat' => 'Lubricantes', 'brand' => 'JK Lubs', 'model' => 'X200', 'on' => true],
    ['name' => 'Filtro sintético X', 'sku' => 'SKU-014', 'cat' => 'Filtros', 'brand' => 'FilterMax', 'model' => 'FM-14', 'on' => false],
    ['name' => 'Grasa industrial Pro', 'sku' => 'SKU-220', 'cat' => 'Grasas', 'brand' => 'JK Lubs', 'model' => 'GP-220', 'on' => true],
];
?>
        <h1 class="jkhive-section-title" style="margin-top:0;">Gestión de productos</h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;">
          Mismo patrón de administración JK Hive: categorías, marcas y modelos con mantenedor + formulario modal, toggles ON/OFF, acciones hex y paginación unificada.
        </p>

        <div class="jkfw-admin-toolbar" style="margin-top:1.1rem;display:flex;flex-wrap:wrap;gap:0.85rem;align-items:flex-end;">
          <div class="jkfw-admin-field">
            <label class="jkfw-admin-label" for="jkfw-products-filter-cat">Familia</label>
            <select id="jkfw-products-filter-cat" class="jkhive-hex-select" data-tooltip="Filtrar familia" aria-label="Filtrar familia">
              <option value="">Todas</option>
              <option value="lub">Lubricantes</option>
              <option value="filt">Filtros</option>
              <option value="gras">Grasas</option>
            </select>
          </div>
          <div class="jkfw-admin-field">
            <label class="jkfw-admin-label" for="jkfw-products-filter-brand">Marca</label>
            <select id="jkfw-products-filter-brand" class="jkhive-hex-select" data-tooltip="Filtrar marca" aria-label="Filtrar marca">
              <option value="">Todas</option>
              <option value="jklubs">JK Lubs</option>
              <option value="filtermax">FilterMax</option>
            </select>
          </div>
          <div class="jkfw-admin-field">
            <label class="jkfw-admin-label" for="jkfw-products-filter-model">Modelo</label>
            <select id="jkfw-products-filter-model" class="jkhive-hex-select" data-tooltip="Filtrar modelo" aria-label="Filtrar modelo">
              <option value="">Todos</option>
              <option value="x200">X200</option>
              <option value="fm14">FM-14</option>
              <option value="gp220">GP-220</option>
            </select>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med jkhive-btn-anim-shake" data-tooltip="Crear producto">
            <button type="button" id="jkfw-products-create" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-plus"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med" data-tooltip="Abrir modal mantenedor">
            <button type="button" id="jkfw-open-products-mantenedor-modal" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-table-list"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med" data-tooltip="Abrir modal formulario">
            <button type="button" id="jkfw-open-products-form-modal" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-file-circle-plus"></i></div></div>
            </button>
          </div>
        </div>

        <div class="jkfw-table-wrap">
          <table class="jkhive-table jkfw-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Producto</th>
                <th>SKU</th>
                <th>Familia</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th class="jkfw-td-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
<?php foreach ($rows as $r) :
    $on = ! empty($r['on']);
    $toggleClass = $on ? 'jkhive-toggle-on' : 'jkhive-toggle-off';
    $togText = $on ? 'ON' : 'OFF';
    ?>
              <tr>
                <td class="jkhive-td-estado">
                  <div class="jkhive-bttn-table jkhive-bttn-table-toggle <?= $toggleClass ?>" data-tooltip="<?= $on ? 'Ocultar del catálogo (demo)' : 'Publicar en catálogo (demo)' ?>" data-toggle-label="<?= $h($r['name']) ?>">
                    <button type="button" class="jkhive-bttn-inner">
                      <div class="jkhive-hex">
                        <div class="jkhive-hex-content">
                          <span class="jkhive-toggle-text"><?= $h($togText) ?></span>
                        </div>
                      </div>
                    </button>
                  </div>
                </td>
                <td><?= $h($r['name']) ?></td>
                <td><?= $h($r['sku']) ?></td>
                <td><?= $h($r['cat']) ?></td>
                <td><?= $h($r['brand']) ?></td>
                <td><?= $h($r['model']) ?></td>
                <td class="jkfw-td-actions">
                  <div class="jkfw-actions-row">
                    <div class="jkhive-bttn-table jkhive-bttn-table-edit" data-tooltip="Editar">
                      <button type="button" class="jkhive-bttn-inner" data-jkfw-edit="products" data-name="<?= $h($r['name']) ?>" data-meta="<?= $h($r['sku']) ?>">
                        <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-pen"></i></div></div>
                      </button>
                    </div>
                    <div class="jkhive-bttn-table jkhive-bttn-table-delete" data-tooltip="Eliminar">
                      <button type="button" class="jkhive-bttn-inner" data-jkfw-delete="products">
                        <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-trash"></i></div></div>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
<?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <div class="jkhive-pagination" data-jkfw-pagination data-pages="6" data-page-size="3" data-total="34" role="navigation" aria-label="Paginación">
          <div class="jkhive-pagination-meta"></div>
          <div class="jkhive-pagination-actions">
            <div class="jkhive-admoptions-bttn jkhive-bttn-med jkhive-btn-anim-coinleft" data-tooltip="Página anterior">
              <button type="button" class="jkhive-bttn-inner" data-jkfw-page-prev>
                <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-chevron-left"></i></div></div>
              </button>
            </div>
            <div class="jkhive-admoptions-bttn jkhive-bttn-med jkhive-btn-anim-coinright" data-tooltip="Página siguiente">
              <button type="button" class="jkhive-bttn-inner" data-jkfw-page-next>
                <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-chevron-right"></i></div></div>
              </button>
            </div>
          </div>
        </div>

  <div id="jkfw-products-mantenedor-modal" class="jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" data-jkfw-close-products-mantenedor></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-tipos" style="max-width:90%;width:760px;height:85vh;max-height:700px;">
      <div class="jkhive-modal-header">
        <div class="jkhive-modal-header-top"><span class="jkhive-modal-icon tipos-modal-header-icon"><i class="fas fa-boxes-stacked"></i></span></div>
        <div class="jkhive-modal-header-bottom"><h2 class="jkhive-modal-title">Mantenedor catálogo</h2></div>
        <button type="button" class="jkhive-modal-close" data-jkfw-close-products-mantenedor aria-label="Cerrar">&times;</button>
      </div>
      <div class="jkhive-modal-body">
        <div class="tipos-modal-body-top">
          <div class="tipos-modal-toolbar-line">
            <div class="tipos-modal-search-wrap">
              <label for="jkfw-modal-search-product" class="tipos-modal-search-label">Buscar</label>
              <input type="text" id="jkfw-modal-search-product" class="tipos-modal-search-input" placeholder="Producto, marca o modelo">
            </div>
            <div class="jkhive-bttn-med jkhive-bttn-modal-add jkhive-btn-anim-coindouble" data-tooltip="Agregar nuevo">
              <button type="button" data-jkfw-open-form-from-products-mantenedor>
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-plus"></i></div></div>
              </button>
            </div>
          </div>
        </div>
        <div class="jkhive-modal-body-content">
          <div class="tipos-table-header-row">
            <table class="jkhive-table admin-tipos-table" role="presentation"><thead><tr><th>ID</th><th>Categoría</th><th>Marca</th><th>Modelo</th><th>Estado</th><th>Acciones</th></tr></thead></table>
          </div>
          <div class="tipos-table-body-scroll">
            <table class="jkhive-table admin-tipos-table">
              <tbody>
                <tr>
                  <td>P-001</td><td>Lubricantes</td><td>JK Lubs</td><td>X200</td>
                  <td class="jkhive-td-estado">
                    <div class="jkhive-bttn-table jkhive-bttn-table-toggle jkhive-toggle-on" data-tooltip="Cambiar estado">
                      <button type="button" class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><span class="jkhive-toggle-text">ON</span></div></div></button>
                    </div>
                  </td>
                  <td class="jkhive-td-actions">
                    <div class="jkfw-actions-row">
                      <div class="jkhive-bttn-table jkhive-bttn-table-edit" data-tooltip="Editar"><button type="button" class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-pen"></i></div></div></button></div>
                      <div class="jkhive-bttn-table jkhive-bttn-table-delete" data-tooltip="Eliminar"><button type="button" class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-trash"></i></div></div></button></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb tipos-modal-footer-honeycomb tipos-modal-footer-solo-salir">
          <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock jkhive-btn-cart-exit" data-tooltip="Salir">
            <button type="button" data-jkfw-close-products-mantenedor><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-times"></i></div></div></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="jkfw-products-form-modal" class="jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" data-jkfw-close-products-form></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin">
      <div class="jkhive-modal-header">
        <button type="button" class="jkhive-modal-close" data-jkfw-close-products-form aria-label="Cerrar">&times;</button>
        <div class="jkhive-modal-header-top"><span class="jkhive-modal-icon"><i class="fas fa-box-open"></i></span></div>
        <div class="jkhive-modal-header-bottom"><h2 class="jkhive-modal-title">Formulario producto</h2></div>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content">
          <div class="jkhive-modal-form-grid">
            <div class="jkhive-modal-form-row"><div class="jkhive-modal-form-field"><label class="jkhive-modal-form-label">Nombre</label><input class="jkhive-modal-form-control" type="text" placeholder="Nombre producto"></div></div>
            <div class="jkhive-modal-form-row"><div class="jkhive-modal-form-field"><label class="jkhive-modal-form-label">Categoría</label><select class="jkhive-modal-form-control jkhive-hex-select"><option>Lubricantes</option><option>Filtros</option><option>Grasas</option></select></div></div>
            <div class="jkhive-modal-form-row"><div class="jkhive-modal-form-field"><label class="jkhive-modal-form-label">Marca</label><select class="jkhive-modal-form-control jkhive-hex-select"><option>JK Lubs</option><option>FilterMax</option></select></div></div>
            <div class="jkhive-modal-form-row"><div class="jkhive-modal-form-field"><label class="jkhive-modal-form-label">Modelo</label><input class="jkhive-modal-form-control" type="text" placeholder="Modelo"></div></div>
          </div>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb">
          <div class="jkhive-modal-admin-footer-row1">
            <div class="jkhive-bttn-med" data-tooltip="Limpiar"><button type="button"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-eraser"></i></div></div></button></div>
            <div class="jkhive-bttn-med" data-tooltip="Guardar"><button type="button"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-save"></i></div></div></button></div>
          </div>
          <div class="jkhive-modal-admin-footer-row2">
            <div class="jkhive-bttn-med jkhive-btn-cart-exit" data-tooltip="Salir"><button type="button" data-jkfw-close-products-form><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-door-open"></i></div></div></button></div>
          </div>
        </div>
      </div>
    </div>
  </div>

<script>
document.addEventListener('DOMContentLoaded', function () {
  var mm = document.getElementById('jkfw-products-mantenedor-modal');
  var fm = document.getElementById('jkfw-products-form-modal');
  function open(m){ if(!m)return; m.classList.add('active','show'); m.style.display='flex'; m.setAttribute('aria-hidden','false'); if(window.JKHiveTooltipAttach){ window.JKHiveTooltipAttach(m); } }
  function close(m){ if(!m)return; m.classList.remove('active','show'); m.style.display='none'; m.setAttribute('aria-hidden','true'); }
  document.getElementById('jkfw-open-products-mantenedor-modal')?.addEventListener('click', function(){ open(mm); });
  document.getElementById('jkfw-open-products-form-modal')?.addEventListener('click', function(){ open(fm); });
  document.getElementById('jkfw-products-create')?.addEventListener('click', function(){ open(fm); });
  document.querySelectorAll('[data-jkfw-open-form-from-products-mantenedor]').forEach(function(b){ b.addEventListener('click', function(){ close(mm); open(fm); }); });
  document.querySelectorAll('[data-jkfw-close-products-mantenedor]').forEach(function(b){ b.addEventListener('click', function(){ close(mm); }); });
  document.querySelectorAll('[data-jkfw-close-products-form]').forEach(function(b){ b.addEventListener('click', function(){ close(fm); }); });
});
</script>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
