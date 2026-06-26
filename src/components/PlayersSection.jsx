import { useEffect, useMemo, useState } from 'react';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../services/playersService';
import DataTable from './Shared/DataTable';
import FilterBar from './Shared/FilterBar';
import Modal from './Shared/Modal';
import ConfirmDialog from './Shared/ConfirmDialog';
import EmptyState from './Shared/EmptyState';
import Badge from './Shared/Badge';
import StatCard from './Shared/StatCard';

const initialForm = { source_type:'mercato', piede_forte:'', ruolo:'', categoria:'' };
const roles = ['', 'Portiere', 'Difensore centrale', 'Terzino destro', 'Terzino sinistro', 'Centrocampista', 'Mediano', 'Mezzala', 'Trequartista', 'Esterno', 'Attaccante'];
const feet = ['', 'Destro', 'Sinistro', 'Ambidestro'];
const sources = [{value:'mercato', label:'Mercato / osservato'}, {value:'rosa', label:'Rosa squadra'}, {value:'entrambi', label:'Rosa + mercato'}];

function emptyToNull(obj){ return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k, v === '' ? null : v])); }
function shortId(id){ return id ? `${id.slice(0,8)}...${id.slice(-4)}` : 'Generato al salvataggio'; }
function copy(text){ navigator.clipboard?.writeText(text); }

