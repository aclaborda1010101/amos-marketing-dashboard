"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api, type ApiClient, type Campaign } from '@/lib/api'
import {
  Users, Zap, Calendar, TrendingUp,
  Users as UsersIcon, ArrowRight, CheckCircle,
  Clock, AlertCircle, Loader2, Play, RefreshCw
} from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.clientId as string
  const [client, setClient] = useState<ApiClient | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [specialists, setSpecialists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [brandDnaStatus, setBrandDnaStatus] = useState('not_started')

  useEffect(() => { loadClientData() }, [clientId])

  const loadClientData = async () => {
    try {
      setLoading(true)
      const [clientsRes, campaignsRes, specialistsRes] = await Promise.allSettled([
        api.listClients(),
        api.getClientCampaigns(clientId),
        api.getSpecialists()
      ])
      if (clientsRes.status === 'fulfilled') {
        const found = clientsRes.value.clients.find((c: ApiClient) => c.id === clientId)
        if (found) { setClient(found); setBrandDnaStatus(found.brief ? 'generated' : 'not_started') }
      }
      if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value.campaigns || [])
      if (specialistsRes.status === 'fulfilled') setSpecialists(specialistsRes.value.specialists || [])
      try {
        const stateRes = await api.getClientState(clientId)
        if (stateRes.brand_dna_state) setBrandDnaStatus(stateRes.brand_dna_state)
      } catch { /* state not initialized */ }
    } catch (error) { console.error('Error loading client:', error) }
    finally { setLoading(false) }
  }

  const handleGenerateBrandDNA = async () => {
    if (!client) return
    setGenerating(true)
    try {
      await api.generateBrandDNA(clientId, { name: client.name, industry: client.industry, website: client.website || '', brief: client.brief || '' })
      setBrandDnaStatus('in_progress')
      setTimeout(() => loadClientData(), 3000)
    } catch (error) { console.error('Error generating Brand DNA:', error); alert('Error al generar Brand DNA') }
    finally { setGenerating(false) }
  }

  const handleInitializeClient = async () => {
    setGenerating(true)
    try { await api.initializeClient(clientId); await loadClientData() }
    catch (error) { console.error('Error initializing client:', error) }
    finally { setGenerating(false) }
  }

  const getStatusIcon = (status: string) => {
    if (['approved','active','generated','validated'].includes(status)) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === 'in_progress') return <Clock className="w-4 h-4 text-yellow-500" />
    return <AlertCircle className="w-4 h-4 text-gray-500" />
  }

  const statusLabels: Record<string, string> = { not_started: 'Pendiente', in_progress: 'En progreso', generated: 'Generado', validated: 'Validado', approved: 'Aprobado', active: 'Activo', rejected: 'Rechazado', failed: 'Error' }

  if (loading) return (
    <div className="flex min-h-screen bg-[#0a0a0a]"><Sidebar /><main className="flex-1 p-6 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#c8ff00]" /></main></div>
  )

  if (!client) return (
    <div className="flex min-h-screen bg-[#0a0a0a]"><Sidebar /><main className="flex-1 p-6"><div className="text-center py-20"><AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-white mb-2">Cliente no encontrado</h2><Link href="/clients"><Button variant="outline">Volver a Clientes</Button></Link></div></main></div>
  )

  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const sections = [
    { id: 'brand', name: 'Brand DNA', icon: Zap, status: brandDnaStatus, href: `/clients/${clientId}/brand`, description: 'Identidad y posicionamiento de marca', stats: { value: brandDnaStatus === 'not_started' ? '---' : (statusLabels[brandDnaStatus] || brandDnaStatus), label: 'Estado' }, action: brandDnaStatus === 'not_started' ? handleGenerateBrandDNA : undefined, actionLabel: 'Generar ADN' },
    { id: 'campaigns', name: 'Campa\u00f1as', icon: TrendingUp, status: activeCampaigns.length > 0 ? 'active' : 'not_started', href: `/clients/${clientId}/campaigns`, description: activeCampaigns.length > 0 ? `${activeCampaigns.length} campa\u00f1as activas` : 'Sin campa\u00f1as a\u00fan', stats: { value: String(campaigns.length), label: 'Total' } },
    { id: 'calendar', name: 'Calendario', icon: Calendar, status: 'not_started', href: `/clients/${clientId}/calendar`, description: 'Calendario de contenido', stats: { value: '0', label: 'Posts' } },
    { id: 'specialists', name: 'Especialistas', icon: UsersIcon, status: specialists.length > 0 ? 'active' : 'not_started', href: `/clients/${clientId}/specialists`, description: 'Equipo de bots asignados', stats: { value: String(specialists.length), label: 'Bots' } }
  ]

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">Dashboard</Link><span>/</span>
            <Link href="/clients" className="hover:text-white">Clientes</Link><span>/</span>
            <span className="flex items-center gap-2 text-white"><Users className="w-4 h-4" />{client.name}</span>
            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{client.status}</span>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{client.name}</h1>
                <p className="text-gray-400">{client.industry}</p>
                {client.website && <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[#c8ff00] text-sm hover:underline">{client.website}</a>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadClientData} className="border-[#2a2a2a] text-gray-400 hover:text-white"><RefreshCw className="w-4 h-4 mr-1" /> Actualizar</Button>
                <Button size="sm" onClick={handleInitializeClient} disabled={generating} className="bg-[#c8ff00] text-black hover:bg-[#b8ef00]">{generating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />} Inicializar</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <div key={section.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#c8ff00]/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-[#c8ff00]/10 rounded-lg"><section.icon className="w-5 h-5 text-[#c8ff00]" /></div>
                  <div className="flex items-center gap-2">{getStatusIcon(section.status)}<Link href={section.href}><ArrowRight className="w-4 h-4 text-gray-500 hover:text-[#c8ff00] cursor-pointer" /></Link></div>
                </div>
                <Link href={section.href}><h3 className="text-lg font-semibold text-white mb-1 hover:text-[#c8ff00]">{section.name}</h3></Link>
                <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                <div className="border-t border-[#2a2a2a] pt-3 flex items-center justify-between">
                  <div><span className="text-2xl font-bold text-white">{section.stats.value}</span><span className="text-sm text-gray-400 ml-2">{section.stats.label}</span></div>
                  {section.action && <Button size="sm" onClick={section.action} disabled={generating} className="bg-[#c8ff00] text-black hover:bg-[#b8ef00] text-xs">{generating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}{section.actionLabel}</Button>}
                </div>
              </div>
            ))}
          </div>

          {client.brief && (
            <div className="mt-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-[#c8ff00]" /> Brand DNA / Brief</h3>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">{client.brief.substring(0, 2000)}{client.brief.length > 2000 && '...'}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
