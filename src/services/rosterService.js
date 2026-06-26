import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
const ALLOWED = ['user_id','season_id','player_id','nome','cognome','ruolo_preferito','altri_ruoli','numero_maglia','attivo','note','created_by','updated_by'];
export async function getRoster(seasonId){ return selectRows('season_roster',{eq:{season_id:seasonId}, order:{column:'cognome', ascending:true}}); }
export async function createRosterItem(payload){ return insertRow('season_roster', {...payload, attivo: payload.attivo === 'false' ? false : Boolean(payload.attivo ?? true)}, ALLOWED); }
export async function updateRosterItem(id,payload){ return updateRow('season_roster', id, {...payload, attivo: payload.attivo === 'false' ? false : Boolean(payload.attivo ?? true)}, ALLOWED); }
export async function deleteRosterItem(id){ return deleteRow('season_roster', id); }
