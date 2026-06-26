# COACH SOCCER LAB

Web app professionale per allenatori: database giocatori, osservazioni mercato/scouting, stagioni, staff condiviso, risultati, presenze, rosa, analytics, eventi IPO, import/export Excel e area Owner Admin.

## Stack

React + Vite, Supabase Auth/Database/RLS, SheetJS/XLSX, CSS custom mobile-first, GitHub e Vercel.

## Installazione locale

```bash
npm install
cp .env.example .env
npm run dev
```

Compila `.env` con:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OWNER_EMAIL=la-tua-email@example.com
```

## Configurazione Supabase

Crea un progetto Supabase, apri SQL Editor e lancia tutto il file `supabase/schema.sql`. Lo schema crea tabelle, indici, funzioni, trigger, seed iniziali e Row Level Security.

Il primo utente registrato con email uguale a `VITE_OWNER_EMAIL` viene marcato come `profiles.global_role = 'owner'` tramite trigger. In alternativa puoi aggiornare manualmente il profilo una sola volta da SQL.

## Deploy GitHub e Vercel

Crea un repository GitHub, carica il progetto e poi importa il repository su Vercel. Su Vercel imposta le stesse variabili ambiente del file `.env.example`. Il comando build è `npm run build`, output `dist`.

## Struttura database

Le tabelle principali sono `profiles`, `app_settings`, `app_invites`, `user_subscriptions`, `subscription_plans`, `feature_flags`, `players`, `observations`, `seasons`, `season_members`, `season_roster`, `season_matches`, `season_attendance`, `season_analytics_events`, `ipo_event_types`.

I giocatori sono collegati tramite `player_id`, non tramite nome/cognome. Le stagioni sono collegate tramite `season_id`. Le stagioni condivise usano `season_members` con ruoli owner, admin, editor, analyst e viewer.

## Row Level Security

RLS è abilitata su tutte le tabelle operative. Un utente vede i propri dati e le stagioni condivise tramite `season_members`. L’area Owner Admin usa policy dedicate basate su `profiles.global_role in ('owner','admin')`.

## Import/export Excel

Il servizio `src/services/excelService.js` usa SheetJS/XLSX. Sono presenti template per giocatori, osservazioni, risultati, presenze, rosa, analytics, eventi IPO e membri stagione. La normalizzazione delle colonne gestisce maiuscole, minuscole, spazi e underscore. La validazione restituisce righe importabili, righe scartate ed errori.

## Condivisione stagione/staff

Ogni stagione ha `owner_user_id`. Gli inviti staff sono salvati in `season_members`, anche se l’utente non è ancora registrato tramite `invited_email`. Quando l’utente si registra, il trigger collega inviti pending alla nuova `user_id`.

## Owner Admin

Visibile solo a `profiles.global_role = 'owner'`. Include Panoramica, Impostazioni app, Utenti, Inviti, Piani, Feature flags e Monetizzazione. Da qui puoi gestire registrazioni pubbliche, invite-only, beta, manutenzione, piani, feature flags e utenti.

## Feature flags e piani

I piani sono in `subscription_plans`, non hardcodati solo nel frontend. Le feature sono in `feature_flags`. Gli hook `useCurrentUserPlan` e `useFeatureAccess` espongono `canUseFeature`, `isOwner`, `isAdmin`, `getPlanLimits` e `checkLimit`.

## Monetizzazione e Stripe futuro

La versione iniziale non integra pagamenti reali. La struttura è pronta per aggiungere Stripe Checkout, Customer Portal e webhook tramite Supabase Edge Functions o API serverless. I piani consigliati sono Free, Pro, Team, Club/Future e Founder/Early Adopter.

## Nota tecnica

Questa codebase è una base completa e scalabile pronta per VS Code, Supabase e Vercel. Alcune operazioni avanzate di amministrazione utenti Supabase Auth possono richiedere Edge Functions con service role key: i servizi frontend e le policy sono già organizzati per questa evoluzione.
