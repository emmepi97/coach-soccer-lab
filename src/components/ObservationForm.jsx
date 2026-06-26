import CrudSection from './CrudSection';
import { getObservations, createObservation, updateObservation, deleteObservation } from '../services/observationsService';
const fields = [{"name": "player_id", "label": "Player Id"}, {"name": "data_osservazione", "label": "Data Osservazione"}, {"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "ruolo", "label": "Ruolo"}, {"name": "categoria", "label": "Categoria"}, {"name": "competizione", "label": "Competizione"}, {"name": "passaggio", "label": "Passaggio"}, {"name": "stop", "label": "Stop"}, {"name": "tiro", "label": "Tiro"}, {"name": "tattica_collettiva", "label": "Tattica Collettiva"}, {"name": "concentrazione", "label": "Concentrazione"}, {"name": "velocita", "label": "Velocita"}];
const columns = [{"key": "nome", "label": "Nome"}, {"key": "cognome", "label": "Cognome"}, {"key": "ruolo", "label": "Ruolo"}, {"key": "media_generale", "label": "Media Generale"}];
export default function ObservationForm({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Form Osservazione" description="Inserimento osservazione con calcolo automatico medie per area." fields={fields} columns={columns} load={getObservations} create={createObservation} update={updateObservation} remove={deleteObservation} defaults={userDefaults} locked={locked} />;
}
