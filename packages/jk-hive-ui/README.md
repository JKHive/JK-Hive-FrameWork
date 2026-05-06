# @jk-hive/ui (stub SCSS → compilación opcional)

Fase **11**: separación inicial **sin romper** el CSS monolítico ya servido desde `jk-hive.css`.

## Qué hay

- `scss/_variables.scss` — extracted token subset from `jk-hive.css :root` (documentado como copia parcial).
- `scss/_animations-registry.scss` — registro textual de `@keyframes jkhive-*` ubicados en `jkhive-elements.css` / `system-messages.css`.
- `scss/main.scss` — re-exporta partials para futura compilación Sass.

## Compilar (Dart Sass)

Desde esta carpeta, con sass instalado:

```bash
npx sass scss/main.scss dist/jk-hive-ui-tokens.css --no-source-map
```

Por ahora **el showcase sigue usando** los CSS copiados de jkhive; este paquete es la base incremental para refactor SCSS sin sustituir aún `--jkhive-hex-horizontal` ni bloques sellados (**05**, **09**).
