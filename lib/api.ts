const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manias-backend-production.up.railway.app'

// ============= TYPES =============

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
  budget: any
  created_at: string
}

export interface Approval {
  request_id: string
  client_id: string
  bot: string
  priority: string
  status: string
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

// ============= API HELPERS =============

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

// ============= API FUNCTIONS =============

export const api = {
  baseURL: API_URL,

  // --- Health ---
  async getHealth(): Promise<{ service: string; version: string; status: string }> {
    return apiGet('/')
  },

  async getHealthDetail(): Promise<HealthResponse> {
    return apiGet('/health')
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

  // --- Brand DNA ---
  async generateBrandDNA(clientId: string, companyInfo: any): Promise<any> {
    return apiPost('/generate-brand-dna', {
      client_id: clientId,
      company_info: companyInfo
    })
  },

  // --- Content Calendar ---
  async generateContentCalendar(clientId: string, month: string): Promise<any> {
    return apiPost('/generate-content-calendar', {
      client_id: clientId,
      month
    })
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

  // --- Scheduled Posts ---
  async listScheduledPosts(clientId?: string): Promise<{ posts: ScheduledPost[] }> {
    const params: Record<string, string> = {}
    if (clientId) params.client_id = clientId
    return apiGet('/scheduled-posts', params)
  }
}
