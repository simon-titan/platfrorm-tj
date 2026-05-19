@AGENTS.md
@design/index.md

# T&J Consulting — Projekt-Kontext (Blueprint)

## Was ist dieses Projekt?

Eine vollständige **SaaS-Lernplattform** (Next.js App Router) mit:
- Kurs-/Modul-System mit Video, Quiz, Gamification
- Community-Features (News, Events, Live Sessions)
- Free-Funnel → Paid Membership → High-Ticket Coaching
- Stripe-Billing, E-Mail-Sequenzen, Admin-Panel

**Blueprint-Status:** Die Plattform ist nischen-agnostisch einsetzbar. Branding, Inhalte und nischenspezifische Features (aktuell: Trading) sind austauschbar. Vor Umbau immer `docs/REBRANDING-GUIDE.md` lesen.

---

## Tech-Stack (Kurzfassung)

| Schicht | Technologie |
|---|---|
| Framework | Next.js 16.2.1 (App Router), React 19, TypeScript 5 |
| Datenbank | Supabase (PostgreSQL + Auth + RLS) |
| Storage | Hetzner Object Storage (S3-kompatibel) |
| Payment | Stripe (Subscription + Lifetime) |
| E-Mail | Resend + React Email |
| Video (Live) | Cloudflare Stream |
| UI | Chakra UI v2, Framer Motion, TipTap, FullCalendar |
| Hosting | Vercel (inkl. Cron Jobs) |

Vollständig: `docs/ARCHITECTURE.md`

---

## Verzeichnis-Struktur

```
app/
  (admin)/admin/    → Admin-Panel (is_admin required)
  (auth)/           → Login, Register, Einsteig
  (marketing)/      → Öffentliche Funnels
  (platform)/       → Haupt-App (authenticated)
  (onboarding)/     → Onboarding-Flow
  api/              → Route Handlers (stripe/*, cron/*, auth/*, etc.)

components/
  admin/            → Admin-Panel-Komponenten (30+)
  platform/         → Nutzer-App-Komponenten (60+)
  landing/          → Landing-Page-Sektionen
  marketing/        → Funnel-Komponenten
  onboarding/       → Onboarding-Steps
  ui/               → Globale UI-Primitives (GlassCard, GlowButton, etc.)
  brand/            → Logo
  layout/           → Hintergrunds-Wrapper

lib/
  supabase/         → DB-Clients (client, server, service, admin-auth, middleware)
  stripe/           → Stripe-Client + Webhook-Handler
  email/            → Templates, Sender, Sequence-Log
  access-control/   → has-access.ts (Membership-Prüfung)
  cron/             → Cron-Auth
  security/         → Turnstile-Verifikation

config/             → Landing-Config, HT-Fragen, Insight-Fragen
theme/              → Chakra UI Theme (tokens aus design/index.md)
design/             → Design System (Farben, Typo, Gradients, Cards, Components, Motion, Layout)
supabase/migrations/ → 54 SQL-Migrations
```

---

## Design System

**Single Source of Truth:** `design/` — vollständige Dokumentation in 8 Dateien.

Alle UI-, Theme- oder Style-Änderungen:
1. `design/index.md` als Einstiegspunkt lesen
2. `theme/index.ts` synchron halten (Chakra extendTheme aus `design/index.md`)
3. `app/globals.css` CSS-Variablen aus `design/index.md` synchron halten

**Typografie:**
- Headlines/Display: **Fraunces** (variable, Display) — Variable Axes: `SOFT` (0–100), `WONK` (0–1)
- Fließtext/UI: **Geist Sans** — Body, Labels, Buttons, Navigation
- Meta/Daten: **Geist Mono** — Kicker-Labels, Timestamps, Datenpunkte

**Akzentfarbe:** Forest `#1F3A2E` (CSS-Var: `--forest`) — monochromatische Forest-Familie

---

## Auth & Zugriffskontrolle

- **Supabase Auth** (kein NextAuth)
- Middleware prüft Session für `(platform)/` und `(admin)/` Routes
- Öffentlich: `(auth)/`, `(marketing)/`, Root
- Onboarding-Gate: `intro_video_watched` + `codex_accepted` in `profiles`
- Membership-Check: `lib/access-control/has-access.ts` → `hasActivePaidAccess(userId)`
- Tiers: `'free' | 'monthly' | 'lifetime' | 'ht_1on1'`

Details: `docs/AUTH-FLOW.md`, `docs/MEMBERSHIP.md`

---

## Datenbank-Konventionen

- Service-Role-Key nur serverseitig (`lib/supabase/service.ts`)
- Jede Tabelle hat RLS aktiviert
- Migrations sequenziell nummeriert: `supabase/migrations/NNN_beschreibung.sql`
- Types nach Änderungen neu generieren: `supabase gen types typescript`

Details: `docs/DATABASE.md`

---

## Rebranding-Status (T&J Consulting — Mai 2026)