export default function PlayersSection({userDefaults={}}){
 const [rows,setRows]=useState([]), [q,setQ]=useState(''), [editing,setEditing]=useState(null), [del,setDel]=useState(null), [msg,setMsg]=useState(''), [busy,setBusy]=useState(false);
 async function refresh(){ try{ setBusy(true); setRows(await getPlayers({q})); }catch(e){ setMsg(e.message || 'Errore caricamento giocatori'); } finally { setBusy(false); } }
 useEffect(()=>{ refresh(); },[q]);
 const stats = useMemo(()=>({
  total: rows.length,
  roster: rows.filter(p=>['rosa','entrambi'].includes(p.source_type)).length,
  market: rows.filter(p=>['mercato','entrambi'].includes(p.source_type)).length,
  roles: new Set(rows.map(p=>p.ruolo).filter(Boolean)).size
 }),[rows]);
 async function save(e){
  e.preventDefault();
  const form=Object.fromEntries(new FormData(e.currentTarget).entries());
  const payload=emptyToNull({...userDefaults, ...form});
  try{ setBusy(true); editing?.id ? await updatePlayer(editing.id,payload) : await createPlayer(payload); setEditing(null); setMsg('Giocatore salvato correttamente. ID univoco gestito da Supabase.'); await refresh(); }catch(err){ setMsg(err.message || 'Errore salvataggio giocatore'); } finally { setBusy(false); }
 }
 async function confirmDelete(){ try{ await deletePlayer(del.id); setDel(null); setMsg('Giocatore eliminato'); await refresh(); }catch(err){ setMsg(err.message || 'Errore eliminazione giocatore'); } }
 const columns=[
  {key:'id', label:'Player ID', render:r=><button className="idPill" title={r.id} onClick={()=>copy(r.id)}>{shortId(r.id)}</button>},
  {key:'nome', label:'Nome'}, {key:'cognome', label:'Cognome'}, {key:'ruolo', label:'Ruolo'}, {key:'categoria', label:'Categoria'}, {key:'squadra', label:'Squadra'},
  {key:'source_type', label:'Tipo', render:r=><Badge type={r.source_type==='rosa'?'success':r.source_type==='entrambi'?'warning':'default'}>{r.source_type || 'mercato'}</Badge>}
 ];
 return <div className="section playersPage">
  <div className="sectionHead"><div><h1>Database Giocatori</h1><p>Anagrafica unica con <strong>player_id</strong> generato automaticamente. Nome e cognome aiutano la ricerca, ma il collegamento tecnico vero è sempre l’ID univoco.</p></div><button onClick={()=>setEditing(initialForm)}>+ Nuovo giocatore</button></div>
  <div className="statsGrid compact"><StatCard label="Giocatori totali" value={stats.total}/><StatCard label="In rosa" value={stats.roster}/><StatCard label="Mercato/osservati" value={stats.market}/><StatCard label="Ruoli coperti" value={stats.roles}/></div>
  <div className="infoBox"><strong>Come funziona l’ID:</strong> ogni giocatore ha un UUID univoco tipo <code>2b9f...a81c</code>. L’UUID evita errori con omonimi. Puoi cliccare sul Player ID per copiarlo e usarlo in import Excel o collegamenti manuali.</div>
  {msg&&<div className={msg.toLowerCase().includes('errore') || msg.toLowerCase().includes('could not') ? 'notice dangerText' : 'notice'}>{msg}</div>}
  <FilterBar value={q} onChange={setQ} placeholder="Cerca nome, cognome, ruolo, categoria, squadra, piede forte..." />
  {busy&&<div className="notice">Operazione in corso...</div>}
  {rows.length?<DataTable columns={columns} rows={rows} onEdit={setEditing} onDelete={setDel}/>:<EmptyState title="Nessun giocatore" text="Inserisci il primo giocatore. Il player_id verrà creato automaticamente e sarà visibile in tabella." action={<button onClick={()=>setEditing(initialForm)}>Crea primo giocatore</button>}/>} 
  <Modal open={!!editing} title={editing?.id?'Modifica giocatore':'Nuovo giocatore'} onClose={()=>setEditing(null)}>
    <form className="gridForm playerForm" onSubmit={save}>
      <div className="formFull idBox"><span>Player ID univoco</span><strong>{shortId(editing?.id)}</strong>{editing?.id&&<button type="button" className="ghost" onClick={()=>copy(editing.id)}>Copia ID completo</button>}<small>Questo ID è la chiave tecnica. Non usare mai solo nome e cognome per collegare dati.</small></div>
      <label>Nome<input name="nome" defaultValue={editing?.nome||''} required placeholder="es. Marco"/></label>
      <label>Cognome<input name="cognome" defaultValue={editing?.cognome||''} required placeholder="es. Rossi"/></label>
      <label>Data nascita<input name="data_nascita" type="date" defaultValue={editing?.data_nascita||''}/></label>
      <label>Ruolo<select name="ruolo" defaultValue={editing?.ruolo||''}>{roles.map(r=><option key={r} value={r}>{r || 'Seleziona ruolo'}</option>)}</select></label>
      <label>Categoria<input name="categoria" defaultValue={editing?.categoria||''} placeholder="es. Juniores / Terza Categoria"/></label>
      <label>Squadra<input name="squadra" defaultValue={editing?.squadra||''} placeholder="es. Faellese"/></label>
      <label>Numero<input name="numero" defaultValue={editing?.numero||''} placeholder="es. 10"/></label>
      <label>Piede forte<select name="piede_forte" defaultValue={editing?.piede_forte||''}>{feet.map(f=><option key={f} value={f}>{f || 'Seleziona piede'}</option>)}</select></label>
      <label>Peso kg<input name="peso_kg" type="number" step="0.1" defaultValue={editing?.peso_kg||''}/></label>
      <label>Altezza cm<input name="altezza_cm" type="number" step="1" defaultValue={editing?.altezza_cm||''}/></label>
      <label>Nickname<input name="nickname" defaultValue={editing?.nickname||''}/></label>
      <label>Tipo giocatore<select name="source_type" defaultValue={editing?.source_type||'mercato'}>{sources.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
      <label className="formFull">Dettagli ruolo<textarea name="dettagli_ruolo" defaultValue={editing?.dettagli_ruolo||''} placeholder="Ruolo specifico, adattabilità, note tattiche..."/></label>
      <label className="formFull">Impressione generale<textarea name="impressione_generale" defaultValue={editing?.impressione_generale||''} placeholder="Sintesi tecnica e comportamentale..."/></label>
      <div className="formActions"><button disabled={busy}>Salva giocatore</button><button type="button" className="secondary" onClick={()=>setEditing(null)}>Annulla</button></div>
    </form>
  </Modal>
  <ConfirmDialog open={!!del} title="Eliminare giocatore?" message="Il giocatore potrebbe essere collegato a osservazioni, rosa, presenze o analytics. Conferma solo se sei sicuro." onConfirm={confirmDelete} onClose={()=>setDel(null)}/>
 </div>;
}
