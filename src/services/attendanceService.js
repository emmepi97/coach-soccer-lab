import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
export async function getAttendance(seasonId){ return selectRows('season_attendance',{eq:{season_id:seasonId}, order:{column:'data', ascending:false}}); }
export async function createAttendance(payload){ return insertRow('season_attendance', payload); }
export async function updateAttendance(id,payload){ return updateRow('season_attendance', id, payload); }
export async function deleteAttendance(id){ return deleteRow('season_attendance', id); }
