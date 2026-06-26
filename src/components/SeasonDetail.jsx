import CrudSection from './CrudSection';
import { getSeasons, createSeason, updateSeason, deleteSeason } from '../services/seasonsService';
const fields = [{"name": "name", "label": "Name"}, {"name": "team_name", "label": "Team Name"}, {"name": "category", "label": "Category"}, {"name": "notes", "label": "Notes"}];
const columns = [{"key": "name", "label": "Name"}, {"key": "team_name", "label": "Team Name"}, {"key": "category", "label": "Category"}];
export default function SeasonDetail({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Scheda Stagione" description="Dettaglio stagione con dati collegati tramite season_id." fields={fields} columns={columns} load={getSeasons} create={createSeason} update={updateSeason} remove={deleteSeason} defaults={userDefaults} locked={locked} />;
}
