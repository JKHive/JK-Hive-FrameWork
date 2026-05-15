/**
 * Showcase: toggles ON/OFF tablas/formularios, paginación demo, mensajería estática (sin API).
 */
(function () {
  'use strict';

  function playCoin180(wrap) {
    if (!wrap) return;
    wrap.classList.remove('jkhive-btn-play-coin180');
    void wrap.offsetWidth;
    wrap.classList.add('jkhive-btn-play-coin180');
    window.setTimeout(function () {
      wrap.classList.remove('jkhive-btn-play-coin180');
    }, 650);
  }

  function toast(msg, state) {
    if (typeof window.jkHiveToast === 'function') {
      window.jkHiveToast({
        type: 'A',
        state: state || 'success',
        message: msg,
        persistent: false,
        autoCloseMs: 3200,
      });
    } else if (typeof window.showToastBar === 'function') {
      window.showToastBar(msg, state === 'error' ? 'error' : 'success', { autoCloseMs: 3200 });
    }
  }

  function toggleFromButton(btn, e) {
    if (e) e.preventDefault();
    var wrap = btn.closest('.jkhive-bttn-table-toggle');
    if (!wrap) return;
    playCoin180(wrap);
    var on = wrap.classList.toggle('jkhive-toggle-on');
    wrap.classList.toggle('jkhive-toggle-off', !on);
    var txt = wrap.querySelector('.jkhive-toggle-text');
    if (txt) txt.textContent = on ? 'ON' : 'OFF';
    var label = wrap.getAttribute('data-toggle-label') || 'Registro';
    toast(label + ' → ' + (on ? 'activo' : 'inactivo') + ' (demo).', 'neutral');
  }

  function bindToggleDelegation() {
    document.addEventListener(
      'click',
      function (e) {
        var btn = e.target.closest('.jkhive-bttn-table-toggle .jkhive-bttn-inner');
        if (!btn || btn.disabled) return;
        if (btn.closest('#jkfw-contact-notify')) return;
        toggleFromButton(btn, e);
      },
      true
    );
  }

  function bindMessagingDemo() {
    var layout = document.querySelector('.jkfw-messaging-demo-layout');
    if (!layout) return;

    layout.querySelectorAll('.messaging-folder[data-jkfw-folder]').forEach(function (folder) {
      folder.addEventListener('click', function () {
        layout.querySelectorAll('.messaging-folder.active').forEach(function (f) {
          f.classList.remove('active');
        });
        folder.classList.add('active');
        toast('Carpeta: ' + (folder.textContent || '').replace(/\s+/g, ' ').trim() + ' (demo)', 'neutral');
      });
    });

    layout.querySelectorAll('.messaging-item[data-jkfw-thread]').forEach(function (item) {
      item.addEventListener('click', function () {
        layout.classList.add('showing-message');
        layout.querySelectorAll('.messaging-item.selected').forEach(function (i) {
          i.classList.remove('selected');
        });
        item.classList.add('selected');
        var subj = item.querySelector('.messaging-item-subject');
        var viewTitle = layout.querySelector('[data-jkfw-thread-title]');
        var viewFrom = layout.querySelector('[data-jkfw-thread-from]');
        if (viewTitle && subj) viewTitle.textContent = subj.textContent || 'Mensaje';
        if (viewFrom) {
          var fromEl = item.querySelector('.messaging-item-from');
          viewFrom.textContent = fromEl ? fromEl.textContent.trim() : '';
        }
      });
    });

    var back = layout.querySelector('[data-jkfw-msg-back]');
    if (back) {
      back.addEventListener('click', function () {
        layout.classList.remove('showing-message');
      });
    }

    var composeHex = layout.querySelector('[data-jkfw-msg-compose]');
    if (composeHex) {
      composeHex.addEventListener('click', function () {
        toast('Composer (demo — sin API de mensajería).', 'neutral');
      });
    }

    var bulk = layout.querySelector('.bulk-actions-toolbar');
    if (bulk) {
      bulk.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var row = btn.closest('.jkhive-actionbutton-small');
          var label = 'Acción en lote';
          if (row && row.classList.contains('bulk-action-delete')) label = 'Eliminar selección';
          if (row && row.classList.contains('bulk-action-archive')) label = 'Archivar selección';
          if (row && row.classList.contains('bulk-action-star')) label = 'Destacar selección';
          toast(label + ' (demo UI).', 'neutral');
        });
      });
      var countEl = bulk.querySelector('.selected-count');
      var checks = layout.querySelectorAll('.messaging-checkbox');
      function syncCount() {
        if (!countEl) return;
        var n = layout.querySelectorAll('.messaging-checkbox:checked').length;
        countEl.textContent = n + ' seleccionados';
      }
      checks.forEach(function (c) {
        c.addEventListener('change', syncCount);
      });
      syncCount();
    }

    var sendHex = layout.querySelector('[data-jkfw-msg-send]');
    var input = layout.querySelector('[data-jkfw-msg-input]');
    var threadBody = layout.querySelector('[data-jkfw-thread-body]');
    if (sendHex && threadBody) {
      sendHex.addEventListener('click', function () {
        var t = input && input.value ? input.value.trim() : '';
        if (!t) {
          toast('Escribe un texto para simular el envío.', 'error');
          return;
        }
        var row = document.createElement('div');
        row.className = 'messaging-view-message messaging-view-message--out';
        var bubble = document.createElement('div');
        bubble.className = 'messaging-view-bubble';
        bubble.textContent = t;
        row.appendChild(bubble);
        threadBody.appendChild(row);
        if (input) input.value = '';
        toast('Mensaje enviado al hilo (solo cliente).', 'success');
      });
    }
  }

  function bindPaginationDemo() {
    document.querySelectorAll('[data-jkfw-pagination]').forEach(function (bar) {
      var page = 1;
      var totalPages = parseInt(bar.getAttribute('data-pages') || '4', 10);
      var pageSize = parseInt(bar.getAttribute('data-page-size') || '3', 10);
      var total = parseInt(bar.getAttribute('data-total') || '12', 10);
      var meta = bar.querySelector('.jkhive-pagination-meta');
      var prev = bar.querySelector('[data-jkfw-page-prev]');
      var next = bar.querySelector('[data-jkfw-page-next]');

      function render() {
        var start = (page - 1) * pageSize + 1;
        var end = Math.min(page * pageSize, total);
        if (meta) {
          meta.innerHTML =
            'Mostrando <strong>' +
            start +
            '–' +
            end +
            '</strong> de <strong>' +
            total +
            '</strong> · Página ' +
            page +
            ' / ' +
            totalPages;
        }
        if (prev) prev.classList.toggle('jkhive-pagination-btn-disabled', page <= 1);
        if (next) next.classList.toggle('jkhive-pagination-btn-disabled', page >= totalPages);
      }

      if (prev) {
        prev.addEventListener('click', function () {
          if (page <= 1) return;
          page--;
          render();
          toast('Página ' + page + ' (demo)', 'neutral');
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          if (page >= totalPages) return;
          page++;
          render();
          toast('Página ' + page + ' (demo)', 'neutral');
        });
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindToggleDelegation();
    bindPaginationDemo();
    bindMessagingDemo();

    var contactNotify = document.getElementById('jkfw-contact-notify');
    if (contactNotify) {
      var cbtn = contactNotify.querySelector('.jkhive-bttn-table-toggle .jkhive-bttn-inner');
      if (cbtn) {
      cbtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var wrap = contactNotify.querySelector('.jkhive-bttn-table-toggle');
        if (!wrap) return;
        playCoin180(wrap);
        var on = wrap.classList.toggle('jkhive-toggle-on');
        wrap.classList.toggle('jkhive-toggle-off', !on);
        var txt = wrap.querySelector('.jkhive-toggle-text');
        if (txt) txt.textContent = on ? 'ON' : 'OFF';
        toast('Notificaciones demo: ' + (on ? 'sí' : 'no'), 'neutral');
      });
      }
    }

    if (typeof window.JKHiveTooltipAttach === 'function') {
      window.JKHiveTooltipAttach(document.getElementById('main-content') || document.body);
    }
  });
})();
