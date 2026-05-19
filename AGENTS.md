<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Design System (T&J Consulting)

**Single source of truth:** `design/` — 8 Dateien, vollständige Dokumentation.  
Bei UI-, Theme- oder Style-Änderungen: `design/index.md` lesen → `theme/index.ts` → `app/globals.css`.

**Typografie (verbindlich):**

| Rolle | Schrift | Einbindung |
|--------|---------|------------|
| Headlines / Display | **Fraunces** (variable, Display) | Variable Axes: `SOFT` 0–100, `WONK` 0–1 · Chakra `fonts.heading` |
| Fließtext & UI | **Geist Sans** | Body, Labels, Buttons, Navigation · Chakra `fonts.body` |
| Meta / Daten | **Geist Mono** | Kicker-Labels, Timestamps, Datenpunkte · Chakra `fonts.mono` |

**Akzentfarbe:** Forest `#1F3A2E` (CSS-Var: `--forest`) — monochromatische Forest-Familie (`--forest-deep`, `--forest`, `--glow`, `--leaf`).

**Praxis:** Keine zusätzlichen Webfonts ohne Anpassung von `design/typography.md` und `app/layout.tsx`.
