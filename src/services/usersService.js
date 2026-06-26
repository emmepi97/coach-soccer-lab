import { selectRows, updateRow } from './baseService';
export async function getProfiles(){ return selectRows('profiles', { order:{column:'created_at', ascending:false} }); }
export async function getProfile(id){ const rows = await selectRows('profiles', { eq:{id} }); return rows[0] || null; }
export async function updateProfile(id,payload){ return updateRow('profiles', id, payload); }
