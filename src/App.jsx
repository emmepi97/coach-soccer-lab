import { useEffect, useMemo, useState } from 'react';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useCurrentUserPlan } from './hooks/useCurrentUserPlan';
import { useFeatureAccess } from './hooks/useFeatureAccess';
import { getSeasons } from './services/seasonsService';
import { getAppSettings } from './services/appSettingsService';
import AuthPage from './components/AuthPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/Shared/LoadingSpinner';
import LockedFeature from './components/Shared/LockedFeature';
import Dashboard from './components/Dashboard';
import PlayersSection from './components/PlayersSection';
import ObservationsSection from './components/ObservationForm';
import SeasonsSection from './components/SeasonsSection';
import SeasonMembersSection from './components/SeasonMembersSection';
import ResultsSection from './components/ResultsSection';
import AttendanceSection from './components/AttendanceSection';
import RosterSection from './components/RosterSection';
import AnalyticsSection from './components/AnalyticsSection';
import IpoEventsSection from './components/IpoEventsSection';
import ExcelSection from './components/ExcelSection';
import SettingsSection from './components/SettingsSection';
import OwnerAdmin from './components/OwnerAdmin/OwnerAdmin';

function MaintenanceScreen(){
 return <main className="authPage"><div className="authCard"><h1>COACH SOCCER LAB</h1><h2>Manutenzione in corso</h2><p>Stiamo aggiornando la piattaforma. Riprova più tardi.</p></div></main>;
}

export default function App(){
 const { user, profile, loading, isOwner } = useCurrentUser();
 const { plan, planCode } = useCurrentUserPlan(user);
 const access = useFeatureAccess(profile, planCode, plan);
 const [active,setActive]=useState('dashboard');
 const [activeSeason,setActiveSeason]=useState(null);
 const [settings,setSettings]=useState(null);
 const userDefaults = useMemo(()=>({ user_id:user?.id, owner_user_id:user?.id, created_by:user?.id, updated_by:user?.id }),[user]);

 useEffect(()=>{ if(!user) return; getSeasons().then(rows=>setActiveSeason(rows.find(s=>s.is_active) || rows[0] || null)).catch(()=>{}); },[user, active]);
 useEffect(()=>{ getAppSettings().then(setSettings).catch(()=>{}); },[]);

 if(loading) return <LoadingSpinner/>;
 if(!user) return <AuthPage/>;
 if(settings?.maintenance_mode_enabled && !isOwner) return <MaintenanceScreen/>;

 const gate=(key, node)=> access.canUseFeature(key) ? node : <LockedFeature message={`Funzionalità disponibile in un piano superiore: ${key}`}/>;
 const pages={
  dashboard:<Dashboard activeSeason={activeSeason} setActive={setActive}/>,
  players:gate('database_players', <PlayersSection userDefaults={userDefaults}/>),
  observations:gate('market_observations', <ObservationsSection userDefaults={userDefaults}/>),
  seasons:gate('season_management', <SeasonsSection userDefaults={userDefaults}/>),
  members:gate('season_sharing', <SeasonMembersSection activeSeason={activeSeason} userDefaults={userDefaults}/>),
  results:gate('results', <ResultsSection activeSeason={activeSeason} userDefaults={userDefaults}/>),
  attendance:gate('attendance', <AttendanceSection activeSeason={activeSeason} userDefaults={userDefaults}/>),
  roster:gate('roster', <RosterSection activeSeason={activeSeason} userDefaults={userDefaults}/>),
  analytics:gate('analytics', <AnalyticsSection activeSeason={activeSeason} userDefaults={userDefaults}/>),
  ipo:gate('ipo_events', <IpoEventsSection userDefaults={userDefaults}/>),
  excel:gate('excel_export', <ExcelSection/>),
  settings:<SettingsSection profile={profile}/>,
  owner:isOwner ? <OwnerAdmin/> : <LockedFeature message="Area riservata al proprietario globale."/>
 };
 return <Layout active={active} setActive={setActive} profile={profile} planCode={planCode} isOwner={isOwner}>{pages[active] || pages.dashboard}</Layout>;
}
