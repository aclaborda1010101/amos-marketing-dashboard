"use client"

import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { 
  Users,
  Zap,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function BrandDNAPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const brandDNA = {
    status: 'approved',
    values: ['Innovación', 'Transparencia', 'Excelencia'],
    tone: 'Profesional y cercano',
    positioning: 'Líder en soluciones tecnológicas',
    target: 'Empresas B2B tech-savvy',
    quality_score: 90
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
              <a href={`/clients/${clientId}`} className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Cliente
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <Zap className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Brand DNA</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="btn-primary" size="sm">
              <Sparkles className="w-4 h-4" />
              Regenerar Brand DNA
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Status Card */}
          <div className="card-dark mb-6">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Estado</h3>
                    <p className="text-sm text-[var(--dark-text-muted)]">Aprobado y activo</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{brandDNA.quality_score}%</div>
                  <div className="text-xs text-[var(--dark-text-subtle)]">Quality Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Valores de Marca */}
            <div className="card-dark">
              <div className="card-header">
                <h3 className="font-semibold text-white">Valores de Marca</h3>
              </div>
              <div className="card-content">
                <div className="flex flex-wrap gap-2">
                  {brandDNA.values.map((value, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tono de Voz */}
            <div className="card-dark">
              <div className="card-header">
                <h3 className="font-semibold text-white">Tono de Voz</h3>
              </div>
              <div className="card-content">
                <p className="text-[var(--dark-text-muted)]">{brandDNA.tone}</p>
              </div>
            </div>

            {/* Posicionamiento */}
            <div className="card-dark">
              <div className="card-header">
                <h3 className="font-semibold text-white">Posicionamiento</h3>
              </div>
              <div className="card-content">
                <p className="text-[var(--dark-text-muted)]">{brandDNA.positioning}</p>
              </div>
            </div>

            {/* Audiencia Objetivo */}
            <div className="card-dark">
              <div className="card-header">
                <h3 className="font-semibold text-white">Audiencia Objetivo</h3>
              </div>
              <div className="card-content">
                <p className="text-[var(--dark-text-muted)]">{brandDNA.target}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
