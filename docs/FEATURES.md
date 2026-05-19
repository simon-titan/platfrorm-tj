# Feature-Inventar

Vollständige Übersicht aller Features mit Kategorisierung für Rebranding-Entscheidungen.

**Legende:**
- ✅ Kern-Feature — plattform-unabhängig, immer behalten
- ⚠️ Trading-spezifisch — bei Rebranding entfernen
- 🔄 Neutral/Anpassbar — Struktur behalten, Inhalte ersetzen

---

## Platform-Features (Nutzer-App)

### ✅ Dashboard (`/dashboard`)
Begrüßungskarte, Lernstatistiken (Streak, Lernminuten), Quick-Access zu Kursen und Events.  
**Komponenten:** `components/platform/DashboardCards.tsx`, `WelcomeCard.tsx`, `StatsCard.tsx`

### ✅ Ausbildung / Institut (`/ausbildung`)
Kurs-Übersicht mit Fortschrittsanzeige. Unterstützt sequenzielle Freischaltung (Modul-Reihenfolge).  
- Kurs-Detail mit Modul-Playlist und Video-Player
- Modul-Lernseite: `app/(platform)/ausbildung/[segment]/[moduleId]/`
- Quiz-Modal nach Video
- Nutzer-Notizen (Rich-Text pro Modul)
- **Kostenloser Einblick** (is_free-Kurse, ohne Paywall)
- **Aufzeichnungen** (Live-Session-Archiv, Shortcut in Sidebar)

### ✅ Events / Kalender (`/events`)
FullCalendar-Integration, Übersicht geplanter Veranstaltungen.  
Unterstützt Farb-Codierung und externe URLs.  
**Komponente:** `components/platform/EventsCalendar.tsx`

### ✅ Arsenal (`/arsenal`)
Ressourcen-Bibliothek mit admin-erstellten Karten (Tools, Ressourcen) und Datei-Downloads.  
Kategorien konfigurierbar in DB (`arsenal_cards.category`).  
**Komponenten:** `components/platform/ArsenalCardsSection.tsx`, `ArsenalAttachmentsBrowser.tsx`

### ✅ News (`/news`)
Community-News-Feed. Unterstützt Likes, Kommentare (max. 1 pro User/Post) und Bookmarks.  
Ungelesene-Badge in der Navbar via `news_read_status`.  
**Komponente:** `components/platform/NewsFeed.tsx`

### ✅ Live Sessions (`/stream`)
Archiv aufgezeichneter Sessions, kategorisiert. Video-Playlist mit Sub-Kapiteln.  
**Komponente:** `components/platform/LiveSessionDetailClient.tsx`

### ✅ Live Stream
Eingebetteter Cloudflare-Stream für Live-Übertragungen.  
Admin konfiguriert Cloudflare-Video-UID in `/admin/stream`.

### ✅ Einstellungen (`/settings`)
Profil-Management: Name, Avatar, Passwort-Änderung, Discord-Verbindung.

### ✅ Billing (`/billing`)
Stripe-Kundenportal-Link, Abo-Status, Zahlungshistorie.

### ✅ Onboarding-Flow
Nach Registrierung: Intro-Video → Codex/Usage Agreement → Dashboard.  
Gate-Prüfung via `profiles.intro_video_watched` + `profiles.codex_accepted`.  
**Komponenten:** `components/onboarding/`

### ✅ Hausaufgaben (`/hausaufgabe`)
Admin-erstellte Aufgaben mit Fälligkeitsdatum. Nutzer können Status setzen.

### ✅ Codex (`/codex`)
Nutzungsregeln/Verhaltenskodex (einmaliges Akzeptieren beim Onboarding).

---

## ⚠️ Trading-spezifische Features (entfernen beim Rebranding)

### ⚠️ Trading Journal (`/trading-journal`)
Persönliches Handels-Tagebuch mit Strategie-Tags, Emotions-Tracking, Screenshot-Upload.  
**Route:** `app/(platform)/trading-journal/`  
**DB-Tabellen:** `trading_journals`, `trading_journal_trades`

### ⚠️ Positionsrechner (`/position-calculator`)
Tool zur Berechnung von Positionsgrößen.  
**Route:** `app/(platform)/position-calculator/`  
**Keine eigene DB-Tabelle** (rein clientseitige Berechnung)

