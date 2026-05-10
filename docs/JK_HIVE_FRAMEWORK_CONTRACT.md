# Contrato operativo — JK Hive Framework (showcase / JKHFW)

Documento único para **no repetir** correcciones págin aa página. Las implementaciones deben cumplir esto; los overrides locales solo con justificación y preferiblemente vía **tokens**, no px sueltos con `!important`.

## 1. Tokens estructurales de color

- Origen: `:root` en `showcase/assets/css/jk-hive.css` (`--jk-primary-blue`, `--jk-tech-*`, `--jk-accent-honey*`, etc.).
- Temas secundarios (paleta): `showcase/assets/css/jkfw-themes.css` — selectores `body.jkfw-theme-*`. **No redefinir `--jk-accent-honey*`** salvo decisión explícita de identidad.
- Resolución del tema activo: `jkfw_theme_resolve()` en `showcase/includes/jkfw-config.php`:
  1. `?theme=canonical|aurora|cobalt|ember` (persiste en sesión)
  2. Variable de página `$jk_color_scheme` (solo esa petición, no escribe sesión) — útil en landings.
  3. Sesión `jkfw_theme`
  4. `canonical`
- HTML: `data-jkfw-theme="<slug>"` en `<html>` (`layout-head.php`). Body incluye clase `jkfw-theme-<slug>`.

## 2. Galerías hexagonales (panal vertical, equilátero)

- Contrato en comentario **HEXAGONAL GALLERY** dentro de `jk-hive.css`:
  - `--jkhive-hive-apex: 1.1547`
  - `--jkhive-gallery-hex-bounding-height` = flat × apex
  - **`--jkhive-gallery-vertical-tip-pad`** = ¼ × altura total + `--jkhive-gallery-edge-breath` (~punta + aire)
  - Stagger: `--jkhive-hive-stagger: calc((var(--jkhive-hive-flat) + var(--jkhive-hive-gap-x)) / 2)` (y ajustes documentados donde existan)
- **No** fijar `padding-top/bottom` de contenedores `.jkhive-hex-gallery-*` en px en hojas de proyecto (p. ej. CRM, services-gallery) salvo recalcular `--jkhive-gallery-hex-flat` cuando el flat real del panal cambie (p. ej. CRM 100px / 80px) y dejar que `--jkhive-gallery-vertical-tip-pad` se actualice.
- Patrones: 9n (desktop 5-4), 5n (móvil 3-2) — ver `product-gallery.css` y doc histórica GALERIA-PRODUCTOS (JK Lubs).
- Hex horizontales (puntas izq/der) **no** usan esta geometría de tip vertical.

### 2.b Tres escalas visuales de panal (ítems con comportamientos propios)

JK Hive define **tres tamaños** de galería vertical; cada uno combina contenedor + clase de ítem y tiene **geometría, ciclo `nth-child` y hover** documentados en `jk-hive.css` (y extensiones en `product-gallery.css`, `jkhive-index-home-responsive.css`, etc.). Al integrar contenido en el framework unificado, **no mezclar** escalas en un mismo contenedor y **respetar** el ítem canónico de cada escala:

| Escala | Contenedor | Ítem típico | Notas |
|--------|------------|-------------|--------|
| **Grande** | `.jkhive-hex-gallery-big` | `.jkhive-itemgallery-big` / carruseles big | Hex mayor, filas/ciclos propios; hovers de celda según bloque BIG. |
| **Mediano** | `.jkhive-hex-gallery-medium` | `.jkhive-itemgallery-med` | Panal 9n (desktop) / 5n (móvil); hovers con `transform`/`::after` en ITEM GALLERY MEDIUM. |
| **Pequeño** | `.jkhive-hex-gallery-small` | `.jkhive-itemgallery-small` | Panal compacto; hovers y offsets por `nth-child` en escenarios tipo “ventajas”. |

Los **skins** de color (p. ej. `jkhive-hex-cyan-item`, `jkhive-hex-blue-item`) son **ortogonales** a la escala: cambian la lectura visual pero deben seguir aplicándose al **hex exterior** del ítem, con mitigaciones ya definidas para CTAs anidados (`jkfw-btn-scope`, `jkfw-launcher.css` § launcher).

### 2.c Galería **MEDIUM**: modo estático vs modo paginado (sellado framework)

Referencias canónicas:

- Script: `showcase/assets/js/jkhive-hex-gallery-framework.js` (solo actúa si existe el atributo de paginación).
- Estilos pager en contexto admin/launcher: `showcase/assets/css/jkfw-launcher.css` (clase `jkhive-pagination--hex-gallery`; complementa `jkfw-showcase-shell.css` en listados admin sin romper genéricos).
- Carga global del script: `showcase/includes/layout-scripts.php`.

**Modo 1 — Lista finita (sin paginación)**  

- Contenedor: `.jkhive-hex-gallery.jkhive-hex-gallery-medium` **sin** `data-jkhive-paginate`.
- Comportamiento: todos los ítems permanecen en el DOM; el panal **crece verticalmente**. Pensado para conjuntos acotados (habitualmente pocas tarjetas); debe seguir siendo correcto con más ítems (p. ej. 18–36) si hiciera falta, **sin** activar el framework de páginas.

**Modo 2 — Feed que crece en el tiempo (con paginación)**  

