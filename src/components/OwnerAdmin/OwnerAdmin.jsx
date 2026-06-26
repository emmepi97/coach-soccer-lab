import { useEffect, useState } from 'react';
import OwnerDashboard from './OwnerDashboard';
import AppSettingsPanel from './AppSettingsPanel';
import UsersPanel from './UsersPanel';
import InvitesPanel from './InvitesPanel';
import PlansPanel from './PlansPanel';
import FeatureFlagsPanel from './FeatureFlagsPanel';
import MonetizationPanel from './MonetizationPanel';
import { getProfiles } from '../../services/usersService';
import { getPlans } from '../../services/billingService';
const tabs=['Panoramica','Impostazioni app','Utenti','Inviti','Piani','Feature flags','Monetizzazione'];
export default function OwnerAdmin(){ const [tab,setTab]=useState(tabs[0]); const [users,setUsers]=useState([]); const [plans,setPlans]=useState([]); useEffect(()=>{getProfiles().then(setUsers); getPlans().then(setPlans);},[]); return <div className="section"><h1>Owner Admin</h1><p>Area riservata al proprietario globale di COACH SOCCER LAB.</p><div className="tabs">{tabs.map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div><div className="panel">{tab==='Panoramica'&&<OwnerDashboard users={users} plans={plans}/>} {tab==='Impostazioni app'&&<AppSettingsPanel/>} {tab==='Utenti'&&<UsersPanel/>} {tab==='Inviti'&&<InvitesPanel/>} {tab==='Piani'&&<PlansPanel/>} {tab==='Feature flags'&&<FeatureFlagsPanel/>} {tab==='Monetizzazione'&&<MonetizationPanel plans={plans}/>}</div></div>; }
