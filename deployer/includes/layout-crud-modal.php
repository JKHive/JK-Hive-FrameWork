<?php declare(strict_types=1); ?>
  <div id="jkfw-crud-modal" class="jkhive-message-modal jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" data-close-crud></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin" role="dialog" aria-modal="true" aria-labelledby="jkfw-crud-modal-title">
      <div class="jkhive-modal-header">
        <button type="button" class="jkhive-modal-close" data-close-crud aria-label="Cerrar">&times;</button>
        <div class="jkhive-modal-header-top"></div>
        <div class="jkhive-modal-header-bottom">
          <h2 class="jkhive-modal-title" id="jkfw-crud-modal-title">Crear</h2>
        </div>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content">
          <input type="hidden" id="jkfw-crud-entity" value="users" />
          <input type="hidden" id="jkfw-crud-mode" value="create" />
          <div class="jkhive-modal-form-grid">
            <div class="jkhive-modal-form-row">
              <div class="jkhive-modal-form-field">
                <label class="jkhive-modal-form-label" for="jkfw-crud-field-name">Nombre</label>
                <input type="text" id="jkfw-crud-field-name" class="jkhive-modal-form-control" autocomplete="off" />
              </div>
            </div>
            <div class="jkhive-modal-form-row">
              <div class="jkhive-modal-form-field">
                <label class="jkhive-modal-form-label" for="jkfw-crud-field-meta" id="jkfw-crud-meta-label">Detalle</label>
                <input type="text" id="jkfw-crud-field-meta" class="jkhive-modal-form-control" autocomplete="off" />
              </div>
            </div>
            <div class="jkhive-modal-form-row jkfw-modal-form-row-toggle">
              <span class="jkhive-modal-form-label">Visible</span>
              <div class="jkhive-bttn-table jkhive-bttn-table-toggle jkhive-toggle-on jkhive-modal-toggle-demo" data-tooltip="Estado en formulario admin (demo)" data-toggle-label="Visibilidad">
                <button type="button" class="jkhive-bttn-inner">
                  <div class="jkhive-hex">
                    <div class="jkhive-hex-content">
                      <span class="jkhive-toggle-text">ON</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="jkhive-modal-form-row">
              <div class="jkhive-modal-form-field">
                <label class="jkhive-modal-form-label" for="jkfw-crud-select-role">Perfil</label>
                <select id="jkfw-crud-select-role" name="jkfw_crud_role" class="jkhive-hex-select jkhive-modal-form-control" data-tooltip="Seleccionar perfil" aria-label="Seleccionar perfil">
                  <option value="">Seleccionar…</option>
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Solo lectura</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb">
          <div class="jkhive-modal-admin-footer-row1" style="gap:6px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;">
            <div class="jkhive-bttn-med" data-tooltip="Cancelar">
              <button type="button" data-close-crud aria-label="Cancelar">
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-times"></i></div></div>
              </button>
            </div>
            <div class="jkhive-bttn-med" data-tooltip="Guardar (demo)" id="jkfw-crud-save-wrap">
              <button type="button" id="jkfw-crud-save" aria-label="Guardar">
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-check"></i></div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
