# Architektur & Tech-Stack

## Überblick

"Capital Circle" ist eine vollständige SaaS-Lernplattform auf Basis von **Next.js App Router**. Die Plattform ist als **Blueprint** konzipiert — Branding, Inhalte und nischenspezifische Features sind austauschbar, die Infrastruktur bleibt stabil.

---

## Framework & Laufzeit

| Komponente | Version | Hinweis |
|---|---|---|
| Next.js | 16.2.1 | App Router, Server Components, API Routes |
| React | 19.2.4 | Server + Client Components |
| TypeScript | 5.x | Strenger Modus, Path-Alias `@/*` → Projektroot |
| Node.js | ≥ 20 | LTS (via Vercel) |

**Wichtig:** Diese Next.js-Version enthält Breaking Changes gegenüber älteren Versionen. Vor Code-Änderungen immer `node_modules/next/dist/docs/` prüfen.

---

## Hosting & Deployment

- **Plattform:** Vercel (`vercel.json` im Root)
- **Cron Jobs:** Vercel Cron — konfiguriert in `vercel.json`, Endpunkte unter `app/api/cron/`
- **Env-Variablen:** Alle Required-Vars dokumentiert in `.env.local.example`
- **Build-Befehl:** `pnpm build` / `next build`

---

## Datenbank & Auth

### Supabase (PostgreSQL)

- **Rolle:** Primäre Datenbank + Auth-Provider + File Storage (nicht für Video)
- **Client-Varianten:**
  - `lib/supabase/client.ts` — Browser-Client (Client Components)
  - `lib/supabase/server.ts` — Server-Client (Server Components, Route Handlers)
  - `lib/supabase/service.ts` — Service-Role-Client (umgeht RLS, nur serverseitig)
  - `lib/supabase/admin-auth.ts` — Admin-Panel-spezifischer Service-Client
  - `lib/supabase/middleware.ts` — SSR-Session-Refresh (Next.js Middleware)
- **Generated Types:** `lib/supabase/types.ts` (via `supabase gen types`)
- **Row Level Security (RLS):** Aktiviert auf allen Tabellen — Details in `docs/DATABASE.md`
- **Migrations:** `supabase/migrations/` (54 `.sql`-Dateien, sequenziell nummeriert)

---

## File Storage & Video

### Hetzner Object Storage (S3-kompatibel)

- **Zweck:** Alle Uploads — Modul-Videos, Attachments, Avatare, Bilder
- **Zugriff:** AWS SDK S3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Upload-Flow:** Admin fordert Presigned URL an (`app/api/admin/presign-upload/`) → Browser uploaded direkt zu Hetzner → kein Proxy durch Vercel
- **Hilfsfunktionen:** `lib/storage.ts`, `lib/admin-upload-presigned.ts`
- **Video-URLs:** Zeitlich begrenzte Presigned URLs via `app/api/video-url/`

### Cloudflare Stream

- **Zweck:** Live-Stream-Embeds (nicht alle Videos — nur Live-Sessions)
- **Integration:** iframe-Embed mit Customer-Subdomain
- **Konfiguration:** Admin setzt Video-UID in `/admin/stream` (DB-Tabelle `stream_settings`)
- **Env:** `NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN`

---

## Payment

### Stripe

- **Produkte:** Monthly Subscription + Lifetime (einmalig)
- **Price IDs:** `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`
- **Server-SDK:** `lib/stripe/` (Client + Webhook-Handler)
- **Webhooks:** `lib/stripe/webhooks/`
  - `checkout-completed.ts` — Membership-Tier setzen nach Kauf
  - `invoice-paid.ts` — `access_until` verlängern
  - `subscription-deleted.ts` — Downgrade auf Free
  - `payment-failed.ts` — Grace-Periode + Dunning-Trigger
