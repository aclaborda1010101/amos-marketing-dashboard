"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ClientWizard } from "@/components/wizard/client-wizard"
import type { ClientFormData } from "@/components/wizard/client-wizard"
import { 
  Plus, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Bell,
  Sparkles,
  Calendar,
  BarChart3,
  Zap
} from "lucide-react"

export default function Dashboard() {
  const [showWizard, setShowWizard] = useState(false)
  const [clients, setClients] = useState<any[]>([])

  const handleCreateClient = async (data: ClientFormData) => {
    console.log("Creating client:", data)
    // TODO: Integrar con API
    setShowWizard(false)
    // Aquí iría la llamada a la API
  }

  // Stats de ejemplo
  const stats = [
    {
      title: "Clientes Activos",
      value: "0",
      change: "+0%",
      icon: Users,
      color: "blue"
    },
    {
      title: "Campañas en Curso",
      value: "0",
      change: "+0%",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Aprobaciones Pendientes",
      value: "0",
      change: "0 nuevas",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Publicaciones Programadas",
      value: "0",
      change: "Esta semana",
      icon: Calendar,
      color: "orange"
    }
  ]

  const quickActions = [
    {
      title: "Nuevo Cliente",
      description: "Onboarding completo con wizard",
      icon: Plus,
      action: () => setShowWizard(true),
      primary: true
    },
    {
      title: "Crear Campaña",
      description: "Lanzar nueva campaña",
      icon: Zap,
      action: () => console.log("Nueva campaña"),
      primary: false
    },
    {
      title: "Ver Calendario",
      description: "Contenido del mes",
      icon: Calendar,
      action: () => console.log("Ver calendario"),
      primary: false
    },
    {
      title: "Analytics",
      description: "Métricas y rendimiento",
      icon: BarChart3,
      action: () => console.log("Ver analytics"),
      primary: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AMOS v2.0</h1>
                <p className="text-xs text-slate-600">Marketing Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-white/50 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-in">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            ¡Bienvenido! 👋
          </h2>
          <p className="text-slate-600">
            Tu departamento de marketing virtualizado está listo
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: "from-blue-500 to-blue-600",
              purple: "from-purple-500 to-purple-600",
              green: "from-green-500 to-green-600",
              orange: "from-orange-500 to-orange-600"
            }[stat.color]

            return (
              <div
                key={stat.title}
                className="card-lovable hover-lift animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="badge-info">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className={`card-lovable text-left hover-lift transition-all animate-slide-in ${
                    action.primary ? 'gradient-primary text-white border-none' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    action.primary ? 'bg-white/20' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${action.primary ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <h4 className={`font-semibold mb-1 ${action.primary ? 'text-white' : 'text-slate-900'}`}>
                    {action.title}
                  </h4>
                  <p className={`text-sm ${action.primary ? 'text-blue-100' : 'text-slate-600'}`}>
                    {action.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Empty State - Clientes */}
        {clients.length === 0 && (
          <div className="card-lovable text-center py-16 animate-slide-in">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No tienes clientes todavía
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Crea tu primer cliente para empezar a usar AMOS. El wizard te guiará paso a paso.
            </p>
            <Button
              onClick={() => setShowWizard(true)}
              className="btn-primary gap-2"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Cliente
            </Button>
          </div>
        )}

        {/* Features Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-lovable">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">
              18 Especialistas IA
            </h4>
            <p className="text-sm text-slate-600">
              Brand Strategist, Creative Director, Copywriter, Social Media Manager y 14 más trabajando 24/7
            </p>
          </div>

          <div className="card-lovable">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Aprobaciones Inteligentes
            </h4>
            <p className="text-sm text-slate-600">
              Revisa y aprueba propuestas. Todo validado con el ADN de marca antes de llegar a ti
            </p>
          </div>

          <div className="card-lovable">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Analytics en Tiempo Real
            </h4>
            <p className="text-sm text-slate-600">
              Métricas, anomalías y oportunidades detectadas automáticamente
            </p>
          </div>
        </div>
      </main>

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
