import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getProfile } from '../services/usersService';
export function useCurrentUser(){
  const [session,setSession]=useState(null); const [profile,setProfile]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ let mounted=true; supabase.auth.getSession().then(async ({data})=>{ if(!mounted) return; setSession(data.session); if(data.session?.user) setProfile(await getProfile(data.session.user.id).catch(()=>null)); setLoading(false); }); const { data:{subscription} }=supabase.auth.onAuthStateChange(async (_e,s)=>{ setSession(s); setProfile(s?.user ? await getProfile(s.user.id).catch(()=>null) : null); setLoading(false); }); return()=>{ mounted=false; subscription.unsubscribe();};},[]);
  return { user:session?.user || null, session, profile, loading, isOwner:profile?.global_role==='owner', isAdmin:['owner','admin'].includes(profile?.global_role) };
}
