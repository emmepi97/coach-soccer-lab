import { supabase, OWNER_EMAIL } from '../lib/supabaseClient';
import { getAppSettings } from './appSettingsService';

async function assertRegistrationAllowed(email) {
  const settings = await getAppSettings().catch(() => null);
  if (!settings) return;
  if (!settings.public_registrations_enabled) {
    throw new Error('Le registrazioni sono momentaneamente chiuse. Richiedi un invito.');
  }
  if (settings.invite_only_enabled) {
    const { data, error } = await supabase
      .from('app_invites')
      .select('id,email,status,expires_at')
      .eq('email', email)
      .eq('status', 'pending')
      .limit(1);
    if (error) throw error;
    const invite = data?.[0];
    const expired = invite?.expires_at && new Date(invite.expires_at) < new Date();
    if (!invite || expired) throw new Error('Registrazione consentita solo con invito valido.');
  }
}

export async function signIn(email,password){
  const { data, error } = await supabase.auth.signInWithPassword({email,password});
  if(error) throw error;
  return data;
}
export async function signUp(email,password,metadata={}){
  await assertRegistrationAllowed(email);
  const { data, error } = await supabase.auth.signUp({email,password,options:{data:{...metadata, owner_email: OWNER_EMAIL}}});
  if(error) throw error;
  return data;
}
export async function signOut(){ const { error } = await supabase.auth.signOut(); if(error) throw error; }
export async function getSession(){ const { data } = await supabase.auth.getSession(); return data.session; }
export function onAuthChange(cb){ return supabase.auth.onAuthStateChange((_event, session)=>cb(session)); }
