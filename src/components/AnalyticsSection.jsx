import { useEffect, useMemo, useState } from 'react';
import { getAnalyticsEvents, createAnalyticsEvent, updateAnalyticsEvent, deleteAnalyticsEvent, summarizeAnalytics } from '../services/analyticsService';
import { getIpoEventTypes } from '../services/ipoEventsService';
import DataTable from './Shared/DataTable';
import FilterBar from './Shared/FilterBar';
import Modal from './Shared/Modal';
import ConfirmDialog from './Shared/ConfirmDialog';
import EmptyState from './Shared/EmptyState';
import StatCard from './Shared/StatCard';
import Badge from './Shared/Badge';
import { BarList, CompareBars, PitchHeatmap, MiniTimeline } from './Shared/SimpleCharts';

const blankEvent = { squadra:'Noi', tipo_evento:'', punteggio_ipo:'', data:'', gara:'', risultato:'', competizione:'', giornata:'', minuto_evento:'', zona_evento:'' };
const PERIODS = [
  {label:"P1 1'-15'", min:1, max:15},
  {label:"P2 16'-30'", min:16, max:30},
  {label:"P3 31'-45'", min:31, max:45},
  {label:"P4 46'-60'", min:46, max:60},
  {label:"P5 61'-75'", min:61, max:75},
  {label:"P6 76'-90+'", min:76, max:140}
];
const SHOT_EVENTS = ['Tiro in area di rigore','Tiro da fuori area','Rigore','Occasione da goal'];

function clean(obj){ return Object.fromEntries(Object.entries(obj).filter(([,v])=>v!==''&&v!==undefined&&v!==null)); }
function isNoi(row){ return (row.squadra || 'Noi') === 'Noi'; }
function num(v){ const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function isShot(row){ return SHOT_EVENTS.includes(row.tipo_evento) || row.esito_tiro || row.tipologia_tiro; }
function periodOf(minute){ const m = num(minute); return PERIODS.find(p => m >= p.min && m <= p.max)?.label || 'N/D'; }
function groupCount(rows, key){ const map={}; rows.forEach(r=>{ const k=r[key]||'Non specificato'; map[k]=(map[k]||0)+1; }); return Object.entries(map).map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value); }
function groupSum(rows, key, sumKey='punteggio_ipo'){ const map={}; rows.forEach(r=>{ const k=r[key]||'Non specificato'; map[k]=(map[k]||0)+num(r[sumKey]); }); return Object.entries(map).map(([label,value])=>({label,value:Math.round(value*100)/100})).sort((a,b)=>b.value-a.value); }
function zoneValues(rows, key){ const out={}; rows.forEach(r=>{ const z=Number(r[key]); if(z>=1 && z<=12) out[z]=(out[z]||0)+num(r.punteggio_ipo || 1); }); return out; }
function byPeriod(rows){ return PERIODS.map(p=>({ label:p.label, a:rows.filter(r=>isNoi(r) && periodOf(r.minuto_evento)===p.label).reduce((s,r)=>s+num(r.punteggio_ipo),0), b:rows.filter(r=>!isNoi(r) && periodOf(r.minuto_evento)===p.label).reduce((s,r)=>s+num(r.punteggio_ipo),0) })); }
function shotByPeriod(rows){ return PERIODS.map(p=>({ label:p.label, a:rows.filter(r=>isNoi(r) && isShot(r) && periodOf(r.minuto_evento)===p.label).length, b:rows.filter(r=>!isNoi(r) && isShot(r) && periodOf(r.minuto_evento)===p.label).length })); }
function density(rows){ const buckets={}; for(let i=0;i<=90;i+=5) buckets[`${i}'`]=0; rows.forEach(r=>{ const b=Math.floor(num(r.minuto_evento)/5)*5; const k=`${Math.max(0, Math.min(90,b))}'`; buckets[k]=(buckets[k]||0)+1; }); return Object.entries(buckets).map(([label,value])=>({label,value})); }
function eventLabel(row){ return row.giocatore_evento || row.cognome_nome || 'Non specificato'; }
function matchLabel(row){ return row.gara || `${row.competizione || ''} ${row.giornata || ''}`.trim() || 'Non specificato'; }

function Indicator({title, children, hint}){
  return <div className="analysisCard"><h2>{title}</h2>{children}{hint && <p className="analysisHint">{hint}</p>}</div>;
}

