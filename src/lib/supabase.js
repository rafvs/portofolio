import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://saqbcpdhdeiymfwbputu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcWJjcGRoZGVpeW1md2JwdXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTgxOTcsImV4cCI6MjEwMjc5NDE5N30.6CQ_hJIKJC_ltOrxpMDO6Z9aQ-IwBoWMTtB_vd7kIpA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
