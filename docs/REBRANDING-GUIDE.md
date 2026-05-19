# Rebranding-Guide

Schritt-für-Schritt Anleitung, um diesen Blueprint auf eine neue Marke und Nische anzupassen.  
**Wichtig:** Immer zuerst `DESIGN.json` als Single Source of Truth prüfen, bevor UI-Änderungen gemacht werden.

---

## Phase 1: Branding & Visuals

### 1.1 Markenname ersetzen

Alle Vorkommen von "Capital Circle" in folgenden Dateien suchen und ersetzen:

| Datei | Inhalt |
|---|---|
| `app/layout.tsx` | `<title>`, `<meta name="description">`, OG-Tags |
| `app/manifest.ts` | App-Name, Short-Name |
| `RESEND_FROM_NAME` (Env) | E-Mail-Absender-Name |
| `RESEND_FROM_EMAIL` (Env) | E-Mail-Absender-Adresse (neue Domain) |
| `lib/email/templates/*.tsx` | E-Mail-Texte und Footer |
| `lib/email/layout/BaseEmail.tsx` | E-Mail-Header, Markenname |
| `config/landing-config.ts` | Landing-Page-Texte |

### 1.2 Logo austauschen

1. Neue Logo-Dateien in `public/logo/` ablegen:
   - `logo-white.png` — für dunklen Hintergrund
   - `logo-black.png` — für hellen Hintergrund
   - `logo-codex.png` — für Onboarding (optional)
   - `logo-intro.png` — für Intro-Video (optional)
   - `logo-agreement.png` — für Usage Agreement (optional)

2. Logo-Komponente prüfen: `components/brand/Logo.tsx`  
   Variants: `onDark`, `onLight` — referenzieren die obigen Dateien.

### 1.3 Farben anpassen

**Prozess:** `DESIGN.json` → `theme/index.ts` → `app/globals.css`

Wichtigste Tokens in `DESIGN.json`:
- `colors.accent.gold` — Primäre Akzentfarbe (derzeit `#D4AF37`)
- `colors.accent.light` — Hellere Variante
- `colors.background.primary` — Haupthintergrund
- `colors.text.*` — Texthierarchie

Nach Änderung in `DESIGN.json`:
1. `theme/index.ts` synchron halten (Chakra UI Token-Mapping)
2. `app/globals.css` CSS-Variablen synchron halten

### 1.4 Hintergrundbilder ersetzen

Bilder in `public/bg/`:
- `dashboard.png` — Dashboard-Hintergrund
- `sky-arch.png` — Plattform-Background
- `landscape.png` — Weiterer Hintergrund

Referenziert von: `components/layout/DashboardBackground.tsx`, `PlatformBackground.tsx`, `SkyArchBackground.tsx`

### 1.5 Typografie (nur bei Bedarf)

Aktuelle Fonts: Radley (Überschriften), Inter (Fließtext), JetBrains Mono (Code)

Bei Änderung:
1. `DESIGN.json` → `typography.fonts.*` anpassen
2. `app/layout.tsx` → Google Fonts `<link>` aktualisieren
3. `theme/index.ts` → `fonts.heading`, `fonts.body` anpassen
4. CSS-Klassen in `app/globals.css` anpassen

---

## Phase 2: Inhalte

### 2.1 Landing Page

**Datei:** `config/landing-config.ts`

Enthält alle Texte für Landing-Page-Sektionen:
- Hero-Text, Subheadline
- Phasen/Schritte (Was bekommt der Nutzer?)
- Founder-Sektion
- Pricing-Bullets

### 2.2 Case Studies / Testimonials

1. Neue Bilder in `public/cases/` ablegen
2. Testimonial-Daten in `config/landing-config.ts` anpassen
3. Review-Texte im Admin-Panel unter `/admin/reviews` pflegen (werden in DB gespeichert)

### 2.3 Founder-Bild

Datei: `public/founder/founder.jpeg` ersetzen

### 2.4 E-Mail-Texte

Alle Templates in `lib/email/templates/` anpassen. Besonders:
- `welcome-free-course.tsx` — Erster Kontakt nach Bewerbungs-Approval
- `welcome-paid.tsx` — Nach Kauf
- `free-course-day-1/2/3/5.tsx` — Onboarding-Sequenz

### 2.5 Onboarding-Texte

| Komponente | Inhalt |
|---|---|
| `components/onboarding/CodexStep.tsx` | Nutzungsregeln/Verhaltenskodex |
| `components/onboarding/UsageAgreementStep.tsx` | Nutzungsvertrag |
| `components/onboarding/IntroVideoStep.tsx` | Intro-Video-Text |

### 2.6 Bewerbungsfragen

| Datei | Verwendung |
|---|---|
| `config/ht-questions.ts` | HT-Bewerbungsformular |
| `config/insight-step2-questions.ts` | Step-2-Insight-Funnel |

Free-Funnel-Fragen sind direkt in der Formular-Komponente `components/marketing/FreeApplicationModal.tsx`.

---

## Phase 3: Trading-Features entfernen

