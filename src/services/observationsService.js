import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
import { calcObservationAverages, OBSERVATION_FIELDS } from '../constants/fields';
const ALLOWED = ['user_id','player_id', ...OBSERVATION_FIELDS, 'media_tecnica','media_tattica','media_difensiva','media_offensiva','media_mentale','media_fisica','media_portiere','media_generale'];
export async function getObservations(filters={}){ return selectRows('observations', { eq:{player_id:filters.player_id}, search:{columns:['nome','cognome','squadra_partita','ruolo','categoria','competizione'], value:filters.q}, order:{column:'created_at'} }); }
export async function createObservation(payload){ return insertRow('observations', {...payload, ...calcObservationAverages(payload)}, ALLOWED); }
export async function updateObservation(id,payload){ return updateRow('observations', id, {...payload, ...calcObservationAverages(payload)}, ALLOWED); }
export async function deleteObservation(id){ return deleteRow('observations', id); }
