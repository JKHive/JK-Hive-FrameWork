<?php
declare(strict_types=1);

/**
 * Carga configuración navegación/footer (Fase 10 — layout configurable).
 * Roles demo en sesión: $_SESSION['jkfw_roles'], por defecto guest + demo_admin.
 */
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start([
        'cookie_samesite' => 'Lax',
    ]);
}

if (! isset($_SESSION['jkfw_roles']) || ! is_array($_SESSION['jkfw_roles'])) {
    $_SESSION['jkfw_roles'] = ['guest', 'demo_admin'];
}

/** Sesión «shell» showcase: menú superior CRM + notificaciones mock (sin backend real). */
if (! array_key_exists('jkfw_shell_auth', $_SESSION)) {
    $_SESSION['jkfw_shell_auth'] = true;
}

function jkfw_shell_session_logged_in(): bool
{
    return ! empty($_SESSION['jkfw_shell_auth']);
}

function jkfw_shell_login(): void
{
    $_SESSION['jkfw_shell_auth'] = true;
}

function jkfw_shell_logout(): void
{
    $_SESSION['jkfw_shell_auth'] = false;
}

/**
 * @return array{authenticated:bool,user:array<string,mixed>}
 */
function jkfw_shell_ssr_auth_payload(): array
{
    if (jkfw_shell_session_logged_in()) {
        $level = (int) ($_SESSION['jkfw_profile_level'] ?? 3);
        $isSa = jkfw_shell_is_super_admin();

        return [
            'authenticated' => true,
            'user' => [
                'id' => 42,
                'username' => 'Visita Showcase',
                'email' => 'demo@jkhive.local',
                'profile_name' => 'Administrador demo',
                'profile_slug' => 'administrator',
                'profile_level' => $level,
                'is_super_admin' => $isSa,
            ],
        ];
    }

    return [
        'authenticated' => false,
        'user' => [
            'profile_slug' => 'guest',
            'username' => 'Invitado',
            'profile_name' => 'Invitado',
            'unique_id' => '00000000-0000-0000-0000-000000000001',
            'profile_level' => 0,
            'is_super_admin' => false,
        ],
    ];
}

/**
 * Temas visuales (paleta secundaria). El acento miel metálico se mantiene en :root; overrides en jkfw-themes.css.
 *
 * @return list<string>
 */
function jkfw_valid_theme_slugs(): array
{
    return ['canonical', 'aurora', 'cobalt', 'ember'];
}

/**
 * Resuelve el tema activo.
 * Prioridad: 1) ?theme= en URL (persiste en sesión) 2) variable opcional $jk_color_scheme en la página
 *    (solo esta petición, no escribe sesión — útil para landings con tema fijo) 3) sesión 4) canonical.
 */
function jkfw_theme_resolve(): string
{
    $valid = jkfw_valid_theme_slugs();
    if (isset($_GET['theme']) && is_string($_GET['theme']) && in_array($_GET['theme'], $valid, true)) {
        $_SESSION['jkfw_theme'] = $_GET['theme'];

        return $_SESSION['jkfw_theme'];
    }

    global $jk_color_scheme;
    if (isset($jk_color_scheme) && is_string($jk_color_scheme) && in_array($jk_color_scheme, $valid, true)) {
        return $jk_color_scheme;
    }

    $t = isset($_SESSION['jkfw_theme']) && is_string($_SESSION['jkfw_theme']) ? $_SESSION['jkfw_theme'] : 'canonical';
    if (! in_array($t, $valid, true)) {
        $t = 'canonical';
        $_SESSION['jkfw_theme'] = $t;
    }

    return $t;
}

/**
 * Lee ?theme= y persiste en sesión. Siempre devuelve un slug válido.
 *
 * @deprecated Usar jkfw_theme_resolve() — se mantiene por compatibilidad con includes que ya lo llaman.
 */
function jkfw_theme_apply_from_request(): string
{
    return jkfw_theme_resolve();
}

function jkfw_theme_body_class_suffix(): string
{
    return 'jkfw-theme-' . jkfw_theme_resolve();
}

/**
 * @return array<string,mixed>
 */
function jkfw_load_nav_json(): array
{
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    $path = dirname(__DIR__) . '/config/navigation.json';
    if (! is_readable($path)) {
        $cached = [];
        return $cached;
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        $cached = [];
        return $cached;
    }
    $decoded = json_decode($raw, true);
    $cached = is_array($decoded) ? $decoded : [];
    return $cached;
}

