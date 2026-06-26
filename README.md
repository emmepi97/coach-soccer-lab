# COACH SOCCER LAB

Web app professionale per allenatori: database giocatori, osservazioni mercato/scouting, stagioni, staff condiviso, risultati, presenze, rosa, analytics, eventi IPO, import/export Excel e area Owner Admin.

## Cosa è stato corretto in questa versione

Questa versione risolve l'errore visto nella sezione Stagioni:

```text
Could not find the 'created_by' column of 'seasons' in the schema cache
```

Il problema nasceva perché il frontend inviava campi di audit (`created_by`, `updated_by`) anche alla tabella `seasons`, che non li prevede. Ora ogni servizio filtra i campi consentiti prima di inviare dati a Supabase.

Sono stati aggiunti anche:

- onboarding iniziale in dashboard;
- gestione stagione attiva più chiara;
- pulsante Attiva nella sezione Stagioni;
- blocco elegante se una sezione richiede una stagione attiva;
- payload Supabase sanitizzati per evitare errori di colonne non presenti;
- `supabase/fix_current_database.sql` per correggere database già creati;
- fix definitivo del campo SQL riservato `cross`, rinominato in `cross_value`.

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

## Se hai già il database Supabase creato

Prima di aggiornare il frontend su Vercel, esegui in Supabase SQL Editor:

```text
supabase/fix_current_database.sql
```

Questo file ripristina permessi, aggiorna il trigger di registrazione, rinomina eventuale colonna `cross` in `cross_value` e ricarica la schema cache di PostgREST.

## Se crei un database nuovo

Esegui direttamente:

```text
supabase/schema.sql
```

Lo schema crea tabelle, indici, funzioni, trigger, seed iniziali, policy RLS, grants e refresh PostgREST.

## Deploy GitHub e Vercel

Carica il progetto su GitHub e importa il repository su Vercel. Su Vercel imposta queste variabili ambiente:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_OWNER_EMAIL
```

Il comando build è:

```bash
npm run build
```

L'output directory è:

```bash
dist
```

## Configurazione Supabase Auth

In Supabase imposta:

```text
Authentication → URL Configuration
```

Site URL:

```text
https://tuo-progetto.vercel.app
```

Redirect URLs consigliati:

```text
https://tuo-progetto.vercel.app
https://tuo-progetto.vercel.app/*
http://localhost:5173
http://localhost:5173/*
```

Per test iniziale puoi disattivare la conferma email da Authentication → Providers → Email.

## Uso consigliato dopo il primo login

Entra con la email indicata in `VITE_OWNER_EMAIL`. Se tutto è corretto vedrai la sezione Owner Admin nella sidebar.

Poi usa la sequenza consigliata:

1. crea una stagione;
2. rendila attiva;
3. inserisci almeno 3 giocatori;
4. registra una osservazione;
5. inserisci un risultato;
6. inizia a usare presenze, rosa e analytics.

## Struttura database

Le tabelle principali sono `profiles`, `app_settings`, `app_invites`, `user_subscriptions`, `subscription_plans`, `feature_flags`, `players`, `observations`, `seasons`, `season_members`, `season_roster`, `season_matches`, `season_attendance`, `season_analytics_events`, `ipo_event_types`.

I giocatori sono collegati tramite `player_id`, non tramite nome/cognome. Le stagioni sono collegate tramite `season_id`. Le stagioni condivise usano `season_members` con ruoli owner, admin, editor, analyst e viewer.

## Row Level Security

RLS è abilitata su tutte le tabelle operative. Un utente vede i propri dati e le stagioni condivise tramite `season_members`. L'area Owner Admin usa policy dedicate basate su `profiles.global_role in ('owner','admin')`.

## Import/export Excel

Il servizio `src/services/excelService.js` usa SheetJS/XLSX. Sono presenti template per giocatori, osservazioni, risultati, presenze, rosa, analytics, eventi IPO e membri stagione. La normalizzazione delle colonne gestisce maiuscole, minuscole, spazi e underscore.

## Monetizzazione futura

La versione iniziale non integra pagamenti reali. La struttura è pronta per aggiungere Stripe Checkout, Customer Portal e webhook tramite Supabase Edge Functions o API serverless.
