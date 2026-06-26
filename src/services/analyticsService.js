import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
export async function getAnalyticsEvents(seasonId){ return selectRows('season_analytics_events',{eq:{season_id:seasonId}, order:{column:'data', ascending:false}}); }
export async function createAnalyticsEvent(payload){ return insertRow('season_analytics_events', payload); }
export async function updateAnalyticsEvent(id,payload){ return updateRow('season_analytics_events', id, payload); }
export async function deleteAnalyticsEvent(id){ return deleteRow('season_analytics_events', id); }
export function summarizeAnalytics(events=[]){ const by=(team)=>events.filter(e=>e.squadra===team); const sum=(arr)=>arr.reduce((a,e)=>a+Number(e.punteggio_ipo||0),0); return { eventi_nostri:by('Noi').length, eventi_avversari:by('Avversario').length, ipo_nostro:sum(by('Noi')), ipo_avversario:sum(by('Avversario')) }; }
