import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variabili Supabase mancanti. Copia .env.example in .env e configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseAnonKey || 'missing-key');
export const APP_NAME = 'COACH SOCCER LAB';
export const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || '';
