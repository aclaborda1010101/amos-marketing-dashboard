'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api, type Campaign, type ScheduledPost, type Approval } from '@/lib/api'
import {
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [approvals, setApprovals] = useState<Approval[]>([])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [campaignsData, postsData, approvalsData] = await Promise.allSettled([
        api.listCampaigns(),
        api.listScheduledPosts(),
        api.listApprovals()
      ])

      if (campaignsData.status === 'fulfilled') {
        setCampaigns(campaignsData.value.campaigns || [])
      }
      if (postsData.status === 'fulfilled') {
        setPosts(postsData.value.posts || [])
      }
      if (approvalsData.status === 'fulfilled') {
        setApprovals(approvalsData.value.approvals || [])
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const publishedPosts = posts.filter(p => p.status === 'published')
  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
  const failedPosts = posts.filter(p => p.status === 'failed')
  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const pendingApprovals = approvals.filter(a => a.status === 'pending')
  const approvedApprovals = approvals.filter(a => a.status === 'approved')

  const stats = [
    {
      label: "Publicaciónes Totales",
      value: posts.length.toString(),
      change: publishedPosts.length > 0 ? `${publishedPosts.length} publicados` : "sin publicar",
      trend: publishedPosts.length > 0 ? "up" : "neutral",
      icon: BarChart3
    },
    {
      label: "Posts Programados",
      value: scheduledPosts.length.toString(),
      change: scheduledPosts.length > 0 ? "pendientes" : "ninguno",
      trend: scheduledPosts.length > 0 ? "up" : "neutral",
      icon: Clock
    },
    {
      label: "Tasa de Aprobación",
      value: approvals.length > 0
        ? Math.round((approvedApprovals.length / approvals.length) * 100) + '%'
        : '0%',
      change: `${approvedApprovals.length} de ${approvals.length}`,
      trend: approvedApprovals.length > 0 ? "up" : "neutral",
      icon: CheckCircle
    },
    {
      label: "Campañas Activas",
      value: activeCampaigns.length.toString(),
      change: `${campaigns.length} total`,
      trend: activeCampaigns.length > 0 ? "up" : "neutral",
      icon: Activity
    }
  ]

  // Group posts by platform
  const platformStats = posts.reduce((acc: Record<string, { total: number; published: number; failed: number }>, post) => {
    const platform = post.platform || 'Desconocido'
    if (!acc[platform]) {
      acc[platform] = { total: 0, published: 0, failed: 0 }
    }
    acc[platform].total++
    if (post.status === 'published') acc[platform].published++
    if (post.status === 'failed') acc[platform].failed++
    return acc
  }, {})

  // Group posts by date for activity chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const dailyActivity = last7Days.map(dateStr => {
    const count = posts.filter(p => {
      const postDate = new Date(p.scheduled_date).toISOString().split('T')[0]
      return postDate === dateStr
    }).length
    return { date: dateStr, count }
  })

  const maxDailyCount = Math.max(...dailyActivity.map(d => d.count), 1)

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/analytics" />
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Dashboard
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <BarChart3 className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Analytics</span>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar métricas..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <Filter className="w-4 h-4" />
            </button>
            <Button className="btn-primary" size="sm" onClick={loadData}>
              <Activity className="w-4 h-4" />
              Actualizar
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-[var(--dark-text-muted)]">Cargando analytics...</div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="stat-label">{stat.label}</div>
                      <stat.icon className="w-4 h-4 text-[var(--dark-text-subtle)]" />
                    </div>
                    <div className="stat-value mb-1">{stat.value}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-400' :
                      stat.trend === 'down' ? 'text-red-400' :
                      'text-[var(--dark-text-subtle)]'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Activity Chart */}
                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-white">Actividad Últimos 7 Dias</h3>
                  </div>
                  <div className="card-content">
                    {posts.length === 0 ? (
                      <div className="empty-state py-8">
                        <BarChart3 className="empty-state-icon" />
                        <p className="empty-state-description">
                          No hay datos de actividad. Programa publicaciónes para ver el gráfico.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-end gap-2 h-48 px-2">
                        {dailyActivity.map((day) => (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <div className="text-xs text-[var(--dark-text-subtle)]">{day.count}</div>
                            <div
                              className="w-full rounded-t bg-lime-500/60 transition-all hover:bg-lime-400/80"
                              style={{
                                height: `${Math.max((day.count / maxDailyCount) * 140, day.count > 0 ? 8 : 2)}px`
                              }}
                            />
                            <div className="text-xs text-[var(--dark-text-subtle)]">
                              {new Date(day.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform Distribution */}
                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-white">Distribución por Plataforma</h3>
                  </div>
                  <div className="card-content">
                    {Object.keys(platformStats).length === 0 ? (
                      <div className="empty-state py-8">
                        <Users className="empty-state-icon" />
                        <p className="empty-state-description">
                          No hay datos por plataforma disponibles.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(platformStats).map(([platform, data]) => (
                          <div key={platform}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white capitalize">{platform}</span>
                              <span className="text-sm text-[var(--dark-text-muted)]">{data.total} posts</span>
                            </div>
                            <div className="w-full bg-[var(--dark-surface)] rounded-full h-2">
                              <div
                                className="bg-lime-500 rounded-full h-2 transition-all"
                                style={{
                                  width: `${posts.length > 0 ? (data.total / posts.length) * 100 : 0}%`
                                }}
                              />
                                            </div>
                            <div className="flex gap-4 mt-1 text-xs">
                              <span className="text-green-400">{data.published} publicados</span>
                              {data.failed > 0 && (
                                <span className="text-red-400">{data.failed} fallidos</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Performance */}
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-white">Rendimiento de Campañas</h3>
                </div>
                <div className="card-content p-0">
                  {campaigns.length === 0 ? (
                    <div className="empty-state py-8">
                      <Activity className="empty-state-icon" />
                      <h4 className="empty-state-title">No hay campañas registradas</h4>
                      <p className="empty-state-description max-w-sm mx-auto">
                        Crea campañas desde la sección de Clientes para ver su rendimiento aquí.
                      </p>
                      <Button variant="outline" className="text-white border-[var(--dark-border)] mt-4" onClick={() => window.location.href = '/campaigns'}>
                        Ver Campañas
                      </Button>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Campana</th>
                          <th>Estado</th>
                          <th>Objetivo</th>
                          <th>Creada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign: Campaign) => (
                          <tr key={campaign.campaign_id}>
                            <td className="font-medium text-white">{campaign.name}</td>
                            <td>
                              <span className={`badge ${
                                campaign.status === 'active' ? 'badge-green' :
                                campaign.status === 'completed' ? 'badge-blue' :
                                campaign.status === 'paused' ? 'badge-yellow' :
                                'badge-gray'
                              }`}>
                                                  {campaign.status === 'active' ? 'Activa' :
                                 campaign.status === 'completed' ? 'Completada' :
                                 campaign.status === 'paused' ? 'Pausada' :
                                 campaign.status}
                              </span>
                            </td>
                            <td className="text-[var(--dark-text-muted)]">{campaign.objective || '-'}</td>
                            <td className="text-[var(--dark-text-muted)] text-sm">
                              {new Date(campaign.created_at).toLocaleDateString('es-ES')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Approval Summary */}
              {approvals.length > 0 && (
                <div className="card-dark mt-6">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold text-white">Resumen de Aprobaciónes</h3>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">{pendingApprovals.length}</div>
                        <div className="text-sm text-[var(--dark-text-muted)] mt-1">Pendientes</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="text-2xl font-bold text-green-400">{approvedApprovals.length}</div>
                        <div className="text-sm text-[var(--dark-text-muted)] mt-1">Aprobadas</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="text-2xl font-bold text-red-400">
                          {approvals.filter(a => a.status === 'rejected').length}
                        </div>
                        <div className="text-sm text-[var(--dark-text-muted)] mt-1">Rechazadas</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
