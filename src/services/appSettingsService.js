import { selectRows, updateRow } from './baseService';
export async function getAppSettings(){ const rows = await selectRows('app_settings'); return rows[0] || null; }
export async function updateAppSettings(id, payload){ return updateRow('app_settings', id, payload); }
