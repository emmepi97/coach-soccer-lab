import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
import { permissionsForRole } from '../constants/permissions';
export async function getSeasonMembers(seasonId){ return selectRows('season_members', { eq:{season_id:seasonId}, order:{column:'created_at'} }); }
export async function inviteSeasonMember(payload){ return insertRow('season_members', {...payload, ...permissionsForRole(payload.role)}); }
export async function updateSeasonMember(id,payload){ const extra = payload.role ? permissionsForRole(payload.role) : {}; return updateRow('season_members', id, {...payload, ...extra}); }
export async function removeSeasonMember(id){ return deleteRow('season_members', id); }
