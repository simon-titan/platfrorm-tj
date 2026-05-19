# Admin-Panel

## Überblick

Das Admin-Panel ist eine vollständige Content-Management-Oberfläche für Plattform-Betreiber.

**Basis-Route:** `/admin/`  
**Auth:** Supabase Session + `profiles.is_admin = true`  
**Client:** Service-Role-Client (`lib/supabase/admin-auth.ts`) — umgeht RLS  
**Sidebar:** `components/admin/AdminSidebar.tsx`

---

## Bereiche

### Übersicht (`/admin`)
Schnellzugriff auf alle Admin-Bereiche.

### Analytics (`/admin/dashboard`)
Plattform-Statistiken und KPIs.
- Nutzer-Wachstum über Zeit
- Membership-Tier-Verteilung
- Aktive Mitglieder, Churn-Rate
- Revenue-Übersicht
- **Komponente:** `components/admin/` Analytics-Charts (Chart.js)

### Kurse & Module (`/admin/kurse`)
Vollständiges Kurs-Management.
- Kurse erstellen/bearbeiten/löschen
- Module innerhalb eines Kurses verwalten
- **Drag & Drop** für Modul-Reihenfolge (`@dnd-kit`)
- Video-Upload via Presigned URLs → Hetzner (kein Proxy)
- Rich-Text-Beschreibungen (TipTap)
- Subcategory-Verwaltung
- **Komponenten:** `components/admin/CoursesManager.tsx`, `ModuleContentManager.tsx`
- **Video-Upload-Komponente:** `components/admin/VideoUploader.tsx`

### Free Kurs (`/admin/free-kurs`)
Verwaltung der kostenlosen Inhalte (is_free-Kurse).

### Quiz (`/admin/quiz`)
Quiz-Editor für Module.
- Fragen hinzufügen/bearbeiten (Multiple Choice)
- Pass-Threshold konfigurieren
- **Komponente:** `components/admin/QuizEditor.tsx`

### Events (`/admin/events`)
Veranstaltungs-Management.
- Events erstellen/bearbeiten (Titel, Beschreibung, Datum, Farbe, externer Link)
- Wiederkehrende Ereignisse (iCal-Regel)
- **Komponente:** `components/admin/EventsManager.tsx` (o.ä.)

### Hausaufgaben (`/admin/hausaufgaben`)
Aufgaben-Management für Mitglieder.
- Aufgaben erstellen mit Fälligkeitsdatum und Wochennummer
- **Komponente:** `components/admin/HomeworkManager.tsx`

### Mitglieder (`/admin/mitglieder`)
Nutzer-Verwaltung.
- Mitgliederliste mit Suche und Filtern
- Membership-Tier manuell ändern
- Konten sperren/entsperren
- E-Mail-Sequenzen einsehen
- **Komponente:** `components/admin/MembersManager.tsx`

### Discord (`/admin/discord`)
Discord-Integration verwalten.
- Verbundene Discord-Accounts einsehen
- Rollen manuell (neu) zuweisen

### Arsenal (`/admin/arsenal`)
Ressourcen-Bibliothek verwalten.
- Arsenal-Karten erstellen/bearbeiten (Tool-Cards mit Feature-Bullets, Logo, URL)
- Kategorien: konfigurierbar in DB (Standard: `'tools'`, `'fremdkapital'`)
- Standalone-Attachments hochladen und kategorisieren
- **Drag & Drop** für Sortierung
- **Komponenten:** `components/admin/ArsenalManager.tsx` (o.ä.)

### Live Sessions (`/admin/live-sessions`)
Aufgezeichnete Sessions verwalten.
- Kategorien erstellen
- Sessions innerhalb einer Kategorie erstellen
- Videos hochladen (Hetzner), Sub-Kapitel (Subcategories) erstellen
- Thumbnail-Upload

### Live Stream (`/admin/stream`)
Live-Stream konfigurieren.
- Cloudflare Stream Video-UID eintragen (wird in `stream_settings` gespeichert)
- Sichtbar für alle Mitglieder unter `/stream`

### ⚠️ Analyse (`/admin/analysis`)
Marktanalyse-Posts erstellen/bearbeiten.  
**Trading-spezifisch — bei Rebranding entfernen.**

### News (`/admin/news`)
Community-News-Feed verwalten.
- Posts erstellen/bearbeiten mit Rich-Text und Cover-Bild
- Beiträge veröffentlichen/depublizieren

### Bewertungen (`/admin/reviews`)
Landing-Page-Testimonials verwalten.
- Reviews erstellen/bearbeiten/löschen
- Werden auf der öffentlichen Landing Page (`/`) angezeigt

### Bewerbungen (`/admin/applications`)
Free-Funnel-Bewerbungen reviewen.
- Liste aller pending/approved/rejected Bewerbungen
- Bewerbung approven → `application_status='approved'`, Welcome-E-Mail-Sequenz startet
- Bewerbung ablehnen → `application_status='rejected'`, Rejection-E-Mail

### High-Ticket (`/admin/ht-applications`)
HT-Bewerbungen managen.
- CRM-Light: Status verfolgen (pending → contacted → call scheduled → outcome)
- `call_scheduled_at`, `contacted_at`, `outcome`, `internal_notes` setzen
- Budget-Tier-Filter (under_2000 / over_2000)

### Step-2 Bewerbungen (`/admin/step2-applications`)
Bewerbungen aus dem Insight-Funnel.

### Tracking Links (`/admin/tracking`)
UTM-Parameter / Tracking-Link-Verwaltung.

---

## Technische Details

### Upload-Architektur (Kein Server-Proxy)

```
1. Admin-Client fragt Presigned URL an:
   POST /api/admin/presign-upload
   Body: { filename, contentType, folder }
   
2. Server generiert Hetzner-Presigned-URL (AWS SDK)

3. Admin-Client uploaded direkt zu Hetzner:
   PUT <presigned-url> mit File-Body
   
4. Storage-Key wird in DB gespeichert
5. Öffentlicher Zugriff über Video-URL-Route:
   GET /api/video-url?key=<storage_key>
```

**Vorteil:** Vercel-Serverless-Limits umgangen (kein 4,5 MB Body-Limit für Videos).  
**Implementierung:** `lib/admin-upload-presigned.ts`, `lib/admin-upload-key.ts`  
**CORS:** Bucket muss `PUT` von der App-Domain erlauben → `docs/hetzner-presigned-upload-cors.md`

### Rich-Text-Editor

TipTap 3.x mit Extensions:
- StarterKit (Bold, Italic, Lists, Headings, etc.)
- Underline, TextAlign
- Link, Image
- Table (mit TableRow, TableCell, TableHeader)
- Placeholder

**Komponente:** `components/admin/RichTextEditor.tsx`  
**Renderer (Platform):** `components/platform/ArticleRenderer.tsx` (rendert gespeichertes HTML)

### Drag & Drop

dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`):  
**Komponente:** `components/admin/DraggableList.tsx`  
**Einsatz:** Modul-Reihenfolge, Arsenal-Karten-Sortierung

### Admin erstellen

Admin-Rechte werden manuell in der DB gesetzt:

```sql
UPDATE profiles SET is_admin = true WHERE id = '<user-uuid>';
```

Alternativ via Supabase-Dashboard oder Service-Role-Skript.
