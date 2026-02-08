"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Users,
  Megaphone,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

export default function Dashboard() {
  // Mock data - En producción vendría de la API
  const stats: Array<{
    label: string
    value: string
    change: string
    trend: 'up' | 'down' | 'neutral'
    icon: any
  }> = [
    {
      label: "Clientes Activos",
      value: "0",
      change: "+0%",
      trend: "up",
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

  const recentClients = [
    // Empty por ahora
  ]

  const recentActivity = [
    // Empty por ahora
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPath="/" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
            
            <Button className="btn-primary" size="sm">
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
                <div key={stat.label} className="stat-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
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
                      <span className="text-xs text-gray-500">{stat.change}</span>
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
              <div className="card-pro">
                <div className="card-header flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Clientes Recientes</h3>
                  <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                    Ver todos
                  </button>
                </div>
                <div className="card-content p-0">
                  {recentClients.length === 0 ? (
                    <div className="empty-state py-12">
                      <Users className="empty-state-icon" />
                      <h4 className="empty-state-title">No hay clientes todavía</h4>
                      <p className="empty-state-description max-w-sm mx-auto">
                        Crea tu primer cliente para empezar a gestionar campañas y contenido
                      </p>
                      <Button className="btn-primary">
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
                          <th>Estado</th>
                          <th>Campañas</th>
                          <th>Última Act.</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Datos cuando existan */}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="card-pro">
                <div className="card-header">
                  <h3 className="font-semibold text-gray-900">Actividad Reciente</h3>
                </div>
                <div className="card-content">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        No hay actividad reciente
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Activity items */}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-pro mt-4">
                <div className="card-header">
                  <h3 className="font-semibold text-gray-900">Acciones Rápidas</h3>
                </div>
                <div className="card-content space-y-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Cliente</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <Megaphone className="w-4 h-4" />
                    <span>Nueva Campaña</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Ver Calendario</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    <span>Aprobaciones</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="mt-6">
            <div className="card-pro">
              <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Aprobaciones Pendientes</h3>
                  <span className="badge badge-neutral">0</span>
                </div>
                <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                  Ver todas
                </button>
              </div>
              <div className="card-content">
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    No hay aprobaciones pendientes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">AMOS Core</span>
              </div>
              <p className="text-xs text-gray-500">Sistema operativo</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">18 Especialistas</span>
              </div>
              <p className="text-xs text-gray-500">Listos para trabajar</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Base de Datos</span>
              </div>
              <p className="text-xs text-gray-500">Pendiente configuración</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
