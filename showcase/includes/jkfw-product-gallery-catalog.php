<?php
declare(strict_types=1);

/**
 * Catálogo demo alineado a JK Lubs `jklubs/www/productos.php` (snapshot en `JKHFW/data/jklubs`).
 * Parámetros URL: pagina, porPagina, categoria, familia, envase, buscar (extra showcase).
 * Aliases: page→pagina, per_page→porPagina, cat→categoria, q→buscar.
 */

/** @return list<array{id:string,nombre:string,marca:string,precio:float,stock:int,tipo_vehiculo_id:int,tipo_producto_id:int,tipo_envase_id:int,imagen_url:string}> */
function jkfw_demo_catalog_productos(): array
{
    static $rows = null;
    if ($rows !== null) {
        return $rows;
    }
    $rows = [];
    $marcas = ['JK Lubs', 'FilterMax', 'ProLine', 'Krauss'];
    $nombres = [
        'LubriJet', 'TransFluid', 'CoolTech', 'BikeDry', 'MarineTech', 'TurboSynth',
        'Grasa EP2', 'FoodTech H1', 'DryFilm', 'NanoFiltro', 'Kit servicio', 'Prefiltro agua',
    ];
    for ($i = 1; $i <= 36; $i++) {
        $rows[] = [
            'id' => (string) $i,
            'nombre' => $nombres[($i - 1) % count($nombres)] . ' ' . $i,
            'marca' => $marcas[$i % count($marcas)],
            'precio' => 4990.0 + ($i * 1333),
            'stock' => ($i % 8 === 0) ? 0 : (3 + ($i % 19)),
            'tipo_vehiculo_id' => (($i - 1) % 4) + 1,
            'tipo_producto_id' => (($i + 1) % 4) + 1,
            'tipo_envase_id' => (($i + 2) % 3) + 1,
            'imagen_url' => '',
        ];
    }
    return $rows;
}

/** @return list<array{id:int|string,nombre:string}> */
function jkfw_demo_tipos_vehiculo(): array
{
    return [
        ['id' => 1, 'nombre' => 'Automóvil / liviano'],
        ['id' => 2, 'nombre' => 'Camión y transporte'],
        ['id' => 3, 'nombre' => 'Moto'],
        ['id' => 4, 'nombre' => 'Industrial'],
    ];
}

/** @return list<array{id:int|string,nombre:string}> */
function jkfw_demo_tipos_producto(): array
{
    return [
        ['id' => 1, 'nombre' => 'Lubricantes'],
        ['id' => 2, 'nombre' => 'Grasas'],
        ['id' => 3, 'nombre' => 'Filtros'],
        ['id' => 4, 'nombre' => 'Kits / packs'],
    ];
}

/** @return list<array{id:int|string,nombre:string}> */
function jkfw_demo_tipos_envase(): array
{
    return [
        ['id' => 1, 'nombre' => 'Botella'],
        ['id' => 2, 'nombre' => 'Balde'],
        ['id' => 3, 'nombre' => 'Tambor'],
    ];
}

function jkfw_catalog_normalize_get_params(): array
{
    if (isset($_GET['pagina'])) {
        $pagina = (int) $_GET['pagina'];
    } elseif (isset($_GET['page'])) {
        $pagina = (int) $_GET['page'];
    } else {
        $pagina = 1;
    }

    $porPagina = isset($_GET['porPagina']) ? (int) $_GET['porPagina'] : (isset($_GET['per_page']) ? (int) $_GET['per_page'] : 18);

    $categoria = isset($_GET['categoria'])
        ? trim((string) $_GET['categoria'])
        : (isset($_GET['cat']) ? trim((string) $_GET['cat']) : '');
    $familia = isset($_GET['familia'])
        ? trim((string) $_GET['familia'])
        : (isset($_GET['fam']) ? trim((string) $_GET['fam']) : '');
    $envase = isset($_GET['envase']) ? trim((string) $_GET['envase']) : '';

    $buscar = isset($_GET['buscar'])
        ? trim((string) $_GET['buscar'])
        : (isset($_GET['q']) ? trim((string) $_GET['q']) : '');
    if ($buscar !== '' && function_exists('mb_substr')) {
        $buscar = mb_substr($buscar, 0, 200, 'UTF-8');
    } elseif (strlen($buscar) > 200) {
        $buscar = substr($buscar, 0, 200);
    }

    return [
        'pagina' => max(1, $pagina),
        'porPagina' => $porPagina,
        'categoria' => $categoria,
        'familia' => $familia,
        'envase' => $envase,
        'buscar' => $buscar,
    ];
}

function jkfw_catalog_clamp_por_pagina(int $n): int
{
    return $n >= 6 && $n <= 24 ? $n : 18;
}

/**
 * @param list<array<string, mixed>> $all
 * @param array{categoria:string,familia:string,envase:string,buscar:string} $f
 * @return list<array<string, mixed>>
 */
