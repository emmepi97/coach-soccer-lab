import CrudSection from './CrudSection';
import { getSeasons, createSeason, updateSeason, deleteSeason } from '../services/seasonsService';
const fields = [{"name": "name", "label": "Name"}, {"name": "team_name", "label": "Team Name"}, {"name": "category", "label": "Category"}, {"name": "start_date", "label": "Start Date"}, {"name": "end_date", "label": "End Date"}, {"name": "notes", "label": "Notes"}];
const columns = [{"key": "name", "label": "Name"}, {"key": "team_name", "label": "Team Name"}, {"key": "category", "label": "Category"}, {"key": "is_active", "label": "Is Active"}, {"key": "is_shared", "label": "Is Shared"}];
export default function SeasonsSection({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Stagioni" description="Crea, modifica e attiva stagioni private o condivise con lo staff." fields={fields} columns={columns} load={getSeasons} create={createSeason} update={updateSeason} remove={deleteSeason} defaults={userDefaults} locked={locked} />;
}
