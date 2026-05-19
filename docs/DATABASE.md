# Datenbank-Schema

**Provider:** Supabase (PostgreSQL)  
**Migrations-Verzeichnis:** `supabase/migrations/` (54 `.sql`-Dateien)  
**Generated Types:** `lib/supabase/types.ts` (via `supabase gen types typescript`)

Alle Tabellen haben Row Level Security (RLS) aktiviert. Zugriff über Service-Role-Key (`SUPABASE_SERVICE_ROLE_KEY`) umgeht RLS — nur serverseitig verwenden.

---

## Kern-Tabellen

### `profiles`
Zentrale Nutzer-Tabelle. Wird bei Registrierung automatisch per DB-Trigger befüllt (Migration `003_profile_trigger.sql`).

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `username` | text | Anzeigename |
| `full_name` | text | Vollständiger Name |
| `avatar_url` | text | Hetzner-Storage-Key für Avatar |
| `is_admin` | boolean | Admin-Panel-Zugang |
| `is_paid` | boolean | Legacy-Flag (wird via Stripe-Webhook synchron gehalten) |
| `membership_tier` | text | `'free' \| 'monthly' \| 'lifetime' \| 'ht_1on1'` |
| `access_until` | timestamptz | Ablauf des kostenpflichtigen Zugangs |
| `lifetime_purchased_at` | timestamptz | Zeitstempel Lifetime-Kauf |
| `stripe_customer_id` | text unique | Stripe-Kunden-ID |
| `application_status` | text | `'pending' \| 'approved' \| 'rejected'` |
| `discord_id` | text | Discord-User-ID |
| `discord_username` | text | Discord-Anzeigename |
| `discord_access_token` | text | OAuth-Token |
| `discord_refresh_token` | text | OAuth-Refresh-Token |
| `codex_accepted` | boolean | Nutzungsvertrag akzeptiert |
| `codex_accepted_at` | timestamptz | Zeitstempel Akzeptanz |
| `intro_video_watched` | boolean | Intro-Video abgeschlossen |
| `intro_video_watched_at` | timestamptz | Zeitstempel |
| `streak_current` | int | Aktuelle Lern-Streak (Tage) |
| `streak_longest` | int | Längste Streak |
| `streak_last_activity` | date | Letzter Aktivitätstag |
| `total_learning_minutes` | int | Kumulierte Lernminuten |
| `last_login_at` | timestamptz | Letzter Login |
| `unsubscribed_at` | timestamptz | E-Mail-Abmeldung |
| `churn_email_*_sent_at` | timestamptz | Churn-E-Mail-Tracking (mehrere Spalten) |
| `payment_failed_email_*_sent_at` | timestamptz | Dunning-E-Mail-Tracking |
| `ht_upsell_email_sent_at` | timestamptz | HT-Upsell-Tracking |
| `created_at` | timestamptz | Erstellt am |

**RLS:** Nutzer lesen nur eigenes Profil; Admins haben vollen Zugriff.

---

## Kurs-System

### `courses`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `title` | text | |
| `slug` | text unique | URL-Slug |
| `description` | text | |
| `is_free` | boolean | Free-Tier-Kurs |
| `cover_image_storage_key` | text | Hetzner-Key |
| `icon` | text | Emoji oder Icon-Bezeichner |
| `accent_color` | text | Kurs-Akzentfarbe |
| `is_sequential` | boolean | Module müssen in Reihenfolge abgeschlossen werden |
| `created_at` | timestamptz | |

### `modules`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `course_id` | uuid FK → courses | |
| `title` | text | |
| `description` | text | |
| `order_index` | int | Reihenfolge innerhalb des Kurses |
| `video_storage_key` | text | Hetzner-Storage-Key für Video |
| `video_duration_seconds` | int | |
| `attachments` | jsonb | Legacy-Anhänge (array) |
| `is_published` | boolean | |
| `is_locked` | boolean | Manuell gesperrt (unabhängig von Reihenfolge) |
| `subcategory_id` | uuid FK → subcategories | |
| `updated_at` | timestamptz | |

