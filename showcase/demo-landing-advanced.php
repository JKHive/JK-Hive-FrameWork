<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'Landing avanzada — JK Hive';
$jk_breadcrumb = 'Landing + administración';
$jk_body_class = 'page-public jkhive-showcase-body';
$jk_demo_auth = true;
$jk_hide_demo_modal = true;
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-catalog-demo.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>

        <h1 class="jkhive-section-title" style="margin-top:0;">Landing con capa de aplicación</h1>
        <p style="color:var(--jk-metal-light);max-width:52rem;line-height:1.55;margin:0 0 1rem;">
          <?= $h('Incluye menú superior, sidebar y acceso demo (usuario «Visita Web», contraseña «123456»): toast tipo A al iniciar sesión, sin backend.') ?>
          Lorem ipsum sit amet — el texto largo es sólo relleno; las etiquetas de función (listados, alta, etc.) se mantienen claras.
        </p>

        <h2 class="jkhive-section-title" style="font-size:1.05rem;">Pantallas de gestión</h2>
        <div class="jkfw-portal-grid">
          <div class="jkfw-portal-tile">
            <h3><?= $h('Lista de usuarios') ?></h3>
            <p>Tabla con toggles, modales hex y paginación JK Hive.</p>
            <p style="margin-top:0.5rem;"><a href="users.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir usuarios') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Productos') ?></h3>
            <p>Gestión demo de ítems de catálogo genéricos.</p>
            <p style="margin-top:0.5rem;"><a href="products.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir productos') ?></a></p>
          </div>
          <div class="jkfw-portal-tile">
            <h3><?= $h('Mensajería interna') ?></h3>
            <p>Bandeja tipo CRM con estados y conversación.</p>
            <p style="margin-top:0.5rem;"><a href="messaging.php" style="color:var(--jk-primary-blue-light);"><?= $h('Abrir mensajes') ?></a></p>
          </div>
        </div>

        <p style="margin-top:1.5rem;font-size:0.88rem;color:var(--jk-metal);max-width:42rem;">
          <?= $h('Esta variante no muestra flujo de tienda (sin carrito).') ?>
          <a href="demo-ecommerce-advanced.php" style="color:var(--jk-primary-blue-light);"><?= $h('Ir al e-commerce avanzado') ?></a>
          · <a href="index.php" style="color:var(--jk-primary-blue-light);"><?= $h('Selector principal') ?></a>
        </p>

<?php
require __DIR__ . '/includes/layout-shell-end.php';
