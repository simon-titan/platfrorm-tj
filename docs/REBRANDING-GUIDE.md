# Rebranding-Guide

Schritt-für-Schritt Anleitung, um diesen Blueprint auf eine neue Marke und Nische anzupassen.

> **Aktueller Stand:** T&J Consulting — vollständig migriert (Mai 2026).  
> Das Design System liegt in `design/` (8 Dateien). `DESIGN.json` existiert nicht mehr.  
> Single Source of Truth: `design/index.md`

---

## Phase 1: Branding & Visuals

### 1.1 Markenname ersetzen

Suche und ersetze den aktuellen Markennamen ("T&J Consulting") in:

| Datei | Inhalt |
|---|---|
| `app/layout.tsx` | `<title>`, `<meta name="description">`, OG-Tags |
| `app/manifest.ts` | App-Name, Short-Name |
| `RESEND_FROM_NAME` (Env) | E-Mail-Absender-Name |
| `RESEND_FROM_EMAIL` (Env) | E-Mail-Absender-Adresse (neue Domain) |
| `lib/email/templates/*.tsx` | E-Mail-Texte und Footer |
| `lib/email/layout/BaseEmail.tsx` | E-Mail-Header, Markenname |
| `config/landing-config.ts` | Landing-Page-Texte |
| `components/platform/TopBar.tsx` | Drawer-Footer, Banner-Texte, Navbar-Labels |
| `components/onboarding/LoginStep.tsx` | Social-Link aria-labels |

### 1.2 Logo austauschen

1. Neue Logo-Dateien in `public/logo/` ablegen:
   - `logo-on-dark.png` — für dunklen Hintergrund (Navbar, Login-Screen)
   - `logo-on-light.png` — für hellen Hintergrund (falls benötigt)

2. Logo-Komponente: `components/brand/Logo.tsx`  
   Props: `variant="onDark"` | `"onLight"` — referenzieren die obigen Dateien.

3. Größen aktuell (nach T&J-Umbau):
   - Navbar (`TopBar.tsx`): `width={120} height={34}` (max-w 120px)
   - Login-Screen (`LoginStep.tsx`): `width={140} height={40}`

### 1.3 Farben anpassen

**Workflow:** `design/index.md` → `design/colors.md` → `theme/index.ts` → `app/globals.css`

Farbtoken-Übersicht (`design/index.md` → CSS Custom Properties):
```
--ink:          #0E0E0C   (Primärtext, Hintergründe dunkel)
--paper:        #FCFCFD   (Heller Hintergrund, heller Text auf dunkel)
--frost:        #F8F8FA   (Karten-Hintergrund hell)
--mist:         #EEEEF1   (Borders auf hellem Bg)
--mute:         #8B867E   (Sekundärer Text, Kicker auf hellem Bg)
--forest-deep:  #122620   (Tiefster Akzent)
--forest:       #1F3A2E   (Haupt-Akzent)
--glow:         #2D5443   (Mittlerer Akzent)
--leaf:         #4A7C5C   (Heller Akzent, Icons)
```

Bei Änderung:
1. Neue Farben in `design/colors.md` dokumentieren
2. CSS Custom Properties in `app/globals.css` unter `:root {}` anpassen
3. `theme/index.ts` Farbobjekte synchron halten (Chakra-Tokens)
4. Backward-compat-Aliases am Ende des `:root {}` Blocks prüfen (`--color-accent-gold` → neuer Wert)

### 1.4 Hintergrundbilder ersetzen

Bilder in `public/bg/`:
- `tj-hero-bg.jpg` — Haupt-Hero-Bild (Root `/`, Login, Gründer-Section)
- Weitere Bilder nach Bedarf

Referenziert von:
- `components/layout/SkyArchBackground.tsx` → Root `/` (OnboardingFlow)
- `components/layout/PlatformBackground.tsx` → Authenticated Platform
- `components/landing/HeroSection.tsx` → Landing-Page-Hero
- `components/landing/FounderSection.tsx` → Gründer-Section

### 1.5 Typografie

Aktuelle Fonts (T&J Consulting):
| Rolle | Font | CSS-Klassen |
|---|---|---|
| Headlines/Display | **Fraunces** (variable) | `fraunces`, `fraunces-italic` |
| Fließtext/UI | **Geist Sans** | `inter`, `inter-medium`, `inter-semibold` |
| Meta/Daten | **Geist Mono** | `jetbrains-mono` |

