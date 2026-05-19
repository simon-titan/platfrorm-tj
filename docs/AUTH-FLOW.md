# Auth-Flow & Autorisierung

## Auth-Provider

**Supabase Auth** — kein NextAuth, kein Passport.js.  
Supabase verwaltet Sessions über HTTP-Cookies (SSR-kompatibel via `@supabase/ssr`).

---

## Supabase-Clients

| Datei | Client-Typ | Verwendung |
|---|---|---|
| `lib/supabase/client.ts` | Browser-Client (`createBrowserClient`) | Client Components, Event-Handler |
| `lib/supabase/server.ts` | Server-Client (`createServerClient`) | Server Components, Route Handlers |
| `lib/supabase/service.ts` | Service-Role-Client | Serverseitige Ops, die RLS umgehen müssen |
| `lib/supabase/admin-auth.ts` | Service-Role-Client | Admin-Panel-spezifische DB-Zugriffe |
| `lib/supabase/middleware.ts` | SSR-Middleware-Client | Session-Cookie-Refresh in Next.js Middleware |

**Regel:** Service-Role-Key (`SUPABASE_SERVICE_ROLE_KEY`) nur serverseitig. Niemals im Browser-Bundle.

---

## Middleware (Session-Guard)

Die Next.js Middleware (`middleware.ts` im Root) prüft bei jedem Request:

1. Session via `lib/supabase/middleware.ts` aus Cookie lesen und refreshen
2. Kein Session-Cookie → Redirect auf `/einsteig` (für Platform-Routes)
3. Letzter Login wird in `lib/auth/middleware-last-login.ts` als `last_login_at` in `profiles` gespeichert (gedrosselt, nicht bei jedem Request)

**Geschützte Route-Gruppen:**
- `(platform)/` — alle Haupt-App-Seiten
- `(admin)/admin/` — Admin-Panel (zusätzlich `is_admin`-Check auf Profilebene)

**Öffentliche Route-Gruppen:**
- `(auth)/` — Login, Register, Einsteig
- `(marketing)/` — Landing, Funnels, Pricing
- Root (`/`) — Landing Page

---

## Login-Flow (E-Mail/Passwort)

```
1. User öffnet /einsteig oder /login
2. Supabase Auth: signInWithPassword(email, password)
3. Supabase setzt Session-Cookie
4. Middleware erkennt Session → erlaubt Zugriff auf (platform)/
5. Redirect zu /dashboard (oder Onboarding, falls unvollständig)
```

---

## Onboarding-Gate

Neue Nutzer müssen vor dem Dashboard-Zugang zwei Schritte abschließen:

1. **Intro-Video schauen** — `profiles.intro_video_watched = true`
2. **Codex / Usage Agreement akzeptieren** — `profiles.codex_accepted = true`

Die Middleware / Server-Component prüft diese Flags. Unvollständige Nutzer werden auf `/intro-video` umgeleitet.  
Tracking-Logic: `lib/intro-video.ts`

---

## Discord OAuth

Optionaler Connect-Flow für bezahlte Mitglieder:

```
1. User klickt "Discord verbinden" in Einstellungen
2. Redirect zu app/api/auth/discord/route.ts → Discord-OAuth-URL
3. Discord leitet zurück zu /api/auth/discord/callback
4. Callback:
   a. Access-Token von Discord holen
   b. Discord-User-Profil abrufen
   c. profiles.discord_id, discord_username, discord_access_token aktualisieren
   d. Discord-Rolle im Guild zuweisen (DISCORD_ROLE_ID via Bot-Token)
5. Redirect zurück zu /settings
```

**Env-Variablen:** `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, `DISCORD_ROLE_ID`, `DISCORD_REDIRECT_URI`  
**Helper:** `lib/discord.ts`

---

## Admin-Authentifizierung

Das Admin-Panel (`(admin)/admin/`) hat zwei Schutzebenen:

1. **Session-Prüfung:** Gleiche Middleware wie Platform-Routes
2. **`is_admin`-Check:** Server Components im Admin-Panel lesen `profiles.is_admin`. Kein Zugang → 404 oder Redirect

Der Admin-Panel-Client (`lib/supabase/admin-auth.ts`) nutzt den Service-Role-Key, damit Admin-Operationen keine RLS-Einschränkungen haben.

Admin-Nutzer werden manuell in der DB gesetzt: `UPDATE profiles SET is_admin = true WHERE id = '<uuid>'`

---

## Access-Control (Membership-Tier)

Zentralisiert in `lib/access-control/has-access.ts`:

```typescript
// Tier-Hierarchie:
// lifetime  → immer Zugang, kein Ablaufdatum
// ht_1on1   → Zugang bis access_until
// monthly   → Zugang bis access_until (Grace nach Payment-Failure: +48h)
// free       → kein Zugang zu Premium-Inhalten
```

Die Funktion `hasActivePaidAccess(userId)` gibt zurück:
- `hasAccess: boolean`
- `tier: 'free' | 'monthly' | 'lifetime' | 'ht_1on1'`
- `reason: AccessReason` (für Debugging/Logging)
- `accessUntil: Date | null`

Für Codepfade, die das Profil bereits geladen haben: synchroner `evaluateAccess(profile)`.

Details zu Membership-Stufen → `docs/MEMBERSHIP.md`

---

## CAPTCHA (Cloudflare Turnstile)

Öffentliche Formulare (Bewerbung, Registrierung) sind durch Cloudflare Turnstile geschützt:
- Frontend: `@types/turnstile.d.ts` + Turnstile-Widget
- Backend: Server-seitige Verifikation in `lib/security/turnstile.ts`
- Env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
