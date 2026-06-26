import CrudSection from './CrudSection';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../services/playersService';
const fields = [{"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "data_nascita", "label": "Data Nascita"}, {"name": "ruolo", "label": "Ruolo"}, {"name": "categoria", "label": "Categoria"}, {"name": "squadra", "label": "Squadra"}, {"name": "numero", "label": "Numero"}, {"name": "piede_forte", "label": "Piede Forte"}];
const columns = [{"key": "nome", "label": "Nome"}, {"key": "cognome", "label": "Cognome"}, {"key": "ruolo", "label": "Ruolo"}, {"key": "categoria", "label": "Categoria"}];
export default function PlayerForm({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Form Giocatore" description="Componente riutilizzabile per inserire o modificare giocatori." fields={fields} columns={columns} load={getPlayers} create={createPlayer} update={updatePlayer} remove={deletePlayer} defaults={userDefaults} locked={locked} />;
}
