import { supabase } from '../lib/supabaseClient';

export function sanitizePayload(payload, allowed = []) {
  const entries = Object.entries(payload || {}).filter(([key, value]) => {
    if (allowed.length && !allowed.includes(key)) return false;
    return value !== undefined && value !== '';
  });
  return Object.fromEntries(entries);
}

export async function selectRows(table, opts = {}) {
  let q = supabase.from(table).select(opts.select || '*');
  if (opts.eq) Object.entries(opts.eq).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') q = q.eq(k,v); });
  if (opts.in) Object.entries(opts.in).forEach(([k,v]) => { if (Array.isArray(v) && v.length) q = q.in(k,v); });
  if (opts.search) {
    const { columns, value } = opts.search;
    if (value && columns?.length) q = q.or(columns.map(c => `${c}.ilike.%${value}%`).join(','));
  }
  if (opts.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}
export async function insertRow(table, payload, allowed) {
  const clean = sanitizePayload(payload, allowed);
  const { data, error } = await supabase.from(table).insert(clean).select().single();
  if (error) throw error;
  return data;
}
export async function updateRow(table, id, payload, allowed) {
  const clean = sanitizePayload(payload, allowed);
  const { data, error } = await supabase.from(table).update(clean).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteRow(table, id) { const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error; return true; }
