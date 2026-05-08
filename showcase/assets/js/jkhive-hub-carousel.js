/**
 * JK Hive — Carrusel hex (primera sección): transición oficial jkhive-transition en slides.
 * Modales de detalle: apertura/cierre simple, sin animación de transición.
 */
(function () {
  'use strict';

  var PHASE1_MS = 1500;
  var PHASE23_TOTAL_MS = 3500;
  var PHASE3_START_MS = 1120;
  var PHASE4_MS = 1500;
  var TRANSITION_TOTAL_MS = PHASE1_MS + PHASE23_TOTAL_MS + PHASE4_MS;

  var DIR_LEFT = {
    forwardOut: 'jkhive-transition-phase2-out-left',
    backwardOut: 'jkhive-transition-phase2-out-right',
    forwardIn: 'jkhive-transition-phase3-from-right',
    backwardIn: 'jkhive-transition-phase3-from-left'
  };

  var PHASE2_OUT = [
    'jkhive-transition-phase2-out-left',
    'jkhive-transition-phase2-out-right',
    'jkhive-transition-phase2-out-up',
    'jkhive-transition-phase2-out-down'
  ];
  var PHASE3_FROM = [
    'jkhive-transition-phase3-from-left',
    'jkhive-transition-phase3-from-right',
    'jkhive-transition-phase3-from-up',
    'jkhive-transition-phase3-from-down'
  ];
  var PHASE4 = ['jkhive-transition-phase4-grow-full'];
  var OUT = [
    'jkhive-transition-out-left',
    'jkhive-transition-out-right',
    'jkhive-transition-out-up',
    'jkhive-transition-out-down'
  ];
  var IN = [
    'jkhive-transition-in-from-left',
    'jkhive-transition-in-from-right',
    'jkhive-transition-in-from-up',
    'jkhive-transition-in-from-down'
  ];

  function clearTransitionClasses(el) {
    if (!el) return;
    PHASE2_OUT.forEach(function (c) { el.classList.remove(c); });
    PHASE3_FROM.forEach(function (c) { el.classList.remove(c); });
    PHASE4.forEach(function (c) { el.classList.remove(c); });
    OUT.forEach(function (c) { el.classList.remove(c); });
    IN.forEach(function (c) { el.classList.remove(c); });
    el.classList.remove('jkhive-transition-phase1-shrink-center', 'jkhive-transition-phase3-reduced-center');
  }

  /**
   * @param {HTMLElement} stage
   * @param {HTMLElement} fromSlide
   * @param {HTMLElement} toSlide
   * @param {boolean} forward true = siguiente (sale a la izquierda, entra desde la derecha)
   * @param {function():void} onComplete
   */
  function runSlideTransition(stage, fromSlide, toSlide, forward, onComplete) {
    if (!stage || !fromSlide || !toSlide) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    var map = forward
      ? { outClass: DIR_LEFT.forwardOut, inClass: DIR_LEFT.forwardIn }
      : { outClass: DIR_LEFT.backwardOut, inClass: DIR_LEFT.backwardIn };

    var timeouts = [];
    var cancelled = false;

    function q(fn, delay) {
      var id = setTimeout(function () {
        if (cancelled) return;
        fn();
      }, delay);
      timeouts.push(id);
    }

    clearTransitionClasses(fromSlide);
    clearTransitionClasses(toSlide);
    stage.classList.add('jkhive-modal-tipos-transitioning');
    stage.classList.remove('jkhive-modal-tipos-phase2-active');
    fromSlide.classList.add('jkhive-transition-visible');
    fromSlide.setAttribute('aria-hidden', 'false');
    toSlide.classList.remove('jkhive-transition-visible');
    toSlide.setAttribute('aria-hidden', 'true');
    void fromSlide.offsetWidth;

    q(function () {
      fromSlide.classList.add('jkhive-transition-phase1-shrink-center');
    }, 0);

    q(function () {
      stage.classList.add('jkhive-modal-tipos-phase2-active');
      fromSlide.classList.remove('jkhive-transition-phase1-shrink-center');
      void fromSlide.offsetWidth;
      fromSlide.classList.add(map.outClass);
    }, PHASE1_MS);

    q(function () {
      clearTransitionClasses(toSlide);
      toSlide.setAttribute('aria-hidden', 'false');
      toSlide.classList.add('jkhive-transition-visible');
      toSlide.classList.add(map.inClass);
      void toSlide.offsetWidth;
      toSlide.classList.remove(map.inClass);
      toSlide.classList.add('jkhive-transition-phase3-reduced-center');
    }, PHASE1_MS + PHASE3_START_MS);

    q(function () {
      stage.classList.remove('jkhive-modal-tipos-phase2-active');
      void toSlide.offsetWidth;
      toSlide.classList.add('jkhive-transition-phase4-grow-full');
    }, PHASE1_MS + PHASE23_TOTAL_MS);

    q(function () {
      clearTransitionClasses(fromSlide);
      clearTransitionClasses(toSlide);
      fromSlide.classList.remove('jkhive-transition-visible');
      fromSlide.setAttribute('aria-hidden', 'true');
      toSlide.classList.add('jkhive-transition-visible');
      toSlide.setAttribute('aria-hidden', 'false');
      stage.classList.remove('jkhive-modal-tipos-transitioning', 'jkhive-modal-tipos-phase2-active');
      if (typeof onComplete === 'function') onComplete();
    }, TRANSITION_TOTAL_MS);

    return function cancel() {
      cancelled = true;
      timeouts.forEach(function (id) { clearTimeout(id); });
      stage.classList.remove('jkhive-modal-tipos-transitioning', 'jkhive-modal-tipos-phase2-active');
    };
  }

  function init() {
    var stage = document.getElementById('jkHubCarouselStage');
    var dataEl = document.getElementById('jk-hub-carousel-items');
    var modal = document.getElementById('jkHubDetailModal');
    if (!stage || !dataEl || !modal) return;

    var items;
    try {
      items = JSON.parse(dataEl.textContent || '[]');
    } catch (e) {
      return;
    }
    if (!Array.isArray(items) || items.length === 0) return;

    var slides = stage.querySelectorAll('.jkhive-hub-carousel-slide');
    if (slides.length !== items.length) return;

    var prevBtn = document.querySelector('.jkhive-hub-carousel-arrow-prev');
    var nextBtn = document.querySelector('.jkhive-hub-carousel-arrow-next');
    var current = 0;
    var transitioning = false;
    var cancelTransition = null;
    var autoplayTimer = null;
    var modalOpen = false;
    var idleAfterMs = 5500;

    var contactHref = modal.getAttribute('data-contact-href') || 'contact.php';

    function stopAutoplay() {
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function scheduleAutoplay() {
      stopAutoplay();
      if (modalOpen || slides.length <= 1) return;
      autoplayTimer = setTimeout(function () {
        autoplayTimer = null;
        if (modalOpen) return;
        goNext();
      }, idleAfterMs);
    }

    function setArrowDisabled() {
      var single = slides.length <= 1;
      if (prevBtn) prevBtn.disabled = single || transitioning;
      if (nextBtn) nextBtn.disabled = single || transitioning;
    }

    function goTo(targetIndex, forward, done) {
      if (transitioning || slides.length <= 1) {
        if (typeof done === 'function') done();
        return;
      }
      var n = slides.length;
      var next = ((targetIndex % n) + n) % n;
      if (next === current) {
        if (typeof done === 'function') done();
        return;
      }
      transitioning = true;
      setArrowDisabled();
      stopAutoplay();
      if (cancelTransition) cancelTransition();

      var fromEl = slides[current];
      var toEl = slides[next];
      cancelTransition = runSlideTransition(stage, fromEl, toEl, forward, function () {
        transitioning = false;
        cancelTransition = null;
        current = next;
        setArrowDisabled();
        if (typeof done === 'function') done();
        scheduleAutoplay();
      });
    }

    function goNext(done) {
      goTo(current + 1, true, done);
    }

    function goPrev(done) {
      goTo(current - 1, false, done);
    }

    function openModal(index) {
      var data = items[index];
      if (!data) return;
      modalOpen = true;
      stopAutoplay();

      var titleEl = document.getElementById('jkHubDetailTitle');
      var subEl = document.getElementById('jkHubDetailSubtitle');
      var bodyEl = document.getElementById('jkHubDetailBody');
      var iconWrap = document.getElementById('jkHubDetailIcon');
      var logoEl = document.getElementById('jkHubDetailLogo');
      var siteBtn = document.getElementById('jkHubDetailSiteBtn');

      if (titleEl) titleEl.textContent = data.title || '';
      if (subEl) subEl.textContent = data.subtitle || '';
      if (bodyEl) bodyEl.textContent = data.body || '';

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

      if (siteBtn) {
        siteBtn.href = data.href || '#';
        if (data.external) {
          siteBtn.setAttribute('target', '_blank');
          siteBtn.setAttribute('rel', 'noopener noreferrer');
        } else {
          siteBtn.removeAttribute('target');
          siteBtn.removeAttribute('rel');
        }
      }

      var contactBtn = document.getElementById('jkHubDetailContactBtn');
      if (contactBtn) contactBtn.href = contactHref;

      document.body.classList.add('jkhive-hub-detail-modal-open');
      modal.style.display = 'flex';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modalOpen = false;
      document.body.classList.remove('jkhive-hub-detail-modal-open');
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      scheduleAutoplay();
    }

    slides.forEach(function (slide, idx) {
      var trigger = slide.querySelector('.jkhive-hub-carousel-hex-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function () {
        if (transitioning) return;
        if (idx !== current) return;
        openModal(idx);
      });
      trigger.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          if (!transitioning && idx === current) openModal(idx);
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (transitioning) return;
        goPrev();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (transitioning) return;
        goNext();
      });
    }

    modal.querySelectorAll('[data-hub-detail-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeModal();
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && modalOpen) {
        closeModal();
      }
    });

    setArrowDisabled();
    scheduleAutoplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
