import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
const ALLOWED = ['user_id','event_name','default_ipo_score','description','active'];
export async function getIpoEventTypes(){ return selectRows('ipo_event_types',{order:{column:'event_name', ascending:true}}); }
export async function createIpoEventType(payload){ return insertRow('ipo_event_types', {...payload, active: payload.active === 'false' ? false : Boolean(payload.active ?? true)}, ALLOWED); }
export async function updateIpoEventType(id,payload){ return updateRow('ipo_event_types', id, {...payload, active: payload.active === 'false' ? false : Boolean(payload.active ?? true)}, ALLOWED); }
export async function deleteIpoEventType(id){ return deleteRow('ipo_event_types', id); }
