import CrudSection from './CrudSection';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../services/playersService';
const fields = [{"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "data_nascita", "label": "Data Nascita"}, {"name": "ruolo", "label": "Ruolo"}, {"name": "categoria", "label": "Categoria"}, {"name": "squadra", "label": "Squadra"}, {"name": "piede_forte", "label": "Piede Forte"}, {"name": "source_type", "label": "Source Type"}];
const columns = [{"key": "nome", "label": "Nome"}, {"key": "cognome", "label": "Cognome"}, {"key": "ruolo", "label": "Ruolo"}, {"key": "categoria", "label": "Categoria"}, {"key": "squadra", "label": "Squadra"}, {"key": "source_type", "label": "Source Type"}];
export default function PlayersSection({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Database Giocatori" description="Anagrafica unica con player_id: scouting, mercato e rosa senza problemi di omonimia." fields={fields} columns={columns} load={getPlayers} create={createPlayer} update={updatePlayer} remove={deletePlayer} defaults={userDefaults} locked={locked} />;
}
