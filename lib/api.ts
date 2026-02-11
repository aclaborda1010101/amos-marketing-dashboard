const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manias-backend-production.up.railway.app'

// ============= TYPES ==============

export interface ApiClient {
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

export interface ClientState {
  client_id: string
  brand_dna_state: 'not_started' | 'in_progress' | 'generated' | 'validated' | 'approved' | 'rejected' | 'failed'
  content_calendar_state: 'not_started' | 'in_progress' | 'generated' | 'validated' | 'approved' | 'rejected' | 'failed'
  campaigns_state: 'inactive' | 'active' | 'paused' | 'aborted'
  last_updated: string
}

export interface Campaign {
  id: string
  campaign_id: string
  client_id: string
  name: string
  status: 'active' | 'completed' | 'paused' | 'draft'
  objective: string
  platforms: string[]
  start_date?: string
  end_date?: string
  budget?: number
  bot: string
  priority: string
  summary: any
  submitted_at: string
}

export interface ScheduledPost {
  post_id: string
  client_id: string
  content: string
  platform: string
  scheduled_date: string
  status: string
  created_at: string
}

export interface HealthResponse {
  status: string
  components?: Record<string, string>
}

export interface DashboardSummary {
  clients: number
  campaigns: number
  posts_this_month: number
  pending_approvals: number
}

export interface Approval {
  id: string
  request_id?: string
  client_id: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  content: any
  submitted_at: string
  decided_at?: string
  decided_by?: string
  comments?: string
}

// ============= API HELPERS ==============

async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, value)
    })
  }
  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' }
  })
  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error')
    throw new Error(`API Error ${response.status}: ${error}`)
  }
  return response.json()
}

async function apiPost<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error')
    throw new Error(`API Error ${response.status}: ${error}`)
  }
  return response.json()
}

// ============= API FUNCTIONS ==============

export const api = {
  baseURL: API_URL,

  // --- Health ---
  async getHealth(): Promise<{ service: string; version: string; status: string }> {
    return apiGet('/')
  },

  async getHealthDetail(): Promise<HealthResponse> {
    return apiGet('/health')
  },

  // --- Dashboard ---
  async getDashboardSummary(): Promise<DashboardSummary> {
    return apiGet('/dashboard/summary')
  },

  // --- Clients ---
  async listClients(): Promise<{ clients: ApiClient[] }> {
    return apiGet('/clients')
  },

  async getClientState(clientId: string): Promise<ClientState> {
    return apiGet(`/client/${clientId}/state`)
  },

  async getClientEvents(clientId: string, limit: number = 50): Promise<{ client_id: string; events: any[] }> {
    return apiGet(`/client/${clientId}/events`, { limit: limit.toString() })
  },

  async initializeClient(clientId: string): Promise<any> {
    return apiPost(`/client/${clientId}/initialize`, {})
  },

  // --- Initialize Client State via Webhook ---
  async initializeClientState(client: { id: string, name: string, industry: string, website?: string, brief?: string }): Promise<any> {
    return apiPost('/webhooks/client-created', {
      client_id: client.id,
      name: client.name,
      industry: client.industry,
      website: client.website || null,
      brief: client.brief || null
    })
  },

  // --- Brand DNA ---
  async generateBrandDNA(clientId: string): Promise<any> {
    return apiPost('/generate-brand-dna-test', {
      client_id: clientId
    })
  },

  async getBrandDNA(clientId: string): Promise<any> {
    return apiGet(`/brand-dna/${clientId}`)
  },

  async validateBrandDNA(clientId: string): Promise<any> {
    return apiPost(`/brand-dna/${clientId}/validate`, {})
  },

  async approveBrandDNA(clientId: string): Promise<any> {
    return apiPost(`/brand-dna/${clientId}/approve`, {})
  },

  // --- Campaigns ---
  async listCampaigns(clientId?: string): Promise<{ campaigns: Campaign[] }> {
    const params: Record<string, string> = {}
    if (clientId) params.client_id = clientId
    return apiGet('/campaigns', params)
  },

  async getClientCampaigns(clientId: string): Promise<{ campaigns: Campaign[] }> {
    return apiGet('/campaigns', { client_id: clientId })
  },

  // --- Approvals ---
  async listApprovals(status?: string): Promise<{ status: string; approvals: Approval[] }> {
    const params: Record<string, string> = {}
    if (status && status !== 'all') params.status = status
    return apiGet('/approvals', params)
  },

  async decideApproval(requestId: string, decision: 'approved' | 'rejected', comments: string, decidedBy: string = 'Director'): Promise<any> {
    return apiPost(`/approvals/${requestId}/decide`, {
      decision,
      comments,
      decided_by: decidedBy
    })
  },

  // --- Publishing ---
  async publishPost(postId: string, clientId: string, force: boolean = false): Promise<any> {
    return apiPost('/publish-post', {
      post_id: postId,
      client_id: clientId,
      force
    })
  },

  async publishCalendar(calendarId: string, clientId: string, dryRun: boolean = false): Promise<any> {
    return apiPost('/publish-calendar', {
      calendar_id: calendarId,
      client_id: clientId,
      dry_run: dryRun
    })
  },

  async retryFailedPost(postId: string, clientId: string): Promise<any> {
    return apiPost('/retry-failed-post', {
      post_id: postId,
      client_id: clientId
    })
  },

  // --- Calendar / Scheduled Posts ---
  async listScheduledPosts(clientId?: string): Promise<{ posts: ScheduledPost[] }> {
    const params: Record<string, string> = {}
    if (clientId) params.client_id = clientId
    return apiGet('/calendar', params)
  },

  // --- Content Calendar Generation ---
  async generateContentCalendar(clientId: string, month: string, platforms?: string[], postCount?: number): Promise<any> {
    return apiPost('/generate-content-calendar', {
      client_id: clientId,
      month: month,
      platforms: platforms || ['instagram', 'linkedin'],
      post_count: postCount || 20
    })
  },

  // --- Specialists ---
  async getSpecialists(): Promise<{ specialists: any[] }> {
    try {
      return await apiGet('/specialists')
    } catch {
      // Backend may not have this endpoint yet - return empty
      return { specialists: [] }
    }
  }
}

