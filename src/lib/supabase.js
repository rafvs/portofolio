import { createClient } from '@supabase/supabase-js'

/**
 * INSIALISASI SUPABASE CLIENT (PORTORAFII FRONTEND)
 * 1. Mengambil URL & Anon Key dari environment variable (.env)
 * 2. Membuat instance `supabase` untuk melakukan query data publik ke database Supabase.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

