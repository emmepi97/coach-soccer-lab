import { supabase } from '../lib/supabaseClient';
import { insertRow, updateRow, deleteRow } from './baseService';
export async function getSeasons(){ const { data, error } = await supabase.from('seasons').select('*').order('created_at',{ascending:false}); if(error) throw error; return data || []; }
export async function createSeason(payload){ return insertRow('seasons', payload); }
export async function updateSeason(id,payload){ return updateRow('seasons', id, payload); }
export async function deleteSeason(id){ return deleteRow('seasons', id); }
export async function activateSeason(id){ const { data, error } = await supabase.rpc('set_active_season', { p_season_id:id }); if(error) throw error; return data; }
