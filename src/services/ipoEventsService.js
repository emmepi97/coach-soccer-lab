import { selectRows, insertRow, updateRow, deleteRow } from './baseService';
export async function getIpoEventTypes(){ return selectRows('ipo_event_types',{order:{column:'event_name', ascending:true}}); }
export async function createIpoEventType(payload){ return insertRow('ipo_event_types', payload); }
export async function updateIpoEventType(id,payload){ return updateRow('ipo_event_types', id, payload); }
export async function deleteIpoEventType(id){ return deleteRow('ipo_event_types', id); }
