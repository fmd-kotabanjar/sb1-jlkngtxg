import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type Tables = Database['public']['Tables']
type Prompt = Tables['prompts']['Row']
type Profile = Tables['profiles']['Row']
type UserClaimedPrompt = Tables['user_claimed_prompts']['Row']
type RedeemCode = Tables['redeem_codes']['Row']
type PromptRequest = Tables['prompt_requests']['Row']
type UserRole = Tables['user_roles']['Row']

export class SupabaseService {
  // Auth methods
  static async signUp(email: string, password: string, userData: { name: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Profile methods
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Prompts methods
  static async getPrompts(filters: {
    platform?: string
    category?: string
    is_premium?: boolean
  } = {}) {
    let query = supabase.from('prompts').select('*')
    
    if (filters.platform) {
      query = query.eq('platform', filters.platform)
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.is_premium !== undefined) {
      query = query.eq('is_premium', filters.is_premium)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getPrompt(id: string) {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // User claimed prompts
  static async getUserClaimedPrompts(userId: string) {
    const { data, error } = await supabase
      .from('user_claimed_prompts')
      .select(`
        *,
        prompts (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }

  static async claimPrompt(userId: string, promptId: string) {
    const { data, error } = await supabase
      .from('user_claimed_prompts')
      .insert({
        user_id: userId,
        prompt_id: promptId
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Redeem codes
  static async getRedeemCode(code: string) {
    const { data, error } = await supabase
      .from('redeem_codes')
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .single()
    
    if (error) throw error
    return data
  }

  static async useRedeemCode(codeId: string, userId: string) {
    const { data, error } = await supabase
      .from('redeem_codes')
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', codeId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Prompt requests
  static async createPromptRequest(userId: string, requestDetails: string) {
    const { data, error } = await supabase
      .from('prompt_requests')
      .insert({
        user_id: userId,
        request_details: requestDetails,
        status: 'Pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserPromptRequests(userId: string) {
    const { data, error } = await supabase
      .from('prompt_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // User roles
  static async getUserRole(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async setUserRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}