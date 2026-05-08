/**
 * JKHIVE - Sistema de toasts (heredable, diseño JK Hive)
 *
 * CONFIGURACIÓN FINAL: Ver ALERTS-README.md y 05-alertas-toasts.md — sección
 * "CONFIGURACIÓN FINAL DEL TOAST — NO TOCAR". No cambiar estructura HTML del
 * persistente (wrapper .jkhive-toast-bar-persistent-wrap > bar-inner + detail-panel).
 *
 * Hex 6%/94% en system-messages.css. No aplicar estilos que cambien clip-path.
 * Convención: prefijo jkhive-toast-*. Tipo A: barra. Tipo A persistente: barra + panel.
 * Tipo B: showToastInline() — animación TV.
 */
(function() {
  'use strict';

  var INLINE_CONTAINER_ID = 'jkhive-toast-inline-container';
  var PERSISTENT_ERROR_TOAST_ID = 'jkhive-toast-persistent-error'; /* ID único JK Hive */
  var TOAST_BAR_MESSAGE_ID = 'jkhive-toast-bar-message'; /* Toast tipo A no persistente (éxito, info, etc.) */

  function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var TOAST_BAR_MODAL_ID = 'jkhive-toast-bar-modal';

  /**
   * Toast tipo A (barra): mensaje en barra derecha bajo navbar. Sin panel. Opcional auto-close.
   * type: 'success' | 'info' | 'error' | 'warning'
   * options.appendTo: contenedor (ej. modal body) para mostrar el toast dentro de él (esquina superior derecha, 80% tamaño).
   */
  window.showToastBar = function(message, type, options) {
    options = options || {};
    type = type || 'info';
    message = message || '';
    var autoCloseMs = options.autoCloseMs !== undefined ? options.autoCloseMs : 3500;
    var icon = options.icon !== undefined ? options.icon : (type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle');
    var appendTo = options.appendTo || document.body;
    var inModal = appendTo !== document.body;

    if (inModal) {
      var existingModal = appendTo.querySelector('#' + TOAST_BAR_MODAL_ID);
      if (existingModal && existingModal.parentNode) existingModal.parentNode.removeChild(existingModal);
    } else {
      var existing = document.getElementById(TOAST_BAR_MESSAGE_ID);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    }

    var wrap = document.createElement('div');
    wrap.id = inModal ? TOAST_BAR_MODAL_ID : TOAST_BAR_MESSAGE_ID;
    wrap.className = 'jkhive-toast-bar jkhive-toast-' + type + (inModal ? ' jkhive-toast-bar-in-modal' : '');
    wrap.setAttribute('role', 'status');
    wrap.innerHTML = '<div class="jkhive-toast-bar-inner jkhive-toast-bar-hex-caps">' +
      '<span class="jkhive-toast-bar-point jkhive-toast-bar-point-left" aria-hidden="true"></span>' +
      '<span class="jkhive-toast-bar-center">' +
      '<i class="' + icon + '" aria-hidden="true"></i>' +
      '<span>' + escapeHtml(message) + '</span>' +
      '</span>' +
      '<span class="jkhive-toast-bar-point jkhive-toast-bar-point-right" aria-hidden="true"></span>' +
      '</div>';
    appendTo.appendChild(wrap);

    var t = null;
    function closeToast() {
      if (!wrap.parentNode) return;
      if (t) clearTimeout(t);
      wrap.classList.add('jkhive-toast-closing');
      setTimeout(function() {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (options.onClose) try { options.onClose(); } catch (e) {}
      }, 350);
    }
    if (autoCloseMs > 0) t = setTimeout(closeToast, autoCloseMs);
    return { close: closeToast };
  };

  var TOAST_MODAL_TV_ID = 'jkhive-toast-modal-tv';

  /**
   * Toast para modales/mantenedores: animación tipo B (oldTV) debajo del título del modal.
   * Resuelve el contenedor desde options.fromElement o options.container.
   * Posición: abajo del título (top del body del modal). Misma animación TV que showToastInline.
   *
   * @param {string} message - Texto del mensaje
   * @param {string} type - 'success' | 'info' | 'error' | 'warning'
   * @param {Object} options - fromElement, container/appendTo, autoCloseMs, icon, onClose
   * @returns {{ close: function }|undefined}
   */
  window.showToastInModal = function(message, type, options) {
    options = options || {};
    var container = options.container || options.appendTo;
    if (!container && options.fromElement && options.fromElement.closest) {
      container = options.fromElement.closest('.jkhive-modal-body');
    }
    if (!container) container = document.body;

    /* Si no está en modal, toast tipo A en body (comportamiento anterior) */
    if (container === document.body) {
      var opts = {
        appendTo: container,
        autoCloseMs: options.autoCloseMs !== undefined ? options.autoCloseMs : 3500,
        icon: options.icon,
        onClose: options.onClose
      };
      return showToastBar(message, type, opts);
    }

    /* Dentro de modal: toast tipo B (oldTV) debajo del título */
    var autoCloseMs = options.autoCloseMs !== undefined ? options.autoCloseMs : 3500;
    var icon = options.icon !== undefined ? options.icon : (type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle');
    var existing = container.querySelector('#' + TOAST_MODAL_TV_ID);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var wrap = document.createElement('div');
    wrap.id = TOAST_MODAL_TV_ID;
    wrap.className = 'jkhive-toast-inline jkhive-toast-inline-modal jkhive-toast-' + type;
    wrap.setAttribute('role', 'status');
    wrap.innerHTML = '<div class="jkhive-toast-tv-wrap">' +
      '<div class="jkhive-toast-tv-line" aria-hidden="true"></div>' +
      '<div class="jkhive-toast-tv-content">' +
      '<div class="jkhive-toast-tv-content-clip">' +
      '<div class="jkhive-toast-inner">' +
      '<i class="' + icon + '" aria-hidden="true"></i>' +
      '<span>' + (message.replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '</span>' +
      '</div></div></div></div>';
    container.appendChild(wrap);

    function closeToast() {
      if (!wrap.parentNode) return;
      wrap.classList.add('jkhive-toast-closing');
      setTimeout(function() {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (options.onClose) try { options.onClose(); } catch (e) {}
      }, 1050);
    }
    if (autoCloseMs > 0) setTimeout(closeToast, autoCloseMs);
    return { close: closeToast };
  };

  /**
   * Toast tipo A persistente: barra error con X para cerrar y icono info que abre panel con detalle.
   * Solo se cierra con la X (no auto-close).
   */
  window.showPersistentErrorToast = function(message, detail) {
    message = message || 'Error.';
    detail = detail || message;
    var existing = document.getElementById(PERSISTENT_ERROR_TOAST_ID);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var wrap = document.createElement('div');
    wrap.id = PERSISTENT_ERROR_TOAST_ID;
    wrap.className = 'jkhive-toast-bar jkhive-toast-error jkhive-toast-persistent';
    wrap.setAttribute('role', 'alert');

    wrap.innerHTML =
      '<div class="jkhive-toast-bar-persistent-wrap">' +
        '<div class="jkhive-toast-bar-inner jkhive-toast-bar-hex-caps">' +
          '<span class="jkhive-toast-bar-point jkhive-toast-bar-point-left" aria-hidden="true"></span>' +
          '<div class="jkhive-toast-bar-center">' +
          '<button type="button" class="jkhive-toast-bar-btn-info" data-tooltip="Ver detalles del error" aria-label="Ver detalles del error">' +
            '<i class="fas fa-info-circle" aria-hidden="true"></i>' +
          '</button>' +
          '<span class="jkhive-toast-bar-message-text">' + escapeHtml(message) + '</span>' +
          '<button type="button" class="jkhive-toast-bar-btn-close" data-tooltip="Cerrar" aria-label="Cerrar">&#215;</button>' +
          '</div>' +
          '<span class="jkhive-toast-bar-point jkhive-toast-bar-point-right" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="jkhive-toast-bar-detail-panel" id="' + PERSISTENT_ERROR_TOAST_ID + '-panel">' +
          '<button type="button" class="jkhive-toast-bar-detail-panel-close" data-tooltip="Cerrar detalle" aria-label="Cerrar detalle">&#215;</button>' +
          '<div class="jkhive-toast-bar-detail-panel-inner">' + escapeHtml(detail) + '</div>' +
          '<div class="jkhive-toast-bar-detail-panel-footer">' +
            '<button type="button" class="jkhive-bttn-sm jkhive-toast-bar-detail-panel-ticket" aria-label="Enviar ticket a soporte">' +
              '<div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-paper-plane"></i></div></div>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(wrap);

    /* Tooltip estilo JK Hive: data-tooltip + tooltip.js en botones de la barra; sin atributo title nativo */
    var ticketBtn = wrap.querySelector('.jkhive-toast-bar-detail-panel-ticket');
    if (ticketBtn) {
      var tipEl = document.createElement('div');
      tipEl.className = 'jkhive-tooltip-following';
      tipEl.setAttribute('role', 'tooltip');
      tipEl.style.cssText = 'opacity:0;pointer-events:none;left:0;top:0;';
      tipEl.textContent = 'Enviar ticket a soporte';
      document.body.appendChild(tipEl);
      function showTip(e) {
        tipEl.textContent = 'Enviar ticket a soporte';
        tipEl.style.opacity = '1';
        moveTip(e);
      }
      function moveTip(e) {
        var o = 10;
        var x = e.clientX;
        var y = e.clientY;
        var tw = tipEl.offsetWidth || 180;
        var th = tipEl.offsetHeight || 28;
        /* Misma lógica que tooltip.js: si cerca del borde derecho, tooltip a la izquierda del cursor */
        var marginRight = 240;
        var useLeft = (x + o + tw > window.innerWidth - 8) || (x > window.innerWidth - marginRight);
        var left, top;
        if (useLeft) {
          left = x - tw - o;
          top = y + o;
          if (left < 8) left = 8;
          if (top + th > window.innerHeight - 8) top = window.innerHeight - th - 8;
          if (top < 8) top = 8;
        } else {
          left = x + o;
          top = y + o;
        }
        tipEl.style.left = left + 'px';
        tipEl.style.top = top + 'px';
      }
      function hideTip() {
        tipEl.style.opacity = '0';
      }
      ticketBtn.addEventListener('mouseenter', showTip);
      ticketBtn.addEventListener('mousemove', moveTip);
      ticketBtn.addEventListener('mouseleave', hideTip);
      document.addEventListener('mousemove', function docMove(e) {
        if (tipEl.style.opacity === '1') moveTip(e);
      });
      wrap._ticketTooltipEl = tipEl;
    }

    var panel = document.getElementById(PERSISTENT_ERROR_TOAST_ID + '-panel');
    var btnInfo = wrap.querySelector('.jkhive-toast-bar-btn-info');
    var btnClose = wrap.querySelector('.jkhive-toast-bar-btn-close');

    function closeToast() {
      if (!wrap.parentNode) return;
      if (wrap._ticketTooltipEl && wrap._ticketTooltipEl.parentNode) wrap._ticketTooltipEl.parentNode.removeChild(wrap._ticketTooltipEl);
      wrap.classList.add('jkhive-toast-closing');
      setTimeout(function() {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }, 350);
    }

    function togglePanel() {
      panel.classList.toggle('jkhive-toast-bar-detail-panel-open');
    }

    btnInfo.addEventListener('click', togglePanel);

    var panelCloseBtn = wrap.querySelector('.jkhive-toast-bar-detail-panel-close');
    if (panelCloseBtn) panelCloseBtn.addEventListener('click', togglePanel);

    var ticketBtn = wrap.querySelector('.jkhive-toast-bar-detail-panel-ticket');
    if (ticketBtn) {
      ticketBtn.addEventListener('click', function() {
        var msgEl = wrap.querySelector('.jkhive-toast-bar-message-text');
        var detailEl = panel.querySelector('.jkhive-toast-bar-detail-panel-inner');
        var msg = (msgEl && msgEl.textContent) ? msgEl.textContent.trim() : message;
        var det = (detailEl && detailEl.textContent) ? detailEl.textContent.trim() : detail;
        det += '\n\n--- Cliente ---\nURL: ' + (window.location && window.location.href ? window.location.href : '') + '\nUser-Agent: ' + (navigator.userAgent || '');
        var urls = [];
        if (typeof HostsConfig !== 'undefined' && typeof HostsConfig.getSupportTicketApiUrls === 'function') {
          urls = HostsConfig.getSupportTicketApiUrls();
        } else if (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) {
          urls = [
            HostsConfig.getCrmUrlPath('api/ticket-soporte-public.php'),
            HostsConfig.getCrmUrlPath('api/ticket-soporte.php')
          ];
        } else {
          var origin = window.location.origin || '';
          var base = origin + (window.location.pathname || '').replace(/\/[^/]*$/, '');
          urls = [base + '/api/ticket-soporte-public.php', base + '/api/ticket-soporte.php'];
        }
        urls = urls.filter(function(u) { return u; });
        var form = new FormData();
        form.append('message', msg);
        form.append('detail', det);
        ticketBtn.disabled = true;

        function finishErr(text) {
          ticketBtn.disabled = false;
          if (typeof showToastInline === 'function') {
            showToastInline({ message: text, type: 'error', anchorEl: ticketBtn, autoCloseMs: 5000 });
          } else {
            alert(text);
          }
        }

        function tryTicketUrl(idx) {
          if (idx >= urls.length) {
            finishErr('No se pudo enviar el ticket.');
            return;
          }
          fetch(urls[idx], { method: 'POST', body: form, credentials: 'same-origin' })
            .then(function(r) {
              var ct = (r.headers.get('content-type') || '').toLowerCase();
              if (ct.indexOf('application/json') === -1) {
                return { ok: false, status: r.status, data: {} };
              }
              return r.json().then(function(d) { return { ok: r.ok, status: r.status, data: d }; });
            })
            .then(function(res) {
              if (res.ok && res.data && res.data.success) {
                ticketBtn.disabled = false;
                if (typeof showToastInline === 'function') {
                  showToastInline({ message: res.data.message || 'Ticket enviado.', type: 'success', anchorEl: ticketBtn, autoCloseMs: 3000 });
                } else {
                  alert(res.data.message || 'Ticket enviado.');
                }
                return;
              }
              if (idx < urls.length - 1 && (res.status === 401 || res.status === 404 || res.status === 405 || res.status === 503)) {
                tryTicketUrl(idx + 1);
                return;
              }
              ticketBtn.disabled = false;
              var errMsg = (res.data && res.data.message) ? res.data.message : 'No se pudo enviar el ticket.';
              if (typeof showToastInline === 'function') {
                showToastInline({ message: errMsg, type: 'error', anchorEl: ticketBtn, autoCloseMs: 5000 });
              } else {
                alert(errMsg);
              }
            })
            .catch(function() {
              if (idx < urls.length - 1) {
                tryTicketUrl(idx + 1);
              } else {
                finishErr('Error de conexión. Intenta de nuevo.');
              }
            });
        }
        tryTicketUrl(0);
      });
    }

    btnClose.addEventListener('click', closeToast);

    return { close: closeToast };
  };

  function getOrCreateInlineContainer() {
    var el = document.getElementById(INLINE_CONTAINER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = INLINE_CONTAINER_ID;
      el.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:0;pointer-events:none;z-index:10000;';
      document.body.appendChild(el);
    }
    return el;
  }

  /**
   * Toast tipo B: aparece encima de anchorEl con animación TV (expandir/contraer).
   */
  window.showToastInline = function(options) {
    options = options || {};
    var message = options.message || '';
    var type = options.type || 'info';
    var anchorEl = options.anchorEl;
    var autoCloseMs = options.autoCloseMs !== undefined ? options.autoCloseMs : 2500;
    var onClose = options.onClose || function() {};
    var appendTo = options.appendTo || document.body;
    var zIndex = options.zIndex;

    if (!anchorEl || !anchorEl.getBoundingClientRect) {
        if (typeof onClose === 'function') onClose();
        return;
    }

    var existing = document.getElementById('jkhive-toast-inline');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var wrap = document.createElement('div');
    wrap.id = 'jkhive-toast-inline';
    wrap.className = 'jkhive-toast-inline jkhive-toast-' + type;
    wrap.setAttribute('role', 'status');
    if (zIndex !== undefined && zIndex !== null) wrap.style.zIndex = String(zIndex);
    wrap.innerHTML = '<div class="jkhive-toast-tv-wrap">' +
      '<div class="jkhive-toast-tv-line" aria-hidden="true"></div>' +
      '<div class="jkhive-toast-tv-content">' +
      '<div class="jkhive-toast-tv-content-clip">' +
      '<div class="jkhive-toast-inner">' +
      (options.icon ? '<i class="' + options.icon + '"></i>' : '') +
      '<span>' + (message.replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '</span>' +
      '</div></div></div></div>';

    appendTo.appendChild(wrap);
    var rect = anchorEl.getBoundingClientRect();
    var toastRect = wrap.getBoundingClientRect();
    /* Centrado vertical y horizontal sobre el elemento: el toast queda superpuesto encima */
    var top = rect.top + (rect.height / 2) - (toastRect.height / 2);
    if (top < 8) top = 8;
    if (top + toastRect.height > window.innerHeight - 8) top = window.innerHeight - toastRect.height - 8;
    wrap.style.top = top + 'px';
    var left = rect.left + (rect.width / 2) - (toastRect.width / 2);
    if (left < 8) left = 8;
    if (left + toastRect.width > window.innerWidth - 8) left = window.innerWidth - toastRect.width - 8;
    wrap.style.left = left + 'px';
    wrap.style.transform = 'none';

    function closeToast() {
      wrap.classList.add('jkhive-toast-closing');
      setTimeout(function() {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        try { onClose(); } catch (e) {}
      }, 1050);
    }

    if (autoCloseMs > 0) setTimeout(closeToast, autoCloseMs);
    return { close: closeToast };
  };

  var ACTION_CONFIRM_TOAST_ID = 'jkhive-toast-action-confirm';
  var DELETE_CONFIRM_TOAST_ID = 'jkhive-toast-delete-confirm';

  /**
   * Toast de decisión hexagonal genérico (JK Hive).
   * Base oficial para confirmaciones con ticket / X sobre un botón.
   */
  window.showActionConfirmToast = function(options) {
    options = options || {};
    var anchorEl = options.anchorEl;
    var onConfirm = options.onConfirm || function() {};
    var onCancel = options.onCancel || function() {};
    var onTimeout = options.onTimeout || null;
    var message = (options.message != null && options.message !== '') ? String(options.message) : '¿Confirmar?';
    var appendTo = options.appendTo || document.body;
    var zIndex = options.zIndex != null ? options.zIndex : 2147483647;
    var variant = (options.variant || 'delete').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'delete';
    var size = (options.size || 'default').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'default';
    var toastId = options.toastId || ACTION_CONFIRM_TOAST_ID;
    var autoCloseMs = options.autoCloseMs != null ? Math.max(0, Number(options.autoCloseMs) || 0) : 0;
    var confirmAriaLabel = options.confirmAriaLabel || 'Confirmar';
    var cancelAriaLabel = options.cancelAriaLabel || 'Cancelar';
    var positionMode = options.positionMode || 'anchor';

    if (!anchorEl || !anchorEl.getBoundingClientRect) return { close: function() {} };

    var existing = document.getElementById(toastId);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var inModal = anchorEl.closest && anchorEl.closest('.jkhive-modal');
    var wrap = document.createElement('div');
    wrap.id = toastId;
    wrap.className = 'jkhive-toast-action-confirm-wrap' +
      (inModal ? ' jkhive-toast-action-confirm-in-modal' : '');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', toastId + '-msg');
    wrap.style.zIndex = String(zIndex);
    wrap.innerHTML =
      '<div class="jkhive-toast-action-confirm jkhive-toast-action-confirm-' + variant + (size !== 'default' ? ' jkhive-toast-action-confirm-' + size : '') + '" tabindex="-1">' +
        '<div class="jkhive-toast-action-confirm-hex">' +
          '<div class="jkhive-toast-action-confirm-content">' +
            '<p class="jkhive-toast-action-confirm-msg" id="' + toastId + '-msg">' + escapeHtml(message) + '</p>' +
            '<div class="jkhive-toast-action-confirm-actions">' +
              '<button type="button" class="jkhive-toast-action-confirm-ok jkhive-toast-action-ticket" aria-label="' + escapeHtml(confirmAriaLabel) + '"><i class="fa-solid fa-ticket" aria-hidden="true"></i></button>' +
              '<button type="button" class="jkhive-toast-action-confirm-cancel jkhive-toast-action-close" aria-label="' + escapeHtml(cancelAriaLabel) + '">&#215;</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    appendTo.appendChild(wrap);

    var panel = wrap.querySelector('.jkhive-toast-action-confirm');
    var targetRect = null;
    if (positionMode === 'modal-center' && anchorEl.closest) {
      var modalContent = anchorEl.closest('.jkhive-modal-content');
      if (modalContent && modalContent.getBoundingClientRect) {
        targetRect = modalContent.getBoundingClientRect();
      }
    }
    if (!targetRect) {
      targetRect = anchorEl.getBoundingClientRect();
    }
    var centerX = targetRect.left + targetRect.width / 2;
    var centerY = targetRect.top + targetRect.height / 2;
    panel.style.left = centerX + 'px';
    panel.style.top = centerY + 'px';
    panel.focus();

    var autoTimer = null;
    var keyHandler = null;
    var closed = false;

    function cleanup() {
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }
      if (keyHandler) {
        document.removeEventListener('keydown', keyHandler, true);
        keyHandler = null;
      }
    }

    function closeToast(doConfirm, wasTimeout, skipCallbacks) {
      if (closed) return;
      closed = true;
      cleanup();
      panel.classList.add('jkhive-toast-action-confirm-closing');
      setTimeout(function() {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (skipCallbacks) return;
        if (doConfirm) { try { onConfirm(); } catch (e) {} return; }
        if (wasTimeout && typeof onTimeout === 'function') { try { onTimeout(); } catch (e) {} return; }
        try { onCancel(); } catch (e) {}
      }, 280);
    }

    wrap.addEventListener('click', function(e) {
      if (e.target === wrap) closeToast(false, false, false);
    });
    panel.querySelector('.jkhive-toast-action-confirm-ok').addEventListener('click', function() { closeToast(true, false, false); });
    panel.querySelector('.jkhive-toast-action-confirm-cancel').addEventListener('click', function() { closeToast(false, false, false); });
    keyHandler = function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        closeToast(true, false, false);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeToast(false, false, false);
      }
    };
    document.addEventListener('keydown', keyHandler, true);

    if (autoCloseMs > 0) {
      autoTimer = setTimeout(function() {
        closeToast(false, true, false);
      }, autoCloseMs);
    }

    requestAnimationFrame(function() {
      panel.classList.add('jkhive-toast-action-confirm-open');
    });
    return {
      close: function() { closeToast(false, false, false); },
      dismiss: function() { closeToast(false, false, true); }
    };
  };

  /**
   * Toast de confirmación para botón Eliminar (JK Hive).
   * Wrapper oficial de la variante genérica.
   */
  window.showDeleteConfirmToast = function(options) {
    options = options || {};
    return window.showActionConfirmToast(Object.assign({}, options, {
      toastId: DELETE_CONFIRM_TOAST_ID,
      variant: 'delete',
      size: 'default',
      message: (options.message != null && options.message !== '') ? String(options.message) : '¿Seguro?',
      autoCloseMs: 0,
      confirmAriaLabel: options.confirmAriaLabel || 'Sí, eliminar',
      cancelAriaLabel: options.cancelAriaLabel || 'Cancelar'
    }));
  };

  /**
   * Toast de confirmación de guardado / continuación (JK Hive).
   * Variante oficial para decisiones post-guardado.
   */
  window.showSaveConfirmToast = function(options) {
    options = options || {};
    return window.showActionConfirmToast(Object.assign({}, options, {
      toastId: options.toastId || 'jkhive-toast-save-confirm',
      variant: 'success',
      size: 'wide',
      positionMode: options.positionMode || 'modal-center',
      message: (options.message != null && options.message !== '') ? String(options.message) : 'Guardado correctamente. ¿Agregar otro?',
      autoCloseMs: options.autoCloseMs != null ? options.autoCloseMs : 5000,
      confirmAriaLabel: options.confirmAriaLabel || 'Agregar otro',
      cancelAriaLabel: options.cancelAriaLabel || 'Cerrar'
    }));
  };
})();
