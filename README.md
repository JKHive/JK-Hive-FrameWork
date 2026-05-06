# JK Hive Framework

Monorepo que **consolida en código real** el sistema visual JK Hive (JK Lubs, app **jkhive**, House Sitting, CRM, jkhive.work), con evidencia documentada por fase.

## Documentación principal

| Documento | Contenido |
|-----------|-----------|
| [docs/PLAN_CONSOLIDACION_JK_HIVE.md](docs/PLAN_CONSOLIDACION_JK_HIVE.md) | Plan maestro y estado del build |
| [docs/CONSOLIDACION_EJECUTADA_RESUMEN.md](docs/CONSOLIDACION_EJECUTADA_RESUMEN.md) | Resumen ejecutable de lo entregado |
| [docs/INVENTARIO_FUENTES_JK_HIVE.md](docs/INVENTARIO_FUENTES_JK_HIVE.md) | Fase 1 — índice multi-fuente |
| [docs/ANALISIS_TEMPORAL_COMPONENTES.md](docs/ANALISIS_TEMPORAL_COMPONENTES.md) | Fase 2 — línea temporal |
| [docs/AGRUPACION_TAXONOMIA.md](docs/AGRUPACION_TAXONOMIA.md) | Fase 3 — taxonomía |
| [docs/SELECCION_EVIDENCIA.md](docs/SELECCION_EVIDENCIA.md) | Fase 4 — selección |
| [docs/PLAN_MIGRACION_EJECUTABLE.md](docs/PLAN_MIGRACION_EJECUTABLE.md) | Fase 12 — migración |
| [docs/VALIDACION_COMPONENTES.md](docs/VALIDACION_COMPONENTES.md) | Fase 13 — checklist |
| [docs/MANIFEST_ASSETS_SNAPSHOT.md](docs/MANIFEST_ASSETS_SNAPSHOT.md) | Origen de `showcase/assets` |

Regla Copilot/Cursor (**XAMPP trabajo ↔ repo aprobación**): [`.cursor/rules/jkhfw-xampp-workflow.mdc`](.cursor/rules/jkhfw-xampp-workflow.mdc).

## Showcase PHP (JK Hive Framework)

- **Repo:** carpeta [`showcase/`](showcase/) — `includes/`, `config/navigation.json`, `*.php`, `assets/` (snapshot **jkhive `www/public/assets`** + capas `jkfw-*`, `jk-hive-toast-api.js`, `error-handler.js`, `jkfw-crud-demo.js`).
- **Características:** grilla JK Hive + **footer**; navbar/sidebar/footer desde **JSON**; tooltips JK Hive (**sin** `title`); toasts (**`toast()` / `jkHiveToast`**, tipo A/B, persistente en demo Home); tabla admin demo + **modal CRUD**; eliminar → **`showDeleteConfirmToast`**; animación **`jkhive-btn-anim-shake`** en crear.
- **XAMPP (trabajo diario):** `c:\xampp\htdocs\JKHFW` — `http://localhost/JKHFW/index.php`

```bash
npm run showcase:php
```

(Abre `http://localhost:4180/index.php` si `php` está en PATH.)

## Paquete SCSS (incremental)

- [`packages/jk-hive-ui/`](packages/jk-hive-ui/) — tokens parciales + registro animaciones (`sass`: ver README del paquete).
