<?php
declare(strict_types=1);
$jk_nav = 'users';
$jk_page_title = 'JK Hive Showcase - Usuarios';
$jk_breadcrumb = 'Gestión de usuarios';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_crud_modal = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/jkfw-showcase-crud.css">' . "\n";
require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$rows = [
    ['name' => 'Ana Pérez', 'email' => 'ana.demo@example.local', 'role' => 'Administrador', 'on' => true],
    ['name' => 'Luis Gómez', 'email' => 'luis.demo@example.local', 'role' => 'Editor', 'on' => false],
    ['name' => 'María Vega', 'email' => 'maria.demo@example.local', 'role' => 'Solo lectura', 'on' => true],
];
?>
        <h1 class="jkhive-section-title" style="margin-top:0;">Gestión de usuarios</h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;">
          Patrón de administración JK Hive: filtros con <code>select.jkhive-hex-select</code>, acciones de fila con <code>.jkhive-bttn-table-*</code>,
          estado con <code>.jkhive-bttn-table-toggle</code>, confirmación de borrado con <code>showDeleteConfirmToast</code> y pie de paginación <code>.jkhive-pagination</code> (estilos admin en <code>jkfw-showcase-shell.css</code>).
        </p>

        <div class="jkfw-admin-toolbar" style="margin-top:1.1rem;display:flex;flex-wrap:wrap;gap:0.85rem;align-items:flex-end;">
          <div class="jkfw-admin-field">
            <label class="jkfw-admin-label" for="jkfw-users-filter-role">Perfil</label>
            <select id="jkfw-users-filter-role" class="jkhive-hex-select" data-tooltip="Filtrar por perfil" aria-label="Filtrar por perfil">
              <option value="">Todos</option>
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="viewer">Solo lectura</option>
            </select>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med jkhive-btn-anim-shake" data-tooltip="Crear usuario">
            <button type="button" id="jkfw-users-create" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-user-plus"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med" data-tooltip="Abrir modal mantenedor">
            <button type="button" id="jkfw-open-mantenedor-modal" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-table"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med" data-tooltip="Abrir modal formulario">
            <button type="button" id="jkfw-open-form-modal" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-file-signature"></i></div></div>
            </button>
          </div>
          <div class="jkhive-admoptions-bttn jkhive-bttn-med" data-tooltip="Demo transición de elementos">
            <button type="button" id="jkfw-run-transition-demo" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-shuffle"></i></div></div>
            </button>
          </div>
        </div>

        <div class="jkfw-table-wrap">
          <table class="jkhive-table jkfw-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
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
                  <div class="jkhive-bttn-table jkhive-bttn-table-toggle <?= $toggleClass ?>" data-tooltip="<?= $on ? 'Desactivar cuenta (demo)' : 'Activar cuenta (demo)' ?>" data-toggle-label="<?= $h($r['name']) ?>">
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
                <td><?= $h($r['email']) ?></td>
                <td><?= $h($r['role']) ?></td>
                <td class="jkfw-td-actions">
                  <div class="jkfw-actions-row">
                    <div class="jkhive-bttn-table jkhive-bttn-table-edit" data-tooltip="Editar">
                      <button type="button" class="jkhive-bttn-inner" data-jkfw-edit="users" data-name="<?= $h($r['name']) ?>" data-meta="<?= $h($r['email']) ?>">
                        <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-pen"></i></div></div>
                      </button>
                    </div>
                    <div class="jkhive-bttn-table jkhive-bttn-table-delete" data-tooltip="Eliminar">
                      <button type="button" class="jkhive-bttn-inner" data-jkfw-delete="users">
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

        <div class="jkhive-pagination" data-jkfw-pagination data-pages="4" data-page-size="3" data-total="12" role="navigation" aria-label="Paginación">
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
        <div style="margin-top:1rem;">
          <div id="jkfw-transition-demo-stage" class="jkhive-transition-stage" style="width:320px;height:180px;border:1px solid rgba(14,165,233,0.4);margin:0 auto;border-radius:8px;background:#020617;">
            <div id="jkfw-slide-a" class="jkhive-transition-slide" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#e2e8f0;">A - mantenedor</div>
            <div id="jkfw-slide-b" class="jkhive-transition-slide jkhive-transition-in-from-right" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#e2e8f0;">B - formulario</div>
          </div>
        </div>

  <div id="jkfw-users-mantenedor-modal" class="jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" data-jkfw-close-mantenedor></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-tipos" style="max-width:90%;width:640px;height:85vh;max-height:700px;">
      <div class="jkhive-modal-header">
        <div class="jkhive-modal-header-top"><span class="jkhive-modal-icon tipos-modal-header-icon"><i class="fas fa-users"></i></span></div>
        <div class="jkhive-modal-header-bottom"><h2 class="jkhive-modal-title">Mantenedor de usuarios</h2></div>
        <button type="button" class="jkhive-modal-close" data-jkfw-close-mantenedor aria-label="Cerrar">&times;</button>
      </div>
      <div class="jkhive-modal-body">
        <div class="tipos-modal-body-top">
          <div class="tipos-modal-toolbar-line">
            <div class="tipos-modal-search-wrap">
              <label for="jkfw-modal-search-user" class="tipos-modal-search-label">Buscar</label>
              <input type="text" id="jkfw-modal-search-user" class="tipos-modal-search-input" placeholder="Por nombre">
            </div>
            <div class="jkhive-bttn-med jkhive-bttn-modal-add jkhive-btn-anim-coindouble" data-tooltip="Agregar nuevo">
              <button type="button" data-jkfw-open-form-from-mantenedor>
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-plus"></i></div></div>
              </button>
            </div>
          </div>
        </div>
        <div class="jkhive-modal-body-content">
          <div class="tipos-table-header-row">
            <table class="jkhive-table admin-tipos-table" role="presentation"><thead><tr><th>ID</th><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead></table>
          </div>
          <div class="tipos-table-body-scroll">
            <table class="jkhive-table admin-tipos-table">
              <tbody>
                <tr>
                  <td>U-001</td><td>Ana Pérez</td>
                  <td class="jkhive-td-estado">
                    <div class="jkhive-bttn-table jkhive-bttn-table-toggle jkhive-toggle-on" data-tooltip="Cambiar estado">
                      <button type="button" class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><span class="jkhive-toggle-text">ON</span></div></div></button>
                    </div>
                  </td>
                  <td class="jkhive-td-actions"><div class="jkhive-bttn-table jkhive-bttn-table-delete" data-tooltip="Eliminar"><button type="button" class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-trash"></i></div></div></button></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb tipos-modal-footer-honeycomb tipos-modal-footer-solo-salir">
          <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock jkhive-btn-cart-exit" data-tooltip="Salir">
            <button type="button" data-jkfw-close-mantenedor><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-times"></i></div></div></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="jkfw-users-form-modal" class="jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" data-jkfw-close-form></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin">
      <div class="jkhive-modal-header">
        <button type="button" class="jkhive-modal-close" data-jkfw-close-form aria-label="Cerrar">&times;</button>
        <div class="jkhive-modal-header-top"><span class="jkhive-modal-icon"><i class="fas fa-user-edit"></i></span></div>
        <div class="jkhive-modal-header-bottom"><h2 class="jkhive-modal-title">Formulario usuario</h2></div>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content">
          <div class="jkhive-modal-form-grid">
            <div class="jkhive-modal-form-row"><div class="jkhive-modal-form-field"><label class="jkhive-modal-form-label">Nombre</label><input class="jkhive-modal-form-control" type="text" placeholder="Nombre completo"></div></div>
            <div class="jkhive-modal-form-row"><div class="jkhive-modal-form-field"><label class="jkhive-modal-form-label">Rol</label><select class="jkhive-modal-form-control jkhive-hex-select"><option>Administrador</option><option>Editor</option></select></div></div>
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
            <div class="jkhive-bttn-med jkhive-btn-cart-exit" data-tooltip="Salir"><button type="button" data-jkfw-close-form><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-door-open"></i></div></div></button></div>
          </div>
        </div>
      </div>
    </div>
  </div>

