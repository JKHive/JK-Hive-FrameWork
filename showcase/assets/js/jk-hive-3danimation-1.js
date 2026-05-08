/**
 * JK Hive — API mínima jk-hive-3danimation-1 para mensajería (modales hex apilados).
 */
(function () {
  'use strict';

  function q(el, sel) {
    return el ? el.querySelector(sel) : null;
  }

  function waitTransition(el) {
    return new Promise(function (resolve) {
      if (!el) {
        resolve();
        return;
      }
      var done = function () {
        el.removeEventListener('animationend', done);
        resolve();
      };
      el.addEventListener('animationend', done);
      window.setTimeout(done, 800);
    });
  }

  window.JKHive3dAnimation1 = {
    /**
     * Modal lectura (#messageViewModalHex .jkhive-modal-message-content | .jkhive-modal-content) → aparece responder.
     */
    messagingOpenReply: function messagingOpenReply(viewModal, replyModal) {
      var viewContent =
        q(viewModal, '.jkhive-modal-message-content') || q(viewModal, '.jkhive-modal-content');
      var replyContent = q(replyModal, '.jkhive-modal-content');

      viewContent &&
        viewContent.classList.remove('jk-hive-3danimation-1-enter-from-above',
          'jk-hive-3danimation-1-exit-down', 'jk-hive-3danimation-1-enter-from-below');
      replyContent &&
        replyContent.classList.remove(
          'jk-hive-3danimation-1-exit-down',
          'jk-hive-3danimation-1-enter-from-below',
          'jk-hive-3danimation-1-exit-up'
        );

      replyModal.style.display = 'none';
      replyModal.classList.remove('active', 'show');

      if (!window.JKHIVE_MESSAGES_SHOWCASE_UI || !viewModal || !viewContent) {
        replyModal.style.display = 'flex';
        replyModal.classList.add('active', 'show');
        document.body.style.overflow = 'hidden';
        return Promise.resolve();
      }

      viewContent.classList.add('jk-hive-3danimation-1-exit-up');
      return waitTransition(viewContent).then(function () {
        viewModal.style.visibility = 'hidden';
        viewContent.classList.remove('jk-hive-3danimation-1-exit-up');
        replyModal.style.display = 'flex';
        replyModal.classList.add('active', 'show');
        document.body.style.overflow = 'hidden';
        if (!replyContent) return;
        replyContent.classList.add('jk-hive-3danimation-1-enter-from-below');
        return waitTransition(replyContent).then(function () {
          replyContent.classList.remove('jk-hive-3danimation-1-enter-from-below');
        });
      });
    },

    /**
     * Cierra responder (animación abajo) y restaura lectura cuando sigue abierta la vista.
     */
    messagingCloseReply: function messagingCloseReply(viewModal, replyModal) {
      var viewContent =
        viewModal &&
        (q(viewModal, '.jkhive-modal-message-content') || q(viewModal, '.jkhive-modal-content'));
      var replyContent = q(replyModal, '.jkhive-modal-content');

      if (!window.JKHIVE_MESSAGES_SHOWCASE_UI || !replyModal || !replyContent) {
        replyModal.style.display = 'none';
        replyModal.classList.remove('active', 'show');
        if (viewModal) viewModal.style.visibility = '';
        document.body.style.overflow = '';
        return Promise.resolve();
      }

      replyContent.classList.remove('jk-hive-3danimation-1-enter-from-below');
      replyContent.classList.add('jk-hive-3danimation-1-exit-down');
      return waitTransition(replyContent).then(function () {
        replyContent.classList.remove('jk-hive-3danimation-1-exit-down');
        replyModal.style.display = 'none';
        replyModal.classList.remove('active', 'show');

        if (viewModal && viewContent && document.body.contains(viewModal)) {
          viewModal.style.visibility = '';
          viewContent.classList.add('jk-hive-3danimation-1-enter-from-above');
          return waitTransition(viewContent).then(function () {
            viewContent.classList.remove('jk-hive-3danimation-1-enter-from-above');
          });
        }
        document.body.style.overflow = '';
        return undefined;
      });
    },

    /**
     * Tras enviar respuesta: cerrar responder “hacia abajo” sin restaurar la vista de lectura.
     */
    messagingDismissSent: function messagingDismissSent(viewModal, replyModal) {
      var viewContent =
        viewModal &&
        (q(viewModal, '.jkhive-modal-message-content') || q(viewModal, '.jkhive-modal-content'));
      var replyContent = q(replyModal, '.jkhive-modal-content');

      if (!window.JKHIVE_MESSAGES_SHOWCASE_UI || !replyModal || !replyContent) {
        if (replyModal) {
          replyModal.style.display = 'none';
          replyModal.classList.remove('active', 'show');
        }
        if (viewModal) {
          viewModal.style.visibility = '';
        }
        document.body.style.overflow = '';
        return Promise.resolve();
      }

      viewContent &&
        viewContent.classList.remove(
          'jk-hive-3danimation-1-exit-up',
          'jk-hive-3danimation-1-enter-from-above',
          'jk-hive-3danimation-1-enter-from-below',
        );
      replyContent.classList.remove(
        'jk-hive-3danimation-1-enter-from-below',
        'jk-hive-3danimation-1-enter-from-above',
      );
      replyContent.classList.add('jk-hive-3danimation-1-exit-down');
      return waitTransition(replyContent).then(function () {
        replyContent.classList.remove('jk-hive-3danimation-1-exit-down');
        replyModal.style.display = 'none';
        replyModal.classList.remove('active', 'show');
        if (viewModal) {
          viewModal.style.visibility = '';
        }
        document.body.style.overflow = '';
      });
    },
  };
})();
