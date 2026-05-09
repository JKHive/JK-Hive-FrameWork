# Reglas de implementacion JK Hive Framework

Estas reglas son obligatorias para toda correccion futura en la mesa `JKHFW`.

1. No se aceptan parches "a la fuerza" por caso puntual.
2. Toda correccion debe quedar como solucion canónica reusable del framework.
3. Si una solucion necesita repetirse, se crea como etiqueta/clase/utilidad JK Hive.
4. Cualquier nueva pagina debe consumir esas utilidades, no duplicar hacks inline.
5. Cuando haya conflicto entre rapidez y arquitectura, prima la solucion final integrada.

## Patron de entrega obligatorio

- Detectar causa raiz.
- Crear/ajustar utilidad canónica (CSS/JS/PHP helper).
- Aplicar esa utilidad en el/los lugares concretos.
- Verificar que no rompe componentes vecinos.

## Utilidades canónicas ya definidas

- `jkhive-link-inline`: hipervinculo inline dentro de texto en componentes hex.
- `jkhive-gallery-align-left`
- `jkhive-gallery-align-center`
- `jkhive-gallery-align-right`

Estas utilidades deben preferirse antes de crear estilos inline o reglas especificas temporales.

## Galerías hex MEDIUM (framework sellado)

- Contrato único: **`docs/JK_HIVE_FRAMEWORK_CONTRACT.md`** §§ **2.b** (tres escalas big / med / small y skins) y **2.c** (MEDIUM sin paginación vs `data-jkhive-paginate="true"`, orden anti-cronológico para feeds, archivos tocados, sync XAMPP).
- Regla operativa del agente: **`.cursor/rules/jkhfw-hex-gallery-medium-modes.mdc`** (refuerzo breve en cada sesión).

Cualquier nueva página que use galería MEDIUM **debe** adherirse a ese contrato; no duplicar lógica de pager ni overrides sueltos fuera de las hojas canónicas citadas.
