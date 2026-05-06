# Fase 1 — Inventario multi-fuente (JK Hive Framework)

Índice enriquecido por **macro-áreas** y archivos **canónicos** referenciados en documentación JK Lubs / jkhive. Los conteos globales sirven como magnitud del corpus (no todos los archivos están listados literalmente).

## 1.1 Proyectos y magnitud del código

| Origen | Ruta base | PHP | CSS | JS | Notas |
|--------|-----------|-----|-----|-----|--------|
| JK Lubs | `...\htdocs\jklubs\www` | 134 | 16 | 18 | Documentación sistemática (`JK Lubs Data\documentación sistema kralub\`). |
| JK Hive CRM/app | `...\htdocs\jkhive\www` | 102 | 29 | 27 | **`jkhive-toasts.js`**, **`system-messages.css`**, layout PHP, footer público. |
| House Sitting | `...\htdocs\housesitting\www` | 129 | 24 | 20 | Sellados `Data\housesitting-docs\`; `sidebar-menu-website.js`; `ANIMACIONES_REUTILIZABLES.txt`. |
| CRM legacy | `...\htdocs\crm` | 145 | 12 | 13 | `css/jk-hive.css`, `jkhive-navbar.css`, sin `jkhive-toasts.js`. |
| jkhive.work | `...\htdocs\jkhive.work` | 90 | 19 | 59 | Sitio marketing + `jkhive-admin-buttons.css` / `tooltip.js` (versión anterior al par jklubs/jkhive). |

## 1.2 Documentación crítica (decisiones y “sellado”)

| Ubicación | Contenido |
|-----------|-----------|
| `jklubs\...\00-SISTEMA_REPLICABLE_LEEME_PRIMERO.md` | Jerarquía: Housesitting ↔ JK Lubs; una sola verdad de assets (**09**, **16** tooltips). |
| `jklubs\...\09-ASSETS_OBLIGATORIOS.md` | Orden CSS/JS; obligatoriedad **`tooltip.js`**. |
| `jklubs\...\16-TOOLTIPS-JKHIVE.md` | Especificación reconstructiva tooltip (solo JK Hive). |
| `jklubs\...\05-alertas-toasts.md` | Tipo A/B, **`showToastInModal`**, hex 6%/94%, confirmaciones. |
| `jklubs\...\estilo-jkhive\20-RESUMEN-EJECUTIVO-ESTRUCTURA-JKHIVE.md` | Grilla 140px sidebar, navbar 70px, modales 3 zonas. |
| `jklubs\...\estilo-jkhive\22-ERRORES-SISTEMA-TOAST-PERSISTENTE-Y-BD.md` | Toast persistente + ticket (PHP + `showPersistentErrorToast`). |
| `housesitting\Data\housesitting-docs\ANIMACIONES_REUTILIZABLES.txt` | Catálogo keyframes **`jkhive-*`** (`jkhive-admin-buttons.css` / elements). |
| `jkhive\www\public\assets\docs\ALERTS-README.md` | API toast heredable, alineación barra/navbar. |

## 1.3 Archivos canónicos ya consolidados en el showcase

| Rol | Rutas fuente equivalentes | En framework |
|-----|---------------------------|--------------|
| Variables + hex base | `jkhive\www\public\assets\css\jk-hive.css` | Copia en `showcase/assets/css/jk-hive.css` |
| Toasts CSS | `system-messages.css` (idéntico jklubs/www y jkhive/www, 64618 bytes, 2026-04-17) | Copia showcase |
| Toasts JS | **`jkhive\www`** `jkhive-toasts.js` (25860 bytes, 2026-04-17) > jklubs 24230/2026-03-29 | Copia desde jkhive |
| Tooltip | `tooltip.js` jklubs == jkhive (10624 bytes, 2026-03-08); HS más corto | Par jkhive/jklubs |
| Navbar / sidebar CSS | `jkhive\www\public\assets\css\` | Copia showcase |
| Modales CSS | `modals.css`, `jkhive-modals.css` | Copia showcase |
| Botones / animaciones elementos | `jkhive-elements.css` (Keyframes `jkhive-anmtn-*`) | Copia showcase |

## 1.4 Dependencias cruzadas (relación archivo ↔ archivo)

- **`tooltip.js`** ↔ `jk-hive.css` (`.jkhive-tooltip-following`), duplicado mínimo en `system-messages.css` para ticket (doc **16**).
- **`jkhive-toasts.js`** ↔ `system-messages.css` (clips hex, tipo A/B, confirmación hex `showActionConfirmToast`).
- **`modals.css`** ↔ `assets/img/honeycomb-pattern.svg` (overlay modal).
- **`jkhive-navbar.js`** ↔ `hosts-config.js` (APIs); showcase usa `hosts-config.js` derivado sin backend.
- **PHP layouts jkhive** ↔ `includes/layout-persistent-error-toast.php` + core `Database` (no incluidos en showcase puro sin autoload).
