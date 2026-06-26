import { supabase } from '../lib/supabaseClient';
import { insertRow, updateRow, deleteRow } from './baseService';

const ALLOWED = ['user_id','owner_user_id','name','team_name','category','notes','start_date','end_date','is_active','is_shared'];

export async function getSeasons(){
  const { data, error } = await supabase.from('seasons').select('*').order('created_at',{ascending:false});
  if(error) throw error;
  return data || [];
}
export async function createSeason(payload){
  return insertRow('seasons', {...payload, is_active: payload.is_active ?? false, is_shared: payload.is_shared ?? false}, ALLOWED);
}
export async function updateSeason(id,payload){ return updateRow('seasons', id, payload, ALLOWED); }
export async function deleteSeason(id){ return deleteRow('seasons', id); }
export async function activateSeason(id){
  const { data, error } = await supabase.rpc('set_active_season', { p_season_id:id });
  if(error) throw error;
  return data;
}
