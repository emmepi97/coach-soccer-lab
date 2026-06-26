import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
export async function getRoster(seasonId){ return selectRows('season_roster',{eq:{season_id:seasonId}, order:{column:'cognome', ascending:true}}); }
export async function createRosterItem(payload){ return insertRow('season_roster', payload); }
export async function updateRosterItem(id,payload){ return updateRow('season_roster', id, payload); }
export async function deleteRosterItem(id){ return deleteRow('season_roster', id); }
