<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_landing_simple_nav_active = 'contact';
$jk_tier = 'basic';
$jk_page_title = 'Landing básica — Contacto';
$jk_breadcrumb = 'Landing básica · Contacto';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout jkfw-landing-basic-body';
$jk_hide_top_navbar = true;
$jk_hide_demo_modal = true;
$jk_footer_minimal = true;
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";
$jk_footer_inline_script = <<<'JS'
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
    var below = Math.ceil(r.bottom) + gap;
    var minTop = 8;
    var nav = document.querySelector('.jkhive-navbar');
    if (nav) {
      var cs = window.getComputedStyle(nav);
      if (cs.display !== 'none' && cs.visibility !== 'hidden') {
        var rootStyle = window.getComputedStyle(document.documentElement);
        var nh = parseFloat(rootStyle.getPropertyValue('--jkhive-toast-navbar-height')) || 70;
        var tg = parseFloat(rootStyle.getPropertyValue('--jkhive-toast-gap')) || 4;
        minTop = nh + tg;
      }
    }
    return Math.max(below, minTop);
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

    /* Demo: sin envío real; mismo contrato toast tipo A que el framework. */
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
JS;

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/jkfw-landing-simple-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$jk_landing_simple_hero_id = 'jkfw-contact-hero-title';
$jk_landing_simple_hero_title = 'Contacto';
$jk_landing_simple_hero_subtitle = 'Canal de contacto público en versión simple, listo para propuesta comercial.';
?>
<?php require __DIR__ . '/includes/jkfw-landing-simple-hero.php'; ?>

<section class="jkfw-landing-basic-section" aria-labelledby="jkfw-contact-title">
  <h2 id="jkfw-contact-title" class="jkhive-section-title">Conversemos</h2>
  <div class="jkhive-lead-wrap">
    <p class="jkhive-lead-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Canales de contacto en versión pública simple.</p>
  </div>
  <div class="jkfw-landing-basic-grid jkfw-landing-basic-grid-contact">
    <article class="jkfw-landing-basic-card">
      <h3 class="jkfw-landing-basic-card-title"><?= $h('Información de contacto') ?></h3>
      <p class="jkfw-landing-basic-card-text jkfw-contact-info-text">
        Email:
        <a class="jkhive-link-inline" href="mailto:contacto@empresa.tld">contacto@empresa.tld</a><br>
        LinkedIn:
        <a class="jkhive-link-inline" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">linkedin.com/company/empresa</a><br>
        Ubicación:
        <a class="jkhive-link-inline" href="https://maps.google.com/?q=Region+del+Maule,+Chile" target="_blank" rel="noopener noreferrer">Región del Maule, Chile</a>
      </p>
      <p class="jkfw-landing-basic-card-text jkfw-contact-info-text"><?= $h('Horario referencial: Lun a Vie de 09:00 a 18:00.') ?></p>
    </article>
    <article class="jkfw-landing-basic-card">
      <h3 class="jkfw-landing-basic-card-title"><?= $h('Formulario de contacto') ?></h3>
      <form id="jkfwSimpleContactForm" class="jkfw-contact-form" novalidate>
        <label class="jkfw-contact-form-label" for="jkfwContactName">Nombre</label>
        <div class="jkhive-field-surface jkhive-surface-theme-sidebar">
          <input id="jkfwContactName" class="jkfw-contact-form-input" type="text" autocomplete="name">
        </div>

        <label class="jkfw-contact-form-label" for="jkfwContactEmail">Email</label>
        <div class="jkhive-field-surface jkhive-surface-theme-sidebar">
          <input id="jkfwContactEmail" class="jkfw-contact-form-input" type="email" autocomplete="email" inputmode="email">
        </div>

        <label class="jkfw-contact-form-label" for="jkfwContactSubject">Asunto</label>
        <div class="jkhive-field-surface jkhive-surface-theme-sidebar">
          <input id="jkfwContactSubject" class="jkfw-contact-form-input" type="text" autocomplete="off">
        </div>

        <label class="jkfw-contact-form-label" for="jkfwContactMessage">Mensaje</label>
        <div class="jkhive-field-surface jkhive-surface-theme-sidebar">
          <textarea id="jkfwContactMessage" class="jkfw-contact-form-input jkfw-contact-form-textarea" rows="5"></textarea>
        </div>

        <div class="jkfw-contact-form-submit-wrap">
          <div class="jkhive-admoptions-bttn jkhive-bttn-big" data-tooltip="Enviar mensaje">
            <button type="submit" class="jkhive-bttn-inner jkfw-contact-form-submit" aria-label="Enviar mensaje">
              <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-paper-plane"></i></div></div>
            </button>
          </div>
        </div>
      </form>
      <p id="jkfwSimpleContactResult" class="jkfw-contact-form-result" aria-live="polite"></p>
    </article>
  </div>
</section>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
