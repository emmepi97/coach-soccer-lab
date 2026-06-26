import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
const ALLOWED = ['user_id','nome','cognome','data_nascita','ruolo','categoria','squadra','numero','peso_kg','altezza_cm','nickname','piede_forte','dettagli_ruolo','impressione_generale','source_type'];
export async function getPlayers(filters={}){ return selectRows('players', { search:{columns:['nome','cognome','ruolo','categoria','squadra','piede_forte'], value:filters.q}, order:{column:'updated_at'} }); }
export async function createPlayer(payload){ return insertRow('players', payload, ALLOWED); }
export async function updatePlayer(id,payload){ return updateRow('players', id, payload, ALLOWED); }
export async function deletePlayer(id){ return deleteRow('players', id); }
