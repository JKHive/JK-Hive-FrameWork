/**
 * CRUD UI demo (Fase 14) — modales + showToastInModal + showDeleteConfirmToast.
 * Requiere: jkhive-toasts.js, tooltip.js, modal #jkfw-crud-modal.
 */
(function () {
  'use strict';

  function qs(id) {
    return document.getElementById(id);
  }

  function openCrudModal(entity, mode, data) {
    var modal = qs('jkfw-crud-modal');
    if (!modal) return;
    data = data || {};
    var title = qs('jkfw-crud-modal-title');
    var fName = qs('jkfw-crud-field-name');
    var fMeta = qs('jkfw-crud-field-meta');
    var metaLabel = qs('jkfw-crud-meta-label');
    var hEnt = qs('jkfw-crud-entity');
    var hMode = qs('jkfw-crud-mode');
    if (hEnt) hEnt.value = entity;
    if (hMode) hMode.value = mode;

    if (entity === 'users') {
      if (metaLabel) metaLabel.textContent = 'Correo';
      if (title) title.textContent = mode === 'create' ? 'Crear usuario' : 'Editar usuario';
    } else {
      if (metaLabel) metaLabel.textContent = 'SKU';
      if (title) title.textContent = mode === 'create' ? 'Crear producto' : 'Editar producto';
    }

    if (fName) fName.value = data.name || '';
    if (fMeta) fMeta.value = data.meta || '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    if (typeof window.JKHiveTooltipAttach === 'function') {
      window.JKHiveTooltipAttach(modal);
    }
  }

  function closeCrudModal() {
    var modal = qs('jkfw-crud-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var modal = qs('jkfw-crud-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-close-crud]').forEach(function (el) {
      el.addEventListener('click', closeCrudModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeCrudModal();
    });

    var saveBtn = qs('jkfw-crud-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var body = modal.querySelector('.jkhive-modal-body');
        var hEnt = qs('jkfw-crud-entity');
        var hMode = qs('jkfw-crud-mode');
        var ent = hEnt ? hEnt.value : 'users';
        var mode = hMode ? hMode.value : 'create';
        var suffix = mode === 'create' ? 'creado' : 'actualizado';
        var label = ent === 'users' ? 'Usuario ' : 'Producto ';
        if (typeof window.showToastInModal === 'function' && body) {
          window.showToastInModal(label + suffix + ' (demo).', 'success', { container: body, autoCloseMs: 2200 });
        } else if (typeof window.showToastBar === 'function') {
          window.showToastBar(label + suffix + ' (demo).', 'success', { autoCloseMs: 2500 });
        }
        window.setTimeout(closeCrudModal, 450);
      });
    }

    function bindOpens(prefix, entity) {
      var cre = qs(prefix + '-create');
      if (cre) {
        cre.addEventListener('click', function () {
          openCrudModal(entity, 'create', {});
        });
      }
      document.querySelectorAll('[data-jkfw-edit="' + entity + '"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          openCrudModal(entity, 'edit', {
            name: btn.getAttribute('data-name') || '',
            meta: btn.getAttribute('data-meta') || '',
          });
        });
      });
      document.querySelectorAll('[data-jkfw-delete="' + entity + '"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (typeof window.showDeleteConfirmToast !== 'function') return;
          window.showDeleteConfirmToast({
            anchorEl: btn,
            onConfirm: function () {
              if (typeof window.showToastBar === 'function') {
                window.showToastBar('Registro eliminado (demo).', 'success', { autoCloseMs: 3500 });
              }
            },
          });
        });
      });
    }

    bindOpens('jkfw-users', 'users');
    bindOpens('jkfw-products', 'products');
  });
})();
