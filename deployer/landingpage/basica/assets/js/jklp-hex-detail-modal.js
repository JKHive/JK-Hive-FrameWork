/**
 * Modal detalle galería — misma grilla hex JK Hive que modales admin
 * (modals.css: .jkhive-modal-content.jkhive-modal-hex.jkhive-modal-form-admin).
 */
(function () {
  'use strict';

  var MODAL_ID = 'jklpHexDetailModal';
  var BODY_LOREM =
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel sapien nec urna sollicitudin facilisis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vitae odio non felis convallis fermentum.</p>' +
    '<p>Nunc eu augue et lacus dignissim tempus. Suspendisse potenti. Maecenas fringilla, lacus ac pulvinar interdum, nibh tortor vehicula augue, sit amet varius eros risus id lacus. Phasellus blandit libero vitae turpis efficitur, nec cursus libero pharetra.</p>' +
    '<p>Morbi sagittis ligula vel urna consequat, sit amet rhoncus lectus condimentum. Etiam id tortor sed ipsum vestibulum ultricies. Cras non urna vitae magna facilisis posuere. Sed vulputate odio id sem bibendum, eu lacinia massa varius.</p>';

  function contactHref() {
    return 'contact.html';
  }

  function ensureModal() {
    var existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    var wrap = document.createElement('div');
    wrap.id = MODAL_ID;
    wrap.className = 'jkhive-modal jklp-hex-detail-modal jkhive-modal-formulario';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-hidden', 'true');

    wrap.innerHTML =
      '<div class="jkhive-modal-overlay jklp-hex-detail-overlay" tabindex="-1" aria-hidden="true"></div>' +
      '<div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin jklp-hex-detail-modal-hex">' +
      '  <div class="jkhive-modal-header">' +
      '    <div class="jkhive-modal-header-top">' +
      '      <span class="jkhive-modal-icon" aria-hidden="true"><i class="fas fa-layer-group jkhive-hex-icon" data-jklp-hex-detail-icon></i></span>' +
      '    </div>' +
      '    <div class="jkhive-modal-header-bottom">' +
      '      <h2 class="jkhive-modal-title" data-jklp-hex-detail-title>Detalle</h2>' +
      '    </div>' +
      '    <button type="button" class="jkhive-modal-close" data-jklp-hex-detail-x aria-label="Cerrar">&times;</button>' +
      '  </div>' +
      '  <div class="jkhive-modal-body">' +
      '    <div class="jkhive-modal-body-content jklp-hex-detail-body-wrap">' +
      '      <div class="jklp-hex-detail-flow">' +
      '        <div class="jklp-hex-detail-photo jklp-hex-detail-photo--right" data-jklp-hex-detail-photo>' +
      '          <div class="jklp-hex-detail-photo__placeholder" aria-hidden="true"><i class="fas fa-image jkhive-hex-icon"></i></div>' +
      '        </div>' +
      '        <div class="jklp-hex-detail-text" data-jklp-hex-detail-body>' +
      BODY_LOREM +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="jkhive-modal-footer jkhive-modal-admin-footer">' +
      '    <div class="jkhive-modal-admin-footer-honeycomb jklp-hex-detail-footer-honeycomb">' +
      '      <div class="jkhive-modal-admin-footer-row1 jklp-hex-detail-footer-row1">' +
      '        <div class="jkhive-bttn-med jkhive-btn-anim-coinleft" data-tooltip="Ir a la página de contacto">' +
      '          <a href="' +
      contactHref() +
      '" class="jkhive-modal-footer-hex-link jklp-hex-detail-contact" aria-label="Contacto">' +
      '            <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-envelope" aria-hidden="true"></i></div></div>' +
      '          </a>' +
      '        </div>' +
      '        <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock jkhive-bttn-modal-exit jkhive-btn-cart-exit" data-tooltip="Salir">' +
      '          <button type="button" data-jklp-hex-detail-close-btn aria-label="Salir">' +
      '            <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div></div>' +
      '          </button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(wrap);

    function close() {
      wrap.classList.remove('show', 'active');
      wrap.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function bindClose(el) {
      if (!el) return;
      el.addEventListener('click', function (e) {
        if (el.getAttribute('data-jklp-hex-detail-close-btn') != null) {
          e.preventDefault();
        }
        close();
      });
    }

    wrap.querySelector('.jklp-hex-detail-overlay').addEventListener('click', close);
    bindClose(wrap.querySelector('[data-jklp-hex-detail-close-btn]'));
    bindClose(wrap.querySelector('[data-jklp-hex-detail-x]'));

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && wrap.classList.contains('show')) {
        close();
      }
    });

    wrap.__jklpClose = close;
    return wrap;
  }

  function iconClassesFromSpot(spot) {
    var icon = spot.querySelector('.jkhive-hex-gallery-icon');
    if (!icon) return 'fas fa-layer-group';
    var parts = (icon.className || '').split(/\s+/).filter(Boolean);
    var cls = parts
      .filter(function (c) {
        return (
          c !== 'jkhive-hex-gallery-icon' &&
          c.indexOf('jkfw-') !== 0 &&
          c.indexOf('jklp-') !== 0
        );
      })
      .join(' ')
      .trim();
    return cls || 'fas fa-layer-group';
  }

  function openFromSpot(spot) {
    var modal = ensureModal();
    var titleEl = spot.querySelector('.jkhive-hex-gallery-title');
    var title = titleEl ? titleEl.textContent.trim() : 'Detalle';

    var iconI = modal.querySelector('[data-jklp-hex-detail-icon]');
    if (iconI) {
      iconI.className = iconClassesFromSpot(spot) + ' jkhive-hex-icon';
    }

    var titleNode = modal.querySelector('[data-jklp-hex-detail-title]');
    if (titleNode) titleNode.textContent = title;

    var side = (
      spot.getAttribute('data-jklp-modal-media-side') || 'right'
    ).toLowerCase();
    var photo = modal.querySelector('[data-jklp-hex-detail-photo]');
    if (photo) {
      photo.classList.remove(
        'jklp-hex-detail-photo--left',
        'jklp-hex-detail-photo--right'
      );
      photo.classList.add(
        side === 'left'
          ? 'jklp-hex-detail-photo--left'
          : 'jklp-hex-detail-photo--right'
      );
    }

    var bodyEl = modal.querySelector('[data-jklp-hex-detail-body]');
    if (bodyEl) bodyEl.innerHTML = BODY_LOREM;

    var contactA = modal.querySelector('.jklp-hex-detail-contact');
    if (contactA) contactA.setAttribute('href', contactHref());

    modal.classList.add('show', 'active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function triggerTarget(ev) {
    var spot = ev.target.closest('.jklp-hex-detail-trigger');
    if (!spot) return null;
    var grid = spot.closest('#jkfwGalleryServicesGrid, #jkfwAboutNewsGallery');
    if (!grid) return null;
    return spot;
  }

  document.addEventListener(
    'click',
    function (ev) {
      var spot = triggerTarget(ev);
      if (!spot) return;
      ev.preventDefault();
      ev.stopPropagation();
      openFromSpot(spot);
    },
    true
  );

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    var spot = triggerTarget(ev);
    if (!spot) return;
    ev.preventDefault();
    openFromSpot(spot);
  });
})();
