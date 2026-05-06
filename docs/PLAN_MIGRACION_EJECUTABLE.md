# Fase 12 — Plan de migración ejecutable (por categoría)

## TOOLTIPS

- **Extraer:** `jkhive\www\public\assets\js\tooltip.js`  
- **Destino framework:** `showcase/assets/js/tooltip.js` (ya copiado); futuro `packages/jk-hive-ui/dist/` sin cambio de API.  
- **Transformar:** ninguna (congelar API `data-tooltip`, `JKHiveTooltipAttach`).  
- **Descartar:** tooltips basados en `title` en componentes JK Hive.  
- **Motivo:** doc **16**.

## TOASTS Y ALERTAS

- **Extraer:** `jkhive\www\public\assets\js\jkhive-toasts.js`, `system-messages.css`.  
- **Destino:** `showcase/assets/` + capa **`jk-hive-toast-api.js`** (única entrada `jkHiveToast`).  
- **Transformar:** estado `neutral` → `info`.  
- **Descartar:** duplicar reglas clip-path del hex en hojas locales.  
- **Motivo:** **05** CONFIGURACIÓN FINAL NO TOCAR.

## LAYOUT (navbar, sidebar, footer)

- **Extraer:** `jkhive-navbar.css`, `jkhive-sidebar.css`, bloque `.jkhive-footer` en `jk-hive.css`, patrón PHP `layout-sidebar.php` / `public-footer.php`.  
- **Destino:** `includes/layout-*.php` + **`config/navigation.json`**.  
- **Transformar:** footer sin `ecosystem.php`; navegación desde JSON; roles simulados sesión.  
- **Descartar:** hardcode duplicado tras migración a JSON.  
- **Motivo:** Fase 10 layout configurable.

## BOTONES Y ANIMACIONES

- **Extraer:** `jkhive-elements.css` (keyframes + clases botón).  
- **Destino:** sigue en CSS único; **`jkfw-button-tokens.css`** documenta variables `--jkfw-btn-*` demo (no reemplaza elementos).  
- **Transformar (futuro):** SCSS `packages/jk-hive-ui/scss/` compila a capa opcional.  
- **Descartar:** recrear animaciones con nombres distintos (`jkhive-anmtn-*` ya estándar).

## MODALES

- **Extraer:** `modals.css`, `jkhive-modals.css`, `honeycomb-pattern.svg`.  
- **Destino:** `showcase/assets/`.  
- **Transformar:** modales CRUD demo IDs `jkfw-crud-modal` reutilizando clases existentes.  

## CORE ERRORES JS

- **Extraer:** Patrón inline `layout-persistent-error-toast.php` (solo lógica cliente `showPersistentErrorToast`).  
- **Destino:** `error-handler.js` + inclusión opcional PHP `includes/layout-persistent-demo.php` showcase.  
- **Descartar:** `Database.php`/`ticket-soporte` hasta integración backend real.  
- **Motivo:** doc **22** requiere stack PHP completo.

## MÓDULOS (tablas admin)

- **Extraer:** reglas `.jkhive-table` incrustadas `jklubs\www\admin\productos.php` (primeros ~120 reglas relevantes).  
- **Destino:** `jkfw-showcase-crud.css` (subconjunto).  
- **Transformar:** solo estilos necesarios para demo; markup reducido pero clases reales.
