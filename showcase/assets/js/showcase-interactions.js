/**
 * Showcase: demos toast/modal/error (tooltip JK Hive solo data-tooltip).
 * Orden en layout-scripts: después de jk-hive-toast-api y error-handler.
 */
(function () {
  'use strict';

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function openModal() {
    var m = qs('#showcase-demo-modal');
    if (!m) return;
    m.classList.add('active');
    m.setAttribute('aria-hidden', 'false');
    if (typeof window.JKHiveTooltipAttach === 'function') {
      window.JKHiveTooltipAttach(m);
    }
  }

  function closeModal() {
    var m = qs('#showcase-demo-modal');
    if (!m) return;
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toastBtn = qs('#showcase-btn-toast');
    if (toastBtn && typeof window.showToastBar === 'function') {
      toastBtn.addEventListener('click', function () {
        window.showToastBar('Toast tipo A — demo del framework.', 'success', { autoCloseMs: 4000 });
      });
    }

    var toastUnified = qs('#showcase-btn-toast-unified');
    if (toastUnified && typeof window.jkHiveToast === 'function') {
      toastUnified.addEventListener('click', function () {
        window.jkHiveToast({
          type: 'A',
          state: 'success',
          persistent: false,
          message: 'jkHiveToast / toast() — tipo A (barra).',
          autoCloseMs: 4000,
        });
      });
    }

    var inlineBtn = qs('#showcase-btn-inline');
    if (inlineBtn && typeof window.showToastInline === 'function') {
      inlineBtn.addEventListener('click', function () {
        window.showToastInline({
          message: 'Validación demo (tipo B).',
          type: 'info',
          anchorEl: inlineBtn,
          autoCloseMs: 2800,
        });
      });
    }

    var inlineUnified = qs('#showcase-btn-inline-unified');
    if (inlineUnified && typeof window.jkHiveToast === 'function') {
      inlineUnified.addEventListener('click', function () {
        window.jkHiveToast({
          type: 'B',
          state: 'neutral',
          persistent: false,
          message: 'Tipo B vía API unificada (neutral→info).',
          anchorEl: inlineUnified,
          autoCloseMs: 2800,
        });
      });
    }

    var persistBtn = qs('#showcase-btn-persistent');
    if (persistBtn && typeof window.jkHiveToast === 'function') {
      persistBtn.addEventListener('click', function () {
        window.jkHiveToast({
          type: 'A',
          state: 'error',
          persistent: true,
          message: 'Error de sistema (demo — sin BD).',
          detail: 'Detalle técnico demo: PHP showcase / XAMPP. En producción ver doc 22 (ticket + soporte).\nUA: ' + navigator.userAgent,
        });
      });
    }

    var errBtn = qs('#showcase-btn-throw');
    if (errBtn) {
      errBtn.addEventListener('click', function () {
        window.setTimeout(function () {
          throw new Error('Error lanzado a propósito (demo error-handler).');
        }, 0);
      });
    }

    var openBtn = qs('#showcase-btn-open-modal');
    if (openBtn) openBtn.addEventListener('click', openModal);

    var modal = qs('#showcase-demo-modal');
    if (modal) {
      modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
        el.addEventListener('click', closeModal);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var demo = qs('#showcase-demo-modal');
      if (demo && demo.classList.contains('active')) closeModal();
    });

    var innerToast = qs('#showcase-modal-inner-toast');
    if (innerToast && typeof window.showToastInModal === 'function') {
      innerToast.addEventListener('click', function () {
        window.showToastInModal('Acción dentro del modal.', 'success', { fromElement: innerToast, autoCloseMs: 3500 });
      });
    }
  });
})();
