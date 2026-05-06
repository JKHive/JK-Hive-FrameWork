# Plan unificado — Selector de demos + variantes JK Hive Framework

## Objetivo (severo)

Un único árbol de activos (**mismos** `jk-hive.css`, `jkhive-elements.css`, `modals.css`, `system-messages.css`, JS de toasts/tooltips/navbar…) que permita:

1. **Pantalla de entrada (“launchpad”)**: fondo igual al overlay de modales JK Hive + título **“Elige lo que quieres ver”** + **ítems hex** agrupados por sección que enlazan demos.
2. **Demos funcionales por vertical** con UI alineada a los sistemas fuente (**jkhive público**, **JK Lubs**, **Housesitting**, **CRM**) sin datos personales ni fotos propias — texto genérico donde el contenido es “relleno”; etiquetas específicas de producto donde el marco JK Hive sí es estable (lista de usuarios, agregar usuario, guardar…).
3. **Login ficticio**: usuario `Visita Web` / contraseña `123456` — sin backend — feedback **toast tipo A** de bienvenida y estado visual persistente en sesión (front).
4. **Sistema de temas**: al menos **4 paletas distintas** que **mantienen el acento miel metálico** como constante JK Hive (`--jk-accent-honey*` fijos); el resto de tokens (`--jk-primary-*`, `--jk-tech-*`, secundarios, glows) cambia para producir una sensación distinta por sitio.
5. **Progresión de implementación incremental** hasta cubrir todas las rutas solicitadas sin duplicar hojas de estilo paralelas (“un solo framework”).

## Segmentación por demo

### A) Landing pública simple

- **Sin** navbar superior institucional, **sin** panel admin, **sin** sidebar lateral de app.
- **Con** hero + secciones de contenido hex / servicios placeholder.
- Preferencia del usuario: **puede servir como HTML ligero**, pero dentro del mismo repo debe seguir usando la misma huella CSS (enlace único en `<head>`) y variable de tema (`?theme=`).

### B) Landing avanzada

- Navbar superior JK Hive real.
- **Auto-admin**: sidebar + vistas de tabla / modales coherentes **como muestra** (`users.php`, CRUD demos). Login ficticio antes o al entrar.
- Sin flujo **carrito** (excluye e-commerce checkout).

### C) E-commerce básico

- Pantallas: **catalogo/grid**, fichas de producto genéricos, filtros superficiales, **sin carrito/checkout** (o sólo estado visual “lista de deseos”).
- Alcance UX: mismo patrón de cards **JK Lubs** estéticamente pero reducido.

### D) E-commerce avanzado

- Todo lo anterior + **carrito** (persistencia cliente en `sessionStorage`) + modal de checkout simulado (sin pago ni API).

### E) Portal web tipo Housesitting

- Home multi-bloques (hero + servicios + CTA hex + pie), enlaces navegacionales públicos genéricos, posible segunda vista “área cuenta” sólo después de login demo.

### F) CRM

- Vista tablero (cards KPI duplicadas) + acceso rápido a vistas ya existentes (usuarios/productos mensajeria) dentro del mismo tema.

### G) Showcase técnico (actual)

- Página **`framework-demo.php`**: contenido donde estaba antes `index.php` (toasts/modales demos avanzadas).

## Sistema de colores — reglas obligatorias

1. **`--jk-accent-honey`, `--jk-accent-honey-light`, `--jk-accent-honey-dark`** no cambian entre temas — son marca JK Hive (“reverencia a las abejas”).
2. Cada tema redefine **solo** variables de marca secundarias (electric blue / teal / tech bg / cyan glow) usando selectores `.jkfw-theme-*` en `assets/css/themes/`.
3. El body de cada página demo incluye `jkfw-theme-<slug>` desde PHP según sesión/query.

## Cronograma ejecutable / gates

| Fase | Entregable | Gate de salida |
|------|-------------|----------------|
| L0 | Esta planilla + archivo de temas + helper PHP `jkfw_theme` | Launcher compila tema |
| L1 | `index.php` launchpad fullscreen | Navegable a todas las rutas demo |
| L2 | `framework-demo.php` migra contenido viejo Home | Links OK |
| L3 | `demo-login-modal.php` + `jkfw-demo-auth.js` | Toast A al loguearse |
| L4 | `demo-landing-simple.php/html` | HTML mínimo con mismos css |
| L5 | `demo-landing-advanced.php` | Login + admin shell |
| L6 | `demo-ecommerce-*.php` | basic vs cart |
| L7 | `demo-portal.php` / `demo-crm.php` | vistas completas placeholders |
| L8 | `navigation.json` + README corto uso temas | Revisión final |

## Riesgos y mitigación

- **Tamaño de copia JK Lubs / Housesitting**: no se replica el repo completo; se aislan **layouts** repetibles con componentes JK Hive ya en `assets/`.
- **Auth real**: cualquier llamada `/api/` seguirá fallando — se documenta como esperado.

## Lista de rutas públicas nuevo set

```
index.php                       → Launchpad selección demos
framework-demo.php              → Demo técnica (ex Home)
demo-landing-simple.php         → Landing básica
demo-landing-advanced.php       → Landing + admin ficticio + login hex
demo-ecommerce-basic.php        → Tienda catalogo sólo lectura (+ wishlist?)
demo-ecommerce-advanced.php     → Carrito cliente + modal checkout mock
demo-crm.php                    → CRM starter set
demo-portal.php                 → Housesitting-lite portal
(users.php / messaging.php…)    → dentro del mapa técnico (ya existían)
```

## Revisión crítica ante el objetivo (checklist rápido)

- [ ] ¿Un solo núcleo de CSS/JS? → Temas externos sólo sobrescriben variables.
- [ ] ¿Honey constante visual? → variables miel intactas entre temas.
- [ ] ¿Login demo muestra estado y toast oficial? → `showToastBar` tipo A globales.

---

**Estado:** implementado en `showcase/` — `index.php` launchpad; `framework-demo.php` demo técnica previa; páginas `demo-*.php`; temas `jkfw-themes.css` (canonical + aurora + cobalt + ember); login demo `jkfw-demo-auth.js` + modal; carrito aislado `JKFW_CART_STORAGE_KEY` en e-commerce avanzado. Tras revisión en navegador, sincronizar `showcase/` → `c:\xampp\htdocs\JKHFW` según la regla XAMPP del repo.