- **Checkout:** `app/(platform)/checkout/` mit `CheckoutClient.tsx`
- **Kundenportal:** `app/api/stripe/create-portal-session/`
- **Idempotenz:** Tabelle `stripe_webhook_events` verhindert doppelte Verarbeitung

---

## E-Mail

### Resend + React Email

- **SDK:** `resend` npm-Paket, `lib/email/resend.ts`
- **Templates:** `lib/email/templates/` (18 Templates als React-Komponenten)
- **Base-Layout:** `lib/email/layout/BaseEmail.tsx`
- **Sender-Helper:** `lib/email/send.ts`
- **Sequence-Logging:** `lib/email/sequence-log.ts` → DB-Tabelle `email_sequence_log`
- **Webhook:** `app/api/resend/` (Open/Click-Tracking)
- **Details:** `docs/EMAIL-SYSTEM.md`

---

## Hintergrundaufgaben (Cron)

- **Auth:** Bearer-Token `CRON_SECRET` — geprüft in `lib/cron/auth.ts`
- **Endpunkte:** `app/api/cron/`
  - `check-inactive-users` — Churn-E-Mails nach 7/14 Tagen Inaktivität
  - `free-course-sequence` — Free-Course-E-Mail-Sequenz (Day 1/2/3/5)
  - `ht-upsell-60d` — HT-Upsell-E-Mail nach 60 Tagen Mitgliedschaft
  - `process-dunning` — Zahlungserinnerungen (3-stufig)
  - `reactivation-offers` — Reaktivierungs-E-Mails für ehemalige Mitglieder

---

## Externe Integrationen

| Service | Zweck | Env-Präfix |
|---|---|---|
| Supabase | DB, Auth, Storage | `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe | Payments | `STRIPE_*` |
| Resend | Transaktions-E-Mail | `RESEND_*` |
| Hetzner | Object Storage | `HETZNER_*` |
| Cloudflare Stream | Live-Video | `NEXT_PUBLIC_CLOUDFLARE_STREAM_*` |
| Cloudflare Turnstile | CAPTCHA | `*_TURNSTILE_*` |
| Discord | OAuth + Rollen | `DISCORD_*` |
| Calendly | HT-Terminbuchung | `NEXT_PUBLIC_CALENDLY_URL` |
| Svix | Webhook-Verifizierung | (intern) |
| Slack | Interne Alerts | `SLACK_WEBHOOK_URL` |
| Upstash Redis | Rate-Limiting (optional) | `UPSTASH_*` |

Details je Integration → `docs/INTEGRATIONS.md`

---

## UI-Bibliotheken

| Paket | Zweck |
|---|---|
| Chakra UI v2 (`@chakra-ui/react`) | Primäres Komponentensystem |
| `@chakra-ui/next-js` | Next.js-Adapter (CacheProvider) |
| Framer Motion 11 | Animationen, Page Transitions |
| Lucide React | Icons |
| React Icons | Zusätzliche Icons |
| TipTap 3.x | Rich-Text-Editor (Admin) + Renderer (Platform) |
| FullCalendar 6 | Ereigniskalender |
| Chart.js 4 | Analytics-Charts im Admin |
| dnd-kit | Drag & Drop (Modul-Reihenfolge im Admin) |

**Design System:** Zentraler Source of Truth ist `DESIGN.json` → Theme `theme/index.ts` → `app/globals.css`

---

## App-Router-Struktur

```
app/
  (admin)/admin/          → Admin-Panel (geschützt via is_admin)
  (auth)/                 → Login, Register, Einsteig
  (marketing)/            → Öffentliche Funnels (apply, free, pricing, survey)
  (platform)/             → Hauptapp für eingeloggte Nutzer
  (onboarding)/           → Onboarding-Flow nach Registrierung
  bewerbung/              → Legacy-Bewerbungsflow
  api/                    → API Routes (admin/*, stripe/*, auth/*, cron/*, etc.)
```

Vollständige Feature-Übersicht → `docs/FEATURES.md`
