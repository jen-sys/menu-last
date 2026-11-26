import { supabase } from './supabase'
import { useOrders, type Order } from '../store/useOrders'
import { useLogs, type LogEntry } from '../store/useLogs'
// Tarik data dari Supabase ke store. Data lokal yang baru (<60 dtk) dan belum sampai ke server tetap dipertahankan.
export async function pullAll() {
  if (!supabase) return
  const [o, l] = await Promise.all([
    supabase.from('orders').select('data').order('created_at', { ascending: false }).limit(500),
    supabase.from('logs').select('data').order('at', { ascending: false }).limit(2000)
  ])
  if (!o.error && o.data) {
    const remote = o.data.map((r) => r.data as Order), ids = new Set(remote.map((x) => x.id))
    const fresh = useOrders.getState().orders.filter((x) => !ids.has(x.id) && Date.now() - x.createdAt < 60_000)
    useOrders.setState({ orders: [...fresh, ...remote].sort((a, b) => b.createdAt - a.createdAt) })
  }
  if (!l.error && l.data) {
    const remote = l.data.map((r) => r.data as LogEntry), ids = new Set(remote.map((x) => x.id))
    const fresh = useLogs.getState().logs.filter((x) => !ids.has(x.id) && Date.now() - x.at < 60_000)
    useLogs.setState({ logs: [...fresh, ...remote].sort((a, b) => b.at - a.at) })
  }
}
let started = false
export function startSync() {
  if (!supabase || started) return
  started = true
  void pullAll()
  supabase.channel('restoku-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => void pullAll())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, () => void pullAll())
    .subscribe()
  setInterval(() => void pullAll(), 10_000) // cadangan jika realtime terputus
}
