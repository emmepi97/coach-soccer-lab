export default function OnboardingPanel({activeSeason, stats={}, setActive}){
 const steps = [
  {done: !!activeSeason, label:'Crea e attiva una stagione', action:'Stagioni', tab:'seasons'},
  {done: (stats.players||0) >= 3, label:'Inserisci almeno 3 giocatori', action:'Database Giocatori', tab:'players'},
  {done: (stats.observations||0) >= 1, label:'Registra la prima osservazione', action:'Osservazioni', tab:'observations'},
  {done: (stats.matches||0) >= 1, label:'Inserisci il primo risultato', action:'Risultati', tab:'results'}
 ];
 if(steps.every(s=>s.done)) return null;
 return <div className="onboarding"><div><h2>Setup iniziale</h2><p>Completa questi passaggi per iniziare a usare COACH SOCCER LAB bene, senza perderti.</p></div><div className="onboardingSteps">{steps.map(s=><button key={s.label} className={s.done?'doneStep':'todoStep'} onClick={()=>setActive(s.tab)}><span>{s.done?'✓':'○'}</span>{s.label}<small>{s.action}</small></button>)}</div></div>;
}
