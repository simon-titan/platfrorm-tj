# Membership-Modell & Billing

## Tier-Struktur

Die Plattform kennt vier Mitgliedschaftsstufen, gespeichert in `profiles.membership_tier`:

| Tier | Wert | Beschreibung | Zugang |
|---|---|---|---|
| **Free** | `'free'` | Kein bezahlter Zugang; Free-Funnel-Inhalte | Nur als Free markierte Kurse, Arsenal-Free-Attachments |
| **Monthly** | `'monthly'` | Monatliche Stripe-Subscription | Alle Premium-Inhalte solange `access_until` in der Zukunft |
| **Lifetime** | `'lifetime'` | Einmalzahlung | Dauerhafter Premium-Zugang, kein `access_until` |
| **HT 1-on-1** | `'ht_1on1'` | High-Ticket-Coaching (persönlich) | Premium-Zugang + individuelle Sessions |

Zusätzlich: `profiles.is_paid` (legacy boolean, wird via Stripe-Webhook synchron gehalten).

---

## Access-Control

**Zentrale Funktion:** `lib/access-control/has-access.ts` → `hasActivePaidAccess(userId)`

**Logik:**

```
lifetime  → hasAccess=true, kein Ablauf
ht_1on1   → hasAccess=true, Ablauf via access_until
monthly   → hasAccess=true wenn access_until > now()
           hasAccess=false wenn access_until <= now() (Expired)
           Grace-Periode: +48h nach Payment-Failure (access_until = now()+48h)
free      → hasAccess=false
```

**Synchroner Helper für Server Components:** `evaluateAccess(profile)` (kein async, wenn Profil bereits geladen)

**Membership-Helpers:** `lib/membership.ts`
- `isFreeMember(profile)` — True wenn free oder nicht bezahlt
- `isApprovedFreeMember(profile)` — True wenn free + application_status='approved'

**Paywall-Komponente:** `components/ui/PaywallOverlay.tsx` — zeigt Upgrade-CTA für Free-Nutzer

---

## Stripe-Integration

### Produkte & Preise
- **Monthly Subscription:** `STRIPE_PRICE_MONTHLY` (monatlich wiederkehrend)
- **Lifetime:** `STRIPE_PRICE_LIFETIME` (einmalig)

### Checkout-Flow
```
1. Nutzer klickt "Mitglied werden" auf /pricing oder /ausbildung (Paywall)
2. Server-Action erstellt Stripe Checkout Session
3. Redirect zu Stripe Hosted Checkout
4. Nach Zahlung: Redirect zu /checkout?success=true
   → CheckoutClient.tsx wartet auf Webhook-Verarbeitung, dann Redirect zu /dashboard
5. Bei Abbruch: Redirect zu /checkout?canceled=true
```

- Checkout-Route: `app/(platform)/checkout/`
- Checkout-Client: `app/(platform)/checkout/CheckoutClient.tsx`
- API: `app/api/stripe/create-checkout-session/`

### Webhook-Handler (`lib/stripe/webhooks/`)

| Event | Datei | Aktion |
|---|---|---|
| `checkout.session.completed` | `checkout-completed.ts` | `membership_tier` setzen, `access_until` setzen, `is_paid=true` |
| `invoice.paid` | `invoice-paid.ts` | `access_until` auf nächste Periode verlängern |
| `customer.subscription.deleted` | `subscription-deleted.ts` | `membership_tier='free'`, `is_paid=false` |
| `invoice.payment_failed` | `payment-failed.ts` | Grace-Periode (+48h), Dunning-Cron triggern |

**Idempotenz:** Alle Events werden in `stripe_webhook_events` geloggt — doppelte Events werden ignoriert.

### Kunden-Portal
- Route: `app/api/stripe/create-portal-session/`
- Nutzer können Subscription kündigen, Zahlungsmethode ändern
- Billing-Seite: `app/(platform)/billing/`

---

## Bewerbungs-Funnel (Free-Gate)

Neue Nutzer müssen eine kurze Bewerbung einreichen, bevor sie Free-Mitglieder werden:

```
1. Interessent öffnet /free oder /apply
2. Füllt Bewerbungsformular aus (3 Pflichtfragen + Cloudflare Turnstile)
3. Bewerbung wird in Tabelle applications gespeichert (status='pending')
4. Admin reviewed im Panel /admin/applications
5. Bei Approval: application_status='approved', E-Mail-Sequenz startet
6. Bei Ablehnung: Rejection-E-Mail wird versendet
```

**Bewerbungskomponente:** `components/marketing/FreeApplicationModal.tsx`  
**Fragen:** Standard-Textfelder (experience, biggest_problem, goal_6_months)

---

## High-Ticket-Funnel (HT 1-on-1)

Separater Sales-Funnel für Premium-Coaching:

```
1. Nutzer öffnet /apply (oder wird durch HT-Upsell-E-Mail nach 60 Tagen geleitet)
2. Füllt ausführlicheren Fragebogen aus (config/ht-questions.ts)
3. Budget-Auswahl: under_2000 / over_2000
4. Daten in high_ticket_applications (status='pending')
5. Admin contacted den Interessenten, plant Calendly-Call
6. Nach Call: outcome auf closed_won/closed_lost/no_show
```

**Formular-Komponente:** `components/marketing/HTApplicationForm.tsx`  
**Fragen:** `config/ht-questions.ts`  
**Calendly-Integration:** `app/api/integrations/calendly/` (Webhook bei Terminbuchung)  
**Admin-Panel:** `/admin/ht-applications`

### Step-2-Bewerbungen
Separater Flow aus Insight-Funnel. Tabelle `step2_applications`. Admin-Panel: `/admin/step2-applications`.  
Fragen: `config/insight-step2-questions.ts`

---

## Churn-Prevention

### Dunning (Zahlungserinnerungen)
Bei `invoice.payment_failed` startet eine 3-stufige E-Mail-Sequenz:
- Schritt 1: Sofort (payment-failed-1)
- Schritt 2: Nach 3 Tagen (payment-failed-2)
- Schritt 3: Nach 7 Tagen (payment-failed-3)

Ausgeführt durch Cron `app/api/cron/process-dunning/`.

### Inaktivitäts-E-Mails
- Nach 7 Tagen kein Login: `churn-inactive-7d`
- Nach 14 Tagen kein Login: `churn-inactive-14d`

Ausgeführt durch Cron `app/api/cron/check-inactive-users/`.

### Cancellation Survey
Nach Kündigung erhält der Nutzer `cancellation-survey` per E-Mail.  
Antworten in Tabelle `cancellations`.  
Formular: `components/marketing/CancellationSurveyForm.tsx` → Route `(marketing)/survey/cancellation/`

### Reactivation-Angebote
Ehemalige Mitglieder erhalten nach definierten Zeiträumen Reaktivierungs-E-Mails.  
Cron: `app/api/cron/reactivation-offers/`
