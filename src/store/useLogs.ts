import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveLog, wipeLogs } from '../lib/cloudDb'
export interface LogEntry { id: string; at: number; kind: 'order' | 'meta'; number: string; name: string; items: string; total: number; method: string; status: string }
interface S {
  logs: LogEntry[]; limit: number // limit 0 = auto-reset nonaktif
  add: (e: Omit<LogEntry, 'id' | 'at'>) => void
  update: (number: string, status: string) => void
  reset: () => void
  setLimit: (n: number) => void
}
const meta = (items: string): LogEntry => ({ id: crypto.randomUUID(), at: Date.now(), kind: 'meta', number: '-', name: 'Sistem', items, total: 0, method: '-', status: 'reset' })
export const useLogs = create<S>()(persist((set, get) => ({
  logs: [], limit: 1000,
  add: (e) => {
    const entry: LogEntry = { ...e, id: crypto.randomUUID(), at: Date.now() }
    const { logs, limit } = get()
    if (limit > 0 && logs.length >= limit) {
      const m = meta(`Auto-reset: logs melebihi ${limit} entri`)
      set({ logs: [entry, m] }); void wipeLogs().then(() => { saveLog(m); saveLog(entry) })
    } else { set({ logs: [entry, ...logs] }); saveLog(entry) }
  },
  update: (number, status) => {
    const changed = get().logs.filter((l) => l.number === number && l.status !== status).map((l) => ({ ...l, status }))
    if (!changed.length) return
    set((s) => ({ logs: s.logs.map((l) => l.number === number ? { ...l, status } : l) })); changed.forEach(saveLog)
  },
  reset: () => { const m = meta('Semua logs direset oleh admin'); set({ logs: [m] }); void wipeLogs().then(() => saveLog(m)) },
  setLimit: (limit) => set({ limit })
}), { name: 'restoku-logs' }))