/**
 * @return list<string>
 */
function jkfw_roles(): array
{
    /** @var list<string>|mixed $r */
    $r = $_SESSION['jkfw_roles'];
    /** @phpstan-ignore-next-line */
    return array_values(array_filter(array_map('strval', $r)));
}

/**
 * Super admin showcase: rol `super_admin` o nivel ≥ 4 (Deploy paquete / API).
 */
function jkfw_shell_is_super_admin(): bool
{
    if (in_array('super_admin', jkfw_roles(), true)) {
        return true;
    }

    return (int) ($_SESSION['jkfw_profile_level'] ?? 0) >= 4;
}

/**
 * @return list<string>
 */
function jkfw_showcase_deploy_demo_pages(): array
{
    return [
        'demo-landing-simple.php',
        'demo-landing-advanced.php',
        'demo-landing-simple-about.php',
        'demo-landing-simple-contact.php',
        'demo-landing-simple-gallery.php',
        'demo-landing-advanced-about.php',
        'demo-landing-advanced-contact.php',
        'demo-landing-advanced-gallery.php',
        'demo-crm.php',
        'demo-portal.php',
        'demo-ecommerce-basic.php',
        'demo-ecommerce-advanced.php',
    ];
}

function jkfw_showcase_is_deploy_demo_page(): bool
{
    $b = basename((string) ($_SERVER['SCRIPT_NAME'] ?? ''));

    return in_array($b, jkfw_showcase_deploy_demo_pages(), true);
}

function jkfw_navbar_title(): string
{
    $data = jkfw_load_nav_json();
    $title = $data['site']['navbarTitle'] ?? 'JK Hive Framework';
    return (string) $title;
}

/**
 * @return list<array{id:string,href:string,icon:string,tooltip:string}>
 */
function jkfw_sidebar_items(): array
{
    $data = jkfw_load_nav_json();
    /** @var list<array>|mixed $sidebar */
    $sidebar = $data['sidebar'] ?? [];
    if (! is_array($sidebar)) {
        return [];
    }

    $roles = jkfw_roles();
    $out = [];

    foreach ($sidebar as $row) {
        if (! is_array($row)) {
            continue;
        }
        $need = isset($row['roles']) && is_array($row['roles']) ? $row['roles'] : [];
        if ($need !== []) {
            $ok = false;
            foreach ($need as $nr) {
                if (in_array((string) $nr, $roles, true)) {
                    $ok = true;
                    break;
                }
            }
            if (! $ok) {
                continue;
            }
        }

        $id = isset($row['id']) ? (string) $row['id'] : '';
        $href = isset($row['href']) ? (string) $row['href'] : '#';
        if ($id === '') {
            continue;
        }

        $out[] = [
            'id' => $id,
            'href' => $href,
            'icon' => isset($row['icon']) ? (string) $row['icon'] : 'fas fa-circle',
            'tooltip' => isset($row['tooltip']) ? (string) $row['tooltip'] : $id,
        ];
    }

    return $out;
}

/**
 * @return array{columns:list<array{title:string,links:list<array{label:string,href:string}>}>,credit:string}
 */
function jkfw_footer_data(): array
{
    $data = jkfw_load_nav_json();
    $footer = isset($data['footer']) && is_array($data['footer']) ? $data['footer'] : [];
    $columns = isset($footer['columns']) && is_array($footer['columns']) ? $footer['columns'] : [];

    $norm = [];

    foreach ($columns as $col) {
        if (! is_array($col)) {
            continue;
        }
        $title = isset($col['title']) ? (string) $col['title'] : '';
        $links = [];
        /** @var list<array>|mixed $linklist */
        $linklist = $col['links'] ?? [];
        if (is_array($linklist)) {
            foreach ($linklist as $ln) {
                if (! is_array($ln)) {
                    continue;
                }
                $links[] = [
                    'label' => isset($ln['label']) ? (string) $ln['label'] : '',
                    'href' => isset($ln['href']) ? (string) $ln['href'] : '#',
                ];
            }
        }
        if ($title !== '' && $links !== []) {
            $norm[] = ['title' => $title, 'links' => $links];
        }
    }

    return [
        'columns' => $norm,
        'credit' => isset($footer['credit']) ? (string) $footer['credit'] : '',
    ];
}
