/**
 * JK Hive — Portafolio público: modal de detalle (mismo patrón que jkhive-hub-carousel.js / index).
 */
(function () {
  'use strict';

  function init() {
    var dataEl = document.getElementById('jk-portfolio-modal-items');
    var modal = document.getElementById('jkPortfolioDetailModal');
    if (!dataEl || !modal) {
      return;
    }

    var items;
    try {
      items = JSON.parse(dataEl.textContent || '[]');
    } catch (e) {
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    var byAnchor = {};
    items.forEach(function (it) {
      if (it && it.anchor) {
        byAnchor[String(it.anchor)] = it;
      }
    });

    var modalOpen = false;
    var contactHref = modal.getAttribute('data-contact-href') || 'contact.php';

    function closeModal() {
      modalOpen = false;
      document.body.classList.remove('jkhive-hub-detail-modal-open');
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }

    function openModal(data) {
      if (!data) {
        return;
      }
      modalOpen = true;

      var titleEl = document.getElementById('jkPortfolioDetailTitle');
      var subEl = document.getElementById('jkPortfolioDetailSubtitle');
      var bodyEl = document.getElementById('jkPortfolioDetailBody');
      var iconWrap = document.getElementById('jkPortfolioDetailIcon');
      var logoEl = document.getElementById('jkPortfolioDetailLogo');
      var siteBtn = document.getElementById('jkPortfolioDetailSiteBtn');
      var siteBtnWrap = document.getElementById('jkPortfolioDetailSiteBtnWrap');

      if (titleEl) {
        titleEl.textContent = data.title || '';
      }
      if (subEl) {
        subEl.textContent = data.subtitle || '';
      }

      if (bodyEl) {
        bodyEl.innerHTML = '';
        var bh = String(data.bodyHtml || '').trim();
        var mt = String(data.modalText || '').trim();
        if (bh !== '') {
          bodyEl.innerHTML = bh;
        } else if (mt !== '') {
          bodyEl.textContent = mt;
        }
      }

      var iconClass = data.iconClass || 'fa-circle';
      var safeIcon = /^fa-[a-z0-9-]+$/i.test(String(iconClass)) ? iconClass : 'fa-circle';
      if (iconWrap) {
        iconWrap.textContent = '';
        var ic = document.createElement('i');
        ic.className = 'fas ' + safeIcon;
        ic.setAttribute('aria-hidden', 'true');
        iconWrap.appendChild(ic);
        iconWrap.style.display = data.logoUrl ? 'none' : '';
      }
      if (logoEl) {
        var lu = String(data.logoUrl || '').trim();
        if (lu && /^(\/|https?:\/\/)\S+$/i.test(lu)) {
          logoEl.src = lu;
          logoEl.alt = data.title || '';
          logoEl.style.display = '';
        } else {
          logoEl.removeAttribute('src');
          logoEl.style.display = 'none';
        }
      }

      var href = String(data.href || '');
      var isAnchorOnly = /^#p\d+$/i.test(href);
      if (siteBtn && siteBtnWrap) {
        if (isAnchorOnly) {
          siteBtnWrap.style.display = 'none';
        } else {
          siteBtnWrap.style.display = '';
          siteBtn.href = href || '#';
          if (data.external) {
            siteBtn.setAttribute('target', '_blank');
            siteBtn.setAttribute('rel', 'noopener noreferrer');
          } else {
            siteBtn.removeAttribute('target');
            siteBtn.removeAttribute('rel');
          }
        }
      }

      var contactBtn = document.getElementById('jkPortfolioDetailContactBtn');
      if (contactBtn) {
        contactBtn.href = contactHref;
      }

      document.body.classList.add('jkhive-hub-detail-modal-open');
      modal.style.display = 'flex';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }

    document.querySelectorAll('.jkhive-portfolio-services-hexlink[data-portfolio-modal="1"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href') || '';
        if (!/^#p\d+$/i.test(href)) {
          return;
        }
        var key = href.replace(/^#/, '');
        var data = byAnchor[key];
        if (!data) {
          return;
        }
        e.preventDefault();
        openModal(data);
      });
    });

    modal.querySelectorAll('[data-portfolio-detail-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeModal();
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && modalOpen) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