> **Hinweis:** Die CSS-Klassen (`fraunces`, `inter-*`, `jetbrains-mono`) sind Legacy-Namen aus der alten Capital-Circle-Zeit — sie zeigen jetzt aber Fraunces/Geist-Fonts. Nicht umbenennen, da sie in hunderten Komponenten verwendet werden.

Bei Font-Änderung:
1. `design/typography.md` anpassen
2. `app/layout.tsx` → Font-Imports (next/font oder Google Fonts `<link>`) aktualisieren
3. `theme/index.ts` → `fonts.heading`, `fonts.body`, `fonts.mono`
4. CSS-Variablen `--font-display`, `--font-sans`, `--font-mono` in `app/globals.css`

---

## Phase 2: Inhalte

### 2.1 Landing Page

**Datei:** `config/landing-config.ts`

Enthält alle Texte für Landing-Page-Sektionen:
- Hero-Text, Subheadline
- Phasen/Schritte
- Founder-Sektion (inkl. `socialLinks.linkedin`)
- Pricing-Bullets

### 2.2 Case Studies / Testimonials

1. Neue Bilder in `public/cases/` ablegen
2. Testimonial-Daten in `config/landing-config.ts` anpassen
3. Review-Texte im Admin-Panel unter `/admin/reviews` pflegen

### 2.3 Founder-Bild

Datei: `public/founder/founder.jpeg` ersetzen

### 2.4 E-Mail-Texte

Alle Templates in `lib/email/templates/` anpassen:
- `welcome-free-course.tsx` — Erster Kontakt
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

---

## Phase 3: Nischen-spezifische Features entfernen

Wenn die neue Nische andere Features braucht:

### 3.1 Trading-Features (bereits entfernt in T&J)

Alle Trading-Features wurden per `supabase/migrations/055_remove_trading_features.sql` entfernt:
- Trading Journal, Positionsrechner, Analyse-Posts, TradingView-Widget

Bei neuem Blueprint von T&J aus: nichts zu tun.

### 3.2 Community-Features (Discord)

Falls Discord für die neue Nische nicht genutzt wird:
1. Discord-OAuth-Routes entfernen: `app/api/auth/discord/`
2. Discord-Admin-Panel entfernen: `app/(admin)/admin/discord/`
3. `DiscordBanner` aus Dashboard entfernen
4. Discord-Env-Variablen leer lassen

---

## Phase 4: Umgebungsvariablen

### 4.1 Stripe

1. Produkte in Stripe anlegen
2. `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME` mit neuen Price IDs
3. Webhook neu registrieren → neuen `STRIPE_WEBHOOK_SECRET`

### 4.2 Resend

1. Neue Domain in Resend verifizieren
2. `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME` aktualisieren

### 4.3 Supabase (falls neues Projekt)

1. Migrations ausführen
2. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Types: `supabase gen types typescript`

### 4.4 Hetzner Storage

1. Bucket anlegen, CORS konfigurieren
2. `HETZNER_BUCKET_NAME`, `HETZNER_ACCESS_KEY`, `HETZNER_SECRET_KEY`

---

## Phase 5: SEO & Meta

| Datei | Zu ändern |
|---|---|
| `app/layout.tsx` | `<title>`, `<meta description>`, OG-Image |
| `app/manifest.ts` | App-Name, Theme-Color, Icons |
| `public/` | Favicon-Dateien ersetzen |

---

## Checkliste für Rebranding

```
[ ] Markenname global ersetzt (TopBar, LoginStep, landing-config, E-Mail-Templates)
[ ] Logo-Dateien in public/logo/ ausgetauscht
[ ] Farben: design/colors.md → app/globals.css (:root) → theme/index.ts
[ ] Hintergrundbild: public/bg/tj-hero-bg.jpg (oder neues Bild, alle 4 Referenz-Stellen updaten)
[ ] Landing Page Texte (config/landing-config.ts) aktualisiert
[ ] Case Studies / Testimonials ersetzt
[ ] E-Mail-Templates angepasst (Texte, Markenname, Links)
[ ] Onboarding-Texte (Codex, Agreement) angepasst
[ ] Bewerbungsfragen angepasst
[ ] Stripe-Produkte und Price-IDs konfiguriert
[ ] Resend-Domain verifiziert
[ ] Neue App-URL in NEXT_PUBLIC_APP_URL
[ ] SEO Meta-Tags aktualisiert
[ ] Favicon + App-Icons ersetzt
[ ] Vercel-Env-Variablen aktualisiert
```
