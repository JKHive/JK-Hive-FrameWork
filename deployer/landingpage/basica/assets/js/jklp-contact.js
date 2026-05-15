/**
 * Formulario contacto landing básica (demo sin envío real).
 */
(function () {
  'use strict';

  function isNonEmptyTrimmed(s) {
    return typeof s === 'string' && s.trim().length > 0;
  }

  function isValidEmail(s) {
    if (!isNonEmptyTrimmed(s)) return false;
    var t = s.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
  }

  function getSuccessToastBarTopPx() {
    var hero = document.querySelector('.jkfw-landing-basic-hero');
    if (!hero) return null;
    var r = hero.getBoundingClientRect();
    var gap = 8;
    if (r.bottom <= 0) return null;
    if (r.top >= window.innerHeight) return null;
    return Math.ceil(r.bottom) + gap;
  }

  var form = document.getElementById('jkfwSimpleContactForm');
  if (!form) return;
  var result = document.getElementById('jkfwSimpleContactResult');
  var elName = document.getElementById('jkfwContactName');
  var elEmail = document.getElementById('jkfwContactEmail');
  var elMessage = document.getElementById('jkfwContactMessage');
  var submitBtn = form.querySelector('.jkfw-contact-form-submit');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.classList.remove('was-validated');

    var nameRaw = elName ? elName.value : '';
    var emailRaw = elEmail ? elEmail.value : '';
    var messageRaw = elMessage ? elMessage.value : '';

    var focusAfterToast = null;
    var toastMsg = '';

    if (!isNonEmptyTrimmed(nameRaw)) {
      toastMsg = 'Falta el nombre.';
      focusAfterToast = elName;
    } else if (!isNonEmptyTrimmed(emailRaw)) {
      toastMsg = 'Falta el correo electrónico.';
      focusAfterToast = elEmail;
    } else if (!isValidEmail(emailRaw)) {
      toastMsg = 'Introduce un correo electrónico válido.';
      focusAfterToast = elEmail;
    } else if (!isNonEmptyTrimmed(messageRaw)) {
      toastMsg = 'Escribe el mensaje.';
      focusAfterToast = elMessage;
    }

    if (toastMsg) {
      if (typeof showToastInline === 'function' && submitBtn) {
        showToastInline({
          message: toastMsg,
          type: 'error',
          anchorEl: submitBtn,
          autoCloseMs: 2800,
          onClose: function () {
            if (focusAfterToast && focusAfterToast.focus) {
              focusAfterToast.focus({ preventScroll: false });
              try {
                focusAfterToast.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              } catch (e) {}
            }
          }
        });
      } else if (focusAfterToast && focusAfterToast.focus) {
        focusAfterToast.focus();
      }
      return;
    }

    var barOpts = {
      autoCloseMs: 3500,
      onClose: function () {
        form.reset();
        form.classList.remove('was-validated');
        if (result) {
          result.textContent = '';
          result.classList.remove('jkfw-contact-form-result--ok');
        }
      }
    };
    var topPx = getSuccessToastBarTopPx();
    if (topPx !== null && topPx !== undefined) {
      barOpts.fixedTopPx = topPx;
    }

    if (typeof showToastBar === 'function') {
      showToastBar('Mensaje enviado correctamente.', 'success', barOpts);
      if (result) {
        result.textContent = '';
        result.classList.remove('jkfw-contact-form-result--ok');
      }
    }
  });
})();
