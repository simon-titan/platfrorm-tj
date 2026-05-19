@AGENTS.md

# Capital Circle — Projekt-Kontext (Blueprint)

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
theme/              → Chakra UI Theme (tokens aus DESIGN.json)
supabase/migrations/ → 54 SQL-Migrations
```

---

## Design System

**Single Source of Truth:** `DESIGN.json`

Alle UI-, Theme- oder Style-Änderungen:
1. `DESIGN.json` prüfen/anpassen
2. `theme/index.ts` synchron halten
3. `app/globals.css` CSS-Variablen synchron halten

**Typografie:**
- Überschriften: **Radley** (serif) — Klassen `.radley-regular`, `.radley-regular-italic`
- Fließtext/UI: **Inter** — Klassen `.inter`, `.inter-medium`, `.inter-semibold`, `.inter-bold`
- Code/Zahlen: **JetBrains Mono** — Klasse `.jetbrains-mono`
- Legacy-Alias: `.dm-sans` → Inter-Body (bestehende Komponenten); neue Markup nutzt `.inter`

**Akzentfarbe:** Gold `#D4AF37` (CSS-Var: `--color-accent-gold`)

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
| `DESIGN.json` | Design-Tokens (Farben, Spacing, Komponenten) |
| `AGENTS.md` | Coding-Konventionen + Design-System-Regeln |
| `.env.local.example` | Alle benötigten Umgebungsvariablen |

---

## Wichtige Konventionen

1. **Kein Code ohne Docs lesen:** Bei Next.js-spezifischen Features zuerst `node_modules/next/dist/docs/` prüfen (Breaking Changes in dieser Version möglich)
2. **Design:** Änderungen immer über `DESIGN.json` → Theme → CSS (nie direkt)
3. **DB-Zugriff:** Immer den sparsam richtigen Client nutzen (Browser-Client für Client-Components, Server-Client für Server-Components, Service-Client nur wenn RLS-Bypass nötig)
4. **Uploads:** Nie Dateien durch Vercel-Serverless proxyen — immer Presigned URLs nutzen
5. **E-Mails:** Immer `email_sequence_log` prüfen vor dem Versand (Duplikate vermeiden)
6. **Rebranding:** Vor Inhaltliche Änderungen → `docs/REBRANDING-GUIDE.md` lesen
