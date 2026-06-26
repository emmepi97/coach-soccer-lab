import { useEffect, useState } from 'react';
import { APP_NAME } from '../lib/supabaseClient';
import { signIn, signUp } from '../services/authService';
import { getAppSettings } from '../services/appSettingsService';
export default function AuthPage(){
 const [mode,setMode]=useState('login'), [settings,setSettings]=useState(null), [msg,setMsg]=useState('');
 useEffect(()=>{ getAppSettings().then(setSettings).catch(()=>{}); },[]);
 const registrationsClosed = settings && !settings.public_registrations_enabled;
 async function submit(e){ e.preventDefault(); const f=Object.fromEntries(new FormData(e.currentTarget).entries()); try{ mode==='login' ? await signIn(f.email,f.password) : await signUp(f.email,f.password,{full_name:f.full_name, club_name:f.club_name}); }catch(err){ setMsg(err.message); } }
 return <main className="authPage"><div className="authCard"><h1>{APP_NAME}</h1><p>Gestione professionale per allenatori: scouting, stagioni, staff, analytics, IPO ed Excel.</p>{msg&&<div className="notice dangerText">{msg}</div>}{mode==='register' && registrationsClosed ? <div className="locked">Le registrazioni sono momentaneamente chiuse. Richiedi un invito.</div> : <form onSubmit={submit} className="authForm">{mode==='register'&&<><input name="full_name" placeholder="Nome completo"/><input name="club_name" placeholder="Società / team"/></>}<input required name="email" type="email" placeholder="Email"/><input required name="password" type="password" placeholder="Password"/><button>{mode==='login'?'Entra':'Crea account'}</button></form>}<button className="ghost" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Crea un account':'Ho già un account'}</button></div></main>;
}
