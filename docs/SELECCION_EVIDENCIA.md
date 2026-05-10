# Fase 4 — Selección basada en evidencia (resumen)

| Elemento | Elegido (ruta de referencia) | Descartado / alternativa | Razón |
|----------|------------------------------|---------------------------|-------|
| `jkhive-toasts.js` | `jkhive\www\public\assets\js\jkhive-toasts.js` | jklubs (más antiguo por bytes/fecha); ausencia CRM | Nueva versión; APIs confirmación documentadas en **05** / **ALERTS-README**. |
| `tooltip.js` | jkhive/jklubs `www` (idénticos) | housesitting `.work` (tamaños menores) | Alineación doc **09/16** y paridad CRM. |
| `system-messages.css` | jkhive (= jklubs) | households reducido en HS sitio público | Paridad tamaño/fecha full stack. |
| Layout CSS core | Paquete jkhive `public/assets/css/*` | Admin/shell showcase en `jkhive-style.css` / `jkhive-navbar.css` (ex crm + shell) | Conjunto coherente con modales/toasts/nav. |
| Tabla admin ejemplo | Extracciones de reglas desde `productos.php` | Tablas aisladas legacy | Doc **15** establece productos como verdad única visual. |
| Footer markup | Derivado `public-footer.php` sin `ecosystem.php` | Copia literal con deps PHP proyecto | Showcase desacoplado; mismas clases `.jkhive-footer`. |

Persistencia toast: propiedad **`persistent`** en **`jkHiveToast({...})`** (wrapper), no tipo de mensaje; tipos siguen siendo A (barra) / B (inline/TV modal) según `jkhive-toasts.js`.
