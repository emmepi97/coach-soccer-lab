import { selectRows, insertRow, updateRow } from './baseService';
export async function getFeatureFlags(){ return selectRows('feature_flags', { order:{column:'feature_key', ascending:true} }); }
export async function saveFeatureFlag(flag){ return flag.id ? updateRow('feature_flags', flag.id, flag) : insertRow('feature_flags', flag); }
