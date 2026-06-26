import { useEffect, useState } from 'react';
import DataTable from './Shared/DataTable';
import FilterBar from './Shared/FilterBar';
import Modal from './Shared/Modal';
import ConfirmDialog from './Shared/ConfirmDialog';
import EmptyState from './Shared/EmptyState';
import Badge from './Shared/Badge';
import { getSeasons, createSeason, updateSeason, deleteSeason, activateSeason } from '../services/seasonsService';

const fields = [
  {name:'name', label:'Nome stagione', placeholder:'es. 2025/2026', required:true},
  {name:'team_name', label:'Squadra', placeholder:'es. Faellese', required:true},
  {name:'category', label:'Categoria', placeholder:'es. Terza Categoria'},
  {name:'start_date', label:'Data inizio', type:'date'},
  {name:'end_date', label:'Data fine', type:'date'},
  {name:'notes', label:'Note', type:'textarea'}
];
const columns = [
  {key:'name', label:'Stagione'},
  {key:'team_name', label:'Squadra'},
  {key:'category', label:'Categoria'},
  {key:'is_active', label:'Attiva', render:r=>r.is_active ? <Badge type="success">Attiva</Badge> : '-'},
  {key:'is_shared', label:'Condivisa', render:r=>r.is_shared ? 'Sì' : 'No'}
];

function clean(payload){return Object.fromEntries(Object.entries(payload).filter(([,v])=>v!==''&&v!==undefined));}

export default function SeasonsSection({userDefaults={}, onSeasonChanged}){
 const [rows,setRows]=useState([]), [q,setQ]=useState(''), [editing,setEditing]=useState(null), [del,setDel]=useState(null), [msg,setMsg]=useState(''), [busy,setBusy]=useState(false);
 async function refresh(){ try{ setBusy(true); const data=await getSeasons(); const filtered=q ? data.filter(s=>[s.name,s.team_name,s.category].join(' ').toLowerCase().includes(q.toLowerCase())) : data; setRows(filtered); onSeasonChanged?.(data.find(s=>s.is_active)||data[0]||null); }catch(e){setMsg(e.message)} finally{setBusy(false);} }
 useEffect(()=>{refresh();},[q]);
 async function save(e){ e.preventDefault(); const form=clean(Object.fromEntries(new FormData(e.currentTarget).entries())); const payload=clean({...userDefaults,...form}); try{ editing?.id ? await updateSeason(editing.id,payload) : await createSeason(payload); setEditing(null); setMsg('Stagione salvata correttamente'); await refresh(); }catch(err){setMsg(err.message || 'Errore salvataggio stagione');} }
 async function activate(row){ try{ await activateSeason(row.id); setMsg(`Stagione attiva: ${row.name}`); await refresh(); }catch(err){setMsg(err.message || 'Errore attivazione stagione');} }
 async function confirmDelete(){ try{ await deleteSeason(del.id); setDel(null); setMsg('Stagione eliminata'); await refresh(); }catch(err){setMsg(err.message || 'Errore eliminazione stagione');} }
 return <div className="section"><div className="sectionHead"><div><h1>Stagioni</h1><p>Crea, modifica e attiva stagioni private o condivise con lo staff. Una stagione attiva collega risultati, presenze, rosa e analytics.</p></div><button onClick={()=>setEditing({})}>+ Nuova stagione</button></div>{msg&&<div className={msg.toLowerCase().includes('errore') || msg.toLowerCase().includes('could not') ? 'notice dangerText' : 'notice'}>{msg}</div>}<FilterBar value={q} onChange={setQ} placeholder="Cerca stagione, squadra, categoria..."/>{busy&&<div className="notice">Caricamento...</div>}{rows.length?<DataTable columns={columns} rows={rows} onEdit={setEditing} onDelete={setDel} rowActions={(r)=><button className={r.is_active?'secondary':'ghost'} onClick={()=>activate(r)}>{r.is_active?'Già attiva':'Attiva'}</button>}/>:<EmptyState title="Nessuna stagione" text="Crea la prima stagione per iniziare a usare risultati, presenze, rosa e analytics." action={<button onClick={()=>setEditing({})}>Crea stagione</button>}/>}<Modal open={!!editing} title={editing?.id?'Modifica stagione':'Nuova stagione'} onClose={()=>setEditing(null)}><form onSubmit={save} className="gridForm">{fields.map(f=><label key={f.name}>{f.label}{f.type==='textarea'?<textarea name={f.name} defaultValue={editing?.[f.name]||''} placeholder={f.placeholder||''}/>:<input name={f.name} type={f.type||'text'} defaultValue={editing?.[f.name]||''} placeholder={f.placeholder||''} required={!!f.required}/>}</label>)}<div className="formActions"><button>Salva</button><button type="button" className="secondary" onClick={()=>setEditing(null)}>Annulla</button></div></form></Modal><ConfirmDialog open={!!del} title="Eliminare stagione?" message="Attenzione: eliminando una stagione saranno coinvolti risultati, presenze, rosa, membri condivisi e analytics collegati." onConfirm={confirmDelete} onClose={()=>setDel(null)}/></div>;
}
