import CrudSection from './CrudSection';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../services/playersService';
const fields = [{"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "data_nascita", "label": "Data Nascita"}, {"name": "ruolo", "label": "Ruolo"}, {"name": "categoria", "label": "Categoria"}, {"name": "squadra", "label": "Squadra"}, {"name": "impressione_generale", "label": "Impressione Generale"}];
const columns = [{"key": "nome", "label": "Nome"}, {"key": "cognome", "label": "Cognome"}, {"key": "ruolo", "label": "Ruolo"}, {"key": "impressione_generale", "label": "Impressione Generale"}];
export default function PlayerDetail({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Scheda Giocatore" description="Storico osservazioni, medie e dati anagrafici collegati tramite player_id." fields={fields} columns={columns} load={getPlayers} create={createPlayer} update={updatePlayer} remove={deletePlayer} defaults={userDefaults} locked={locked} />;
}
