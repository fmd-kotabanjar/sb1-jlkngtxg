import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables!')
  console.log('📋 Setup Instructions:')
  console.log('1. Buat project di https://supabase.com')
  console.log('2. Copy Project URL dan Anon Key')
  console.log('3. Update file .env dengan kredensial Anda')
  console.log('4. Jalankan SQL migration dari supabase/migrations/')
}

// Use fallback values for development if env vars are not set
const fallbackUrl = supabaseUrl || 'https://your-project.supabase.co'
const fallbackKey = supabaseAnonKey || 'your-anon-key'

export const supabase = createClient(fallbackUrl, fallbackKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key')
}