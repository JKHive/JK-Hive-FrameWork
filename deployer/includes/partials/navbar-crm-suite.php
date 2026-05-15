<?php
declare(strict_types=1);

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<div class="jkfw-navbar-crm-suite" role="group" aria-label="Menú contextual JK Hive CRM">
  <div class="jkhive-lang-selector" aria-label="Idioma">
    <div class="jkhive-lang-hex-container">
      <div class="jkhive-lang-hex active" data-lang="es" data-tooltip="<?= $h('Español'); ?>"><span class="flag-icon" aria-hidden="true">🇪🇸</span></div>
      <div class="jkhive-lang-hex" data-lang="en" data-tooltip="<?= $h('English'); ?>"><span class="flag-icon" aria-hidden="true">ENG</span></div>
      <div class="jkhive-lang-hex" data-lang="it" data-tooltip="<?= $h('Italiano'); ?>"><span class="flag-icon" aria-hidden="true">🇮🇹</span></div>
      <div class="jkhive-lang-hex" data-lang="de" data-tooltip="<?= $h('Deutsch'); ?>"><span class="flag-icon" aria-hidden="true">🇩🇪</span></div>
    </div>
  </div>

  <div class="jkhive-notif-selector" aria-label="<?= $h('Alertas'); ?>">
    <div class="jkhive-notif-hex-container">
      <div class="jkhive-notif-hex jkhive-notif-main" data-tooltip="<?= $h('Notificaciones'); ?>"><i class="fas fa-bell" aria-hidden="true"></i></div>
      <div class="jkhive-notif-hex" data-notif-type="messages" data-tooltip="<?= $h('Mensajes'); ?>">
        <i class="fas fa-comments" aria-hidden="true"></i>
      </div>
      <div class="jkhive-notif-hex" data-notif-type="purchases" data-tooltip="<?= $h('Ventas'); ?>">
        <i class="fas fa-shopping-bag" aria-hidden="true"></i>
      </div>
      <div class="jkhive-notif-hex" data-notif-type="donations" data-tooltip="<?= $h('Campañas'); ?>">
        <i class="fas fa-hand-holding-heart" aria-hidden="true"></i>
      </div>
      <div class="jkhive-notif-hex" data-notif-type="users" data-tooltip="<?= $h('Nuevos registros'); ?>">
        <i class="fas fa-user-plus" aria-hidden="true"></i>
      </div>
    </div>
  </div>

  <div id="userMenuContainer" class="jkfw-navbar-user-mount"></div>
</div>
