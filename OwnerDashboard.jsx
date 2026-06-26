import CrudSection from './CrudSection';
import { getObservations, createObservation, updateObservation, deleteObservation } from '../services/observationsService';
const fields = [{"name": "player_id", "label": "Player Id"}, {"name": "data_osservazione", "label": "Data Osservazione"}, {"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "impressione_generale", "label": "Impressione Generale"}, {"name": "punti_forza", "label": "Punti Forza"}, {"name": "punti_debolezza", "label": "Punti Debolezza"}];
const columns = [{"key": "nome", "label": "Nome"}, {"key": "cognome", "label": "Cognome"}, {"key": "impressione_generale", "label": "Impressione Generale"}];
export default function ObservationDetail({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Dettaglio Osservazione" description="Lettura completa della singola osservazione scouting." fields={fields} columns={columns} load={getObservations} create={createObservation} update={updateObservation} remove={deleteObservation} defaults={userDefaults} locked={locked} />;
}