function jkfw_catalog_aplicar_filtros(array $all, array $f): array
{
    $out = [];
    $buscarLower = '';
    if ($f['buscar'] !== '') {
        $buscarLower = function_exists('mb_strtolower')
            ? mb_strtolower($f['buscar'], 'UTF-8')
            : strtolower($f['buscar']);
    }
    foreach ($all as $row) {
        if ($f['categoria'] !== '' && is_numeric($f['categoria'])) {
            if ((int) $row['tipo_vehiculo_id'] !== (int) $f['categoria']) {
                continue;
            }
        }
        if ($f['familia'] !== '' && is_numeric($f['familia'])) {
            if ((int) $row['tipo_producto_id'] !== (int) $f['familia']) {
                continue;
            }
        }
        if ($f['envase'] !== '' && is_numeric($f['envase'])) {
            if ((int) $row['tipo_envase_id'] !== (int) $f['envase']) {
                continue;
            }
        }
        if ($buscarLower !== '') {
            $blob = ($row['nombre'] ?? '') . ' ' . ($row['marca'] ?? '') . ' ' . ($row['id'] ?? '');
            $blob = function_exists('mb_strtolower') ? mb_strtolower($blob, 'UTF-8') : strtolower($blob);
            if (function_exists('mb_strpos')) {
                if (mb_strpos($blob, $buscarLower, 0, 'UTF-8') === false) {
                    continue;
                }
            } elseif (strpos($blob, $buscarLower) === false) {
                continue;
            }
        }
        $out[] = $row;
    }
    if (count($out) > 1) {
        usort($out, static function (array $a, array $b): int {
            $na = (string) ($a['nombre'] ?? '');
            $nb = (string) ($b['nombre'] ?? '');
            $cmp = strnatcasecmp($na, $nb);
            if ($cmp !== 0) {
                return $cmp;
            }
            return strcmp((string) ($a['id'] ?? ''), (string) ($b['id'] ?? ''));
        });
        $out = array_values($out);
    }
    return $out;
}

/**
 * @param list<array<string, mixed>> $filtered
 * @return array{slice: list<array<string, mixed>>, total: int, pages: int, page: int, per: int}
 */
function jkfw_catalog_paginar(array $filtered, int $pagina, int $porPagina): array
{
    $total = count($filtered);
    $pages = $porPagina > 0 ? max(1, (int) ceil($total / $porPagina)) : 1;
    $page = max(1, min($pagina, $pages));
    $off = ($page - 1) * $porPagina;
    $slice = array_slice($filtered, $off, $porPagina);
    return ['slice' => $slice, 'total' => $total, 'pages' => $pages, 'page' => $page, 'per' => $porPagina];
}

/**
 * @param array{pagina:int,porPagina:int,categoria:string,familia:string,envase:string,buscar:string} $st
 * @param array<string, scalar|null> $overrides
 */
function jkfw_catalog_demo_url(array $st, array $overrides = []): string
{
    $m = array_merge($st, $overrides);
    $q = [];
    if ($m['categoria'] !== '') {
        $q['categoria'] = $m['categoria'];
    }
    if ($m['familia'] !== '') {
        $q['familia'] = $m['familia'];
    }
    if ($m['envase'] !== '') {
        $q['envase'] = $m['envase'];
    }
    if ($m['buscar'] !== '') {
        $q['buscar'] = $m['buscar'];
    }
    $per = (int) $m['porPagina'];
    if ($per !== 18) {
        $q['porPagina'] = $per;
    }
    $pg = (int) $m['pagina'];
    if ($pg > 1) {
        $q['pagina'] = $pg;
    }
    $qs = http_build_query($q);
    return 'demo-landing-advanced-gallery.php' . ($qs !== '' ? '?' . $qs : '');
}

/**
 * @param array{total: int, pages: int, page: int, per: int} $meta
 * @param array{pagina:int,porPagina:int,categoria:string,familia:string,envase:string,buscar:string} $st
 */
function jkfw_catalog_render_pagination_jklubs(string $navId, bool $inToolbar, array $meta, array $st, callable $h): void
{
    $total = $meta['total'];
    $totalPaginas = $meta['pages'];
    $pagina = $meta['page'];
    $showPagination = $totalPaginas > 1;

    $classBar = $inToolbar
        ? 'catalog-pagination catalog-pagination-in-bar'
        : 'catalog-pagination jkhive-gallery-catalog-pagination-bottom';

    if (! $showPagination) {
        return;
    }

    echo '<nav id="' . $h($navId) . '" class="' . $h($classBar) . '" role="navigation" aria-label="' . $h('Paginación del catálogo') . '">';
    echo '<span class="catalog-pagination-info">Total: ' . (string) $total . $h(' producto(s) · Página ') . (string) $pagina . $h(' de ') . (string) $totalPaginas . '</span>';

    if ($pagina > 1) {
        echo '<a href="' . $h(jkfw_catalog_demo_url($st, ['pagina' => $pagina - 1])) . '" class="catalog-pagination-link">← ' . $h('Anterior') . '</a>';
    }
    for ($i = max(1, $pagina - 2); $i <= min($totalPaginas, $pagina + 2); $i++) {
        $cur = $i === $pagina ? ' catalog-pagination-current' : '';
        echo '<a href="' . $h(jkfw_catalog_demo_url($st, ['pagina' => $i])) . '" class="catalog-pagination-link' . $cur . '"' . ($i === $pagina ? ' aria-current="page"' : '') . '>' . (string) $i . '</a>';
    }
    if ($pagina < $totalPaginas) {
        echo '<a href="' . $h(jkfw_catalog_demo_url($st, ['pagina' => $pagina + 1])) . '" class="catalog-pagination-link">' . $h('Siguiente') . ' →</a>';
    }
    echo '</nav>';
}

