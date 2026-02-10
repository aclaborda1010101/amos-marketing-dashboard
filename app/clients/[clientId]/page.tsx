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
  Clock, AlertCircle, Loader2, Play, RefreshCw, XCircle
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
  const [brandDna, setBrandDna] = useState<any>(null)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { loadClientData() }, [clientId])

  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(''), 8000); return () => clearTimeout(t) }
  }, [error])
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 8000); return () => clearTimeout(t) }
  }, [successMsg])

  const loadClientData = async () => {
    try {
      const [clientsRes, campaignsRes, specialistsRes] = await Promise.all([
        api.listClients(),
        api.getClientCampaigns(clientId),
        api.getSpecialists()
      ])
      const found = clientsRes.clients.find((c: ApiClient) => c.id === clientId)
      if (found) setClient(found)
      setCampaigns(campaignsRes.campaigns || [])
      setSpecialists(specialistsRes.specialists || [])

      try {
        const dna = await api.getBrandDNA(clientId)
        if (dna) {
          setBrandDna(dna)
          setBrandDnaStatus('generated')
        }
      } catch {
        setBrandDnaStatus('not_started')
      }

      try {
        const state = await api.getClientState(clientId)
        if (state?.brand_dna_state) setBrandDnaStatus(state.brand_dna_state)
      } catch {
        // State not initialized yet
      }
    } catch (err) {
      console.error('Error loading client data:', err)
      setError('Error al cargar datos del cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateBrandDNA = async () => {
    if (!client) return
    setGenerating(true)
    setError('')
    setSuccessMsg('')
    try {
      await api.generateBrandDNA(clientId, {
        name: client.name,
        industry: client.industry,
        website: client.website || '',
        brief: client.brief || ''
      })
      setBrandDnaStatus('in_progress')
      setSuccessMsg('ADN de Marca iniciado. Puede tardar unos minutos...')
      const pollInterval = setInterval(() => {
        api.getBrandDNA(clientId).then(dna => {
          if (dna) {
            setBrandDna(dna)
            setBrandDnaStatus('generated')
            setSuccessMsg('ADN de Marca generado exitosamente')
            clearInterval(pollInterval)
          }
        }).catch(() => {})
      }, 5000)
      setTimeout(() => clearInterval(pollInterval), 120000)
    } catch (err) {
      console.error('Error generating Brand DNA:', err)
      const msg = err instanceof Error ? err.message : 'Error al generar Brand DNA'
      setError(msg)
      setBrandDnaStatus('not_started')
    } finally {
      setGenerating(false)
    }
  }

  const handleValidateBrandDNA = () => {
    setError('')
    api.validateBrandDNA(clientId)
      .then(() => { setBrandDnaStatus('validated'); setSuccessMsg('ADN validado') })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al validar'))
  }

  const handleApproveBrandDNA = () => {
    setError('')
    api.approveBrandDNA(clientId)
      .then(() => { setBrandDnaStatus('approved'); setSuccessMsg('ADN aprobado') })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al aprobar'))
  }

  const getBrandDnaStatusInfo = () => {
    const m: Record<string, { label: string; color: string; icon: any }> = {
      'not_started': { label: 'Pendiente', color: 'text-yellow-400', icon: Clock },
      'in_progress': { label: 'Generando...', color: 'text-blue-400', icon: Loader2 },
      'generated': { label: 'Generado', color: 'text-green-400', icon: CheckCircle },
      'validated': { label: 'Validado', color: 'text-green-400', icon: CheckCircle },
      'approved': { label: 'Aprobado', color: 'text-emerald-400', icon: CheckCircle },
      'rejected': { label: 'Rechazado', color: 'text-red-400', icon: XCircle },
      'failed': { label: 'Error', color: 'text-red-400', icon: AlertCircle },
    }
    return m[brandDnaStatus] || m['not_started']
  }

  const sections = [
    {
      id: 'brand-dna',
      name: 'ADN de Marca',
      icon: Zap,
      status: getBrandDnaStatusInfo(),
      description: brandDna ? 'ADN generado - click para ver detalles' : 'Genera el perfil de marca con IA',
      stats: brandDna ? 'Listo' : brandDnaStatus === 'in_progress' ? 'Procesando...' : 'Sin generar',
    },
    {
      id: 'campaigns',
      name: 'Campañas',
      icon: TrendingUp,
      href: `/campaigns?client=${clientId}`,
      status: { label: campaigns.length > 0 ? 'Activas' : 'Sin campañas', color: campaigns.length > 0 ? 'text-green-400' : 'text-gray-400', icon: campaigns.length > 0 ? Play : Clock },
      description: 'Gestiona las campañas de marketing',
      stats: `${campaigns.length} Campañas`,
    },
    {
      id: 'calendar',
      name: 'Calendario',
      icon: Calendar,
      href: `/calendar?client=${clientId}`,
      status: { label: 'Ver calendario', color: 'text-blue-400', icon: Calendar },
      description: 'Publicaciones programadas',
      stats: 'Ver posts',
    },
    {
      id: 'specialists',
      name: 'Especialistas',
      icon: UsersIcon,
      status: { label: `${specialists.length} Bots`, color: 'text-purple-400', icon: Users },
      description: 'Bots especializados del sistema',
      stats: `${specialists.length} Bots`,
    },
  ]

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/clients" className="text-gray-400 hover:text-white transition-colors">
            ← Volver
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{client?.name || 'Cliente'}</h1>
            <p className="text-gray-400 mt-1">{client?.industry} {client?.website ? `· ${client.website}` : ''}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            client?.status === 'active' ? 'bg-green-500/20 text-green-400' :
            client?.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {client?.status === 'active' ? 'Activo' : client?.status === 'paused' ? 'Pausado' : 'Archivado'}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm flex-1">{successMsg}</p>
            <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-300">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <section.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{section.name}</h3>
                    <p className="text-gray-500 text-sm">{section.description}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 ${section.status.color}`}>
                  <section.status.icon className={`w-4 h-4 ${brandDnaStatus === 'in_progress' && section.id === 'brand-dna' ? 'animate-spin' : ''}`} />
                  <span className="text-sm">{section.status.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-400 text-sm">{section.stats}</span>
                <div className="flex gap-2">
                  {section.id === 'brand-dna' && (
                    <>
                      {(brandDnaStatus === 'not_started' || brandDnaStatus === 'failed') && (
                        <Button size="sm" onClick={handleGenerateBrandDNA} disabled={generating} className="bg-purple-600 hover:bg-purple-700 text-white">
                          {generating ? (<><Loader2 className="w-3 h-3 animate-spin mr-1" />Generando...</>) : (<><Zap className="w-3 h-3 mr-1" />Generar ADN</>)}
                        </Button>
                      )}
                      {brandDnaStatus === 'generated' && (
                        <Button size="sm" onClick={handleValidateBrandDNA} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />Validar
                        </Button>
                      )}
                      {brandDnaStatus === 'validated' && (
                        <Button size="sm" onClick={handleApproveBrandDNA} className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />Aprobar
                        </Button>
                      )}
                      {brandDnaStatus === 'in_progress' && (
                        <Button size="sm" disabled className="bg-gray-700 text-gray-400">
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />Procesando...
                        </Button>
                      )}
                      {(brandDnaStatus === 'approved' || brandDnaStatus === 'generated' || brandDnaStatus === 'validated') && (
                        <Button size="sm" variant="outline" onClick={() => loadClientData()} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          <RefreshCw className="w-3 h-3 mr-1" />Actualizar
                        </Button>
                      )}
                    </>
                  )}
                  {section.href && (
                    <Link href={section.href}>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Ver <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {brandDna && (
          <div className="mt-8 bg-[#111] border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              ADN de Marca - Detalles
            </h3>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-[#0a0a0a] p-4 rounded-lg overflow-auto max-h-96">
              {typeof brandDna === 'string' ? brandDna : JSON.stringify(brandDna, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}
