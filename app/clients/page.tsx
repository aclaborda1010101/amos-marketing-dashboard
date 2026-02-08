"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { supabase, type Client } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Filter,
  Users,
  Building2,
  TrendingUp,
  Calendar,
  Megaphone,
  Trash2
} from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

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

  const deleteClient = async (clientId: string, clientName: string, e: React.MouseEvent) => {
    e.preventDefault() // Evitar navegar al hacer click
    e.stopPropagation()
    
    if (!confirm(`¿Eliminar cliente "${clientName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
      
      if (error) throw error
      
      // Recargar lista
      await loadClients()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error al eliminar cliente')
    }
  }

  const stats = [
    {
      label: "Clientes Totales",
      value: clients.length.toString(),
      icon: Users,
      color: "text-lime-400"
    },
    {
      label: "Nuevos Este Mes",
      value: "0",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      label: "Campañas Activas",
      value: "0",
      icon: Megaphone,
      color: "text-blue-500"
    },
    {
      label: "Posts Programados",
      value: "0",
      icon: Calendar,
      color: "text-purple-500"
    }
  ]

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
              <Users className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Clientes</span>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <Filter className="w-4 h-4" />
            </button>
            
            <Link href="/clients/new">
              <Button className="btn-primary" size="sm">
                <Plus className="w-4 h-4" />
                Nuevo Cliente
              </Button>
            </Link>
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
                  </div>
                  <div className="stat-value mb-1">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : clients.length === 0 ? (
              <div className="col-span-full">
                <div className="card-dark">
                  <div className="card-content">
                    <div className="empty-state py-12">
                      <Users className="empty-state-icon" />
                      <h4 className="empty-state-title">No hay clientes todavía</h4>
                      <p className="empty-state-description max-w-sm mx-auto">
                        Crea tu primer cliente para empezar a gestionar campañas y contenido
                      </p>
                      <Link href="/clients/new">
                        <Button className="btn-primary mt-6">
                          <Plus className="w-4 h-4" />
                          Crear Cliente
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="block"
                >
                  <div className="card-dark hover:border-lime-500/50 transition-all cursor-pointer">
                    <div className="card-content">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {client.logo_url ? (
                            <img 
                              src={client.logo_url} 
                              alt={client.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-lime-500/20 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-lime-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-success">
                            {client.status}
                          </span>
                          <button
                            onClick={(e) => deleteClient(client.id, client.name, e)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="text-lg font-semibold text-white mb-1">{client.name}</h3>
                      <p className="text-sm text-[var(--dark-text-muted)] mb-4">{client.industry}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--dark-border)]">
                        <div>
                          <p className="text-xs text-[var(--dark-text-subtle)]">Campañas</p>
                          <p className="text-base font-semibold text-white">0</p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--dark-text-subtle)]">Posts</p>
                          <p className="text-base font-semibold text-white">0</p>
                        </div>
                      </div>

                      {/* Brand DNA Status */}
                      <div className="mt-4 pt-4 border-t border-[var(--dark-border)]">
                        <div className="flex items-center gap-2 text-xs">
                          <TrendingUp className="w-3 h-3 text-lime-400" />
                          <span className="text-[var(--dark-text-muted)]">Brand DNA:</span>
                          <span className="text-lime-400 font-medium">Pendiente</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
