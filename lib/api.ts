/**
 * AMOS v2.0 API Client
 * Connects frontend to FastAPI backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetcher(url: string) {
  const res = await fetch(`${API_URL}${url}`)
  if (!res.ok) throw new Error('API request failed')
  return res.json()
}

export const api = {
  // Dashboard
  getDashboardSummary: () => fetcher('/api/dashboard/summary'),
  
  // Clients
  getClients: () => fetcher('/api/clients'),
  getClient: (id: string) => fetcher(`/api/clients/${id}`),
  createClient: (data: any) => 
    fetch(`${API_URL}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  
  // Approvals
  getApprovals: (status?: string) => 
    fetcher(`/api/approvals${status ? `?status=${status}` : ''}`),
  decideApproval: (id: string, decision: 'approved' | 'rejected', comments?: string) =>
    fetch(`${API_URL}/api/approvals/${id}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, comments })
    }).then(r => r.json()),
  
  // Specialists
  getSpecialists: () => fetcher('/api/specialists'),
  
  // Campaigns
  getClientCampaigns: (clientId: string) => 
    fetcher(`/api/clients/${clientId}/campaigns`),
  
  // Calendar
  getContentCalendar: (clientId: string, month: string) =>
    fetcher(`/api/clients/${clientId}/calendar/${month}`)
}
