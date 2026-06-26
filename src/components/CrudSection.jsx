import { useEffect, useState } from 'react';
import DataTable from './Shared/DataTable';
import FilterBar from './Shared/FilterBar';
import Modal from './Shared/Modal';
import ConfirmDialog from './Shared/ConfirmDialog';
import EmptyState from './Shared/EmptyState';

export default function CrudSection({title,description,fields,columns,load,create,update,remove,extraActions,defaults={}, locked=false}){
 const [rows,setRows]=useState([]), [q,setQ]=useState(''), [editing,setEditing]=useState(null), [del,setDel]=useState(null), [msg,setMsg]=useState('');
 async function refresh(){ try{ setRows(await load({q})); }catch(e){ setMsg(e.message); } }
 useEffect(()=>{ refresh(); },[q]);
 const visible = rows;
 async function save(e){ e.preventDefault(); const form=Object.fromEntries(new FormData(e.currentTarget).entries()); const payload={...defaults,...form}; try{ editing?.id ? await update(editing.id,payload) : await create(payload); setEditing(null); setMsg('Salvato correttamente'); refresh(); }catch(err){ setMsg(err.message); } }
 async function confirmDelete(){ try{ await remove(del.id); setDel(null); setMsg('Eliminato correttamente'); refresh(); }catch(err){ setMsg(err.message); } }
 if(locked) return <div className="section"><h1>{title}</h1><p>{description}</p><div className="locked"><strong>Funzionalità disponibile in un piano superiore.</strong></div></div>;
 return <div className="section"><div className="sectionHead"><div><h1>{title}</h1><p>{description}</p></div><button onClick={()=>setEditing({})}>+ Nuovo</button></div>{msg&&<div className="notice">{msg}</div>}<FilterBar value={q} onChange={setQ}>{extraActions}</FilterBar>{visible.length?<DataTable columns={columns} rows={visible} onEdit={setEditing} onDelete={setDel}/>:<EmptyState action={<button onClick={()=>setEditing({})}>Crea primo record</button>}/>}<Modal open={!!editing} title={editing?.id?'Modifica':'Nuovo'} onClose={()=>setEditing(null)}><form onSubmit={save} className="gridForm">{fields.map(f=><label key={f.name}>{f.label}<input name={f.name} defaultValue={editing?.[f.name] ?? f.default ?? ''} type={f.type||'text'} /></label>)}<div className="formActions"><button>Salva</button><button type="button" className="secondary" onClick={()=>setEditing(null)}>Annulla</button></div></form></Modal><ConfirmDialog open={!!del} title="Conferma eliminazione" message="Sei sicuro? L’operazione può influenzare dati collegati." onConfirm={confirmDelete} onClose={()=>setDel(null)}/></div>;
}
