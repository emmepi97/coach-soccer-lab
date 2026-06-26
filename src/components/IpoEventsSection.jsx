import CrudSection from './CrudSection';
import { getIpoEventTypes, createIpoEventType, updateIpoEventType, deleteIpoEventType } from '../services/ipoEventsService';
const fields = [{"name": "event_name", "label": "Event Name"}, {"name": "default_ipo_score", "label": "Default Ipo Score"}, {"name": "description", "label": "Description"}, {"name": "active", "label": "Active"}];
const columns = [{"key": "event_name", "label": "Event Name"}, {"key": "default_ipo_score", "label": "Default Ipo Score"}, {"key": "active", "label": "Active"}];
export default function IpoEventsSection({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Eventi IPO" description="Gestione dei tipi evento e punteggi IPO proposti automaticamente." fields={fields} columns={columns} load={getIpoEventTypes} create={createIpoEventType} update={updateIpoEventType} remove={deleteIpoEventType} defaults={userDefaults} locked={locked} />;
}
