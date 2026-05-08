(function () {
  'use strict';

  var STORAGE = 'jkfw_showcase_demo_auth';
  var DEMO_USER = 'Visita Web';
  var DEMO_PASS = '123456';

  function qs(id) {
    return document.getElementById(id);
  }

  function readAuth() {
    try {
      var raw = sessionStorage.getItem(STORAGE);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (o && o.name) return o;
    } catch (e) {}
    return null;
  }

  function saveAuth(name) {
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify({ name: String(name), ts: Date.now() }));
    } catch (e) {}
  }

  function clearAuth() {
    try {
      sessionStorage.removeItem(STORAGE);
    } catch (e) {}
  }

  function modalOpen() {
    var m = qs('jkfw-demo-login-modal');
    if (!m) return;
    m.classList.add('active', 'show');
    m.setAttribute('aria-hidden', 'false');
    qs('jkfw-demo-login-open') &&
      qs('jkfw-demo-login-open').setAttribute('aria-expanded', 'true');
  }

  function modalClose() {
    var m = qs('jkfw-demo-login-modal');
    if (!m) return;
    m.classList.remove('active', 'show');
    m.setAttribute('aria-hidden', 'true');
    qs('jkfw-demo-login-open') &&
      qs('jkfw-demo-login-open').setAttribute('aria-expanded', 'false');
  }

  function applyUi() {
    var auth = readAuth();
    var loggedWrap = qs('jkfw-demo-logged-wrap');
    var loginWrap = qs('jkfw-demo-login-wrap');
    var nameEl = qs('jkfw-demo-display-name');
    if (!loggedWrap || !loginWrap) return;
    if (auth && auth.name) {
      loggedWrap.style.display = 'inline-flex';
      loginWrap.style.display = 'none';
      if (nameEl) nameEl.textContent = auth.name;
    } else {
      loggedWrap.style.display = 'none';
      loginWrap.style.display = 'inline-flex';
    }
  }

  function greet(name) {
    var msg = 'Hola, ' + name + '. Sesión demostración activa (sin conexión a servidor).';
    if (typeof window.toast === 'function') {
      window.toast({ type: 'A', state: 'success', message: msg, autoCloseMs: 4200 });
    } else if (typeof window.showToastBar === 'function') {
      window.showToastBar(msg, 'success', { autoCloseMs: 4200 });
    }
  }

  function onSubmit(ev) {
    ev.preventDefault();
    var u = (qs('jkfw-demo-user') && qs('jkfw-demo-user').value) || '';
    var p = (qs('jkfw-demo-pass') && qs('jkfw-demo-pass').value) || '';
    if (u.trim() !== DEMO_USER || p !== DEMO_PASS) {
      if (typeof window.toast === 'function') {
        window.toast({
          type: 'A',
          state: 'warning',
          message: 'Usa el usuario y contraseña de demostración indicados en el modal.',
          autoCloseMs: 4000,
        });
      }
      return;
    }
    saveAuth(DEMO_USER);
    applyUi();
    modalClose();
    greet(DEMO_USER);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyUi();

    var openBtn = qs('jkfw-demo-login-open');
    if (openBtn) openBtn.addEventListener('click', modalOpen);

    ['jkfw-demo-login-close', 'jkfw-demo-login-close-foot', 'jkfw-demo-cancel'].forEach(function (id) {
      var el = qs(id);
      if (el) el.addEventListener('click', modalClose);
    });

    var ov = qs('jkfw-demo-login-overlay');
    if (ov) ov.addEventListener('click', modalClose);

    var form = qs('jkfw-demo-login-form');
    if (form) form.addEventListener('submit', onSubmit);

    var out = qs('jkfw-demo-logout-btn');
    if (out) {
      out.addEventListener('click', function () {
        clearAuth();
        applyUi();
        if (typeof window.toast === 'function') {
          window.toast({ type: 'A', state: 'info', message: 'Sesión demo cerrada.', autoCloseMs: 2800 });
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') modalClose();
    });
  });
})();
