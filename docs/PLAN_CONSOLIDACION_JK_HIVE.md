# Plan de trabajo — JK Hive Framework (consolidación real)

Este documento es el **plan maestro ejecutable** para construir el repositorio **JK-Hive-FrameWork** a partir de los proyectos fuente reales. Las decisiones de prioridad siguen la documentación interna (p. ej. `00-SISTEMA_REPLICABLE_LEEME_PRIMERO.md` en JK Lubs: Housesitting = estructura base; JK Lubs = perfeccionado para replicar; jkhive = destino de integración) y la evidencia de fechas/tamaño de archivos.

## 0. Fuentes indexadas (rutas absolutas en disco)

| Proyecto | Ruta |
|----------|------|
| JK Lubs | `d:\Perfil\Desktop\JK HIVE BACKUP\htdocs\jklubs` |
| CRM | `d:\Perfil\Desktop\JK HIVE BACKUP\htdocs\crm` |
| House Sitting | `d:\Perfil\Desktop\JK HIVE BACKUP\htdocs\housesitting` |
| JK Hive (app) | `d:\Perfil\Desktop\JK HIVE BACKUP\htdocs\jkhive` |
| jkhive.work | `d:\Perfil\Desktop\JK HIVE BACKUP\htdocs\jkhive.work` |

### Documentación obligatoria (leer antes de consolidar cada bloque)

- **JK Lubs:** `JK Lubs Data\documentación sistema kralub\` — en especial `00-SISTEMA_REPLICABLE_LEEME_PRIMERO.md`, `09-ASSETS_OBLIGATORIOS.md`, `16-TOOLTIPS-JKHIVE.md`, `05-alertas-toasts.md`, `estilo-jkhive\20-RESUMEN-EJECUTIVO-ESTRUCTURA-JKHIVE.md`, `estilo-jkhive\22-ERRORES-SISTEMA-TOAST-PERSISTENTE-Y-BD.md`.
- **House Sitting:** `Data\housesitting-docs\ANIMACIONES_REUTILIZABLES.txt`, sellados `*_Sellado_Estado_Actual.txt`, `NAVBAR_ESTANDAR_UNIFICADO_JK_HIVE.md`.
- **jkhive:** `www\public\assets\docs\ALERTS-README.md`, includes de layout y `layout-persistent-error-toast.php`.
- **CRM:** `NAVBAR_UNIFICADO_DOCUMENTACION.md` (convivencia con rutas `css/` `js/`).

## 1. Criterios de selección (evidencia)

| Componente | Hecho comprobado | Acción en framework |
|------------|------------------|----------------------|
| `tooltip.js` | Mismo tamaño y fecha en jklubs `www` y jkhive `www` (2026-03-08, 10624 bytes) | Una sola copia canónica; Housesitting y jkhive.work son versiones anteriores/menores |
| `system-messages.css` | Idéntico en jklubs y jkhive (2026-04-17, 64618 bytes) | Copia única |
| `jkhive-toasts.js` | jkhive **más reciente y mayor** que jklubs (2026-04-17 vs 2026-03-29) | Tomar **jkhive** como referencia; alinear jklubs en una fase posterior si difieren |
| Toasts en Housesitting | `jkhive-toasts.js` ausente; `system-messages.css` reducido | No usar Housesitting como fuente de toasts completos |
| Animaciones botones (doc sellado feb 2025) | Housesitting: `jkhive-admin-buttons.css` | En SCSS unificado: importar o fusionar con `jkhive-elements.css` de JK Lubs/jkhive según doc 09 |

## 2. Estructura objetivo del monorepo

```
JK-Hive-FrameWork/
  docs/                    # Plan, inventario (fases 1–4, 12–13), migración
  showcase/                # Showcase PHP completo + config JSON + includes/
    assets/                # Snapshot jkhive www/public/assets + capas jkfw-*
    config/navigation.json
    *.php                  # Entradas + shell común
  packages/
    jk-hive-ui/            # SCSS incremental (tokens / registro animaciones)
  apps/                    # (opcional) wrappers por producto
```

## 3. Fases de trabajo (resumen)

1. **Indexación** — Ver **`docs/INVENTARIO_FUENTES_JK_HIVE.md`** (completado en repo).
2. **Análisis temporal** — Por archivo duplicado: `LastWriteTime`, diff, doc “sellado” o “arreglado”.
3. **Agrupación** — Taxonomía del usuario (Fase 3 original).
4. **Selección** — Tabla origen vs descartado con motivo.
5. **Botones JK Hive** — Base `jkhive-elements.css` + variantes documentadas en `04-botones-y-ctas.md`; animaciones centralizadas ( Housesitting catalog + jkhive ).
6. **Tooltips** — Solo `data-tooltip` + `tooltip.js` + `.jkhive-tooltip-following` en `jk-hive.css` / `system-messages.css`; prohibido `title` para UI JK Hive.
7. **Toasts y errores** — `system-messages.css` + `jkhive-toasts.js`; API `showToastBar`, `showToastInModal`, `showToastInline`, `showPersistentErrorToast`, confirmaciones; integración doc 22 (PHP + partial).
8. **Grillas** — Layout 140px sidebar, navbar 70px, `jkhive-content-wrap`, modales 3 secciones (`modals.css`, `jkhive-modals.css`).
9. **Animaciones** — Transición modal stage/slides; toasts TV; extraer keyframes a módulo SCSS.
10. **Layout configurable** — Extraer ítems a JSON/YAML cargado por build o PHP; roles en servidor.
11. **SCSS unificado** — Partir `jk-hive.css` / `system-messages.css` sin cambiar salida inicial (wrapper `@import` hasta migración completa).
12. **Plan de migración por archivo** — Tabla “origen → destino → transformación → eliminación”.
13. **Validación** — Por componente: aislado, responsive, sin dependencia del repo original.
14. **Showcase** — Páginas Home, About, Contact, Mensajería, Usuarios, Productos usando la grilla y los sistemas anteriores.

## 4. Artefactos de código en `showcase/`

- Activos **`jkhive\www\public\assets`** (+ `hosts-config.js` showcase). Lista extendida en [MANIFEST_ASSETS_SNAPSHOT.md](MANIFEST_ASSETS_SNAPSHOT.md).
- **PHP:** entradas, `includes/` (cabecera, sidebar desde JSON, footer desde JSON, modales demo + CRUD, scripts).
- **Capas nuevas:** `jk-hive-toast-api.js`, `error-handler.js`, `jkfw-crud-demo.js`, `jkfw-showcase-crud.css`, `jkfw-button-tokens.css`.


## 5. Próximas oleadas (orden sugerido)

Ejecutado: inventario/consolidación en `docs/`; showcase PHP con **`config/navigation.json`**; **`jk-hive-toast-api.js`** + **`error-handler.js`**; CRUD demo usuarios/productos; stub **`packages/jk-hive-ui`**. Detalle en **`docs/CONSOLIDACION_EJECUTADA_RESUMEN.md`**.

Siguientes extensiones opcionales:

1. Portar **`layout-persistent-error-toast.php`** + APIs de ticket cuando exista backend (doc **22**).
2. Compilar SCSS en CI y refactor incremental del monolítico **`jk-hive.css`**.
3. Tests visuales o Storybook.

## 6. Cómo ejecutar el showcase localmente

**XAMPP (recomendado):** `http://localhost/JKHFW/index.php` sobre `c:\xampp\htdocs\JKHFW`.

**PHP embebido (sin XAMPP):** desde la raíz del repo, `npm run showcase:php` y abrir `http://localhost:4180/index.php`. Las llamadas a API del navbar fallarán sin backend; es esperado en esta fase.
