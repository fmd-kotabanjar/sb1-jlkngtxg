import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using fallback configuration.')
}

// Use fallback values for development if env vars are not set
const fallbackUrl = supabaseUrl || 'https://your-project.supabase.co'
const fallbackKey = supabaseAnonKey || 'your-anon-key'

export const supabase = createClient(fallbackUrl, fallbackKey)