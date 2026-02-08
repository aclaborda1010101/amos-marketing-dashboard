"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { ClientWizard } from "@/components/wizard/client-wizard"
import type { ClientFormData } from "@/components/wizard/client-wizard"
import { supabase, type Client } from "@/lib/supabase"
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Megaphone,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  MoreHorizontal,
  ExternalLink
} from "lucide-react"

export default function Dashboard() {
  const [showWizard, setShowWizard] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Load clients from Supabase
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (formData: ClientFormData) => {
    try {
      // Upload logo if provided
      let logoUrl = null
      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, formData.logo)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(fileName)
        
        logoUrl = publicUrl
      }

      // Create client (using demo user ID - TODO: implement real auth)
      const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'
      
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            user_id: DEMO_USER_ID,
            name: formData.name,
            industry: formData.industry,
            business_description: formData.brief || '',
            website: formData.website || null,
            instagram_username: formData.instagram || null,
            linkedin_profile: formData.linkedin || null,
            facebook_page: formData.facebook || null
          }
        ])
        .select()
        .single()
      
      if (error) throw error

      // Create client state
      await supabase
        .from('client_state')
        .insert([{ client_id: data.id }])

      // Emit event
      await supabase
        .from('events')
        .insert([
          {
            event_type: 'client.created',
            client_id: data.id,
            source: 'dashboard',
            payload: { name: formData.name, industry: formData.industry }
          }
        ])

      // Reload clients
      await loadClients()
      setShowWizard(false)
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Error al crear el cliente. Verifica que las tablas estén creadas en Supabase.')
    }
  }

  const stats: Array<{
    label: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: any
  }> = [
    {
      label: "Clientes Activos",
      value: clients.length.toString(),
      change: `${clients.length} total`,
      trend: "neutral",
      icon: Users
    },
    {
      label: "Campañas Activas",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Megaphone
    },
    {
      label: "Publicaciones Este Mes",
      value: "0",
      change: "+0%",
      trend: "neutral",
      icon: Calendar
    },
    {
      label: "Aprobaciones Pendientes",
      value: "0",
      change: "0 urgentes",
      trend: "neutral",
      icon: CheckCircle
    }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white font-medium">Dashboard</span>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar clientes, campañas..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <Filter className="w-4 h-4" />
            </button>
            
            <Button 
              className="btn-primary" 
              size="sm"
              onClick={() => setShowWizard(true)}
            >
              <Plus className="w-4 h-4" />
              Nuevo Cliente
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
                      <Icon className="w-5 h-5 text-lime-400" />
                    </div>
                    {stat.trend === 'up' && (
                      <span className="stat-change positive flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    )}
                    {stat.trend === 'down' && (
                      <span className="stat-change negative flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {stat.change}
                      </span>
                    )}
                    {stat.trend === 'neutral' && (
                      <span className="text-xs text-[var(--dark-text-subtle)]">{stat.change}</span>
                    )}
                  </div>
                  <div className="stat-value mb-1">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Clients */}
            <div className="lg:col-span-2">
              <div className="card-dark">
                <div className="card-header flex items-center justify-between">
                  <h3 className="font-semibold text-white">Clientes Recientes</h3>
                  <button className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors">
                    Ver todos
                  </button>
                </div>
                <div className="card-content p-0">
                  {loading ? (
                    <div className="p-12 text-center">
                      <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm text-[var(--dark-text-muted)] mt-4">Cargando...</p>
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="empty-state py-12">
                      <Users className="empty-state-icon" />
                      <h4 className="empty-state-title">No hay clientes todavía</h4>
                      <p className="empty-state-description max-w-sm mx-auto">
                        Crea tu primer cliente para empezar a gestionar campañas y contenido
                      </p>
                      <Button 
                        className="btn-primary"
                        onClick={() => setShowWizard(true)}
                      >
                        <Plus className="w-4 h-4" />
                        Crear Cliente
                      </Button>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Industria</th>
                          <th>Website</th>
                          <th>Estado</th>
                          <th>Creado</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                {client.logo_url ? (
                                  <img 
                                    src={client.logo_url} 
                                    alt={client.name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-lime-500/20 flex items-center justify-center">
                                    <span className="text-xs font-bold text-lime-400">
                                      {client.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <span className="font-medium">{client.name}</span>
                              </div>
                            </td>
                            <td className="text-[var(--dark-text-muted)]">{client.industry}</td>
                            <td>
                              {client.website ? (
                                <a 
                                  href={client.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-lime-400 hover:text-lime-300 transition-colors"
                                >
                                  <span className="text-xs">Ver sitio</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-[var(--dark-text-subtle)]">-</span>
                              )}
                            </td>
                            <td>
                              <span className="badge badge-success">
                                {client.status}
                              </span>
                            </td>
                            <td className="text-[var(--dark-text-muted)] text-xs">
                              {new Date(client.created_at).toLocaleDateString('es-ES')}
                            </td>
                            <td>
                              <button className="icon-btn">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="font-semibold text-white">Actividad Reciente</h3>
                </div>
                <div className="card-content">
                  <div className="text-center py-8">
                    <Clock className="w-10 h-10 mx-auto mb-3 text-[var(--dark-text-subtle)]" />
                    <p className="text-sm text-[var(--dark-text-muted)]">
                      No hay actividad reciente
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-dark mt-4">
                <div className="card-header">
                  <h3 className="font-semibold text-white">Acciones Rápidas</h3>
                </div>
                <div className="card-content space-y-2">
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[var(--dark-surface-hover)] transition-colors text-[var(--dark-text-muted)] hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Cliente</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[var(--dark-surface-hover)] transition-colors text-[var(--dark-text-muted)] hover:text-white">
                    <Megaphone className="w-4 h-4" />
                    <span>Nueva Campaña</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[var(--dark-surface-hover)] transition-colors text-[var(--dark-text-muted)] hover:text-white">
                    <Calendar className="w-4 h-4" />
                    <span>Ver Calendario</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[var(--dark-surface-hover)] transition-colors text-[var(--dark-text-muted)] hover:text-white">
                    <CheckCircle className="w-4 h-4" />
                    <span>Aprobaciones</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="mt-6">
            <div className="card-dark">
              <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Aprobaciones Pendientes</h3>
                  <span className="badge badge-neutral">0</span>
                </div>
                <button className="text-sm text-lime-400 hover:text-lime-300 font-medium transition-colors">
                  Ver todas
                </button>
              </div>
              <div className="card-content">
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[var(--dark-text-subtle)]" />
                  <p className="text-sm text-[var(--dark-text-muted)]">
                    No hay aprobaciones pendientes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-dark p-4 border-l-2 border-lime-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">ManIAS Core</span>
              </div>
              <p className="text-xs text-[var(--dark-text-muted)]">Sistema operativo</p>
            </div>

            <div className="card-dark p-4 border-l-2 border-lime-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">Database</span>
              </div>
              <p className="text-xs text-[var(--dark-text-muted)]">{clients.length} clientes</p>
            </div>

            <div className="card-dark p-4 border-l-2 border-lime-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">18 Especialistas</span>
              </div>
              <p className="text-xs text-[var(--dark-text-muted)]">Listos para trabajar</p>
            </div>
          </div>

          {/* Branding Footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--dark-text-subtle)]">
            <Sparkles className="w-3 h-3 text-lime-500" />
            <span>Powered by ManIAS Marketing Autonomous System</span>
          </div>
        </main>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <ClientWizard
          onComplete={handleCreateClient}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  )
}
