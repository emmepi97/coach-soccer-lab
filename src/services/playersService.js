import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
export async function getPlayers(filters={}){ return selectRows('players', { search:{columns:['nome','cognome','ruolo','categoria','squadra','piede_forte'], value:filters.q}, order:{column:'updated_at'} }); }
export async function createPlayer(payload){ return insertRow('players', payload); }
export async function updatePlayer(id,payload){ return updateRow('players', id, payload); }
export async function deletePlayer(id){ return deleteRow('players', id); }
