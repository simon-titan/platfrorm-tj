# Externe Integrationen

Alle Dienste und ihre Konfiguration. Referenz-Datei für alle Env-Variablen: `.env.local.example`

---

## Supabase

**Zweck:** PostgreSQL-Datenbank, Auth, Row Level Security  
**Docs:** `docs/DATABASE.md`, `docs/AUTH-FLOW.md`

| Env-Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Projekt-URL (öffentlich) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon-Key für Browser-Client (öffentlich) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-Role-Key — **nur serverseitig**, umgeht RLS |

**Setup für neues Projekt:**
1. Neues Supabase-Projekt anlegen
2. Alle Migrations in `supabase/migrations/` in Reihenfolge ausführen
3. `supabase gen types typescript --project-id <id> > lib/supabase/types.ts`

---

## Stripe

**Zweck:** Zahlungsabwicklung — Monthly Subscription + Lifetime-Kauf

| Env-Variable | Beschreibung |
|---|---|
| `STRIPE_SECRET_KEY` | Server-only API-Key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Öffentlicher Key für Browser-SDK |
| `STRIPE_WEBHOOK_SECRET` | Webhook-Signing-Secret (aus Stripe Dashboard) |
| `STRIPE_PRICE_MONTHLY` | Price-ID für monatliche Subscription |
| `STRIPE_PRICE_LIFETIME` | Price-ID für Lifetime-Einmalzahlung |

**Webhook-Endpunkt:** `app/api/stripe/webhook/` → registrieren in Stripe Dashboard  
**Verarbeitete Events:**
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.deleted`

**Setup für neues Projekt:**
1. Stripe-Produkte + Preise anlegen → Price IDs in Env eintragen
2. Webhook in Stripe Dashboard auf `https://yourdomain.com/api/stripe/webhook` registrieren
3. `STRIPE_WEBHOOK_SECRET` aus Stripe Dashboard kopieren

---

## Resend

**Zweck:** Transaktions-E-Mails

| Env-Variable | Beschreibung |
|---|---|
| `RESEND_API_KEY` | API-Key |
| `RESEND_FROM_EMAIL` | Absender-E-Mail (muss Domain-verifiziert sein) |
| `RESEND_FROM_NAME` | Absender-Name |
| `RESEND_WEBHOOK_SECRET` | Für Open/Click-Tracking (optional) |
| `UNSUBSCRIBE_TOKEN_SECRET` | HMAC-Secret für Abmelde-Tokens |

**Setup für neues Projekt:**
1. Domain in Resend verifizieren (DNS-Einträge)
2. `RESEND_FROM_EMAIL` auf neue Domain setzen
3. E-Mail-Texte in `lib/email/templates/` anpassen

---

## Hetzner Object Storage

**Zweck:** Alle hochgeladenen Dateien — Videos, Bilder, Attachments, Avatare  
**Protokoll:** S3-kompatibel (AWS SDK)

| Env-Variable | Beschreibung |
|---|---|
| `HETZNER_ACCESS_KEY` | S3 Access Key |
| `HETZNER_SECRET_KEY` | S3 Secret Key |
| `HETZNER_BUCKET_NAME` | Bucket-Name |
| `HETZNER_ENDPOINT` | S3-Endpoint (z. B. `https://nbg1.your-objectstorage.com`) |

**Upload-Flow:** Presigned URLs (Browser → Hetzner direkt, kein Proxy via Vercel)  
**CORS:** Bucket-CORS-Config muss App-Domain erlauben → `docs/hetzner-presigned-upload-cors.md`

**Setup für neues Projekt:**
1. Neuen Hetzner-Bucket anlegen
2. CORS-Konfiguration setzen (Domain + `PUT`-Method erlauben)
3. Env-Variablen eintragen

---

## Cloudflare Stream

**Zweck:** Live-Stream-Embed (nicht für alle Videos — nur für Echtzeit-Streams)

| Env-Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN` | Format: `customer-<hash>` aus CF Stream |

**Konfiguration:** Admin setzt Cloudflare Video-UID im Admin-Panel unter `/admin/stream`.  
**Embed-Format:** `https://<SUBDOMAIN>.cloudflarestream.com/<UID>/iframe`

