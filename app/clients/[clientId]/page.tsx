'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Users,
  CheckCircle2,
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

  const departments = [
    {
      id: 'brand',
      name: 'Brand DNA',
      icon: Zap,
      status: client.brand_dna_state,
      color: 'blue',
      href: `/clients/${clientId}/brand`,
      description: 'Identidad y posicionamiento de marca'
    },
    {
      id: 'campaigns',
      name: 'Campañas',
      icon: TrendingUp,
      status: client.campaigns_state,
      color: 'purple',
      href: `/clients/${clientId}/campaigns`,
      description: '5 campañas activas'
    },
    {
      id: 'calendar',
      name: 'Calendario',
      icon: Calendar,
      status: client.content_calendar_state,
      color: 'green',
      href: `/clients/${clientId}/calendar/2024-02`,
      description: '47 posts este mes'
    },
    {
      id: 'specialists',
      name: 'Especialistas',
      icon: Users,
      status: 'standby',
      color: 'orange',
      href: `/clients/${clientId}/specialists`,
      description: '18 especialistas disponibles'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'validated':
        return 'bg-blue-100 text-blue-700'
      case 'generated':
        return 'bg-yellow-100 text-yellow-700'
      case 'standby':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />
      case 'validated':
      case 'generated':
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Clientes
        </Link>

        {/* Client Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{client.name}</h1>
              <p className="text-slate-600 mb-4">{client.industry}</p>
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {client.website}
                </a>
              )}
            </div>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
              {client.status}
            </span>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon
            
            return (
              <Link key={dept.id} href={dept.href} className="block">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${dept.color}-500 to-${dept.color}-600 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(dept.status)}`}>
                      {getStatusIcon(dept.status)}
                      {dept.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h3>
                  <p className="text-slate-600 text-sm">{dept.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
