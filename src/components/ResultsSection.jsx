import CrudSection from './CrudSection';
import { getMatches, createMatch, updateMatch, deleteMatch } from '../services/matchesService';
const fields = [{"name": "data_partita", "label": "Data Partita"}, {"name": "competizione", "label": "Competizione"}, {"name": "giornata", "label": "Giornata"}, {"name": "avversario", "label": "Avversario"}, {"name": "venue", "label": "Venue"}, {"name": "campo", "label": "Campo"}, {"name": "gol_fatti", "label": "Gol Fatti"}, {"name": "gol_subiti", "label": "Gol Subiti"}, {"name": "note", "label": "Note"}];
const columns = [{"key": "data_partita", "label": "Data Partita"}, {"key": "competizione", "label": "Competizione"}, {"key": "giornata", "label": "Giornata"}, {"key": "avversario", "label": "Avversario"}, {"key": "risultato_calcolato", "label": "Risultato Calcolato"}, {"key": "esito", "label": "Esito"}];
export default function ResultsSection({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Risultati Stagione" description="Risultati collegati alla stagione attiva con esito calcolato automaticamente." fields={fields} columns={columns} load={(filters)=>activeSeason ? getMatches(activeSeason.id, filters) : Promise.resolve([])} create={createMatch} update={updateMatch} remove={deleteMatch} defaults={{...userDefaults, season_id: activeSeason?.id}} locked={locked} />;
}
