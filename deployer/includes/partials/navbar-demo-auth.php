<?php
declare(strict_types=1);

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<span class="jkfw-demo-nav-chip" id="jkfw-demo-auth-mount">
  <span id="jkfw-demo-logged-wrap" style="display:none;align-items:center;gap:0.35rem;">
    <span id="jkfw-demo-display-name"><?= $h('Visita Web') ?></span>
    <button type="button" id="jkfw-demo-logout-btn" data-tooltip="Salir sesión demo"><?= $h('Salir') ?></button>
  </span>
  <span id="jkfw-demo-login-wrap">
    <button type="button" id="jkfw-demo-login-open" data-tooltip="Acceso demo (sin servidor)" aria-expanded="false"><?= $h('Entrar demo') ?></button>
  </span>
</span>
