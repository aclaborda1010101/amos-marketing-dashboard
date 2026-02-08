/**
 * AMOS v2.0 API Client
 * Connects frontend to FastAPI backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetcher(url: string) {
  const res = await fetch(`${API_URL}${url}`)
  if (!res.ok) {
    console.error(`API Error: ${res.status} ${res.statusText} - ${API_URL}${url}`)
    throw new Error(`API request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Dashboard
  getDashboardSummary: () => fetcher('/dashboard/summary'),
  
  // Clients
  getClients: () => fetcher('/clients'),
  getClient: (id: string) => fetcher(`/client/${id}/state`),
  
  // Brand DNA
  generateBrandDNA: (clientId: string, companyInfo: any) =>
    fetch(`${API_URL}/generate-brand-dna`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, company_info: companyInfo })
    }).then(r => r.json()),
  
  // Content Calendar
  generateContentCalendar: (clientId: string, month: string) =>
    fetch(`${API_URL}/generate-content-calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, month })
    }).then(r => r.json()),
  
  // Approvals
  getApprovals: (status?: string) => 
    fetcher(`/approvals${status ? `?status=${status}` : ''}`),
  decideApproval: (requestId: string, decision: 'approved' | 'rejected', comments?: string) =>
    fetch(`${API_URL}/approvals/${requestId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, comments })
    }).then(r => r.json()),
  
  // Client State
  getClientState: (clientId: string) => fetcher(`/client/${clientId}/state`),
  getClientEvents: (clientId: string) => fetcher(`/client/${clientId}/events`),
  
  // Specialists
  getSpecialists: () => fetcher('/specialists'),
  
  // Campaigns
  getClientCampaigns: (clientId: string) => fetcher(`/clients/${clientId}/campaigns`),
  
  // Calendar - Using backend
  getContentCalendar: (clientId: string, month: string) =>
    fetch(`${API_URL}/generate-content-calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, month })
    }).then(r => r.json())
}

// Helper to construct API URLs
export const apiUrl = (path: string) => `${API_URL}${path}`
