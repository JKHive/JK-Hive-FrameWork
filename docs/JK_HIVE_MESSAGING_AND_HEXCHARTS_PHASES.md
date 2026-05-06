# Fases — gráficos hex dashboard + mensajería CRM en showcase

Cada fase debe cumplir textualmente lo pedido antes de pasar a la siguiente.

## Fase H1 — Naming y animación `jk-hive-3danimation-1`

- [x] Nombre oficial de la familia de transiciones: **`jk-hive-3danimation-1`**.
- [x] Alias documentado sobre el mismo patrón de profundidad/escala ya usado en `.jkhive-transition-*` (modales/carrousel).
- [x] API JS mínima reutilizable: `JKHive3dAnimation1` (mensajería view→reply y cierre reply).

## Fase H2 — Gráficos hexagonales dashboard

- [x] **H2a Torta hex**: sectores proporcionales al *ángulo* (pie convencional) recortados por **hex regular** (`clip-path` / máscara). Nota técnica: el área resultante dentro del hex ya no respeta proporción métrica euclídea cilíndrica como un círculo; equivale al patrón “pie + máscara hex” con porcentajes de ángulos al centro; documentado en CSS.
- [x] **H2b Estrella / radar de 6 ejes**: seis radios al vértice, polígono que une valores normalizados; variante pensada como “órbitas” tipo radar (vértices en cada eje).
- [x] **H2c / H2d Barras**: barras construidas con **tiles hex** alineados (vertical u horizontal).

## Fase H3 — Mensajería = CRM backup (funcional + visual JK Hive actual)

**Comprobación contra** `JK HIVE BACKUP/htdocs/crm/messages.php` + `js/messaging.js`:

- [x] Mismo esqueleto DOM: `#messagingFolders`, `#messagingList`, `#bulkActionsToolbar`, `#selectAllMessages`, `#folderTitle`, `#messagingView` (oculto; lectura principal en modal hex).
- [x] `MessagingSystem` se inicializa (requiere `#messagingFolders`).
- [x] **API demo**: intercept `fetch` hacia mensajes con respuestas JSON coherentes (`folders`, `list`, `read`, `send`, `bulk`, `star`, marcado lectura simulado, `empty_trash`, `get_messaging_users`) sin servidor.
- [x] `AuthManager.currentUser` en showcase para perfil administrator (reenvío / destinatarios como en CRM).
- [x] **Toasts**: envío nuevo / respuesta → **tipo B** (`toast()`, anclaje al hex de enviar); errores siguen usando `systemMessages`/alertas JK Hive donde ya estaba definido.
- [x] **Confirmaciones destructivas**: se mantiene el flujo `SystemMessages.confirm` moderno hex del CRM (`jkhive-modals-alert` cuando aplica); el toast persistente con ticket+X es el mismo componente cargado desde `jkhive-toasts.js` y queda disponible para flujos de error/soporte donde corresponda.
- [x] Transición **view → responder**: clase **`jk-hive-3danimation-1`** (salida vista hacia arriba).
- [x] **Cerrar / enviar respuesta**: transición **`jk-hive-3danimation-1`** salida reply hacia abajo y vista restaurada donde aplique.

## Fase H4 — Integración única JK Hive

- [x] Mismos `assets/css/jk-hive.css`, `messaging.css`, `jkhive-modals.css`, JS compartidos (sin segunda copia de `messaging.js`).

---

**Ejecución:** implementado en `showcase/` (archivos listados en el diff).

