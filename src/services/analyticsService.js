import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
const ALLOWED = ['user_id','season_id','match_id','data','gara','risultato','competizione','giornata','squadra','tipo_evento','ipo_event_type_id','giocatore_evento','cognome_nome','player_id','minuto_evento','zona_evento','nota_evento','esito_tiro','tipologia_tiro','esito_palla_inattiva','zona_inizio_azione','giocatore_rifinitura','rifinitore_player_id','zona_rifinitura','zona_recupero_palla','punteggio_ipo','created_by','updated_by'];
export async function getAnalyticsEvents(seasonId){ return selectRows('season_analytics_events',{eq:{season_id:seasonId}, order:{column:'data', ascending:false}}); }
export async function createAnalyticsEvent(payload){ return insertRow('season_analytics_events', payload, ALLOWED); }
export async function updateAnalyticsEvent(id,payload){ return updateRow('season_analytics_events', id, payload, ALLOWED); }
export async function deleteAnalyticsEvent(id){ return deleteRow('season_analytics_events', id); }
export function summarizeAnalytics(events=[]){ const by=(team)=>events.filter(e=>e.squadra===team); const sum=(arr)=>arr.reduce((a,e)=>a+Number(e.punteggio_ipo||0),0); return { eventi_nostri:by('Noi').length, eventi_avversari:by('Avversario').length, ipo_nostro:sum(by('Noi')), ipo_avversario:sum(by('Avversario')) }; }
