# Fase 2 — Análisis temporal (línea evolutiva)

## 2.1 Tooltip (`tooltip.js`)

| Versión (evidencia) | Tamaño | Fecha | Veredicto |
|---------------------|--------|-------|-----------|
| jkhive + jklubs `www` | 10624 B | 2026-03-08 | **Seleccionada** — paridad y doc **16** apuntan a esta base. |
| housesitting | 5819 B | 2026-02-17 | Descartada como referencia canónica (menor, sin paridad con doc Lubs). |
| jkhive.work | 5371 B | 2025-12-23 | Origen histórico; no alineada con CRM actual. |

## 2.2 Toasts (`jkhive-toasts.js`)

| Versión | Tamaño | Fecha | Veredicto |
|---------|--------|-------|-----------|
| jkhive `www` | 25860 B | 2026-04-17 | **Seleccionada** — más reciente; incluye `showActionConfirmToast` / `showDeleteConfirmToast` unificados. |
| jklubs `www` | 24230 B | 2026-03-29 | Reserva; sync pendiente si diverge en producción Lubs. |
| CRM + jkhive.work | — | — | Sin archivo dedicado comparable (CRM no bundle; work sin toasts CRM). |

## 2.3 `system-messages.css`

Paridad **exacta** (tamaño y fecha) entre jklubs y jkhive (2026-04-17). Cualquiera válida; en framework se usa la copia empaquetada con **`jkhive-toasts.js` de jkhive** para pairing probado.

## 2.4 Animaciones botones

- Doc sellado **11 feb 2025** (Housesitting) → archivo histórico `jkhive-admin-buttons.css`; en stack jkhive CRM actual las animaciones coexisten en **`jkhive-elements.css`** (@keyframes `jkhive-anmtn-*`).  
- Evolución: **refinar en HS doc** → **consolidar en elements** para apps PHP unificadas.

## 2.5 Layout público footer

`jkhive\www\views\layouts\public-footer.php` depende de helpers `jk_ecosystem_*` → en showcase se **adapta marcado** `.jkhive-footer` sin acoplar ecosistema (datos desde JSON).