---

## Cloudflare Turnstile

**Zweck:** DSGVO-konformes CAPTCHA (Alternative zu reCAPTCHA)  
**Eingesetzt bei:** Bewerbungsformulare, Registrierung

| Env-Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Öffentlicher Site-Key |
| `TURNSTILE_SECRET_KEY` | Server-seitiger Verification-Key |

**Backend-Verifikation:** `lib/security/turnstile.ts`  
**Typdefinitionen:** `types/turnstile.d.ts`

---

## Discord

**Zweck:** OAuth-Connect für Mitglieder + automatische Rollen-Zuweisung im Community-Server

| Env-Variable | Beschreibung |
|---|---|
| `DISCORD_CLIENT_ID` | OAuth-App Client-ID |
| `DISCORD_CLIENT_SECRET` | OAuth-App Client-Secret |
| `DISCORD_BOT_TOKEN` | Bot-Token für Rollen-API |
| `DISCORD_GUILD_ID` | Server-ID |
| `DISCORD_ROLE_ID` | Rollen-ID (wird bei Connect zugewiesen) |
| `DISCORD_REDIRECT_URI` | OAuth-Callback-URL (muss in Discord-App registriert sein) |

**Flow-Details:** `docs/AUTH-FLOW.md` → Discord OAuth  
**Helper:** `lib/discord.ts`

**Setup für neues Projekt / Nische:**
- Bei nicht-trading-Nische: Discord-Integration ist optional
- Server-ID und Rollen-IDs anpassen oder Integration komplett entfernen

---

## Calendly

**Zweck:** Terminbuchungs-Integration für High-Ticket-Coaching-Calls

| Env-Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_CALENDLY_URL` | Buchungs-Link (z. B. `https://calendly.com/...`) |

**Webhook:** `app/api/integrations/calendly/` — bei Buchung wird `high_ticket_applications.call_scheduled_at` gesetzt

---

## Slack

**Zweck:** Interne Benachrichtigungen (neue HT-Bewerbungen, Dunning-Eskalationen, Fehler)

| Env-Variable | Beschreibung |
|---|---|
| `SLACK_WEBHOOK_URL` | Incoming Webhook URL |

Optional — bei fehlendem Wert werden Alerts still ignoriert.

---

## Vercel Cron

**Konfiguration:** `vercel.json` im Root

```json
{
  "crons": [
    { "path": "/api/cron/check-inactive-users", "schedule": "0 8 * * *" },
    { "path": "/api/cron/free-course-sequence", "schedule": "0 9 * * *" },
    { "path": "/api/cron/ht-upsell-60d", "schedule": "0 10 * * *" },
    { "path": "/api/cron/process-dunning", "schedule": "0 11 * * *" },
    { "path": "/api/cron/reactivation-offers", "schedule": "0 12 * * 1" }
  ]
}
```

| Env-Variable | Beschreibung |
|---|---|
| `CRON_SECRET` | Bearer-Token zum Schutz der Cron-Endpunkte (min. 32 Zeichen) |

**Auth-Prüfung:** `lib/cron/auth.ts`

---

## Upstash Redis (optional)

**Zweck:** Rate-Limiting (MVP kann auch In-Memory-Fallback nutzen)

| Env-Variable | Beschreibung |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Auth-Token |

Nicht zwingend erforderlich für den Betrieb.

---

## App-URL

| Env-Variable | Beschreibung |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Basis-URL der App (z. B. `https://yourdomain.com`) |

Wichtig für: E-Mail-Links, OAuth-Redirects, Stripe-Success-URLs.

---

## Video-URLs (öffentliche Seiten)

| Env-Variable | Verwendung |
|---|---|
| `NEXT_PUBLIC_INTRO_VIDEO_URL` | Intro-Video beim Onboarding |
| `NEXT_PUBLIC_PRICING_VIDEO_URL` | Video auf der Pricing-Seite |
| `NEXT_PUBLIC_FREE_FUNNEL_VIDEO_URL` | Video im Free-Funnel |

Direkte URLs (z. B. Cloudflare R2, Vimeo, Bunny.net) — kein Hetzner-Presigned-Flow.
