export const OBSERVATION_FIELDS = [
  'data_osservazione','nome','cognome','squadra_partita','ruolo','categoria','competizione','numero','data_nascita','peso_kg','altezza_cm','nickname','piede_forte','dettagli_ruolo','fase_possesso','fase_non_possesso','transizioni','caratteristiche_comportamentali_mentali','punti_forza','punti_debolezza','impressione_generale','corner','punizione','rigore','rimessa_laterale','attitudine_schemi','passaggio','stop','conduzione','tiro','lancio','colpo_testa','tecnica_individuale','tattica_collettiva','anticipo','intercetto','contrasto','marcatura_uomo','marcatura_zona','intervento_scivolata','indirizzamento_avversario','postura_difensiva','duello_aereo','recupero_palloni','dribbling','finalizzazione','tiro_distanza','creativita','cross_value','filtrante','rifinitura','concentrazione','personalita','coraggio','determinazione','leadership','lavoro_squadra','impegno','comunicazione','rischio','ego','rispetto_regole','velocita','accelerazione','agilita','forza','resistenza','salto','rapidita','altezza','muscolatura','abilita_tecniche_portiere','parata_tuffo','uscite_basse','uscite_alte','rinvio_piedi','rinvio_mani','posizionamento_pali','scelta_tempi','organizzazione_difesa','senso_tattico','copertura_spazio_avanti'
];

export const PLAYER_FIELDS = ['nome','cognome','data_nascita','ruolo','categoria','squadra','numero','peso_kg','altezza_cm','nickname','piede_forte','dettagli_ruolo','impressione_generale','source_type'];
export const MATCH_FIELDS = ['data_partita','competizione','giornata','avversario','venue','campo','gol_fatti','gol_subiti','note'];
export const ATTENDANCE_FIELDS = ['nome','cognome','data','tipo','presente','minuti','ruolo','nota','cognome_nome','player_id','match_id'];
export const ROSTER_FIELDS = ['nome','cognome','ruolo_preferito','altri_ruoli','numero_maglia','attivo','note','player_id'];
export const ANALYTICS_FIELDS = ['data','gara','risultato','competizione','giornata','squadra','tipo_evento','giocatore_evento','cognome_nome','minuto_evento','zona_evento','nota_evento','esito_tiro','tipologia_tiro','esito_palla_inattiva','zona_inizio_azione','giocatore_rifinitura','zona_rifinitura','zona_recupero_palla','punteggio_ipo'];

export const AVERAGE_GROUPS = {
  media_tecnica: ['passaggio','stop','conduzione','tiro','lancio','colpo_testa','tecnica_individuale'],
  media_tattica: ['tattica_collettiva','senso_tattico','attitudine_schemi'],
  media_difensiva: ['anticipo','intercetto','contrasto','marcatura_uomo','marcatura_zona','intervento_scivolata','indirizzamento_avversario','postura_difensiva','duello_aereo','recupero_palloni'],
  media_offensiva: ['dribbling','finalizzazione','tiro_distanza','creativita','cross_value','filtrante','rifinitura'],
  media_mentale: ['concentrazione','personalita','coraggio','determinazione','leadership','lavoro_squadra','impegno','comunicazione','rischio','ego','rispetto_regole'],
  media_fisica: ['velocita','accelerazione','agilita','forza','resistenza','salto','rapidita','altezza','muscolatura'],
  media_portiere: ['abilita_tecniche_portiere','parata_tuffo','uscite_basse','uscite_alte','rinvio_piedi','rinvio_mani','posizionamento_pali','scelta_tempi','organizzazione_difesa','copertura_spazio_avanti']
};

export function calcAverage(values, fields) {
  const nums = fields.map(f => values?.[f]).filter(v => v !== null && v !== undefined && v !== '').map(Number).filter(n => !Number.isNaN(n));
  if (!nums.length) return null;
  return Math.round((nums.reduce((a,b)=>a+b,0)/nums.length)*100)/100;
}

export function calcObservationAverages(row) {
  const out = {};
  Object.entries(AVERAGE_GROUPS).forEach(([k, fields]) => out[k] = calcAverage(row, fields));
  const areaValues = Object.values(out).filter(v => v !== null && v !== undefined);
  out.media_generale = areaValues.length ? Math.round((areaValues.reduce((a,b)=>a+b,0)/areaValues.length)*100)/100 : null;
  return out;
}
