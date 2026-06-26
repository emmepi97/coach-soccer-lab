import CrudSection from './CrudSection';
import { getRoster, createRosterItem, updateRosterItem, deleteRosterItem } from '../services/rosterService';
const fields = [{"name": "player_id", "label": "Player Id"}, {"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "ruolo_preferito", "label": "Ruolo Preferito"}, {"name": "altri_ruoli", "label": "Altri Ruoli"}, {"name": "numero_maglia", "label": "Numero Maglia"}, {"name": "attivo", "label": "Attivo"}, {"name": "note", "label": "Note"}];
const columns = [{"key": "cognome", "label": "Cognome"}, {"key": "nome", "label": "Nome"}, {"key": "ruolo_preferito", "label": "Ruolo Preferito"}, {"key": "numero_maglia", "label": "Numero Maglia"}, {"key": "attivo", "label": "Attivo"}];
export default function RosterSection({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Rosa Squadra" description="Rosa per stagione: un giocatore può essere in rosa in una stagione e non in un’altra." fields={fields} columns={columns} load={(filters)=>activeSeason ? getRoster(activeSeason.id, filters) : Promise.resolve([])} create={createRosterItem} update={updateRosterItem} remove={deleteRosterItem} defaults={{...userDefaults, season_id: activeSeason?.id}} locked={locked} />;
}
