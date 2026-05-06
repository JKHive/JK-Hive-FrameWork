<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'Portal web — JK Hive';
$jk_breadcrumb = 'Portal demo';
$jk_body_class = 'page-public jkhive-showcase-body';
$jk_demo_auth = true;
$jk_hide_demo_modal = true;
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">Portal de servicios</h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;">
          <?= $h('Estructura tipo housesitting: entrada pública, bloques de valor y acceso condicionado a zona de cuenta mediante el login demo (Visita Web / 123456).') ?>
          Lorem ipsum dolor sit amet — bloques de texto genérico; la arquitectura de navegación es la que importa para el framework.
        </p>

        <section class="jkfw-portal-hero" style="margin-top:1.25rem;padding:1.5rem;border-radius:14px;border:1px solid rgba(14,165,233,0.2);background:rgba(15,23,42,0.4);">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;margin-top:0;"><?= $h('¿Cómo funciona el servicio?') ?></h2>
          <div class="jkfw-portal-grid">
            <div class="jkfw-portal-tile">
              <h3><?= $h('Exploración') ?></h3>
              <p>Usuario anónimo recorre páginas informativas y formularios de contacto público.</p>
            </div>
            <div class="jkfw-portal-tile">
              <h3><?= $h('Registro o acceso') ?></h3>
              <p>En este showcase el acceso es ficticio; en producción enlazarías a tu API real.</p>
            </div>
            <div class="jkfw-portal-tile">
              <h3><?= $h('Área privada') ?></h3>
              <p>Listados, mensajes y CRM comparten el mismo shell visual una vez dentro.</p>
            </div>
          </div>
        </section>

        <section style="margin-top:1.75rem;">
          <h2 class="jkhive-section-title" style="font-size:1.05rem;"><?= $h('Trámites y recursos') ?></h2>
          <ul style="margin:0.5rem 0 0;padding-left:1.1rem;color:var(--jk-metal-light);line-height:1.6;max-width:48rem;">
            <li><a href="users.php" style="color:var(--jk-primary-blue-light);"><?= $h('Directorio de perfiles') ?></a> — equivalente a “gestión de anfitriones” en un portal real.</li>
            <li><a href="messaging.php" style="color:var(--jk-primary-blue-light);"><?= $h('Mensajes y notificaciones') ?></a></li>
            <li><a href="contact.php" style="color:var(--jk-primary-blue-light);"><?= $h('Formulario público') ?></a></li>
          </ul>
        </section>

        <p style="margin-top:1.75rem;font-size:0.88rem;color:var(--jk-metal);">
          <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Volver al selector') ?></a>
        </p>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
