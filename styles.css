import { useEffect, useMemo, useState } from 'react';
import { getPlans, getUserSubscription } from '../services/billingService';
export function useCurrentUserPlan(user){
 const [plans,setPlans]=useState([]); const [subscription,setSubscription]=useState(null);
 useEffect(()=>{ if(!user) return; Promise.all([getPlans(), getUserSubscription(user.id)]).then(([p,s])=>{setPlans(p);setSubscription(s);}).catch(()=>{}); },[user]);
 const plan = useMemo(()=> plans.find(p=>p.plan_code===(subscription?.plan_code || 'free')) || plans.find(p=>p.plan_code==='free') || null, [plans, subscription]);
 return { plans, subscription, plan, planCode: plan?.plan_code || 'free', getPlanLimits:()=>plan || {} };
}
