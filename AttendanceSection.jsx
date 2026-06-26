import { selectRows, insertRow, updateRow } from './baseService';
export async function getAppInvites(){ return selectRows('app_invites', { order:{column:'created_at', ascending:false} }); }
export async function createAppInvite(payload){ return insertRow('app_invites', payload); }
export async function updateAppInvite(id,payload){ return updateRow('app_invites', id, payload); }
export async function getSeasonInvites(seasonId){ return selectRows('season_members', { eq:{season_id:seasonId} }); }
