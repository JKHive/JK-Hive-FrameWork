# Fase 13 — Validación por componente (showcase)

## Criterios

1. **Aislamiento:** no requiere proyecto jklubs/jkhive en disco para servir el showcase (solo activos empaquetados + PHP).  
2. **Look & feel:** usa las mismas clases y variables que el stack documentado (**09**, **20**, **16**).  
3. **Responsive:** hereda breakpoints de `jk-hive.css`, `jkhive-navbar.css`, `jkhive-sidebar.css`, `krauss-mobile.css`; tablas demo con scroll/gap documentado.  
4. **Tooltips:** solo `data-tooltip` + `tooltip.js` (sin `title` como sustituto en botones demo).  
5. **Toasts:** `jkHiveToast` delega en `jkhive-toasts.js`; persistente no confunde con tipo A/B.  

## Matriz rápida showcase

| Pieza | ¿Validado en showcase? | Nota |
|-------|------------------------|------|
| Grilla navbar+sidebar+footer | Sí | Footer + main + includes. |
| Tipo A toast | Sí | Botones Home. |
| Tipo B / inline | Sí | Botón info Home. |
| Toast modal TV | Sí | `showToastInModal` desde demo CRUD. |
| Confirmación eliminar | Sí | `showDeleteConfirmToast` en usuarios/productos. |
| Tooltip en modal | Sí | Tooltip attach al abrir modal CRUD. |
| Error global capturado | Sí | `error-handler.js` (mensaje acotado demo). |
| Ticket backend | No | Falta `api/ticket-soporte-public.php` en showcase. |