<script>
document.addEventListener('DOMContentLoaded', function(){
  var mm = document.getElementById('jkfw-users-mantenedor-modal');
  var fm = document.getElementById('jkfw-users-form-modal');
  function open(m){ if(!m)return; m.classList.add('active','show'); m.style.display='flex'; m.setAttribute('aria-hidden','false'); if(window.JKHiveTooltipAttach){ window.JKHiveTooltipAttach(m); } }
  function close(m){ if(!m)return; m.classList.remove('active','show'); m.style.display='none'; m.setAttribute('aria-hidden','true'); }
  document.getElementById('jkfw-open-mantenedor-modal')?.addEventListener('click', function(){ open(mm); });
  document.getElementById('jkfw-open-form-modal')?.addEventListener('click', function(){ open(fm); });
  document.querySelectorAll('[data-jkfw-open-form-from-mantenedor]').forEach(function(b){ b.addEventListener('click', function(){ close(mm); open(fm); }); });
  document.querySelectorAll('[data-jkfw-close-mantenedor]').forEach(function(b){ b.addEventListener('click', function(){ close(mm); }); });
  document.querySelectorAll('[data-jkfw-close-form]').forEach(function(b){ b.addEventListener('click', function(){ close(fm); }); });

  var stageBtn = document.getElementById('jkfw-run-transition-demo');
  var a = document.getElementById('jkfw-slide-a');
  var b = document.getElementById('jkfw-slide-b');
  if(stageBtn && a && b){
    var flip=false;
    stageBtn.addEventListener('click', function(){
      flip=!flip;
      if(flip){
        a.classList.remove('jkhive-transition-in-from-left');
        a.classList.add('jkhive-transition-out-left');
        b.classList.remove('jkhive-transition-out-right');
        b.classList.add('jkhive-transition-in-from-right');
      } else {
        b.classList.remove('jkhive-transition-in-from-right');
        b.classList.add('jkhive-transition-out-right');
        a.classList.remove('jkhive-transition-out-left');
        a.classList.add('jkhive-transition-in-from-left');
      }
    });
  }
});
</script>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
