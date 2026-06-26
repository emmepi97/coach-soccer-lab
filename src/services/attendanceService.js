import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
const ALLOWED = ['user_id','season_id','match_id','player_id','nome','cognome','data','tipo','presente','minuti','ruolo','nota','cognome_nome','created_by','updated_by'];
export async function getAttendance(seasonId){ return selectRows('season_attendance',{eq:{season_id:seasonId}, order:{column:'data', ascending:false}}); }
export async function createAttendance(payload){ return insertRow('season_attendance', {...payload, presente: payload.presente === 'false' ? false : Boolean(payload.presente ?? true)}, ALLOWED); }
export async function updateAttendance(id,payload){ return updateRow('season_attendance', id, {...payload, presente: payload.presente === 'false' ? false : Boolean(payload.presente ?? true)}, ALLOWED); }
export async function deleteAttendance(id){ return deleteRow('season_attendance', id); }
