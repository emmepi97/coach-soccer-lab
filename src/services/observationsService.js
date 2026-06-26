import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
import { calcObservationAverages } from '../constants/fields';
export async function getObservations(filters={}){ return selectRows('observations', { eq:{player_id:filters.player_id}, search:{columns:['nome','cognome','squadra_partita','ruolo','categoria','competizione'], value:filters.q}, order:{column:'created_at'} }); }
export async function createObservation(payload){ return insertRow('observations', {...payload, ...calcObservationAverages(payload)}); }
export async function updateObservation(id,payload){ return updateRow('observations', id, {...payload, ...calcObservationAverages(payload)}); }
export async function deleteObservation(id){ return deleteRow('observations', id); }