Nur relevant, wenn die neue Nische kein Trading ist.

### 3.1 Routes löschen

```
app/(platform)/trading-journal/      → Ordner löschen
app/(platform)/position-calculator/  → Ordner löschen
app/(platform)/analysis/             → Ordner löschen
app/(admin)/admin/analysis/          → Ordner löschen
```

### 3.2 Navigation bereinigen

**Platform-Sidebar** (`components/platform/Sidebar.tsx`):  
Prüfen, ob Links auf die o.g. Routes vorhanden sind → entfernen.

**Admin-Sidebar** (`components/admin/AdminSidebar.tsx`):  
Eintrag `{ href: "/admin/analysis", label: "Analyse" }` entfernen.

**Dashboard** (`app/(platform)/dashboard/`):  
`TradingViewMarketSummary`-Komponente aus der Dashboard-Seite entfernen.

### 3.3 TradingView Widget entfernen

```
components/platform/TradingViewMarketSummary.tsx → Datei löschen
```

Alle Importe dieser Komponente entfernen.

### 3.4 Datenbank bereinigen

Migration schreiben:

```sql
-- Neue Migration, z. B. 055_remove_trading_features.sql
DROP TABLE IF EXISTS public.trading_journal_trades CASCADE;
DROP TABLE IF EXISTS public.trading_journals CASCADE;
DROP TABLE IF EXISTS public.analysis_posts CASCADE;
```

Oder alternativ RLS-Policies auf "kein Zugriff" setzen (Tabellen behalten, aber sperren).

---

## Phase 4: Neue Umgebungsvariablen konfigurieren

### 4.1 Neue Stripe Price IDs

Bei neuem Stripe-Account oder neuen Produkten:
1. Produkte in Stripe anlegen
2. `STRIPE_PRICE_MONTHLY` und `STRIPE_PRICE_LIFETIME` mit neuen Price IDs ersetzen
3. Webhook-Endpoint in Stripe neu registrieren → neuen `STRIPE_WEBHOOK_SECRET` eintragen

### 4.2 Neue Resend-Domain

1. Neue Domain in Resend verifizieren
2. `RESEND_FROM_EMAIL` auf neue Adresse setzen
3. `RESEND_FROM_NAME` auf neuen Markennamen setzen

### 4.3 Neues Supabase-Projekt (falls komplett getrennt)

1. Neues Projekt anlegen
2. Migrations ausführen
3. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` aktualisieren
4. Types neu generieren: `supabase gen types typescript`

### 4.4 Discord (optional)

Wenn Discord für die neue Nische nicht genutzt wird:
1. Discord-OAuth-Routes entfernen: `app/api/auth/discord/`
2. Discord-Admin-Panel entfernen: `app/(admin)/admin/discord/`
3. Discord-Anzeige aus Platform-Sidebar entfernen
4. Discord-bezogene Env-Variablen leer lassen

Wenn Discord weiter genutzt wird: Neuen Server, neue Rollen anlegen → IDs in Env aktualisieren.

### 4.5 Neue Hetzner-Bucket

1. Bucket anlegen, CORS konfigurieren (siehe `docs/hetzner-presigned-upload-cors.md`)
2. `HETZNER_BUCKET_NAME`, `HETZNER_ACCESS_KEY`, `HETZNER_SECRET_KEY` aktualisieren

---

## Phase 5: SEO & Meta

| Datei | Zu ändern |
|---|---|
| `app/layout.tsx` | `<title>`, `<meta description>`, OG-Image, Favicon-Link |
| `app/manifest.ts` | App-Name, Theme-Color, Icons |
| `public/` | Favicon-Dateien (`favicon.ico`, `icon.png`, etc.) ersetzen |
| Landing-Page-Komponenten | OG-Image-Referenzen |

---

## Checkliste für Rebranding

```
[ ] Markenname in allen Dateien ersetzt
[ ] Logo-Dateien ausgetauscht
[ ] Farben in DESIGN.json → theme/ → globals.css angepasst
[ ] Hintergrundbilder ersetzt
[ ] Landing Page Texte (config/landing-config.ts) aktualisiert
[ ] Case Studies / Testimonials ersetzt
[ ] E-Mail-Templates angepasst (Texte, Markenname, Links)
[ ] Onboarding-Texte (Codex, Agreement) angepasst
[ ] Bewerbungsfragen angepasst
[ ] Trading-Features entfernt (falls neue Nische ≠ Trading):
    [ ] Routes gelöscht
    [ ] Navigation bereinigt
    [ ] DB-Migration geschrieben
[ ] Stripe-Produkte und Price-IDs konfiguriert
[ ] Stripe-Webhook neu registriert
[ ] Resend-Domain verifiziert
[ ] Neue App-URL in NEXT_PUBLIC_APP_URL
[ ] Alle Video-URLs eingetragen (Intro, Pricing, Free Funnel)
[ ] SEO Meta-Tags aktualisiert
[ ] Favicon + App-Icons ersetzt
[ ] Deployment: Vercel-Env-Variablen aktualisiert
```
