# E-Mail-System

## Provider & Setup

- **Provider:** [Resend](https://resend.com)
- **SDK:** `resend` npm-Paket (`lib/email/resend.ts`)
- **Templates:** React Email (`@react-email/components`, `@react-email/render`)
- **Base-Layout:** `lib/email/layout/BaseEmail.tsx`
- **Sender-Helper:** `lib/email/send.ts`
- **Sequence-Logging:** `lib/email/sequence-log.ts` → DB-Tabelle `email_sequence_log`

### Umgebungsvariablen

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Plattform-Name
RESEND_WEBHOOK_SECRET=         # für Open/Click-Tracking (optional)
UNSUBSCRIBE_TOKEN_SECRET=      # HMAC für DSGVO-konforme Abmeldung
```

---

## Sequence-Logging

**Funktion:** Verhindert, dass E-Mails in Sequenzen doppelt versendet werden.

```typescript
// lib/email/sequence-log.ts
await logEmailSent(userId, email, sequenceName, stepNumber, resendMessageId)
await hasEmailBeenSent(email, sequenceName, stepNumber)
```

**DB-Tabelle:** `email_sequence_log` mit UNIQUE-Constraint auf `(recipient_email, sequence, step)`.

---

## Template-Übersicht

Alle Templates in `lib/email/templates/`. Jede Datei exportiert:
- `default` — React-Komponente (für `react-email preview`)
- `send<Name>` — Ready-to-use Sender-Funktion mit Sequence-Log

### Onboarding-Sequenz (Free-Funnel)

| Datei | Export | Trigger | Sequence-Key |
|---|---|---|---|
| `welcome-free-course.tsx` | `sendWelcomeFreeCourse` | Direkt nach Bewerbungs-Approval | `welcome_free` |
| `free-course-day-1.tsx` | `sendFreeCourseDay1` | Cron: 1 Tag nach Approval | `free_course` step 1 |
| `free-course-day-2.tsx` | `sendFreeCourseDay2` | Cron: 2 Tage nach Approval | `free_course` step 2 |
| `free-course-day-3.tsx` | `sendFreeCourseDay3` | Cron: 3 Tage nach Approval | `free_course` step 3 |
| `free-course-day-5.tsx` | `sendFreeCourseDay5` | Cron: 5 Tage nach Approval | `free_course` step 5 |

**Cron-Endpunkt:** `app/api/cron/free-course-sequence/route.ts`

### Bezahlte Mitglieder

| Datei | Export | Trigger |
|---|---|---|
| `welcome-paid.tsx` | `sendWelcomePaid` | Stripe `checkout.session.completed` |

### Bewerbungs-Management

| Datei | Export | Trigger |
|---|---|---|
| `application-received.tsx` | `sendApplicationReceived` | Nach Einreichen der Bewerbung |
| `application-rejected.tsx` | `sendApplicationRejected` | Nach Admin-Ablehnung |

### Dunning (Zahlungserinnerungen)

3-stufige Sequenz bei `invoice.payment_failed`:

| Datei | Export | Timing | Sequence-Key |
|---|---|---|---|
| `payment-failed-1.tsx` | `sendPaymentFailed1` | Sofort | `dunning` step 1 |
| `payment-failed-2.tsx` | `sendPaymentFailed2` | +3 Tage | `dunning` step 2 |
| `payment-failed-3.tsx` | `sendPaymentFailed3` | +7 Tage | `dunning` step 3 |

**Cron-Endpunkt:** `app/api/cron/process-dunning/route.ts`  
**Tracking:** `profiles.payment_failed_email_1/2/3_sent_at`

### Churn-Prevention

| Datei | Export | Trigger | Tracking-Spalte |
|---|---|---|---|
| `churn-inactive-7d.tsx` | `sendChurnInactive7d` | 7 Tage kein Login | `profiles.churn_email_1_sent_at` |
| `churn-inactive-14d.tsx` | `sendChurnInactive14d` | 14 Tage kein Login | `profiles.churn_email_2_sent_at` |
| `cancellation-survey.tsx` | `sendCancellationSurvey` | Nach Subscription-Kündigung | — |
| `reactivation-offer.tsx` | `sendReactivationOffer` | Cron: nach Kündigung | — |

**Cron-Endpunkte:**
- `app/api/cron/check-inactive-users/` — prüft `last_login_at`, sendet Churn-E-Mails
- `app/api/cron/reactivation-offers/` — Reaktivierungs-Kampagne

### Upsell

| Datei | Export | Trigger | Tracking-Spalte |
|---|---|---|---|
| `ht-upsell-60d.tsx` | `sendHtUpsell60d` | 60 Tage nach Mitglied werden | `profiles.ht_upsell_email_sent_at` |

**Cron-Endpunkt:** `app/api/cron/ht-upsell-60d/`

### Intern

| Datei | Beschreibung |
|---|---|
| `admin-credentials.tsx` | Zugangsdaten für neuen Admin-Account |
| `step2-invite.tsx` | Einladung zum Step-2-Bewerbungsgespräch |

---

## Cron-Jobs (vollständig)

Alle Cron-Endpunkte sind durch Bearer-Token gesichert (`CRON_SECRET`).  
Auth-Check: `lib/cron/auth.ts`

| Endpunkt | Aufgabe | Frequenz (empfohlen) |
|---|---|---|
| `app/api/cron/check-inactive-users/` | Inaktivitäts-E-Mails (7d/14d) | Täglich |
| `app/api/cron/free-course-sequence/` | Free-Kurs-Sequenz (Day 1/2/3/5) | Täglich |
| `app/api/cron/ht-upsell-60d/` | HT-Upsell nach 60 Tagen | Täglich |
| `app/api/cron/process-dunning/` | Zahlungserinnerungen (3-stufig) | Täglich |
| `app/api/cron/reactivation-offers/` | Reaktivierungs-Angebote | Wöchentlich |

**Konfiguration:** In `vercel.json` unter `"crons"` eingetragen.

---

## Resend Webhook

**Endpunkt:** `app/api/resend/`  
**Zweck:** Open- und Click-Events verarbeiten → `email_sequence_log.opened_at` / `clicked_at` setzen  
**Auth:** HMAC-Signature via `RESEND_WEBHOOK_SECRET`

---

## Slack-Benachrichtigungen

Interne Alerts (kein Nutzer-facing) über `lib/notifications/slack.ts`:
- Neue HT-Bewerbung eingegangen
- Dunning-Eskalation
- Fehler in kritischen Webhooks

**Env:** `SLACK_WEBHOOK_URL`

---

## DSGVO-Abmeldung

Jede E-Mail enthält einen Abmelde-Link mit HMAC-Token (`UNSUBSCRIBE_TOKEN_SECRET`).  
Bei Klick: `profiles.unsubscribed_at` setzen. Alle E-Mail-Sender prüfen dieses Feld vor dem Versand.
