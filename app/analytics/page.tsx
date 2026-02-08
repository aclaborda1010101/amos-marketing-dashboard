"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
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
  Activity
} from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const stats = [
    {
      label: "Impresiones Totales",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Eye
    },
    {
      label: "Clics",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: MousePointer
    },
    {
      label: "Conversiones",
      value: "0",
      change: "0% CTR",
      trend: "neutral",
      icon: Users
    },
    {
      label: "Gasto Total",
      value: "€0",
      change: "€0 CPC",
      trend: "neutral",
      icon: DollarSign
    }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/analytics" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
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
            
            <Button variant="outline" className="text-white border-[var(--dark-border)]" size="sm">
              Últimos 7 días
            </Button>
            <Button variant="outline" className="text-white border-[var(--dark-border)]" size="sm">
              Últimos 30 días
            </Button>
            <Button className="btn-primary" size="sm">
              Exportar Reporte
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card-dark">
              <div className="card-header">
                <h3 className="font-semibold text-white">Rendimiento por Plataforma</h3>
              </div>
              <div className="card-content">
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-[var(--dark-border)] rounded-lg">
                  <div className="text-center text-[var(--dark-text-muted)]">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de rendimiento</p>
                    <p className="text-sm">(próximamente)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-dark">
              <div className="card-header">
                <h3 className="font-semibold text-white">Tendencias de Engagement</h3>
              </div>
              <div className="card-content">
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-[var(--dark-border)] rounded-lg">
                  <div className="text-center text-[var(--dark-text-muted)]">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Gráfico de tendencias</p>
                    <p className="text-sm">(próximamente)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Content */}
          <div className="card-dark">
            <div className="card-header">
              <h3 className="font-semibold text-white">Contenido de Mayor Rendimiento</h3>
            </div>
            <div className="card-content">
              <div className="empty-state py-12">
                <TrendingUp className="empty-state-icon" />
                <h4 className="empty-state-title">No hay datos disponibles todavía</h4>
                <p className="empty-state-description max-w-sm mx-auto">
                  Los datos aparecerán aquí cuando tengas campañas activas
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
