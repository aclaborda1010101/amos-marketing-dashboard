const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  baseURL: API_URL,
  
  async generateBrandDNA(clientId: string, companyInfo: any) {
    const response = await fetch(`${API_URL}/generate-brand-dna`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, company_info: companyInfo })
    })
    return response.json()
  },
  
  async generateContentCalendar(clientId: string, month: string) {
    const response = await fetch(`${API_URL}/generate-content-calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, month })
    })
    return response.json()
  }
}
