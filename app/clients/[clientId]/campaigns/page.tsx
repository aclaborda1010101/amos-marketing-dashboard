'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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
  DollarSign
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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/clients/${clientId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Cliente
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Campañas
              </h1>
              <p className="text-slate-600">
                Gestiona todas las campañas de marketing del cliente
              </p>
            </div>
            
            <button
              onClick={() => router.push(`/clients/${clientId}/campaigns/new`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Nueva Campaña
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Cargando campañas...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium mb-2">{error}</p>
            <button
              onClick={loadCampaigns}
              className="text-red-600 hover:text-red-700 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && campaigns.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Sin campañas aún
            </h3>
            <p className="text-slate-600 mb-6">
              Crea tu primera campaña para empezar a generar resultados
            </p>
            <button
              onClick={() => router.push(`/clients/${clientId}/campaigns/new`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Campaña
            </button>
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
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:scale-105">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                    <Target className="w-5 h-5 text-slate-400" />
                  </div>

                  {/* Campaign Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {campaign.name}
                  </h3>

                  {/* Objective */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {campaign.objective || 'Sin objetivo definido'}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    {campaign.budget && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{campaign.budget.toLocaleString('es-ES')} €</span>
                      </div>
                    )}
                    
                    {(campaign.start_date || campaign.end_date) && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
