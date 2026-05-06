# Fase 3 — Agrupación total por taxonomía

## BOTONES

- Clases: `jkhive-bttn-*`, `jkhive-admoptions-bttn`, toggles tabla, footer honeycomb modal (JK Lubs doc **04**, **17**).
- Fuente principal: **`jkhive-elements.css`** + doc animaciones Housesitting (`jkhive-anmtn-*`).

## TOOLTIPS (solo JK Hive)

- `data-tooltip` + **`tooltip.js`** + `.jkhive-tooltip-following` (`jk-hive.css` + duplicación mínima en `system-messages.css`).
- Prohibido: `title` nativo como sustituto de UX JK Hive.

## TOASTS / ALERTAS

- CSS: **`system-messages.css`** (`--jkhive-hex-horizontal`).
- JS: **`jkhive-toasts.js`**: tipo A (`showToastBar`), modal TV (`showToastInModal`), B (`showToastInline`), persistente (`showPersistentErrorToast`), confirmaciones (`showActionConfirmToast`, `showDeleteConfirmToast`, `showSaveConfirmToast`).

## LAYOUT

- Navbar: `jkhive-navbar.css` + **`jkhive-navbar.js`**.
- Sidebar + logo cuadrado 140px: `jkhive-sidebar.css`; patrón jkhive `layout-sidebar.php`.
- Footer público: bloque `.jkhive-footer` en **`jk-hive.css`** + markup tipo `public-footer.php`.

## GRILLAS

- Página: `jkhive-content-wrap`, `jkhive-page-container`, `scroll-padding` doc **20**.
- Modales: `modals.css` (overlay fullscreen, contenido centrado).
- Hex / galerías: `jkhive-hex-item-layout.css`, galerías móvil, skins doc **HEX-ITEM-CANONICAL-SKINS.md**.

## ANIMACIONES

- Botones/iconos: keyframes `jkhive-anmtn-*` en **`jkhive-elements.css`**.
- Modales: `modalSlideIn` en **`modals.css`**; transiciones tipos en `modals.css` (`jkhive-modal-tipos`).
- Carruseles: **`jkhive-hub-carousel.css`**, **`service-carousel`** patterns (sites públicos).

## CORE (errores / helpers JS)

- `hosts-config.js` (rutas API).
- `error-handler`: patrón global + **`jkHiveToast`**: capa nueva en showcase (véase **Fases 7/13**) sin reemplazar `jkhive-toasts.js`.

## MÓDULOS (usuarios / productos / mensajería)

- Referencia tablas admin: **`jklubs\www\admin\productos.php`** (estructura `.jkhive-table` + acciones hex).
- Mensajería: `messaging.css` + `messaging.js` (jkhive app); showcase carga solo estilos de demo.
