import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Client = {
  id: string
  user_id: string
  name: string
  industry: string
  business_description: string
  website?: string
  instagram_username?: string
  linkedin_profile?: string
  facebook_page?: string
  tiktok_username?: string
  twitter_username?: string
  created_at: string
  updated_at: string
}

export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>

export type ClientState = {
  client_id: string
  brand_dna_state: 'not_started' | 'generated' | 'validated' | 'approved' | 'rejected'
  content_calendar_state: 'not_started' | 'generated' | 'validated' | 'approved' | 'rejected'
  campaigns_state: 'inactive' | 'active' | 'paused' | 'aborted'
  last_updated: string
}
