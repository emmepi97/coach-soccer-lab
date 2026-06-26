export const SEASON_ROLES = ['owner','admin','editor','analyst','viewer'];
export const ROLE_PERMISSIONS = {
  owner: { can_view:true, can_edit_results:true, can_edit_attendance:true, can_edit_roster:true, can_edit_analytics:true, can_manage_members:true },
  admin: { can_view:true, can_edit_results:true, can_edit_attendance:true, can_edit_roster:true, can_edit_analytics:true, can_manage_members:true },
  editor: { can_view:true, can_edit_results:true, can_edit_attendance:true, can_edit_roster:true, can_edit_analytics:true, can_manage_members:false },
  analyst: { can_view:true, can_edit_results:false, can_edit_attendance:false, can_edit_roster:false, can_edit_analytics:true, can_manage_members:false },
  viewer: { can_view:true, can_edit_results:false, can_edit_attendance:false, can_edit_roster:false, can_edit_analytics:false, can_manage_members:false }
};
export function permissionsForRole(role){ return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer; }