- Contenedor: misma clase MEDIUM más **`data-jkhive-paginate="true"`**.
- Comportamiento: **igual al estado validado en mesa** — reconstrucción de página respetando ciclo honeycomb MEDIUM, pager con meta compacta (“Mostrando *a–b* de *n*”), bloque centrado, sin control “ir a página”.
- **Orden de contenido:** en noticias y feeds similares, **anti-cronológico** (más nuevas primero en el panal y en las primeras páginas). La entrada más antigua queda al final. Los datos deben ordenarse **antes** del HTML; si se usa `array_reverse` solo para pintado, preservar **índices** alineados con el JSON del modal (`data-jkfw-news-idx` ↔ `items[i]` en `#jkfw-simple-news-modal-data`).

**Ejemplo integrado (landing básica CANON):** `showcase/includes/partials/jkfw-landing-simple-home-mirror.php` + `demo-landing-simple.php`.

**Sincronización mesa XAMPP:** el árbol vivo `c:\xampp\htdocs\JKHFW` usa `assets\` y `includes\` en la raíz del sitio — **no** existe `showcase\` bajo JKHFW. Copiar desde `JK-Hive-FrameWork/showcase/assets/` → `JKHFW/assets/` (y equivalente PHP/includes) al validar en Apache.

## 3. Galería catálogo (`.jkhive-product-gallery`)

- Layout y breakpoints en `product-gallery.css` **parte 1**; estilo visual **parte 2**.
- Padding vertical del contenedor: mismos tokens que §2 con `--jkhive-gallery-hex-flat` por breakpoint (210 → 160 → 130 → 110); bottom extra hacia paginación: `--jkhive-product-gallery-pagination-gap`.

## 4. Anti-patrones (causa de regresiones documentadas)

- Reducir “a ojo” `padding-top` de galerías (p. ej. 60px → 35px) sin apex — **rechazado**.
- `padding-top: … !important` sobre galerías medium que pisan `jk-hive.css`.
- `transform: none !important` en celdas del panal salvo excepción mobile documentada en `jk-hive.css`.
- Sombras/fondos/honeycomb extra en `main`/`body` no presentes en el shell JK Hive estándar.

### 4.b Hex JK Hive **anidado** dentro de `.jkhive-itemgallery-med` (regresión frecuente)

En `jk-hive.css`, el bloque “ITEM GALLERY MEDIUM” usa selectores por **descendencia**:

- `.jkhive-itemgallery-med .jkhive-hex` (tamaños ~260px, `clip-path`, `::after` de relleno)
- `.jkhive-itemgallery-med:hover .jkhive-hex` / `::after` (`transform`, `background` con `!important`)

Eso **no distingue** el hex grande del ítem del panal del **primer** nivel de cualquier `.jkhive-hex` **interno** (p. ej. `jkhive-admoptions-bttn` + `jkhive-bttn-sm`). Mientras el puntero está sobre la celda (`:hover`), el CTA hijo puede quedar pintado como si fuera el hex del ítem → aspecto roto / doble pseudocapa.

**Mitigación (showcase launcher, vigente):**

1. Controles dentro del ítem med: envoltorio **`jkfw-btn-scope`** y hoja **`jkfw-button-tokens.css`** (`isolation: isolate`), ver `framework-demo.php` y esta hoja en `assets/css/`.
2. **Anulación dirigida:** `jkfw-launcher.css` — comentario *“Controles JK Hive DENTRO de .jkhive-itemgallery-med”*; selectores con prefijo `html body … .jkfw-launcher-hex-gallery … .jkfw-btn-scope` restauran tamaño/`::after`/fondo del patrón admoptions+bttn-sm.

**Mitigación estructural a futuro (breaking, coordinar):** acotar el CSS legacy del ítem med a **`> .jkhive-hex`** (solo el hex exterior) en `jk-hive.css` cuando el refactor global esté pactado.

## 5. Pieles e ítems hex

- `showcase/assets/docs` en proyectos vivos: **HEX-ITEM-CANONICAL-SKINS** (referencia jkhive); layout 25/50/25: `jkhive-hex-item-layout.css`.

## 6. Showcase y sincronización local

- Regla Cursor: `.cursor/rules/jkhfw-xampp-workflow.mdc`.
- Validación por componente: `docs/VALIDACION_COMPONENTES.md` (extensible con esta matriz).

## 7. Formulario de contacto público (canónico)

- Contrato detallado en **`docs/CONTACT_FORM_PUBLIC_CANON.md`** (no duplicar aquí el checklist completo).
- Invariantes que **no romper** en sitios públicos JK Hive:
  - Campos dentro de **`jkhive-field-surface jkhive-surface-theme-sidebar`** (SVG panal único por máscara + tokens hero; sin segunda capa `var(--honeycomb-url)` en el wrap).
  - Botón enviar hex **admoptions+bttn-big** como en showcase.
  - Validación cliente en orden nombre → correo → mensaje; **asunto opcional**; errores tipo **B** sobre el botón; éxito tipo **A** con regla hero / posición estándar.
- Producción puede añadir backend; la misma cascada UX debe mantenerse salvo especificación nueva.

---

**Mantenimiento:** cualquier nueva familia de componente debe añadir aquí una subsección breve (qué token / qué archivo / qué no tocar).
