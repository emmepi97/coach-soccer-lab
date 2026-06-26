import CrudSection from './CrudSection';
import { getAttendance, createAttendance, updateAttendance, deleteAttendance } from '../services/attendanceService';
const fields = [{"name": "player_id", "label": "Player Id"}, {"name": "match_id", "label": "Match Id"}, {"name": "nome", "label": "Nome"}, {"name": "cognome", "label": "Cognome"}, {"name": "data", "label": "Data"}, {"name": "tipo", "label": "Tipo"}, {"name": "presente", "label": "Presente"}, {"name": "minuti", "label": "Minuti"}, {"name": "ruolo", "label": "Ruolo"}, {"name": "nota", "label": "Nota"}, {"name": "cognome_nome", "label": "Cognome Nome"}];
const columns = [{"key": "data", "label": "Data"}, {"key": "cognome", "label": "Cognome"}, {"key": "nome", "label": "Nome"}, {"key": "tipo", "label": "Tipo"}, {"key": "presente", "label": "Presente"}, {"key": "minuti", "label": "Minuti"}];
export default function AttendanceSection({activeSeason,userDefaults={}, locked=false}){
 return <CrudSection title="Presenze Giocatori Squadra" description="Presenze e minutaggio collegati a stagione, match e player_id." fields={fields} columns={columns} load={(filters)=>activeSeason ? getAttendance(activeSeason.id, filters) : Promise.resolve([])} create={createAttendance} update={updateAttendance} remove={deleteAttendance} defaults={{...userDefaults, season_id: activeSeason?.id}} locked={locked} />;
}