### ⚠️ Analyse-Posts (`/analysis`)
Admin-erstellte Marktanalysen (täglich/wöchentlich) mit Rich-Text und Bild.  
**Route:** `app/(platform)/analysis/`  
**Admin-Route:** `/admin/analysis`  
**DB-Tabelle:** `analysis_posts`

### ⚠️ TradingView Widget
Marktübersichts-Widget auf dem Dashboard.  
**Komponente:** `components/platform/TradingViewMarketSummary.tsx`  
**Eingebunden in:** Dashboard-Seite

**Entfernungs-Checkliste:**
1. Routes löschen: `trading-journal/`, `position-calculator/`, `analysis/`
2. Admin-Route löschen: `admin/analysis/`
3. Sidebar-Navigation bereinigen (`Sidebar.tsx`, `AdminSidebar.tsx`)
4. `TradingViewMarketSummary.tsx` aus Dashboard entfernen
5. DB-Migration: `DROP TABLE trading_journals, trading_journal_trades, analysis_posts`
6. DB-Tabelle `analysis_posts` aus Admin-Tabelle entfernen
7. Sidebar-Links auf diese Routes prüfen

---

## Marketing & Funnel-Features

### 🔄 Landing Page (`/`)
Vollständige Landing Page mit Hero, Cases, Reviews, Phases, Founder, Pricing.  
**Inhalt:** `config/landing-config.ts`  
**Komponenten:** `components/landing/` (12 Komponenten)

### 🔄 Free-Funnel (`/free`, `/apply`)
Bewerbungsformular für Free-Mitgliedschaft.  
**Fragen:** Konfiguriert in den Formular-Komponenten

### 🔄 HT-Funnel (`/apply`)
High-Ticket-Bewerbungsflow.  
**Fragen:** `config/ht-questions.ts`

### 🔄 Pricing-Seite (`/pricing`)
Preisübersicht, Pricing-Video-Player.  
**Komponenten:** `components/marketing/PricingVideo.tsx`, `PricingCards.tsx`

### 🔄 Cancellation Survey (`/survey/cancellation`)
Kunden-Feedback bei Kündigung.  
**Komponente:** `components/marketing/CancellationSurveyForm.tsx`

---

## Admin-Panel-Features

Vollständige Übersicht → `docs/ADMIN-PANEL.md`

---

## Navigation (Platform-Sidebar)

Aktuelle Sidebar-Links (`components/platform/Sidebar.tsx`):

| Label | Route | Hinweis |
|---|---|---|
| Dashboard | `/dashboard` | ✅ |
| Events | `/events` | ✅ |
| Institut | `/ausbildung` | ✅ |
| Kostenloser Einblick | `/ausbildung#kostenloser-einblick` | ✅ Sub-Link |
| Aufzeichnungen | `/ausbildung#aufzeichnungen` | ✅ Sub-Link |
| Einstellungen | `/settings` | ✅ |

**Hinweis:** News, Arsenal, Live Stream, Billing, Trading Journal, Positionsrechner, Analyse sind direkt verlinkbar aber nicht in der primären Sidebar — über Dashboard-Cards oder separate Navigation erreichbar.

---

## Gamification

- **Streak:** Tägliche Lernaktivität (`streak_current`, `streak_longest`, `streak_last_activity`)  
  Logic: `lib/streak.ts`
- **Lernminuten:** Akkumuliert beim Schauen von Videos (`total_learning_minutes`)  
  Logic: `lib/learning-daily.ts`
- Tages-Aggregation: `learning_minutes_by_day`, `streak_activity_by_day`

---

## Öffentliche Routes (kein Login nötig)

| Route | Zweck |
|---|---|
| `/` | Landing Page |
| `/einsteig` | Login/Start-Seite |
| `(auth)/login` | Login-Formular |
| `(auth)/register` | Registrierung |
| `(marketing)/apply` | HT-Bewerbung |
| `(marketing)/free` | Free-Funnel |
| `(marketing)/pricing` | Pricing |
| `(marketing)/survey/cancellation` | Cancellation Survey |
| `/bewerbung` | Legacy-Bewerbungsflow |
