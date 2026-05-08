<?php declare(strict_types=1); ?>
  <div id="showcase-demo-modal" class="jkhive-message-modal jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" data-close-modal></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin jkfw-showcase-hex-simple" role="dialog" aria-modal="true" aria-labelledby="showcase-modal-title">
      <div class="jkhive-modal-header">
        <button type="button" class="jkhive-modal-close" data-close-modal aria-label="Cerrar">&times;</button>
        <div class="jkhive-modal-header-top"></div>
        <div class="jkhive-modal-header-bottom">
          <h2 class="jkhive-modal-title" id="showcase-modal-title">Modal JK Hive (hex)</h2>
          <p class="jkhive-modal-subtitle" style="margin:0.35rem 0 0;font-size:0.88rem;color:var(--jk-metal-medium);font-weight:500;">
            Overlay + panal · transición de entrada desde <code>modals.css</code>
          </p>
        </div>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content">
          <p class="jkhive-modal-description" style="margin:0;color:var(--jk-metal-light);line-height:1.45;">
            Demo de contenido dentro del modal hex administrativo. Cerrá con Escape, fondo miel o botón inferior.
          </p>
          <div style="margin-top:1rem;display:flex;justify-content:center;">
            <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Toast dentro del cuerpo (showToastInModal)">
              <button type="button" id="showcase-modal-inner-toast" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
                <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-bolt"></i></div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb">
          <div class="jkhive-modal-admin-footer-row2">
            <div class="jkhive-bttn-med jkhive-bttn-modal-exit jkhive-btn-cart-exit" data-tooltip="Cerrar modal">
              <button type="button" data-close-modal aria-label="Cerrar modal">
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-door-open"></i></div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
