import { useEffect } from 'react'
import { useOrders } from '../store/useOrders'
import { pullAll } from '../lib/sync'
import { supabase } from '../lib/supabase'
// Polling ringan: Supabase jika aktif, selain itu sinkron dari localStorage (antar-tab).
export function useOrderPolling(ms = 3000) {
  useEffect(() => {
    const t = setInterval(() => { if (supabase) void pullAll(); else void useOrders.persist.rehydrate() }, ms)
    return () => clearInterval(t)
  }, [ms])
}
