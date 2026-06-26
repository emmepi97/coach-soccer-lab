import { selectRows, insertRow, updateRow } from './baseService';
export async function getPlans(){ return selectRows('subscription_plans', { order:{column:'monthly_price', ascending:true} }); }
export async function savePlan(plan){ return plan.id ? updateRow('subscription_plans', plan.id, plan) : insertRow('subscription_plans', plan); }
export async function getUserSubscription(userId){ const rows = await selectRows('user_subscriptions', { eq:{user_id:userId} }); return rows[0] || null; }
export async function updateUserSubscription(id,payload){ return updateRow('user_subscriptions', id, payload); }
