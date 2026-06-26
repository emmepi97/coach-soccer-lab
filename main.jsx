import { useMemo } from 'react';
export function useSeasonPermissions(season, members, user){
 return useMemo(()=>{ if(!user || !season) return { can_view:false }; if(season.owner_user_id===user.id) return { role:'owner', can_view:true, can_edit_results:true, can_edit_attendance:true, can_edit_roster:true, can_edit_analytics:true, can_manage_members:true, can_delete:true }; const m=(members||[]).find(x=>x.user_id===user.id && x.status==='accepted'); return m || { can_view:false }; },[season,members,user]);
}
