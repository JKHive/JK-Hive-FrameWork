/**
 * API unificada (Fase 7) sobre jkhive-toasts.js ya cargado.
 * toast / jkHiveToast({ type: 'A'|'B', state, persistent, message, detail?, anchorEl?, autoCloseMs? })
 * - state: success | error | warning | info | neutral (neutral -> info)
 * - persistent: boolean (usa showPersistentErrorToast, no confundir con tipo A/B)
 */
(function () {
  'use strict';

  function mapState(state) {
    if (!state || state === 'neutral') return 'info';
    if (state === 'success' || state === 'error' || state === 'warning' || state === 'info') return state;
    return 'info';
  }

  function implToast(opts) {
    opts = opts || {};
    var type = (opts.type || 'A').toString().toUpperCase();
    var state = mapState(opts.state);
    var persistent = !!opts.persistent;
    var message = opts.message != null ? String(opts.message) : '';
    var detail = opts.detail != null ? String(opts.detail) : message;

    if (persistent) {
      if (typeof window.showPersistentErrorToast === 'function') {
        window.showPersistentErrorToast(message || 'Error.', detail || message || 'Error.');
      }
      return;
    }

    if (type === 'B') {
      var anchor = opts.anchorEl;
      if (typeof window.showToastInline === 'function' && anchor && anchor.nodeType === 1) {
        window.showToastInline({
          message: message,
          type: state,
          anchorEl: anchor,
          autoCloseMs: opts.autoCloseMs !== undefined ? opts.autoCloseMs : 2800,
        });
        return;
      }
      type = 'A';
    }

    var autoCloseMs = opts.autoCloseMs !== undefined ? opts.autoCloseMs : 3500;

    /* showToastBar(message, type, options) donde type es tipo visual success|info|… */
    if (typeof window.showToastBar === 'function') {
      window.showToastBar(message, state, { autoCloseMs: autoCloseMs });
      return;
    }

    console.warn('[jkHiveToast] jkhive-toasts.js no cargado');
  }

  /** @deprecated usar jkHiveToast */
  window.jkHiveToast = implToast;

  window.toast = function (opts) {
    implToast(opts);
  };
})();
