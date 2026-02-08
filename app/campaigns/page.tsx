"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Filter,
  Megaphone,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react'

interface Campaign {
  campaign_id: string
  client_id: string
  name: string
  status: string
  objective: string
  budget: any
  created_at: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCampaigns(data || [])
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: "Campañas Activas",
      value: campaigns.filter(c => c.status === 'active').length.toString(),
      change: `${campaigns.length} total`,
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      label: "Presupuesto Total",
      value: "€0",
      change: "0 campañas",
      icon: DollarSign,
      color: "text-blue-500"
    },
    {
      label: "Impresiones",
      value: "0",
      change: "Este mes",
      icon: Users,
      color: "text-purple-500"
    },
    {
      label: "En Curso",
      value: campaigns.filter(c => c.status === 'active').length.toString(),
      change: "Campañas",
      icon: Calendar,
      color: "text-orange-500"
    }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/campaigns" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Dashboard
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <Megaphone className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Campañas</span>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar campañas..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <Filter className="w-4 h-4" />
            </button>
            
            <Button className="btn-primary" size="sm">
              <Plus className="w-4 h-4" />
              Nueva Campaña
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="stat-card hover:border-lime-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[var(--dark-surface-hover)] rounded-lg flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-[var(--dark-text-subtle)]">{stat.change}</span>
                  </div>
                  <div className="stat-value mb-1">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Campaigns List */}
          <div className="card-dark">
            <div className="card-header flex items-center justify-between">
              <h3 className="font-semibold text-white">Todas las Campañas</h3>
              <button className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors">
                Exportar
              </button>
            </div>
            <div className="card-content p-0">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-[var(--dark-text-muted)] mt-4">Cargando...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="empty-state py-12">
                  <Megaphone className="empty-state-icon" />
                  <h4 className="empty-state-title">No hay campañas todavía</h4>
                  <p className="empty-state-description max-w-sm mx-auto">
                    Comienza creando tu primera campaña o selecciona un cliente para ver sus campañas activas
                  </p>
                  <div className="flex gap-3 justify-center mt-6">
                    <Button variant="outline" className="text-white border-[var(--dark-border)]">
                      Ver Clientes
                    </Button>
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4" />
                      Nueva Campaña
                    </Button>
                  </div>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Campaña</th>
                      <th>Cliente</th>
                      <th>Objetivo</th>
                      <th>Presupuesto</th>
                      <th>Estado</th>
                      <th>Creada</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.campaign_id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-lime-500/20 flex items-center justify-center">
                              <Megaphone className="w-4 h-4 text-lime-400" />
                            </div>
                            <span className="font-medium">{campaign.name}</span>
                          </div>
                        </td>
                        <td className="text-[var(--dark-text-muted)]">{campaign.client_id}</td>
                        <td className="text-[var(--dark-text-muted)]">{campaign.objective}</td>
                        <td className="text-[var(--dark-text-muted)]">
                          {campaign.budget?.total ? `€${campaign.budget.total}` : '-'}
                        </td>
                        <td>
                          <span className={`badge ${
                            campaign.status === 'active' ? 'badge-success' :
                            campaign.status === 'paused' ? 'badge-warning' :
                            campaign.status === 'draft' ? 'badge-neutral' :
                            'badge-muted'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="text-[var(--dark-text-muted)] text-sm">
                          {new Date(campaign.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td>
                          <button className="icon-btn">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
