/**
 * Captura global mínima (Fase 7) — genera toast no persistente salvo opts.
 * No reemplaza layout-persistent-error-toast.php del CRM (requiere PHP/BD).
 */
(function () {
  'use strict';

  var lastKey = '';
  var lastAt = 0;

  function fire(msg, state) {
    var now = Date.now();
    var key = (state || 'error') + '|' + (msg || '');
    if (key === lastKey && now - lastAt < 800) return;
    lastKey = key;
    lastAt = now;
    if (typeof window.jkHiveToast === 'function') {
      window.jkHiveToast({ type: 'A', state: state || 'error', message: msg, persistent: false, autoCloseMs: 5000 });
    }
  }

  window.addEventListener('error', function (ev) {
    var m = (ev && ev.message) ? String(ev.message) : 'Error de script';
    fire(m, 'error');
  });

  window.addEventListener('unhandledrejection', function (ev) {
    var r = ev && ev.reason;
    var m = r && r.message ? String(r.message) : (typeof r === 'string' ? r : 'Promesa rechazada');
    fire(m, 'error');
  });
})();
