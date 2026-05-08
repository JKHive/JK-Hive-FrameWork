<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-config.php';

$error = '';
$DEMO_USER = 'Visita Web';
$DEMO_PASS = '123456';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = isset($_POST['user']) ? trim((string) $_POST['user']) : '';
    $p = isset($_POST['password']) ? (string) $_POST['password'] : '';
    if ($u === $DEMO_USER && $p === $DEMO_PASS) {
        jkfw_shell_login();
        $redir = isset($_GET['redirect']) ? trim((string) $_GET['redirect']) : 'demo-crm.php';
        if ($redir === '' || ! preg_match('/^[a-zA-Z0-9][a-zA-Z0-9_.-]*\\.php$/', $redir)) {
            $redir = 'demo-crm.php';
        }
        header('Location: ' . $redir);
        exit;
    }
    $error = 'Credenciales incorrectas. Usuario «Visita Web», contraseña «123456».';
}

$jk_page_title = 'Ingresar — JK Hive Showcase';
$jk_breadcrumb = '';
$jk_hide_top_navbar = true;
$jk_hide_sidebar = true;
$jk_hide_demo_modal = true;
$jk_body_class = 'page-public jkhive-showcase-body jkfw-shell-login-page';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-sidebar.php';
require __DIR__ . '/includes/layout-main-open.php';

$qs = isset($_GET['loggedout']) ? '1' : '';
$bye = $qs !== '';

?>
        <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin jkfw-showcase-hex-simple jkfw-shell-login-card" role="dialog" aria-labelledby="jkfw-shell-login-title">
          <div class="jkhive-modal-header">
            <div class="jkhive-modal-header-top"></div>
            <div class="jkhive-modal-header-bottom">
              <h2 class="jkhive-modal-title" id="jkfw-shell-login-title">Acceso JK Hive Showcase</h2>
              <p class="jkhive-modal-subtitle" style="margin:0.35rem 0 0;font-size:0.88rem;color:var(--jk-metal-medium);font-weight:500;">
                Pantalla oficial del framework (sin servidor de cuentas). Credenciales fijas sólo para la demo empotrada en PHP.
              </p>
              <?php if ($bye) : ?>
                <p role="status" style="margin:0.6rem 0 0;color:var(--jk-accent-honey);font-weight:700;font-size:0.82rem;">
                  <?= $h('Sesión showcase cerrada. Volvé a entrar.') ?>
                </p>
              <?php endif; ?>
              <?php if ($error !== '') : ?>
                <p role="alert" style="margin:0.6rem 0 0;color:#f87171;font-weight:700;font-size:0.82rem;">
                  <?= $h($error) ?></p>
              <?php endif; ?>
            </div>
          </div>
          <div class="jkhive-modal-body">
            <div class="jkhive-modal-body-content">
              <form method="post" action="" style="display:flex;flex-direction:column;gap:1rem;margin-top:0.25rem;">
                <input type="hidden" name="__jkfw_login" value="1" />
                <div>
                  <label for="jkfw-shell-user" style="display:block;font-size:0.75rem;font-weight:600;margin-bottom:0.35rem;color:var(--jk-metal-light);">Usuario</label>
                  <input id="jkfw-shell-user" name="user" type="text" autocomplete="username" value="<?= $h($DEMO_USER) ?>" class="jkhive-hex-select" style="width:100%;box-sizing:border-box;padding:0.5rem 0.75rem;border-radius:8px;border:1px solid rgba(14,165,233,0.35);background:rgba(15,23,42,0.6);color:var(--jk-metal-light);" />
                </div>
                <div>
                  <label for="jkfw-shell-pass" style="display:block;font-size:0.75rem;font-weight:600;margin-bottom:0.35rem;color:var(--jk-metal-light);">Contraseña</label>
                  <input id="jkfw-shell-pass" name="password" type="password" autocomplete="current-password" value="<?= $h($DEMO_PASS) ?>" class="jkhive-hex-select" style="width:100%;box-sizing:border-box;padding:0.5rem 0.75rem;border-radius:8px;border:1px solid rgba(14,165,233,0.35);background:rgba(15,23,42,0.6);color:var(--jk-metal-light);" />
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:flex-end;margin-top:0.35rem;">
                  <button type="submit" class="jkfw-demo-modal-submit" style="cursor:pointer;padding:0.55rem 1rem;border-radius:8px;border:1px solid var(--jk-primary-blue);background:linear-gradient(135deg,var(--jk-tech-dark),var(--jk-primary-blue-darker));color:var(--jk-metal-light);font-weight:700;font-size:0.8rem;">
                    Ingresar
                  </button>
                  <a href="index.php" style="display:inline-flex;align-items:center;padding:0.55rem 1rem;border-radius:8px;border:1px solid rgba(148,163,184,0.45);color:var(--jk-metal);font-weight:600;font-size:0.8rem;text-decoration:none;">
                    Volver al selector
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
<?php
require __DIR__ . '/includes/layout-shell-end.php';
