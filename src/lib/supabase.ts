import { createClient } from '@supabase/supabase-js'
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env
const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_ANON_KEY
// null jika env belum diisi -> aplikasi jalan dalam mode lokal (localStorage)
export const supabase = url && key ? createClient(url, key) : null