### `subcategories`
Gruppierung von Modulen innerhalb eines Kurses.

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `course_id` | uuid FK → courses | |
| `title` | text | |
| `position` | int | |
| `storage_folder_key` | text | Hetzner-Ordner für Uploads |

### `user_progress`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles | |
| `module_id` | uuid FK → modules | |
| `video_progress_seconds` | int | Letzte Videoposition |
| `video_completed` | boolean | Video vollständig geschaut |
| `quiz_passed` | boolean | Quiz bestanden |
| `completed` | boolean | Modul abgeschlossen |
| `completed_at` | timestamptz | |
| UNIQUE | (user_id, module_id) | |

### `quizzes`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `module_id` | uuid FK unique → modules | 1:1 |
| `title` | text | |
| `pass_threshold` | int | Mindest-% zum Bestehen (default 100) |
| `questions` | jsonb | Array von Frage-Objekten |

---

## Lern-Aktivität & Gamification

### `user_notes`
Rich-Text-Notizen pro Nutzer und Modul.

| Spalte | Typ |
|---|---|
| `id` | uuid PK |
| `user_id` | uuid FK → profiles |
| `module_id` | uuid FK → modules |
| `content` | text (HTML) |
| `updated_at` | timestamptz |
| UNIQUE | (user_id, module_id) |

### `video_attachments`
Dateianhänge (PDF etc.) zu Videos/Modulen.

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `video_id` | uuid FK | |
| `storage_key` | text | Hetzner-Key |
| `filename` | text | |
| `content_type` | text | MIME-Type |
| `size_bytes` | bigint | |
| `position` | int | |
| `arsenal_kind` | text | `null \| 'template' \| 'pdf'` |
| `is_free` | boolean | Für Free-Tier zugänglich |

### `learning_minutes_by_day` / `streak_activity_by_day`
Tages-Aggregation für Gamification (Streak, Lernminuten).

---

## Community & News

### `news_posts`
Admin-erstellte Beiträge, sichtbar für alle authentifizierten Nutzer.

| Spalte | Typ |
|---|---|
| `id` | uuid PK |
| `title` | text |
| `content` | text (Rich-Text HTML) |
| `excerpt` | text |
| `cover_image_storage_key` | text |
| `published_at` | timestamptz |
| `created_by` | uuid FK → profiles |

### `news_likes` / `news_comments` / `news_saves` / `news_read_status`
Social-Interaktionen zu News-Beiträgen. Je eindeutig pro (post, user).

### `events`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `title` | text | |
| `description` | text | |
| `start_time` | timestamptz | |
| `end_time` | timestamptz | |
| `event_type` | text | |
| `color` | text | Kalenderfarbe |
| `external_url` | text | Externer Link (optional) |
| `is_recurring` | boolean | Wiederkehrendes Ereignis |
| `recurrence_rule` | text | iCal-Regel |

### `homework`
| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `title` | text | |
| `description` | text | |
| `due_date` | date | |
| `week_number` | int | |
| `is_active` | boolean | |

---

## Live Sessions

### `live_session_categories`
Übergeordnete Kategorien für Sessions.

### `live_sessions`
Einzelne aufgezeichnete Session (verknüpft mit Kategorie + optional Event).

| Spalte | Typ |
|---|---|
| `id` | uuid PK |
| `category_id` | uuid FK → live_session_categories |
| `event_id` | uuid FK → events (optional) |
| `title` | text |
| `description` | text |
| `thumbnail_storage_key` | text |
| `recorded_at` | timestamptz |
| `position` | int |

### `live_session_subcategories`
Unterabschnitte einer Session.

### `live_session_videos`
Videos innerhalb einer Session (Hetzner Storage Keys).

### `stream_settings`
Live-Stream-Konfiguration (Cloudflare Stream UID, eingetragen durch Admin).

---

## Arsenal (Ressourcen-Bibliothek)

