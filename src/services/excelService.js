import * as XLSX from 'xlsx';
import { OBSERVATION_FIELDS, PLAYER_FIELDS, MATCH_FIELDS, ATTENDANCE_FIELDS, ROSTER_FIELDS, ANALYTICS_FIELDS } from '../constants/fields';

export const TEMPLATE_FIELDS = {
  giocatori: PLAYER_FIELDS,
  osservazioni: ['player_id', ...OBSERVATION_FIELDS],
  risultati: MATCH_FIELDS,
  presenze: ATTENDANCE_FIELDS,
  rosa: ROSTER_FIELDS,
  analytics: ANALYTICS_FIELDS,
  ipo: ['event_name','default_ipo_score','description','active'],
  membri: ['invited_email','role','can_view','can_edit_results','can_edit_attendance','can_edit_roster','can_edit_analytics','can_manage_members']
};

export function normalizeColumnName(name='') { return String(name).trim().toLowerCase().replace(/[à]/g,'a').replace(/[èé]/g,'e').replace(/[ì]/g,'i').replace(/[ò]/g,'o').replace(/[ù]/g,'u').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,''); }
export function normalizeRow(row){ const out={}; Object.entries(row).forEach(([k,v])=> out[normalizeColumnName(k)] = v); return out; }
export function exportToExcel(filename, sheets){ const wb=XLSX.utils.book_new(); Object.entries(sheets).forEach(([name, rows])=>XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows || []), name.substring(0,31))); XLSX.writeFile(wb, filename); }
export function downloadTemplate(type){ const fields=TEMPLATE_FIELDS[type] || []; exportToExcel(`coach-football-lab-template-${type}.xlsx`, { [type]: [Object.fromEntries(fields.map(f=>[f,'']))] }); }
export async function readExcelFile(file){ const buf=await file.arrayBuffer(); const wb=XLSX.read(buf); const first=wb.SheetNames[0]; return XLSX.utils.sheet_to_json(wb.Sheets[first], { defval:'' }).map(normalizeRow); }
export function validateRows(rows, required=[]){ const errors=[]; const valid=[]; rows.forEach((r,i)=>{ const miss=required.filter(c=>r[c]===undefined || r[c]===''); if(miss.length) errors.push({row:i+2, error:`Colonne obbligatorie mancanti/vuote: ${miss.join(', ')}`, data:r}); else valid.push(r); }); return { valid, errors, imported: valid.length, discarded: errors.length }; }
export function findPlayerMatch(row, players=[]){ const same=players.filter(p => String(p.nome||'').toLowerCase()===String(row.nome||'').toLowerCase() && String(p.cognome||'').toLowerCase()===String(row.cognome||'').toLowerCase() && (!row.data_nascita || p.data_nascita===row.data_nascita)); if(same.length===1) return { player_id:same[0].id, conflict:false }; if(same.length>1) return { player_id:null, conflict:true, matches:same }; return { player_id:null, conflict:false }; }
