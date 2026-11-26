import { supabase } from './supabase'
const warn = (e: unknown) => { if (e) console.error('[supabase]', e) }
export const saveOrder = (o: { id: string; number: string; status: string }) => {
  if (supabase) void supabase.from('orders').upsert({ id: o.id, number: o.number, status: o.status, data: o }).then(({ error }) => warn(error))
}
export const saveLog = (l: { id: string; at: number }) => {
  if (supabase) void supabase.from('logs').upsert({ id: l.id, at: l.at, data: l }).then(({ error }) => warn(error))
}
export const wipeLogs = async () => {
  if (supabase) { const { error } = await supabase.from('logs').delete().neq('id', ''); warn(error) }
}
