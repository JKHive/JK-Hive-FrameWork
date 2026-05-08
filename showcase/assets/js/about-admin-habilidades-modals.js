/**
 * About admin — Habilidades: modales (línea + mantenedor + sección), mismo patrón show/display:flex que profile.php.
 */
(function () {
  'use strict';

  var stack = [];

  function modalEl(id) {
    return document.getElementById(id);
  }

  function openModal(id) {
    var m = modalEl(id);
    if (!m) return;
    m.classList.add('show');
    m.style.display = 'flex';
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('jkhive-admin-modal-open');
    stack.push(id);
  }

  function closeModal(id) {
    var m = modalEl(id);
    if (!m) return;
    m.classList.remove('show');
    m.style.display = 'none';
    m.setAttribute('aria-hidden', 'true');
    var i = stack.lastIndexOf(id);
    if (i >= 0) stack.splice(i, 1);
    if (stack.length === 0) {
      document.body.classList.remove('jkhive-admin-modal-open');
    }
  }

  window.jkAboutModalOpen = openModal;
  window.jkAboutModalClose = closeModal;

  function firstSectionId() {
    var sel = document.getElementById('aboutSkillLineSection');
    if (!sel || !sel.options.length) return 0;
    return parseInt(sel.options[0].value, 10) || 0;
  }

  function resetSkillLineFormForNew() {
    var f = document.getElementById('aboutSkillLineForm');
    if (!f) return;
    f.reset();
    var hid = document.getElementById('aboutSkillLineFormId');
    if (hid) hid.value = '0';
    var sid = firstSectionId();
    var sec = document.getElementById('aboutSkillLineSection');
    if (sec && sid) sec.value = String(sid);
    var sort = document.getElementById('aboutSkillLineSort');
    if (sort) sort.value = '0';
    var act = document.getElementById('aboutSkillLineActive');
    if (act) act.checked = true;
    var t = document.getElementById('aboutSkillLineModalTitle');
    if (t) t.textContent = 'Nueva habilidad';
  }

  function openSkillLineNew() {
    resetSkillLineFormForNew();
    openModal('aboutSkillLineModal');
  }

  function resetTagFormForNew() {
    var idEl = document.getElementById('aboutTagFormId');
    var nameEl = document.getElementById('aboutTagFormName');
    if (idEl) idEl.value = '0';
    if (nameEl) nameEl.value = '';
  }

  function resetSectionFormForNew() {
    var f = document.getElementById('aboutSectionForm');
    if (!f) return;
    f.reset();
    var id = document.getElementById('aboutSectionFormId');
    if (id) id.value = '0';
    var ic = document.getElementById('aboutSectionIcon');
    if (ic) ic.value = 'fas fa-star';
    var so = document.getElementById('aboutSectionSort');
    if (so) so.value = '100';
    var ac = document.getElementById('aboutSectionActive');
    if (ac) ac.checked = true;
    var ti = document.getElementById('aboutSectionFormModalTitle');
    if (ti) ti.textContent = 'Nueva sección';
  }

  function fillSectionForm(data) {
    var id = document.getElementById('aboutSectionFormId');
    var title = document.getElementById('aboutSectionTitle');
    var ic = document.getElementById('aboutSectionIcon');
    var so = document.getElementById('aboutSectionSort');
    var ac = document.getElementById('aboutSectionActive');
    var ti = document.getElementById('aboutSectionFormModalTitle');
    if (id) id.value = String(data.id || 0);
    if (title) title.value = data.title || '';
    if (ic) ic.value = data.icon_class || 'fas fa-star';
    if (so) so.value = String(data.sort_order != null ? data.sort_order : 0);
    if (ac) ac.checked = !!data.is_active;
    if (ti) ti.textContent = 'Editar sección';
  }

  document.addEventListener('click', function (e) {
    var closeId = e.target && e.target.getAttribute && e.target.getAttribute('data-jk-about-close');
    if (!closeId) {
      var p = e.target.closest && e.target.closest('[data-jk-about-close]');
      if (p) closeId = p.getAttribute('data-jk-about-close');
    }
    if (closeId) {
      e.preventDefault();
      closeModal(closeId);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var btnNew = document.getElementById('jkAboutBtnNewSkill');
    if (btnNew) btnNew.addEventListener('click', function () {
      if (btnNew.disabled) return;
      openSkillLineNew();
    });

    var btnMaint = document.getElementById('jkAboutBtnOpenMaint');
    if (btnMaint) btnMaint.addEventListener('click', function () {
      openModal('aboutSectionsMaintModal');
    });

    var btnMaintNewSkill = document.getElementById('jkAboutMaintBtnNewSkill');
    if (btnMaintNewSkill) btnMaintNewSkill.addEventListener('click', function () {
      if (btnMaintNewSkill.disabled) return;
      openSkillLineNew();
    });

    var btnMaintNewSec = document.getElementById('jkAboutMaintBtnNewSection');
    if (btnMaintNewSec) btnMaintNewSec.addEventListener('click', function () {
      resetSectionFormForNew();
      openModal('aboutSectionFormModal');
    });

    var btnMaintNewTag = document.getElementById('jkAboutMaintBtnNewTag');
    if (btnMaintNewTag) btnMaintNewTag.addEventListener('click', function () {
      resetTagFormForNew();
      openModal('aboutSectionsMaintModal');
      var b = document.getElementById('aboutMaintTagBlock');
      if (b && typeof b.scrollIntoView === 'function') {
        setTimeout(function () { b.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
      }
    });

    document.querySelectorAll('.jk-about-sec-edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var raw = btn.getAttribute('data-section');
        if (!raw) return;
        try {
          var data = JSON.parse(raw);
          fillSectionForm(data);
          openModal('aboutSectionFormModal');
        } catch (err) {}
      });
    });

    var resetSkill = document.getElementById('aboutSkillLineFormReset');
    if (resetSkill) resetSkill.addEventListener('click', function () {
      var idEl = document.getElementById('aboutSkillLineFormId');
      var isNew = !idEl || idEl.value === '0' || idEl.value === '';
      if (isNew) {
        resetSkillLineFormForNew();
      } else {
        var f = document.getElementById('aboutSkillLineForm');
        if (f) f.reset();
      }
    });
  });
})();