Das Branding ist vollständig auf **T&J Consulting** migriert:
- Akzentfarbe: **Forest-Familie** (`--forest-deep → --leaf`). Kein Gold (`#D4AF37`) irgendwo.
- Fonts: **Fraunces** (Display) · **Geist Sans** (UI) · **Geist Mono** (Daten)
- Background: `public/bg/tj-hero-bg.jpg` in allen Hintergrundbereichen
- `DESIGN.json` existiert nicht mehr — Single Source of Truth ist `design/index.md`

**Noch ausstehend (außerhalb des Plan-Scopes):** ~300 Gold-Farbinstanzen in 40+ Dateien
(landing, marketing, onboarding, weitere platform-Komponenten). Betrifft Nicht-Dashboard-Seiten.

---

## GlassCard — Kontrast-Regeln

`components/ui/GlassCard.tsx` hat 5 Varianten. **Textfarbe hängt vom Hintergrund ab:**

| Prop | Hintergrund | Texte müssen sein |
|---|---|---|
| `hero` | Dunkel (10–22 % weiß über bg) | Hell: `var(--paper)`, `rgba(255,255,255,…)` |
| `dashboard` | **Hell** `rgba(248,248,250,0.85)` | Dunkel: `var(--ink)`, `var(--mute)` |
| `spotlight` | Dunkel (10 % weiß) | Hell: `var(--paper)`, `rgba(255,255,255,…)` |

**Sonderfall `LastVideoCard`:** Nutzt `<GlassCard dashboard>` als Wrapper (hell), aber `.institut-card-body` CSS-Klasse überschreibt den Hintergrund mit `rgba(22,22,26,0.96)` (dunkel).
→ Alle Texte **innerhalb `.institut-card-body`** müssen hell sein (`var(--paper)`, `rgba(252,252,253,…)`).

Details und Codebeispiele: `design/cards.md` → Abschnitt "Platform GlassCard"

---

## Trading-Features

Alle trading-spezifischen Features wurden entfernt (Branch `remove-trading-features`):
- Trading Journal, Positionsrechner, Analyse-Posts, TradingView-Widget
- DB-Migration: `supabase/migrations/055_remove_trading_features.sql`

Die Plattform ist bereinigt und einsatzbereit als nischen-agnostischer Blueprint.

---

## Dokumentations-Index

| Dokument | Inhalt |
|---|---|
| `docs/ARCHITECTURE.md` | Tech-Stack, Infrastruktur, alle Dienste |
| `docs/DATABASE.md` | Vollständiges DB-Schema (alle Tabellen) |
| `docs/AUTH-FLOW.md` | Auth, Middleware, Discord OAuth, Access-Control |
| `docs/MEMBERSHIP.md` | Tier-Logik, Stripe-Flow, Churn-Prevention |
| `docs/FEATURES.md` | Feature-Inventar mit Rebranding-Markierungen |
| `docs/EMAIL-SYSTEM.md` | Templates, Sequenzen, Cron-Jobs |
| `docs/INTEGRATIONS.md` | Alle Drittanbieter + Env-Variablen |
| `docs/ADMIN-PANEL.md` | Admin-Bereiche, Upload-Architektur |
| `docs/REBRANDING-GUIDE.md` | Schritt-für-Schritt Blueprint-Adaptation |
| `design/index.md` | Design System Master-Index (Tokens, Theme, Do/Don'ts) |
| `design/colors.md` | Farbpalette & Semantic Mapping |
| `design/typography.md` | Fonts, Type Scale, Type Moments |
| `design/gradients.md` | 20+ Gradient-Varianten |
| `design/cards.md` | Alle Card-Varianten |
| `design/components.md` | Buttons, Inputs, Icons, Chase Trail |
| `design/motion.md` | Framer Motion Variants, Easter Eggs |
| `design/layout.md` | Spacing, Radii, Shadows, Grid |
| `AGENTS.md` | Coding-Konventionen + Design-System-Regeln |
| `.env.local.example` | Alle benötigten Umgebungsvariablen |

---

## Wichtige Konventionen

1. **Kein Code ohne Docs lesen:** Bei Next.js-spezifischen Features zuerst `node_modules/next/dist/docs/` prüfen (Breaking Changes in dieser Version möglich)
2. **Design:** Änderungen immer über `design/` → `theme/index.ts` → `app/globals.css` (nie direkt hardcoden)
3. **DB-Zugriff:** Immer den sparsam richtigen Client nutzen (Browser-Client für Client-Components, Server-Client für Server-Components, Service-Client nur wenn RLS-Bypass nötig)
4. **Uploads:** Nie Dateien durch Vercel-Serverless proxyen — immer Presigned URLs nutzen
5. **E-Mails:** Immer `email_sequence_log` prüfen vor dem Versand (Duplikate vermeiden)
6. **Rebranding:** Vor Inhaltliche Änderungen → `docs/REBRANDING-GUIDE.md` lesen
