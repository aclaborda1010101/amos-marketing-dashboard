'use client'

import Link from 'next/link'
import { Plus, Building2, TrendingUp, Clock } from 'lucide-react'

const mockClients = [
  {
    id: 'test_client_01',
    name: 'Test Company',
    industry: 'Tech',
    status: 'active',
    campaigns: 5,
    posts: 47,
    brand_dna_state: 'approved',
    last_updated: '2024-02-08'
  },
  {
    id: 'client_02',
    name: 'Fashion Brand',
    industry: 'Retail',
    status: 'active',
    campaigns: 3,
    posts: 28,
    brand_dna_state: 'validated',
    last_updated: '2024-02-07'
  },
  {
    id: 'client_03',
    name: 'Food Startup',
    industry: 'Food & Beverage',
    status: 'active',
    campaigns: 2,
    posts: 15,
    brand_dna_state: 'generated',
    last_updated: '2024-02-06'
  }
]

export default function ClientsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-600 mt-2">Gestiona tus clientes y sus campañas</p>
          </div>
          
          <Link
            href="/clients/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </Link>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="block"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all hover:scale-105">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {client.status}
                  </span>
                </div>

                {/* Client Info */}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{client.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{client.industry}</p>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Campañas</span>
                    <span className="font-semibold text-slate-900">{client.campaigns}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Posts este mes</span>
                    <span className="font-semibold text-slate-900">{client.posts}</span>
                  </div>
                </div>

                {/* Brand DNA Status */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-600">Brand DNA:</span>
                    <span className={`font-medium ${
                      client.brand_dna_state === 'approved' 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`}>
                      {client.brand_dna_state}
                    </span>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  Actualizado {client.last_updated}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
