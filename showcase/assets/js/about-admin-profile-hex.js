/**
 * Admin About — perfil dentro del hex: campos bloqueados, edición en línea (lápiz / ticket / Enter / Esc / blur).
 */
(function () {
  'use strict';

  var cfgEl = document.getElementById('jkhive-about-admin-profile-cfg');
  if (!cfgEl) return;

  var cfg;
  try {
    cfg = JSON.parse(cfgEl.textContent || '{}');
  } catch (e) {
    return;
  }
  if (!cfg.postUrl || !cfg.csrf) return;

  var root = document.getElementById('jkhiveAboutAdminProfileRoot');
  if (!root) return;

  var activeWrap = null;
  var photoPreview = document.getElementById('jk-about-admin-photo-preview');
  var photoInput = document.getElementById('jk-about-admin-photo-url');
  var photoPick = document.getElementById('jk-about-admin-photo-pick');
  var photoFile = document.getElementById('jk-about-admin-photo-file');
  var photoPreviewWrap = photoPreview ? photoPreview.closest('.jkhive-about-admin-profile-photo-preview-wrap') : null;

  function resolvePhotoUrl(v) {
    var base = (cfg.photoBase || '').replace(/\/?$/, '/');
    v = (v || '').trim();
    if (!v) return base + 'public/assets/img/about/profile-placeholder.svg';
    if (/^https?:\/\//i.test(v)) return v;
    return base + v.replace(/^\//, '');
  }

  function getPrimaryControl(wrap) {
    var cb = wrap.querySelector('.jkhive-about-inline-checkbox');
    if (cb) return cb;
    return wrap.querySelector('.jkhive-about-inline-input');
  }

  function getValue(wrap, el) {
    if (el.type === 'checkbox') return el.checked ? '1' : '0';
    return el.value;
  }

  function setLocked(wrap, locked) {
    var el = getPrimaryControl(wrap);
    if (!el) return;
    if (el.type === 'checkbox') {
      el.disabled = locked;
    } else {
      el.readOnly = locked;
    }
    wrap.classList.toggle('is-locked', locked);
    wrap.classList.toggle('is-editing', !locked);
  }

  function snapshot(wrap) {
    var el = getPrimaryControl(wrap);
    if (!el) return;
    if (el.type === 'checkbox') {
      wrap.setAttribute('data-original-checked', el.checked ? '1' : '0');
    } else {
      wrap.setAttribute('data-original', el.value);
    }
  }

  function restore(wrap) {
    var el = getPrimaryControl(wrap);
    if (!el) return;
    if (el.type === 'checkbox') {
      el.checked = wrap.getAttribute('data-original-checked') === '1';
    } else {
      el.value = wrap.getAttribute('data-original') || '';
    }
  }

  function cancelEdit(wrap) {
    if (!wrap.classList.contains('is-editing')) return;
    restore(wrap);
    setLocked(wrap, true);
    if (activeWrap === wrap) activeWrap = null;
  }

  function startEdit(wrap) {
    if (wrap.classList.contains('is-saving')) return;
    if (activeWrap && activeWrap !== wrap) cancelEdit(activeWrap);
    activeWrap = wrap;
    snapshot(wrap);
    setLocked(wrap, false);
    var el = getPrimaryControl(wrap);
    if (el) {
      el.focus();
      if (typeof el.select === 'function' && el.tagName === 'INPUT' && el.type !== 'checkbox') {
        el.select();
      }
    }
  }

  function toast(msg, type) {
    if (typeof showToastBar === 'function') {
      showToastBar(msg, type || 'info', { autoCloseMs: type === 'error' ? 5000 : 2600 });
    }
  }

  function saveWrap(wrap) {
    if (!wrap.classList.contains('is-editing') || wrap.classList.contains('is-saving')) return;
    var field = wrap.getAttribute('data-field');
    if (!field) return;
    var el = getPrimaryControl(wrap);
    if (!el) return;

    var value = getValue(wrap, el);
    var orig = el.type === 'checkbox'
      ? wrap.getAttribute('data-original-checked')
      : (wrap.getAttribute('data-original') || '');
    var curSnap = el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value;
    if (el.type === 'checkbox') {
      if (curSnap === orig) {
        setLocked(wrap, true);
        activeWrap = null;
        return;
      }
    } else if (curSnap === orig) {
      setLocked(wrap, true);
      activeWrap = null;
      return;
    }

    wrap.classList.add('is-saving');
    var params = new URLSearchParams();
    params.set('csrf_token', cfg.csrf);
    params.set('action', 'profile_field_save');
    params.set('field', field);
    params.set('value', value);

    fetch(cfg.postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: params.toString(),
      credentials: 'same-origin',
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (r) {
        wrap.classList.remove('is-saving');
        if (r.data && r.data.ok) {
          if (typeof r.data.value === 'string' && el && el.type !== 'checkbox') {
            el.value = r.data.value;
          }
          snapshot(wrap);
          setLocked(wrap, true);
          activeWrap = null;
          if (field === 'profile_photo_url' && photoPreview && photoInput) {
            photoPreview.src = resolvePhotoUrl(photoInput.value);
          }
          toast('Guardado.', 'success');
        } else {
          var err = (r.data && r.data.error) ? r.data.error : 'No se pudo guardar.';
          toast(err, 'error');
        }
      })
      .catch(function () {
        wrap.classList.remove('is-saving');
        toast('Error de red al guardar.', 'error');
      });
  }

  function onDocumentKeydown(e) {
    if (e.key === 'Escape' && activeWrap) {
      e.preventDefault();
      cancelEdit(activeWrap);
    }
  }

  root.querySelectorAll('.jkhive-about-inline-field').forEach(function (wrap) {
    var pen = wrap.querySelector('.jkhive-about-inline-pen');
    var ticket = wrap.querySelector('.jkhive-about-inline-ticket');
    var el = getPrimaryControl(wrap);
    var multiline = wrap.getAttribute('data-multiline') === '1';

    setLocked(wrap, true);

    if (pen) {
      pen.addEventListener('mousedown', function (ev) {
        ev.preventDefault();
      });
      pen.addEventListener('click', function () {
        startEdit(wrap);
      });
    }
    if (ticket) {
      ticket.addEventListener('mousedown', function (ev) {
        ev.preventDefault();
      });
      ticket.addEventListener('click', function () {
        saveWrap(wrap);
      });
    }

    wrap.addEventListener('click', function (e) {
      if (wrap.classList.contains('is-editing')) return;
      if (e.target.closest('.jkhive-about-inline-btn')) return;
      startEdit(wrap);
    });

    wrap.addEventListener('keydown', function (e) {
      if (!wrap.classList.contains('is-editing')) return;
      var c = getPrimaryControl(wrap);
      if (c && c.type === 'checkbox' && e.key === 'Enter') {
        e.preventDefault();
        saveWrap(wrap);
      }
    });

    if (el && el.type !== 'checkbox') {
      el.addEventListener('keydown', function (e) {
        if (!wrap.classList.contains('is-editing')) return;
        if (e.key === 'Enter') {
          if (multiline) {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              saveWrap(wrap);
            }
          } else {
            e.preventDefault();
            saveWrap(wrap);
          }
        }
      });

      el.addEventListener('blur', function () {
        if (!wrap.classList.contains('is-editing')) return;
        setTimeout(function () {
          if (!wrap.classList.contains('is-editing')) return;
          var ae = document.activeElement;
          if (ae && wrap.contains(ae)) return;
          cancelEdit(wrap);
        }, 150);
      });
    }

    if (el && el.type === 'checkbox') {
      wrap.addEventListener('focusout', function () {
        if (!wrap.classList.contains('is-editing')) return;
        setTimeout(function () {
          if (!wrap.contains(document.activeElement)) {
            cancelEdit(wrap);
          }
        }, 0);
      });
    }
  });

  document.addEventListener('keydown', onDocumentKeydown);

  if (photoInput && photoPreview) {
    photoInput.addEventListener('input', function () {
      var f = photoInput.closest('.jkhive-about-inline-field');
      if (!f || !f.classList.contains('is-editing')) return;
      photoPreview.src = resolvePhotoUrl(photoInput.value);
    });
  }

  function uploadProfilePhoto(file) {
    if (!file || !photoPreviewWrap) return;
    var fd = new FormData();
    fd.append('csrf_token', cfg.csrf);
    fd.append('action', 'profile_photo_upload');
    fd.append('photo', file);
    photoPreviewWrap.classList.add('is-uploading');
    if (photoPick) photoPick.disabled = true;
    fetch(cfg.postUrl, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: fd,
      credentials: 'same-origin',
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (r) {
        photoPreviewWrap.classList.remove('is-uploading');
        if (photoPick) photoPick.disabled = false;
        if (photoFile) photoFile.value = '';
        if (r.data && r.data.ok && typeof r.data.value === 'string' && photoInput && photoPreview) {
          photoInput.value = r.data.value;
          var wrap = photoInput.closest('.jkhive-about-inline-field');
          if (wrap) {
            wrap.setAttribute('data-original', r.data.value);
          }
          photoInput.dispatchEvent(new Event('input', { bubbles: true }));
          var url = resolvePhotoUrl(r.data.value);
          photoPreview.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + String(Date.now());
          toast('Foto actualizada.', 'success');
        } else {
          var err = r.data && r.data.error ? r.data.error : 'No se pudo subir la foto.';
          toast(err, 'error');
        }
      })
      .catch(function () {
        photoPreviewWrap.classList.remove('is-uploading');
        if (photoPick) photoPick.disabled = false;
        if (photoFile) photoFile.value = '';
        toast('Error de red al subir.', 'error');
      });
  }

  if (photoPick && photoFile) {
    photoPick.addEventListener('mousedown', function (ev) {
      ev.preventDefault();
    });
    photoPick.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      photoFile.click();
    });
    photoFile.addEventListener('change', function () {
      var f = photoFile.files && photoFile.files[0];
      if (f) uploadProfilePhoto(f);
    });
  }
})();
