# Formulario de contacto público — JK Hive (canónico)

**Estado cerrado:** 2026-05-08. Esta es la **referencia oficial** para formularios de contacto en sitios públicos que usan el shell JK Hive (landing básica, CRM público ligero, demos).

## Referencia viva en showcase

| Recurso | Ruta (`showcase/` o mesa XAMPP `JKHFW/`) |
|--------|------------------------------------------|
| Página demo | `demo-landing-simple-contact.php` |
| Sidebar landing simple | `includes/jkfw-landing-simple-sidebar.php` |
| Hero landing simple | `includes/jkfw-landing-simple-hero.php` |
| Estilos formulario / grid contacto | `assets/css/jkfw-launcher.css` (prefijos `.jkfw-contact-*`) |
| Superficie campos (`mask` + mismo SVG que sidebar/hero) | `assets/css/jk-hive.css` → `.jkhive-field-surface.jkhive-surface-theme-sidebar` |
| Honeycomb técnico (tokens tema) | `assets/css/jkfw-themes.css` (`--jk-hero-pattern-color-rgb`, `--jk-hero-pattern-opacity`, etc.) |

## Contrato de marcado (campos)

- Cada **`input`** / **`textarea`** va dentro de un wrap:

```html
<div class="jkhive-field-surface jkhive-surface-theme-sidebar">
  <input class="jkfw-contact-form-input" …>
</div>
```

- Motivo técnico: el patrón canónico usa **`::before`** con `mask-image: var(--honeycomb-url)` + tinte `rgba(var(--jk-hero-pattern-color-rgb), var(--jk-hero-pattern-opacity))`. Los elementos de formulario reemplazados no admiten ese pseudo de forma fiable.

- Envío oficial: **`jkhive-admoptions-bttn` + `jkhive-bttn-big` + `jkhive-bttn-inner`** (hex con icono papel).

## Validación cliente (orden fijo)

Cada envío del formulario (`#jkfwSimpleContactForm`, demo) aplica **en este orden**:

1. **Nombre** — no vacío (trim).
2. **Correo** — no vacío y formato mínimo `usuario@dominio.ext`.
3. **Mensaje** — no vacío (trim).

**Asunto:** opcional; no se valida.

## Toasts (framework)

- **Error / dato faltante:** **tipo B** — `showToastInline({ message, type: 'error', anchorEl: <botón enviar>, autoCloseMs, onClose })`. El mensaje indica qué falta en el orden anterior. Al **cerrar** el toast (auto), se hace **focus** + `scrollIntoView` al campo correspondiente.
- **Éxito (demo, sin backend):** **tipo A** — `showToastBar('Mensaje enviado correctamente.', 'success', opts)`  
  - `opts.fixedTopPx`: cuando el hero **`.jkfw-landing-basic-hero`** interseca el viewport pero no está oculto arriba, la barra se coloca **bajo el hero** (no sobrepone el hero). Si el usuario ya pasó el hero (`bottom ≤ 0`) o solo queda más abajo del viewport, se usa la posición fija estándar (esquina superior derecha tipo A).
  - Tras **`onClose`**: `reset()` del formulario y limpieza de `#jkfwSimpleContactResult`.

## APIs JS relacionadas

- `showToastBar(message, type, { autoCloseMs, onClose, fixedTopPx })` — opción **`fixedTopPx`** en `showcase/assets/js/jkhive-toasts.js`.
- `toast()` / `jkHiveToast()` — `showcase/assets/js/jk-hive-toast-api.js`: pasa **`onClose`** en tipo **B**; tipo **A** admite **`onClose`** y **`fixedTopPx`**.

## Producción posterior

Este contrato cubre UI/UX canónica. En producción, sustituir el bloque éxito “demo” por **POST**/API real manteniendo los mismos toasts y el mismo orden de validación.
