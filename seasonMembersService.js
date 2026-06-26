import { useEffect, useState } from 'react';
import { getFeatureFlags } from '../services/featureFlagsService';
export function useFeatureAccess(profile, planCode='free', plan=null){
 const [flags,setFlags]=useState([]); useEffect(()=>{ getFeatureFlags().then(setFlags).catch(()=>setFlags([])); },[]);
 function isOwner(){ return profile?.global_role === 'owner'; }
 function isAdmin(){ return ['owner','admin'].includes(profile?.global_role); }
 function canUseFeature(featureKey){ if(isOwner()) return true; const f=flags.find(x=>x.feature_key===featureKey); if(!f) return true; return Boolean(f.is_globally_enabled && f[`enabled_for_${planCode}`]); }
 function checkLimit(limitName,currentValue){ if(isOwner()) return true; const limit=plan?.[limitName]; return limit === null || limit === undefined || Number(limit) < 0 || Number(currentValue) < Number(limit); }
 return { flags, canUseFeature, isOwner, isAdmin, checkLimit, getPlanLimits:()=>plan || {} };
}
