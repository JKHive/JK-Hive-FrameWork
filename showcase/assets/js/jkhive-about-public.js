/**
 * JK Hive — About público: modal perfil (clic en hex vitrina) + modales de experiencia.
 */
(function () {
    'use strict';

    function initProfileModal() {
        var modal = document.getElementById('jkhive-about-profile-modal');
        var trigger = document.querySelector('.jkhive-about-profile-hex-trigger');
        if (!modal || !trigger) {
            return;
        }

        function closeModal() {
            modal.classList.remove('active');
            setTimeout(function () {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                modal.setAttribute('aria-hidden', 'true');
            }, 280);
        }

        function openModal() {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(function () {
                modal.classList.add('active');
            }, 10);
        }

        var actionsRow = trigger.querySelector('.jkhive-hex-gallery-actions');
        if (actionsRow) {
            actionsRow.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });

        modal.querySelectorAll('[data-about-close-profile]').forEach(function (el) {
            el.addEventListener('click', function () {
                closeModal();
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    function initExperienceTriggers() {
        document.querySelectorAll('.jkhive-about-exp-trigger').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                var id = a.getAttribute('data-exp-id');
                if (!id || typeof window.openExperienceModal !== 'function') {
                    return;
                }
                window.openExperienceModal(id);
            });
        });
    }

    function init() {
        initProfileModal();
        initExperienceTriggers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
