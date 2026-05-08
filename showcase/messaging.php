<?php
declare(strict_types=1);

$jk_nav = 'messaging';
$jk_page_title = 'JK Hive Showcase - Mensajería';
$jk_breadcrumb = 'Mensajería';
$jk_body_class = 'page-public jkhive-showcase-body admin-layout crm-layout';
$jk_messaging_full = true;
$jk_extra_css =
    '<link rel="stylesheet" href="assets/css/messaging.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jkfw-showcase-crud.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/crm.css">' . "\n" .
    '<link rel="stylesheet" href="assets/css/jk-hive-3danimation-1.css">' . "\n";

$jk_body_top_script = <<<'HTML'
<script>
window.JKHIVE_MESSAGES_SHOWCASE = true;
window.JKHIVE_MESSAGES_SHOWCASE_UI = true;
window.AuthManager = window.AuthManager || {};
window.AuthManager.currentUser = window.AuthManager.currentUser || {
  id: 42,
  username: 'Visita Demo',
  email: 'demo@jk.local',
  profile_slug: 'administrator',
  profile_level: 3
};
</script>
HTML;

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
        <h1 class="jkhive-section-title" style="margin-top:0;"><?= $h('Mensajería interna') ?></h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;margin-bottom:1rem;">
          <?= $h('Bandeja con la misma lógica que el CRM: carpetas, lista, acciones en lote, modales hex y API simulada en memoria cuando corresponde el flag de showcase.') ?>
        </p>

        <div class="messaging-layout">
          <div class="messaging-sidebar">
            <div class="messaging-sidebar-header">
              <h3><?= $h('Carpetas') ?></h3>
              <div class="jkhive-actionbutton-small" data-tooltip="<?= $h('Redactar mensaje') ?>">
                <button type="button" onclick="if (window.messagingSystem) messagingSystem.showNewMessageModalHex();">
                  <div class="jkhive-hex jkhive-hex-honey">
                    <div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon fas fa-pen"></i></div>
                  </div>
                </button>
              </div>
            </div>
            <div id="messagingFolders" class="messaging-folders" aria-label="<?= $h('Carpetas de mensajería') ?>"></div>
          </div>

          <div class="messaging-list-container">
            <div class="messaging-list-header">
              <div class="messaging-header-left" style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
                <label class="messaging-select-all-wrap" style="display:inline-flex;align-items:center;gap:0.35rem;color:var(--jk-metal-light);font-size:0.9rem;">
                  <input type="checkbox" id="selectAllMessages" data-tooltip="<?= $h('Seleccionar todos') ?>" aria-label="<?= $h('Seleccionar todos') ?>" onchange="if (window.messagingSystem) messagingSystem.toggleSelectAll(this.checked);" />
                  <span><?= $h('Todos') ?></span>
                </label>
                <h4 id="folderTitle" style="margin:0;"><?= $h('Bandeja de entrada') ?></h4>
                <div id="bulkActionsToolbar" class="bulk-actions-toolbar" role="toolbar" aria-label="<?= $h('Acciones en lote') ?>" style="display:none;"></div>
              </div>
            </div>
            <div id="messagingList" class="messaging-list" role="list" aria-label="<?= $h('Lista de conversaciones') ?>"></div>
          </div>

          <div id="messagingView" class="messaging-view" style="display:none;" aria-hidden="true"></div>
        </div>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
