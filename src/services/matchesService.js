import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
function calc(payload){ const gf=Number(payload.gol_fatti??0), gs=Number(payload.gol_subiti??0); return {...payload, risultato_calcolato:`${gf}-${gs}`, esito: gf>gs?'vittoria':gf===gs?'pareggio':'sconfitta'}; }
export async function getMatches(seasonId){ return selectRows('season_matches',{eq:{season_id:seasonId}, order:{column:'data_partita', ascending:false}}); }
export async function createMatch(payload){ return insertRow('season_matches', calc(payload)); }
export async function updateMatch(id,payload){ return updateRow('season_matches', id, calc(payload)); }
export async function deleteMatch(id){ return deleteRow('season_matches', id); }
