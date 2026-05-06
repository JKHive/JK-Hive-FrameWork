<?php
declare(strict_types=1);
$jk_nav = 'contact';
$jk_page_title = 'JK Hive Showcase - Contacto';
$jk_breadcrumb = 'Contacto';
$jk_body_class = 'page-public jkhive-showcase-body contact-page';
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/contact-style.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-showcase-crud.css">' . "\n";
require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
?>
        <h1 class="jkhive-section-title" style="margin-top:0;">Contacto</h1>
        <p style="color:var(--jk-metal-light);max-width:48rem;">Lorem ipsum — demo de envío hex (sin backend). Patrón <code>contact-submit-wrap</code> + botón grande según doc 09.</p>
        <form class="jkfw-contact-form" action="#" method="post" style="max-width:28rem;margin-top:1.25rem;">
          <div class="jkfw-admin-field" style="margin-bottom:1rem;">
            <label class="jkfw-admin-label" for="jkfw-contact-subject">Motivo</label>
            <select id="jkfw-contact-subject" name="subject" class="jkhive-hex-select" title="Motivo">
              <option value="">Seleccionar…</option>
              <option value="demo">Consulta general</option>
              <option value="support">Soporte técnico</option>
              <option value="sales">Comercial</option>
            </select>
          </div>
          <label style="display:flex;flex-direction:column;gap:0.35rem;margin-bottom:1rem;font-size:0.88rem;color:var(--jk-metal-light);">
            Mensaje
            <textarea rows="4" style="resize:vertical;padding:0.55rem;border-radius:8px;border:1px solid rgba(14,165,233,0.4);background:rgba(15,23,42,0.85);color:var(--jk-metal-light);"></textarea>
          </label>
          <div class="jkfw-modal-form-row-toggle" id="jkfw-contact-notify" style="margin-bottom:1rem;align-items:center;">
            <span class="jkfw-admin-label" style="margin:0;">Alertas por correo</span>
            <div class="jkhive-bttn-table jkhive-bttn-table-toggle jkhive-toggle-on" data-tooltip="Notificaciones (demo)">
              <button type="button" class="jkhive-bttn-inner">
                <div class="jkhive-hex">
                  <div class="jkhive-hex-content">
                    <span class="jkhive-toggle-text">ON</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div class="contact-submit-wrap">
            <div class="jkhive-admoptions-bttn jkhive-bttn-big" data-tooltip="Enviar (demo sin servidor)" id="jkfw-contact-send-anchor">
              <button type="submit" class="jkhive-bttn-inner" style="background:none;border:none;padding:0;cursor:pointer;color:inherit;">
                <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-paper-plane"></i></div></div>
              </button>
            </div>
          </div>
        </form>
        <script>
        document.addEventListener('DOMContentLoaded',function(){
          var f=document.querySelector('.jkfw-contact-form');
          var wrap=document.getElementById('jkfw-contact-send-anchor');
          var sub=f?f.querySelector('button[type="submit"]'):null;
          var anchor=(wrap&&wrap.getBoundingClientRect)?wrap:sub;
          if(!f||!anchor)return;
          f.addEventListener('submit',function(ev){
            ev.preventDefault();
            function send(){
              if(typeof jkHiveToast==='function'){
                jkHiveToast({type:'A',state:'success',message:'Mensaje enviado (demo).',persistent:false,autoCloseMs:3600});
              }
            }
            if(typeof window.showActionConfirmToast!=='function'){
              send();
              return;
            }
            window.showActionConfirmToast({
              anchorEl:anchor,
              variant:'success',
              toastId:'jkhive-toast-contact-confirm',
              message:'¿Confirmar envío del formulario de contacto?',
              confirmAriaLabel:'Sí, enviar',
              cancelAriaLabel:'Revisar',
              onConfirm:send
            });
          });
        });
        </script>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
