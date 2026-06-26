import { useEffect, useState } from 'react';
import StatCard from './Shared/StatCard';
import OnboardingPanel from './OnboardingPanel';
import { getPlayers } from '../services/playersService';
import { getObservations } from '../services/observationsService';
import { getSeasons } from '../services/seasonsService';
import { getMatches } from '../services/matchesService';
import { getAnalyticsEvents, summarizeAnalytics } from '../services/analyticsService';
export default function Dashboard({activeSeason,setActive}){
 const [s,setS]=useState({players:[],obs:[],seasons:[],matches:[],events:[],analytics:{}});
 useEffect(()=>{ async function run(){ const [players,obs,seasons]=await Promise.all([getPlayers(),getObservations(),getSeasons()]); let matches=[], events=[]; if(activeSeason){ matches=await getMatches(activeSeason.id); events=await getAnalyticsEvents(activeSeason.id); } setS({players,obs,seasons,matches,events,analytics:summarizeAnalytics(events)}); } run().catch(()=>{}); },[activeSeason]);
 const wins=(s.matches||[]).filter(m=>m.esito==='vittoria').length, draws=(s.matches||[]).filter(m=>m.esito==='pareggio').length, losses=(s.matches||[]).filter(m=>m.esito==='sconfitta').length;
 const gf=(s.matches||[]).reduce((a,m)=>a+Number(m.gol_fatti||0),0), gs=(s.matches||[]).reduce((a,m)=>a+Number(m.gol_subiti||0),0);
 return <div className="section">
  <div className="hero"><h1>Dashboard {activeSeason?`- ${activeSeason.name}`:''}</h1><p>{activeSeason ? `Stagione attiva: ${activeSeason.team_name || ''} ${activeSeason.category || ''}` : 'Crea una stagione per iniziare a collegare risultati, presenze, rosa e analytics.'}</p><div className="quick"><button onClick={()=>setActive('observations')}>+ Osservazione</button><button onClick={()=>setActive('results')}>+ Risultato</button><button onClick={()=>setActive('attendance')}>+ Presenza</button><button onClick={()=>setActive('analytics')}>+ Evento analytics</button></div></div>
  <OnboardingPanel activeSeason={activeSeason} stats={{players:s.players?.length, observations:s.obs?.length, matches:s.matches?.length}} setActive={setActive}/>
  <div className="statsGrid"><StatCard label="Giocatori database" value={s.players?.length}/><StatCard label="Osservazioni" value={s.obs?.length}/><StatCard label="Stagioni" value={s.seasons?.length}/><StatCard label="Partite" value={s.matches?.length}/><StatCard label="Record V/P/S" value={`${wins}/${draws}/${losses}`}/><StatCard label="Gol fatti/subiti" value={`${gf}/${gs}`}/><StatCard label="Eventi analytics" value={s.events?.length}/><StatCard label="IPO nostro / avversario" value={`${s.analytics?.ipo_nostro||0} / ${s.analytics?.ipo_avversario||0}`}/></div>
 </div>;
}
