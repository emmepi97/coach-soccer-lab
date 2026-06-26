import { useEffect, useMemo, useState } from 'react';
import DataTable from './Shared/DataTable';
import FilterBar from './Shared/FilterBar';
import Modal from './Shared/Modal';
import ConfirmDialog from './Shared/ConfirmDialog';
import EmptyState from './Shared/EmptyState';

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== '')
  );
}

export default function CrudSection({
  title,
  description,
  fields,
  columns,
  load,
  create,
  update,
  remove,
  extraActions,
  defaults = {},
  locked = false,
  beforeSave,
  headerRight,
  emptyTitle = 'Nessun dato',
  emptyText = 'Aggiungi il primo elemento per iniziare.'
}){
 const [rows,setRows]=useState([]);
 const [q,setQ]=useState('');
 const [editing,setEditing]=useState(null);
 const [del,setDel]=useState(null);
 const [msg,setMsg]=useState('');
 const [busy,setBusy]=useState(false);

 const visible = useMemo(() => rows, [rows]);

 async function refresh(){
  try{
    setBusy(true);
    setRows(await load({q}));
  }catch(e){
    setMsg(e.message || 'Errore caricamento dati');
  } finally {
    setBusy(false);
  }
 }

 useEffect(()=>{ refresh(); },[q]);

 async function save(e){
  e.preventDefault();
  const form=Object.fromEntries(new FormData(e.currentTarget).entries());
  let payload=cleanPayload({...defaults,...form});
  if(beforeSave) payload = cleanPayload(await beforeSave(payload, editing));
  try{
    setBusy(true);
    editing?.id ? await update(editing.id,payload) : await create(payload);
    setEditing(null);
    setMsg('Salvato correttamente');
    await refresh();
  }catch(err){
    setMsg(err.message || 'Errore salvataggio');
  } finally {
    setBusy(false);
  }
 }

 async function confirmDelete(){
  try{
    setBusy(true);
    await remove(del.id);
    setDel(null);
    setMsg('Eliminato correttamente');
    await refresh();
  }catch(err){
    setMsg(err.message || 'Errore eliminazione');
  } finally {
    setBusy(false);
  }
 }

 if(locked) return <div className="section"><h1>{title}</h1><p>{description}</p><div className="locked"><strong>Funzionalità disponibile in un piano superiore.</strong></div></div>;

 return <div className="section">
  <div className="sectionHead">
    <div><h1>{title}</h1><p>{description}</p></div>
    <div className="headActions">{headerRight}<button onClick={()=>setEditing({})}>+ Nuovo</button></div>
  </div>
  {msg&&<div className={msg.toLowerCase().includes('errore') || msg.toLowerCase().includes('could not') ? 'notice dangerText' : 'notice'}>{msg}</div>}
  <FilterBar value={q} onChange={setQ}>{extraActions}</FilterBar>
  {busy && <div className="notice">Operazione in corso...</div>}
  {visible.length?<DataTable columns={columns} rows={visible} onEdit={setEditing} onDelete={setDel}/>:<EmptyState title={emptyTitle} text={emptyText} action={<button onClick={()=>setEditing({})}>Crea primo record</button>}/>} 
  <Modal open={!!editing} title={editing?.id?'Modifica':'Nuovo'} onClose={()=>setEditing(null)}>
    <form onSubmit={save} className="gridForm">
      {fields.map(f=><label key={f.name}>{f.label}{f.type === 'textarea' ? <textarea name={f.name} defaultValue={editing?.[f.name] ?? f.default ?? ''} placeholder={f.placeholder || ''}/> : f.type === 'select' ? <select name={f.name} defaultValue={editing?.[f.name] ?? f.default ?? ''}>{(f.options||[]).map(o=><option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select> : <input name={f.name} defaultValue={editing?.[f.name] ?? f.default ?? ''} type={f.type||'text'} placeholder={f.placeholder || ''} required={!!f.required}/>}</label>)}
      <div className="formActions"><button disabled={busy}>Salva</button><button type="button" className="secondary" onClick={()=>setEditing(null)}>Annulla</button></div>
    </form>
  </Modal>
  <ConfirmDialog open={!!del} title="Conferma eliminazione" message="Sei sicuro? L’operazione può influenzare dati collegati. Se stai eliminando una stagione, verifica prima risultati, presenze, rosa, staff e analytics." onConfirm={confirmDelete} onClose={()=>setDel(null)}/>
 </div>;
}