function jkfw_catalog_nombre_trunc(string $nombre, int $max = 25): string
{
    if (function_exists('mb_strimwidth')) {
        return mb_strimwidth($nombre, 0, $max, '...', 'UTF-8');
    }
    return strlen($nombre) > $max ? substr($nombre, 0, $max - 3) . '...' : $nombre;
}

/**
 * @param array{slice: list<array<string, mixed>>, total: int, pages: int, page: int, per: int} $meta
 * @param array{pagina:int,porPagina:int,categoria:string,familia:string,envase:string,buscar:string} $st
 */
function jkfw_catalog_render_galeria_items_jklubs(array $meta, array $st, callable $h): void
{
    if ($meta['total'] === 0) {
        echo '<div class="empty-state">';
        echo '<div class="empty-state-icon">🛢️</div>';
        echo '<h3>' . $h('No hay productos disponibles') . '</h3>';
        echo '<p>' . $h('No se encontraron productos que coincidan con los filtros seleccionados.') . '</p>';
        echo '</div>';
        return;
    }

    $tiposV = jkfw_demo_tipos_vehiculo();
    $tvMap = [];
    foreach ($tiposV as $tv) {
        $tvMap[(int) $tv['id']] = (string) $tv['nombre'];
    }

    foreach ($meta['slice'] as $p) {
        $pid = (string) $p['id'];
        $stock = (int) $p['stock'];
        $nombre = (string) $p['nombre'];
        $marca = (string) $p['marca'];
        $precio = (float) $p['precio'];
        $img = trim((string) ($p['imagen_url'] ?? ''));
        $familiaVeh = $tvMap[(int) $p['tipo_vehiculo_id']] ?? '';

        $item = [
            'id' => $pid,
            'type' => 'product',
            'name' => $nombre,
            'price' => $precio,
            'icon' => '🛢️',
            'description' => $marca,
            'category' => $familiaVeh,
        ];
        $itemJson = json_encode($item, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        if ($itemJson === false) {
            $itemJson = '{}';
        }
        $onclick = 'if (' . (int) $stock . ' <= 0) { if (typeof showToastInline === "function") showToastInline({ type: "error", message: "No hay stock", anchorEl: this, autoCloseMs: 2500 }); return; } addToCart(' . $itemJson . ', "product", this);';

        echo '<div class="jkhive-product-gallery-item" data-id="' . $h($pid) . '" data-stock="' . (string) $stock . '">';
        echo '<div class="jkhive-badge ' . ($stock > 0 ? 'jkhive-badge-green' : 'jkhive-badge-red') . '">';
        echo '<span class="jkhive-badge-text">' . ($stock > 0 ? $h('Stock: ') . (string) $stock : $h('Sin stock')) . '</span>';
        echo '</div>';
        echo '<div class="jkhive-product-gallery-hex">';
        echo '<div class="jkhive-product-gallery-hex-header">';
        echo '<div class="jkhive-product-gallery-icon">';
        if ($img !== '') {
            echo '<img src="' . $h($img) . '" alt="' . $h($nombre) . '" style="max-height: 100%; max-width: 100%;">';
        } else {
            echo '<span style="font-size: 2rem;">🛢️</span>';
        }
        echo '</div></div>';
        echo '<div class="jkhive-product-gallery-hex-body">';
        echo '<h3 class="jkhive-product-gallery-title" title="' . $h($nombre) . '">' . $h(jkfw_catalog_nombre_trunc($nombre, 25)) . '</h3>';
        echo '<p class="jkhive-product-gallery-subtitle">' . $h($marca !== '' ? $marca : '—') . '</p>';
        echo '<p class="jkhive-product-gallery-price">$' . $h(number_format($precio, 0, ',', '.')) . '</p>';
        echo '</div>';
        echo '<div class="jkhive-product-gallery-hex-footer">';
        echo '<button type="button" class="jkhive-bttn-item" onclick="' . htmlspecialchars($onclick, ENT_QUOTES, 'UTF-8') . '" title="' . $h($stock > 0 ? 'Añadir al carrito' : 'No hay stock') . '" aria-label="' . $h($stock > 0 ? 'Añadir al carrito' : 'No hay stock') . '">';
        echo '<div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial">';
        echo '<i class="jkhive-hex-icon fas fa-shopping-cart"></i>';
        echo '</div></div>';
        echo '</button>';
        echo '</div></div></div>';
    }
}
