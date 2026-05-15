<?php declare(strict_types=1); ?>
  <div id="jkfw-demo-login-modal" class="jkhive-message-modal jkhive-modal" aria-hidden="true">
    <div class="jkhive-modal-overlay" id="jkfw-demo-login-overlay"></div>
    <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin jkfw-showcase-hex-simple" role="dialog" aria-modal="true" aria-labelledby="jkfw-demo-login-title">
      <div class="jkhive-modal-header">
        <button type="button" class="jkhive-modal-close" id="jkfw-demo-login-close" aria-label="Cerrar">&times;</button>
        <div class="jkhive-modal-header-top"></div>
        <div class="jkhive-modal-header-bottom">
          <h2 class="jkhive-modal-title" id="jkfw-demo-login-title">Acceso demostración</h2>
          <p class="jkhive-modal-subtitle" style="margin:0.35rem 0 0;font-size:0.88rem;color:var(--jk-metal-medium);font-weight:500;">
            Credenciales locales — no hay backend; sirve sólo para el flujo visual JK Hive.
          </p>
        </div>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content">
          <form id="jkfw-demo-login-form" style="display:flex;flex-direction:column;gap:1rem;margin-top:0.25rem;">
            <div>
              <label for="jkfw-demo-user" style="display:block;font-size:0.75rem;font-weight:600;margin-bottom:0.35rem;color:var(--jk-metal-light);">Usuario</label>
              <input id="jkfw-demo-user" name="user" type="text" autocomplete="username" value="Visita Web" class="jkhive-hex-select" style="width:100%;box-sizing:border-box;padding:0.5rem 0.75rem;border-radius:8px;border:1px solid rgba(14,165,233,0.35);background:rgba(15,23,42,0.6);color:var(--jk-metal-light);" />
            </div>
            <div>
              <label for="jkfw-demo-pass" style="display:block;font-size:0.75rem;font-weight:600;margin-bottom:0.35rem;color:var(--jk-metal-light);">Contraseña</label>
              <input id="jkfw-demo-pass" name="password" type="password" autocomplete="current-password" value="123456" class="jkhive-hex-select" style="width:100%;box-sizing:border-box;padding:0.5rem 0.75rem;border-radius:8px;border:1px solid rgba(14,165,233,0.35);background:rgba(15,23,42,0.6);color:var(--jk-metal-light);" />
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem;">
              <button type="submit" class="jkfw-demo-modal-submit" style="cursor:pointer;padding:0.55rem 1rem;border-radius:8px;border:1px solid var(--jk-primary-blue);background:linear-gradient(135deg,var(--jk-tech-dark),var(--jk-primary-blue-darker));color:var(--jk-metal-light);font-weight:700;font-size:0.8rem;">
                Ingresar
              </button>
              <button type="button" id="jkfw-demo-cancel" style="cursor:pointer;padding:0.55rem 1rem;border-radius:8px;border:1px solid rgba(148,163,184,0.45);background:transparent;color:var(--jk-metal);font-weight:600;font-size:0.8rem;">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-admin-footer">
        <div class="jkhive-modal-admin-footer-honeycomb">
          <div class="jkhive-modal-admin-footer-row2">
            <div class="jkhive-bttn-med jkhive-btn-cart-exit jkhive-bttn-modal-exit" data-tooltip="Cerrar">
              <button type="button" id="jkfw-demo-login-close-foot" aria-label="Cerrar modal">
                <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-door-open"></i></div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
