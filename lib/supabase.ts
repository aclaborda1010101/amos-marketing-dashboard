import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Client = {
  id: string
  name: string
  industry: string
  website?: string
  logo_url?: string
  brief?: string
  status: 'active' | 'paused' | 'archived'
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
