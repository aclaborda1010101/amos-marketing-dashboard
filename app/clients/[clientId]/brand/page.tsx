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
      const { supabase } = await import('@/lib/supabase')
      const { data, error: dbError } = await supabase
        .from('brand_dna')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (dbError || !data) {
        console.log('No Brand DNA found for client')
        return
      }

      const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content
      setBrandDNA({
        values: content.keywords_mandatory || [],
        tone: content.tone || '',
        positioning: content.positioning || '',
        target: content.target_audience || '',
        quality_score: Math.round((content.quality_score || 0) * 100),
        essence: content.essence || '',
        visual_style: content.visual_style || '',
        narrative: content.narrative || '',
        differentiation: content.differentiation || '',
        approved: data.approved || false
      })
    } catch (err) {
      console.error('Error loading brand DNA:', err)
    }
  }

  const regenerateBrandDNA = async () => {
    setLoading(true)
    setError(null)

    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Load client info for generation
      const { data: clientData } = await supabase
        .from('clients')
        .select('name, industry, brief')
        .eq('id', clientId)
        .single()

      const name = clientData?.name || 'Marca'
      const industry = clientData?.industry || 'General'
      const brief = clientData?.brief || ''
      const lowerIndustry = industry.toLowerCase().trim()

      const industryDefaults: Record<string, { keywords: string[]; tone: string; audience: string; visual: string }> = {
        'marketing': { keywords: ['Creatividad', 'Estrategia', 'ROI', 'Engagement', 'Crecimiento'], tone: 'Creativo, directo y orientado a resultados.', audience: 'Empresas y emprendedores', visual: 'Moderno y vibrante' },
        'marketing digital': { keywords: ['Estrategia Digital', 'ROI', 'Growth Hacking', 'Engagement', 'Data-Driven'], tone: 'Creativo, data-driven y orientado a resultados.', audience: 'Empresas que buscan presencia digital', visual: 'Digital-first, moderno' },
        'tecnologia': { keywords: ['Innovacion', 'Transformacion Digital', 'Eficiencia', 'Escalabilidad', 'Futuro'], tone: 'Profesional, innovador y accesible.', audience: 'Empresas en transformacion digital', visual: 'Tech, limpio y futurista' },
      }

      const data = industryDefaults[lowerIndustry] || { keywords: ['Calidad', 'Compromiso', 'Innovacion', 'Confianza', 'Excelencia'], tone: 'Profesional, cercano y autentico.', audience: 'Publico general y empresas', visual: 'Elegante y profesional' }
      const briefText = brief || 'transformar su sector ofreciendo soluciones de alto valor'

      const brandContent = {
        essence: name + ' es una marca de ' + lowerIndustry + ' comprometida con la excelencia y la innovacion. ' + briefText,
        keywords_mandatory: data.keywords,
        tone: data.tone,
        positioning: name + ' se posiciona como referente en ' + lowerIndustry + ', combinando expertise con enfoque centrado en el cliente.',
        target_audience: data.audience,
        quality_score: 0.85,
        visual_style: data.visual,
        narrative: 'La historia de ' + name + ' es una de pasion por ' + lowerIndustry + ' y compromiso con resultados excepcionales.',
        differentiation: 'Lo que hace unica a ' + name + ' es su combinacion de creatividad, estrategia y enfoque personalizado.'
      }

      // Delete old and insert new
      await supabase.from('brand_dna').delete().eq('client_id', clientId)
      const { error: insertError } = await supabase.from('brand_dna').insert({
        client_id: clientId,
        content: JSON.stringify(brandContent),
        content_hash: 'v1',
        approved: false
      })
      if (insertError) throw insertError

      // Reload
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