### `arsenal_cards`
Admin-erstellte Ressourcen-Karten (Tools, Fremdkapital, etc.).

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `category` | text | `'tools' \| 'fremdkapital'` — erweiterbar |
| `title` | text | |
| `description` | text | |
| `external_url` | text | |
| `feature_bullets` | jsonb | Array von Stichpunkten |
| `logo_storage_key` | text | Hetzner-Key für Logo |
| `position` | int | Sortierung |

### `arsenal_attachments`
Standalone-Dateien (nicht an Video gebunden), kategorisiert.

---

## Bewerbungs- & Sales-System

### `applications`
Free-Funnel-Bewerbungen (Step 1).

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles | |
| `email` | text | |
| `name` | text | |
| `experience` | text | Pflichtfrage |
| `biggest_problem` | text | Pflichtfrage |
| `goal_6_months` | text | Pflichtfrage |
| `status` | text | `'pending' \| 'approved' \| 'rejected'` |
| `reviewed_at` | timestamptz | |
| `reviewed_by` | uuid FK → profiles | |
| `rejection_reason` | text | |
| `welcome_sequence_started_at` | timestamptz | |

### `high_ticket_applications`
High-Ticket-Bewerbungen (Step 2, 1-on-1).

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles | |
| `email` / `name` / `whatsapp_number` | text | |
| `answers` | jsonb | Alle Fragebogen-Antworten |
| `budget_tier` | text | `'under_2000' \| 'over_2000'` |
| `contacted_at` | timestamptz | |
| `call_scheduled_at` | timestamptz | |
| `outcome` | text | `'closed_won' \| 'closed_lost' \| 'no_show' \| 'pending'` |
| `internal_notes` | text | |

### `step2_applications`
Bewerbungen aus dem Step-2-Funnel (Insight-Tracking).

---

## Billing & Zahlungen

### `subscriptions`
Stripe-Subscriptions synchronisiert via Webhook.

| Spalte | Typ |
|---|---|
| `id` | uuid PK |
| `user_id` | uuid FK → profiles |
| `stripe_subscription_id` | text unique |
| `stripe_customer_id` | text |
| `stripe_price_id` | text |
| `status` | text (aktiv/past_due/canceled/etc.) |
| `current_period_start/end` | timestamptz |
| `cancel_at_period_end` | boolean |
| `canceled_at` | timestamptz |

### `payments`
Einzelzahlungen (Checkout + Lifetime).

### `stripe_webhook_events`
Idempotenz-Log: Jedes Stripe-Event wird einmalig verarbeitet.

### `cancellations`
Offboarding-Survey nach Kündigung.

| Spalte | Typ |
|---|---|
| `structured_reason` | text (`'too_expensive' \| 'not_enough_value' \| 'tech_issues' \| 'other'`) |
| `feedback` | text |

---

## E-Mail & Tracking

### `email_sequence_log`
Verhindert doppelte E-Mails in Sequenzen.

| Spalte | Typ |
|---|---|
| `recipient_email` | text |
| `sequence` | text (Sequenz-Name) |
| `step` | int |
| `sent_at` | timestamptz |
| `opened_at` / `clicked_at` | timestamptz |
| UNIQUE | (recipient_email, sequence, step) |

---

## ⚠️ Trading-spezifische Tabellen (für Rebranding entfernen)

### `trading_journals`
Journal-Container pro Nutzer.

### `trading_journal_trades`
Einzelne Trades mit Strategie-Tags, Emotionen, Screenshots, JSONB-Scoring-Feldern.

### `analysis_posts`
Admin-erstellte Marktanalysen (`post_type: 'weekly' | 'daily'`).

**Entfernung:** Migration schreiben, die diese Tabellen droppt (oder RLS auf "kein Zugriff" setzt), und alle referenzierenden App-Routes entfernen.

---

## Discord

### `discord_invites`
Discord-Einladungslinks + Rollen-Zuweisung pro Nutzer.
