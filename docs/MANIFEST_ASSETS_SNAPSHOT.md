# Snapshot de activos UI (oleada 1)

**Origen canónico copiado:** `d:\Perfil\Desktop\JK HIVE BACKUP\htdocs\jkhive\www\public\assets\`  
**Destino en el monorepo:** `showcase\assets\`  
**Fecha de copia (referencia):** 2026-04-30  

Incluye:

- `css\` — 29 hojas (mismo conjunto que el proyecto jkhive `www`).
- `js\` — 27 scripts; **`hosts-config.js` fue reemplazado** por la variante `showcase` que resuelve `WEB_URL`/`CRM_URL` respecto al directorio del showcase.
- `img\` — copiado para que `modals.css` resuelva `honeycomb-pattern.svg`.

**Excepción / archivos añadidos (no vienen de jkhive como tal):**

- `showcase\assets\js\showcase-interactions.js` — demos home (toast/modal/error).
- `showcase\assets\js\jk-hive-toast-api.js` — API `toast` / `jkHiveToast`.
- `showcase\assets\js\error-handler.js` — captura global (toast).
- `showcase\assets\js\jkfw-crud-demo.js` — CRUD demo usuarios/productos.
- `showcase\assets\css\jkfw-button-tokens.css`, `jkfw-showcase-crud.css` — capa showcase.
- `showcase\config\navigation.json` — navegación y footer configurables.
- `showcase\includes\*.php`, `*.php` raíz — shell PHP JK Hive Framework.

**Evidencia de sincronía jklubs ↔ jkhive (auditoría previa):**

- `system-messages.css` — mismo tamaño en jklubs y jkhive.
- `tooltip.js` — mismo tamaño en jklubs y jkhive.
- `jkhive-toasts.js` — jkhive más reciente que jklubs; el snapshot sigue a jkhive.
