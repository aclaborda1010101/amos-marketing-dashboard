'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { 
  ArrowLeft, 
  TrendingUp, 
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  DollarSign,
  Megaphone
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  client_id: string
  objective: string
  budget?: number
  start_date?: string
  end_date?: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  created_at: string
}

export default function CampaignsListPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.getClientCampaigns(clientId)
      setCampaigns(data.campaigns || [])
    } catch (err) {
      console.error('Error loading campaigns:', err)
      setError('Error al cargar campañas')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'paused':
        return 'bg-yellow-100 text-yellow-700'
      case 'draft':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'paused':
        return <Clock className="w-4 h-4" />
      case 'draft':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/clients" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Dashboard
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <a href="/clients" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Clientes
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <a href={`/clients/${clientId}`} className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Cliente
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <Megaphone className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Campañas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className="btn-primary" 
              size="sm"
              onClick={() => router.push(`/clients/${clientId}/campaigns/new`)}
            >
              <Plus className="w-4 h-4" />
              Nueva Campaña
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-[var(--dark-text-muted)] mt-4">Cargando campañas...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-500/20 border border-red-500/50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-medium mb-2 text-center">{error}</p>
            <button
              onClick={loadCampaigns}
              className="text-red-400 hover:text-red-300 text-sm underline block mx-auto"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && campaigns.length === 0 && (
          <div className="card-dark">
            <div className="card-content">
              <div className="empty-state py-12">
                <Megaphone className="empty-state-icon" />
                <h4 className="empty-state-title">Sin campañas aún</h4>
                <p className="empty-state-description max-w-sm mx-auto">
                  Crea tu primera campaña para empezar a generar resultados
                </p>
                <Button 
                  className="btn-primary mt-6"
                  onClick={() => router.push(`/clients/${clientId}/campaigns/new`)}
                >
                  <Plus className="w-4 h-4" />
                  Crear Primera Campaña
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && !error && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/clients/${clientId}/campaigns/${campaign.id}`}
                className="block"
              >
                <div className="card-dark hover:border-lime-500/50 transition-all">
                  <div className="card-content">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`badge ${
                        campaign.status === 'active' ? 'badge-success' :
                        campaign.status === 'completed' ? 'badge-success' :
                        campaign.status === 'paused' ? 'badge-warning' :
                        'badge-neutral'
                      }`}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </span>
                      <Target className="w-5 h-5 text-lime-400" />
                    </div>

                    {/* Campaign Name */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {campaign.name}
                    </h3>

                    {/* Objective */}
                    <p className="text-[var(--dark-text-muted)] text-sm mb-4 line-clamp-2">
                      {campaign.objective || 'Sin objetivo definido'}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 pt-4 border-t border-[var(--dark-border)]">
                      {campaign.budget && (
                        <div className="flex items-center gap-2 text-sm text-[var(--dark-text-muted)]">
                          <DollarSign className="w-4 h-4" />
                          <span>{campaign.budget.toLocaleString('es-ES')} €</span>
                        </div>
                      )}
                      
                      {(campaign.start_date || campaign.end_date) && (
                        <div className="flex items-center gap-2 text-sm text-[var(--dark-text-muted)]">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
