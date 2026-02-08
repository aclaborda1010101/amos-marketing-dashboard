"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { 
  Users,
  Zap,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function BrandDNAPage() {
  const params = useParams()
  const clientId = params.clientId as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brandDNA, setBrandDNA] = useState<any>(null)

  // Load existing Brand DNA on mount
  useEffect(() => {
    loadBrandDNA()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const loadBrandDNA = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://manias-backend-production.up.railway.app'
      
      const response = await fetch(`${apiUrl}/brand-dna/${clientId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.brand_dna) {
          setBrandDNA({
            status: 'generated',
            values: data.brand_dna.keywords_mandatory || [],
            tone: data.brand_dna.tone || '',
            positioning: data.brand_dna.positioning || '',
            target: data.brand_dna.target_audience || '',
            quality_score: Math.round((data.brand_dna.quality_score || 0) * 100),
            essence: data.brand_dna.essence || '',
            visual_style: data.brand_dna.visual_style || '',
            narrative: data.brand_dna.narrative || '',
            differentiation: data.brand_dna.differentiation || ''
          })
        }
      }
    } catch (err) {
      console.error('Error loading brand DNA:', err)
    }
  }

  const regenerateBrandDNA = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://manias-backend-production.up.railway.app'
      
      const response = await fetch(`${apiUrl}/generate-brand-dna`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Error al generar Brand DNA')
      }

      // Reload Brand DNA after generation
      await loadBrandDNA()
      
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
      console.error('Error regenerating brand DNA:', err)
    } finally {
      setLoading(false)
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
              <a href={`/clients/${clientId}`} className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Cliente
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <Zap className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Brand DNA</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className="btn-primary" 
              size="sm"
              onClick={regenerateBrandDNA}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Regenerar Brand DNA
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !brandDNA && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
            </div>
          )}

          {/* Empty State */}
          {!loading && !brandDNA && (
            <div className="card-dark">
              <div className="card-content">
                <div className="empty-state py-12">
                  <Zap className="empty-state-icon" />
                  <h4 className="empty-state-title">No hay Brand DNA generado</h4>
                  <p className="empty-state-description max-w-sm mx-auto">
                    Genera el Brand DNA para este cliente para empezar a crear contenido y campañas
                  </p>
                  <Button 
                    className="btn-primary mt-6"
                    onClick={regenerateBrandDNA}
                  >
                    <Sparkles className="w-4 h-4" />
                    Generar Brand DNA
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Brand DNA Content */}
          {brandDNA && (
            <>
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
                  {brandDNA.values.map((value: string, index: number) => (
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
          </>
          )}
        </main>
      </div>
    </div>
  )
}