export default function AnalyticsSection({activeSeason,userDefaults={},locked=false}){
 const [rows,setRows]=useState([]), [types,setTypes]=useState([]), [q,setQ]=useState(''), [editing,setEditing]=useState(null), [del,setDel]=useState(null), [msg,setMsg]=useState(''), [busy,setBusy]=useState(false), [form,setForm]=useState(blankEvent);
 async function refresh(){ if(!activeSeason) return; try{ setBusy(true); const [events, ipoTypes] = await Promise.all([getAnalyticsEvents(activeSeason.id), getIpoEventTypes()]); setRows(events); setTypes(ipoTypes.filter(t=>t.active)); }catch(e){ setMsg(e.message || 'Errore caricamento analytics'); } finally { setBusy(false); } }
 useEffect(()=>{ refresh(); },[activeSeason?.id]);
 useEffect(()=>{ setForm(editing || blankEvent); },[editing]);

 const filtered = useMemo(()=> q ? rows.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase())) : rows, [rows,q]);
 const summary = useMemo(()=>summarizeAnalytics(filtered),[filtered]);
 const noi = filtered.filter(isNoi);
 const avv = filtered.filter(r=>!isNoi(r));
 const matchCount = new Set(filtered.map(matchLabel).filter(Boolean)).size;
 const ipoTotal = summary.ipo_nostro + summary.ipo_avversario;
 const ipoShare = ipoTotal ? Math.round(summary.ipo_nostro / ipoTotal * 100) : 0;
 const ipoPerMatch = matchCount ? Math.round((summary.ipo_nostro/matchCount)*100)/100 : 0;
 const shotsNoi = noi.filter(isShot);
 const shotsAvv = avv.filter(isShot);
 const shotsOnTarget = shotsNoi.filter(r=>['Gol','Parato','In porta'].includes(r.esito_tiro)).length;
 const shotAccuracy = shotsNoi.length ? Math.round(shotsOnTarget/shotsNoi.length*100) : 0;
 const goalChancesFor = noi.filter(r=>r.tipo_evento==='Occasione da goal').length;
 const goalChancesAgainst = avv.filter(r=>r.tipo_evento==='Occasione da goal').length;
 const byType = groupCount(filtered,'tipo_evento').slice(0,10);
 const byPlayer = groupSum(noi.map(r=>({...r, player_label:eventLabel(r)})),'player_label').slice(0,10);
 const byMatch = groupSum(filtered.map(r=>({...r, match_label:matchLabel(r)})),'match_label').slice(0,10);
 const byCompetition = groupSum(filtered,'competizione').slice(0,8);
 const byResultNoi = groupCount(shotsNoi,'esito_tiro');
 const byResultAvv = groupCount(shotsAvv,'esito_tiro');
 const byShotType = groupCount(shotsNoi,'tipologia_tiro');
 const inactive = groupCount(noi.filter(r=>r.esito_palla_inattiva),'esito_palla_inattiva');
 const periodIpo = byPeriod(filtered);
 const periodShots = shotByPeriod(filtered);
 const eventDensity = density(filtered);
 const progressive = Array.from(new Set(filtered.map(matchLabel))).filter(Boolean).map(label=>({ label, a: noi.filter(r=>matchLabel(r)===label).reduce((s,r)=>s+num(r.punteggio_ipo),0), b: avv.filter(r=>matchLabel(r)===label).reduce((s,r)=>s+num(r.punteggio_ipo),0) }));

 const columns=[
  {key:'data',label:'Data'}, {key:'gara',label:'Gara'}, {key:'squadra',label:'Squadra', render:r=><Badge type={isNoi(r)?'success':'danger'}>{r.squadra}</Badge>}, {key:'tipo_evento',label:'Evento'}, {key:'giocatore_evento',label:'Giocatore'}, {key:'minuto_evento',label:'Min'}, {key:'zona_evento',label:'Zona'}, {key:'punteggio_ipo',label:'IPO'}
 ];
 function onTypeChange(value){ const t=types.find(x=>x.event_name===value); setForm(f=>({...f, tipo_evento:value, ipo_event_type_id:t?.id || '', punteggio_ipo:t?.default_ipo_score ?? f.punteggio_ipo})); }
 async function save(e){ e.preventDefault(); const payload=clean({...userDefaults, season_id:activeSeason.id, ...form}); try{ setBusy(true); editing?.id ? await updateAnalyticsEvent(editing.id,payload) : await createAnalyticsEvent(payload); setEditing(null); setMsg('Evento analytics salvato'); await refresh(); }catch(err){ setMsg(err.message || 'Errore salvataggio evento'); } finally { setBusy(false); } }
 async function confirmDelete(){ try{ await deleteAnalyticsEvent(del.id); setDel(null); setMsg('Evento eliminato'); await refresh(); }catch(err){ setMsg(err.message || 'Errore eliminazione evento'); } }
 if(locked) return <div className="section"><h1>Analytics Stagione</h1><div className="locked">Funzionalità disponibile in un piano superiore.</div></div>;
 return <div className="section analyticsLabPage">
  <div className="sectionHead"><div><h1>Analytics Stagione</h1><p>Dashboard stile CoachLab: IPO, heatmap, periodi, tiri, eventi, giocatori e registro completo della stagione attiva.</p></div><button onClick={()=>setEditing(blankEvent)}>+ Nuovo evento</button></div>
  {msg&&<div className={msg.toLowerCase().includes('errore') || msg.toLowerCase().includes('could not') ? 'notice dangerText' : 'notice'}>{msg}</div>}
  <div className="statsGrid compact"><StatCard label="IPO NOI" value={summary.ipo_nostro}/><StatCard label="IPO Avversario" value={summary.ipo_avversario}/><StatCard label="Quota NOI" value={`${ipoShare}%`}/><StatCard label="IPO medio/gara" value={ipoPerMatch}/><StatCard label="Tiri NOI" value={shotsNoi.length}/><StatCard label="Precisione tiri" value={`${shotAccuracy}%`}/><StatCard label="Occasioni create" value={goalChancesFor}/><StatCard label="Occasioni subite" value={goalChancesAgainst}/></div>

  <details className="analysisGroup" open><summary><span>🎯 IPO & Pericolosità</span><small>Sintesi offensiva NOI + confronto avversario</small></summary>
    <div className="analysisGrid twoOne"><Indicator title="IPO offensivo"><div className="ipoPanel"><strong>{summary.ipo_nostro}</strong><span>NOI</span><em>{summary.ipo_nostro >= summary.ipo_avversario ? 'Iniziativa nostra' : 'Avversario più pericoloso'}</em></div><CompareBars leftLabel="NOI" rightLabel="Avversario" left={summary.ipo_nostro} right={summary.ipo_avversario}/></Indicator><Indicator title="IPO per partita" hint="Da usare per capire quali gare hanno generato o concesso più pericolo."><BarList items={byMatch}/></Indicator></div>
  </details>

  <details className="analysisGroup" open><summary><span>🗺 Heatmap Pericolosità</span><small>Zone calde: dove nasce il pericolo</small></summary>
    <div className="analysisGrid three"><Indicator title="Zona evento — NOI" hint="Zone rosse = più IPO creato."><PitchHeatmap values={zoneValues(noi,'zona_evento')} title="Zona evento NOI"/></Indicator><Indicator title="Zona evento — Avversario" hint="Dove concedi occasioni."><PitchHeatmap values={zoneValues(avv,'zona_evento')} title="Zona evento avversario"/></Indicator><Indicator title="Zona rifinitura" hint="Dove nasce l’ultima giocata."><PitchHeatmap values={zoneValues(noi,'zona_rifinitura')} title="Zona rifinitura"/></Indicator><Indicator title="Zona recupero palla" hint="Recuperi alti = transizioni più pericolose."><PitchHeatmap values={zoneValues(noi,'zona_recupero_palla')} title="Zona recupero"/></Indicator><Indicator title="Zona inizio azione" hint="Da dove partono le azioni pericolose."><PitchHeatmap values={zoneValues(noi,'zona_inizio_azione')} title="Zona inizio"/></Indicator></div>
  </details>

  <details className="analysisGroup" open><summary><span>⏱ Temporale & Intensità</span><small>Quando crei e quando soffri</small></summary>
    <div className="analysisGrid two"><Indicator title="IPO per periodo — NOI vs AVV" hint="Calo nei periodi finali = possibile problema fisico o gestione cambi."><MiniTimeline items={periodIpo}/></Indicator><Indicator title="Densità eventi per minuto" hint="Picchi = fasi molto intense o caotiche."><BarList items={eventDensity}/></Indicator></div>
  </details>

  <details className="analysisGroup"><summary><span>🥅 Tiri</span><small>Quantità, qualità e precisione</small></summary>
    <div className="analysisGrid three"><Indicator title="Tiri per periodo" hint="Confronta quando tiri e quando subisci tiri."><MiniTimeline items={periodShots}/></Indicator><Indicator title="Esito tiri — NOI"><BarList items={byResultNoi}/></Indicator><Indicator title="Esito tiri — Avversario"><BarList items={byResultAvv}/></Indicator><Indicator title="Tipologia tiro — NOI"><BarList items={byShotType}/></Indicator></div>
  </details>

  <details className="analysisGroup"><summary><span>📊 Distribuzione & Contributi</span><small>Mix eventi + chi crea pericolo</small></summary>
    <div className="analysisGrid three"><Indicator title="Tipi di evento"><BarList items={byType}/></Indicator><Indicator title="Palle inattive — NOI"><BarList items={inactive}/></Indicator><Indicator title="IPO per giocatore"><BarList items={byPlayer}/></Indicator><Indicator title="IPO per competizione"><BarList items={byCompetition}/></Indicator><Indicator title="Progressivo per gara"><MiniTimeline items={progressive}/></Indicator></div>
  </details>

  <div className="sectionSubHead"><div><h2>Registro Eventi Analytics</h2><p>Dati di dettaglio per controllare i grafici.</p></div></div>
  <FilterBar value={q} onChange={setQ} placeholder="Filtra per gara, competizione, giocatore, evento, nota..." />
  {busy&&<div className="notice">Operazione in corso...</div>}
  {filtered.length?<DataTable columns={columns} rows={filtered} onEdit={setEditing} onDelete={setDel}/>:<EmptyState title="Nessun evento analytics" text="Inserisci il primo evento per vedere dashboard, heatmap e indicatori IPO." action={<button onClick={()=>setEditing(blankEvent)}>Crea evento analytics</button>}/>} 

  <Modal open={!!editing} title={editing?.id?'Modifica evento analytics':'Nuovo evento analytics'} onClose={()=>setEditing(null)}>
    <form className="gridForm analyticsForm" onSubmit={save}>
      <label>Data<input type="date" value={form.data||''} onChange={e=>setForm({...form,data:e.target.value})}/></label>
      <label>Gara<input value={form.gara||''} onChange={e=>setForm({...form,gara:e.target.value})} placeholder="es. Noi vs FC Siena"/></label>
      <label>Risultato<input value={form.risultato||''} onChange={e=>setForm({...form,risultato:e.target.value})} placeholder="es. 2-1"/></label>
      <label>Competizione<input value={form.competizione||''} onChange={e=>setForm({...form,competizione:e.target.value})}/></label>
      <label>Giornata<input value={form.giornata||''} onChange={e=>setForm({...form,giornata:e.target.value})}/></label>
      <label>Squadra<select value={form.squadra||'Noi'} onChange={e=>setForm({...form,squadra:e.target.value})}><option>Noi</option><option>Avversario</option></select></label>
      <label>Tipo evento<select value={form.tipo_evento||''} onChange={e=>onTypeChange(e.target.value)}><option value="">Seleziona evento IPO</option>{types.map(t=><option key={t.id} value={t.event_name}>{t.event_name} — IPO {t.default_ipo_score}</option>)}</select></label>
      <label>Punteggio IPO<input type="number" step="0.1" value={form.punteggio_ipo||''} onChange={e=>setForm({...form,punteggio_ipo:e.target.value})}/></label>
      <label>Giocatore evento<input value={form.giocatore_evento||''} onChange={e=>setForm({...form,giocatore_evento:e.target.value})} placeholder="es. Rossi Marco"/></label>
      <label>COGNOME_NOME<input value={form.cognome_nome||''} onChange={e=>setForm({...form,cognome_nome:e.target.value})} placeholder="ROSSI_MARCO"/></label>
      <label>Minuto<input type="number" value={form.minuto_evento||''} onChange={e=>setForm({...form,minuto_evento:e.target.value})}/></label>
      <label>Zona evento<input value={form.zona_evento||''} onChange={e=>setForm({...form,zona_evento:e.target.value})} placeholder="1-12"/></label>
      <label>Esito tiro<input value={form.esito_tiro||''} onChange={e=>setForm({...form,esito_tiro:e.target.value})} placeholder="Gol / Parato / Fuori..."/></label>
      <label>Tipologia tiro<input value={form.tipologia_tiro||''} onChange={e=>setForm({...form,tipologia_tiro:e.target.value})} placeholder="Destro / Sinistro / Testa..."/></label>
      <label>Esito palla inattiva<input value={form.esito_palla_inattiva||''} onChange={e=>setForm({...form,esito_palla_inattiva:e.target.value})}/></label>
      <label>Zona inizio azione<input value={form.zona_inizio_azione||''} onChange={e=>setForm({...form,zona_inizio_azione:e.target.value})}/></label>
      <label>Giocatore rifinitura<input value={form.giocatore_rifinitura||''} onChange={e=>setForm({...form,giocatore_rifinitura:e.target.value})}/></label>
      <label>Zona rifinitura<input value={form.zona_rifinitura||''} onChange={e=>setForm({...form,zona_rifinitura:e.target.value})}/></label>
      <label>Zona recupero palla<input value={form.zona_recupero_palla||''} onChange={e=>setForm({...form,zona_recupero_palla:e.target.value})}/></label>
      <label className="formFull">Nota evento<textarea value={form.nota_evento||''} onChange={e=>setForm({...form,note_evento:e.target.value, nota_evento:e.target.value})}/></label>
      <div className="formActions"><button disabled={busy}>Salva evento</button><button type="button" className="secondary" onClick={()=>setEditing(null)}>Annulla</button></div>
    </form>
  </Modal>
  <ConfirmDialog open={!!del} title="Eliminare evento analytics?" message="Confermi l’eliminazione dell’evento?" onConfirm={confirmDelete} onClose={()=>setDel(null)}/>
 </div>;
}
