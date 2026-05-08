/**
 * About admin: líneas por sección (bullets ↔ textarea) y etiquetas de experiencia (chips + tag_ids[]).
 */
(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseLines(text) {
    return String(text || '')
      .split(/\r\n|\r|\n/)
      .map(function (l) {
        return l.trim();
      })
      .filter(Boolean);
  }

  function renderSkillLines(listEl, lines, persist) {
    if (!lines.length) {
      listEl.innerHTML =
        '<p class="jkhive-bullets-empty">No hay líneas. Agregá habilidades con el botón hexagonal.</p>';
      if (typeof persist === 'function') {
        persist();
      }
      return;
    }
    listEl.innerHTML = lines
      .map(function (line, idx) {
        return (
          '<div class="jkhive-bullet-item" data-index="' +
          idx +
          '">' +
          '<span class="jkhive-bullet-text">' +
          escapeHtml(line) +
          '</span>' +
          '<button type="button" class="jkhive-bullet-remove" data-tooltip="Eliminar" aria-label="Quitar línea">' +
          '<i class="fas fa-times" aria-hidden="true"></i>' +
          '</button></div>'
        );
      })
      .join('');
    listEl.querySelectorAll('.jkhive-bullet-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.jkhive-bullet-item');
        if (!item) {
          return;
        }
        var i = parseInt(item.getAttribute('data-index'), 10);
        if (isNaN(i)) {
          return;
        }
        lines.splice(i, 1);
        renderSkillLines(listEl, lines, persist);
      });
    });
    if (typeof persist === 'function') {
      persist();
    }
  }

  function initSkillLineForm(form) {
    var ta = form.querySelector('textarea[name="lines"]');
    var listEl = form.querySelector('.jkhive-about-skill-lines-list');
    var input = form.querySelector('.jkhive-about-skill-line-input');
    var addBtn = form.querySelector('.jkhive-about-skill-line-add');
    if (!ta || !listEl) {
      return;
    }
    form.classList.add('jkhive-about-lines-js');
    var lines = parseLines(ta.value);

    function persist() {
      ta.value = lines.join('\n');
    }

    renderSkillLines(listEl, lines, persist);

    if (addBtn && input) {
      addBtn.addEventListener('click', function () {
        var v = input.value.trim();
        if (!v) {
          return;
        }
        lines.push(v);
        input.value = '';
        input.focus();
        renderSkillLines(listEl, lines, persist);
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          addBtn.click();
        }
      });
    }

    form.addEventListener('submit', function () {
      persist();
    });
  }

  function normName(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function initExpTags(form) {
    var raw = form.getAttribute('data-available-tags');
    var initialRaw = form.getAttribute('data-initial-tags');
    var listEl = form.querySelector('.jkhive-exp-tags-list');
    var hiddenWrap = form.querySelector('.jkhive-exp-tag-hidden-inputs');
    var input = form.querySelector('.jkhive-exp-tag-input');
    var addBtn = form.querySelector('.jkhive-exp-tag-add');
    if (!listEl || !hiddenWrap) {
      return;
    }

    var available = [];
    try {
      available = JSON.parse(raw || '[]');
    } catch (e) {
      available = [];
    }
    var initial = [];
    try {
      initial = JSON.parse(initialRaw || '[]');
    } catch (e) {
      initial = [];
    }

    var nameToId = {};
    available.forEach(function (t) {
      nameToId[normName(t.name)] = t.id;
    });

    var selected = initial.map(function (t) {
      return { id: t.id, name: t.name };
    });

    function syncHidden() {
      hiddenWrap.innerHTML = '';
      selected.forEach(function (t) {
        var inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = 'tag_ids[]';
        inp.value = String(t.id);
        hiddenWrap.appendChild(inp);
      });
    }

    function renderTags() {
      if (!selected.length) {
        listEl.innerHTML =
          '<p class="jkhive-bullets-empty">Ninguna etiqueta. Escribí el nombre (autocompletado) y agregá con el botón hexagonal.</p>';
        syncHidden();
        return;
      }
      listEl.innerHTML = selected
        .map(function (t, idx) {
          return (
            '<div class="jkhive-bullet-item" data-tag-id="' +
            t.id +
            '" data-index="' +
            idx +
            '">' +
            '<span class="jkhive-bullet-text">' +
            escapeHtml(t.name) +
            '</span>' +
            '<button type="button" class="jkhive-bullet-remove" data-tooltip="Quitar etiqueta" aria-label="Quitar etiqueta">' +
            '<i class="fas fa-times" aria-hidden="true"></i>' +
            '</button></div>'
          );
        })
        .join('');
      listEl.querySelectorAll('.jkhive-bullet-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.jkhive-bullet-item');
          if (!item) {
            return;
          }
          var i = parseInt(item.getAttribute('data-index'), 10);
          if (isNaN(i)) {
            return;
          }
          selected.splice(i, 1);
          renderTags();
        });
      });
      syncHidden();
    }

    renderTags();

    if (addBtn && input) {
      addBtn.addEventListener('click', function () {
        var name = input.value.trim();
        if (!name) {
          return;
        }
        var id = nameToId[normName(name)];
        if (!id) {
          if (typeof window.systemMessages !== 'undefined' && window.systemMessages.error) {
            window.systemMessages.error(
              'Elegí una etiqueta de la lista o creadla en «Etiquetas de skills».',
              'Etiqueta desconocida'
            );
          } else {
            window.alert(
              'Etiqueta no encontrada. Usá el autocompletado o creá la etiqueta arriba.'
            );
          }
          return;
        }
        if (selected.some(function (t) {
          return t.id === id;
        })) {
          input.value = '';
          return;
        }
        selected.push({ id: id, name: name });
        input.value = '';
        input.focus();
        renderTags();
      });
    }
  }

  function init() {
    document.querySelectorAll('form.jkhive-about-lines-form').forEach(initSkillLineForm);
    document.querySelectorAll('form[data-jkhive-exp-tags="1"]').forEach(initExpTags);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
