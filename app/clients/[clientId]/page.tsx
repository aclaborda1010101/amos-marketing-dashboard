"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/sidebar'
import { 
  Users,
  Zap, 
  Calendar, 
  TrendingUp,
  Users as UsersIcon,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const client = {
    id: clientId,
    name: 'Test Company',
    industry: 'Tech',
    website: 'https://testcompany.com',
    status: 'active',
    brand_dna_state: 'approved',
    campaigns_state: 'active',
    content_calendar_state: 'approved'
  }

  const sections = [
    {
      id: 'brand',
      name: 'Brand DNA',
      icon: Zap,
      status: 'approved',
      href: `/clients/${clientId}/brand`,
      description: 'Identidad y posicionamiento de marca',
      stats: { value: '90%', label: 'Quality Score' }
    },
    {
      id: 'campaigns',
      name: 'Campañas',
      icon: TrendingUp,
      status: 'active',
      href: `/clients/${clientId}/campaigns`,
      description: '5 campañas activas',
      stats: { value: '5', label: 'Activas' }
    },
    {
      id: 'calendar',
      name: 'Calendario',
      icon: Calendar,
      status: 'approved',
      href: `/clients/${clientId}/calendar`,
      description: '47 posts este mes',
      stats: { value: '47', label: 'Posts' }
    },
    {
      id: 'specialists',
      name: 'Especialistas',
      icon: UsersIcon,
      status: 'active',
      href: `/clients/${clientId}/specialists`,
      description: 'Equipo de bots asignados',
      stats: { value: '3', label: 'Bots' }
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-[var(--dark-text-muted)]" />
    }
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
              <Users className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">{client.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge badge-success">{client.status}</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Client Info Card */}
          <div className="card-dark mb-6">
            <div className="card-content">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{client.name}</h1>
                  <p className="text-[var(--dark-text-muted)] mb-4">{client.industry}</p>
                  {client.website && (
                    <a 
                      href={client.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-lime-400 hover:text-lime-300 transition-colors"
                    >
                      {client.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="block"
                >
                  <div className="card-dark hover:border-lime-500/50 transition-all cursor-pointer group">
                    <div className="card-content">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[var(--dark-surface-hover)] rounded-lg flex items-center justify-center group-hover:bg-lime-500/20 transition-colors">
                          <Icon className="w-6 h-6 text-lime-400" />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(section.status)}
                          <ArrowRight className="w-4 h-4 text-[var(--dark-text-subtle)] group-hover:text-lime-400 transition-colors" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2">{section.name}</h3>
                      <p className="text-sm text-[var(--dark-text-muted)] mb-4">{section.description}</p>
                      
                      <div className="pt-4 border-t border-[var(--dark-border)]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">{section.stats.value}</span>
                          <span className="text-sm text-[var(--dark-text-subtle)]">{section.stats.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
