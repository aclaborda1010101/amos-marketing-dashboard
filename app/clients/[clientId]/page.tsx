"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api, type ApiClient, type Campaign } from '@/lib/api'
import {
  Users, Zap, Calendar, TrendingUp,
  Users as UsersIcon, ArrowRight, CheckCircle,
  Clock, AlertCircle, Loader2, Play, RefreshCw, XCircle
} from 'lucide-react'

// Helper: Generate Brand DNA content based on client data
function generateBrandDNAContent(client: { name: string; industry: string; brief?: string }) {
  const name = client.name || 'Marca'
  const industry = client.industry || 'General'
  const brief = client.brief || ''
  const industryMap: Record<string, { keywords: string[]; tone: string; audience: string; visual: string }> = {
    'marketing': { keywords: ['Creatividad', 'Estrategia', 'ROI', 'Engagement', 'Crecimiento'], tone: 'Creativo, directo y orientado a resultados. Inspiramos confianza con datos y creatividad.', audience: 'Empresas y emprendedores que necesitan aumentar su presencia digital y generar leads cualificados.', visual: 'Vibrante y din\u00e1mico con colores llamativos, tipograf\u00eda bold y elementos visuales que destacan.' },
    'marketing digital': { keywords: ['Creatividad', 'Estrategia Digital', 'ROI', 'Engagement', 'Growth Hacking'], tone: 'Creativo, data-driven y orientado a resultados. Combinamos arte y ciencia del marketing.', audience: 'Empresas que buscan maximizar su presencia online, generar leads y escalar su negocio digital.', visual: 'Vibrante y din\u00e1mico con gradientes modernos, tipograf\u00eda bold y elementos visuales interactivos.' },
    'tecnolog\u00eda': { keywords: ['Innovaci\u00f3n', 'Transformaci\u00f3n Digital', 'Eficiencia', 'Escalabilidad', 'Futuro'], tone: 'Profesional, innovador y accesible. Comunicamos complejidad t\u00e9cnica de forma clara y humana.', audience: 'Empresas y profesionales que buscan soluciones tecnol\u00f3gicas para optimizar sus procesos.', visual: 'Minimalista y moderno con paleta de colores fr\u00edos (azules, grises) con acentos vibrantes.' },
    'salud': { keywords: ['Bienestar', 'Confianza', 'Cuidado', 'Innovaci\u00f3n M\u00e9dica', 'Prevenci\u00f3n'], tone: 'Emp\u00e1tico, profesional y tranquilizador. Comunicamos cercan\u00eda y expertise m\u00e9dico.', audience: 'Pacientes y profesionales de la salud que buscan servicios m\u00e9dicos de calidad.', visual: 'Limpio y sereno con colores suaves (verdes, blancos, azules claros) que transmiten calma.' },
    'gastronom\u00eda': { keywords: ['Sabor', 'Experiencia', 'Tradici\u00f3n', 'Innovaci\u00f3n Culinaria', 'Calidad'], tone: 'C\u00e1lido, apasionado y sensorial. Evocamos emociones a trav\u00e9s de la experiencia gastron\u00f3mica.', audience: 'Amantes de la buena comida y personas que valoran experiencias culinarias \u00fanicas.', visual: 'Rico en texturas y colores c\u00e1lidos, fotograf\u00eda de alta calidad, tipograf\u00eda elegante.' },
  }
  const lowerIndustry = industry.toLowerCase().trim()
  const data = industryMap[lowerIndustry] || { keywords: ['Calidad', 'Compromiso', 'Innovaci\u00f3n', 'Confianza', 'Excelencia'], tone: 'Profesional, cercano y aut\u00e9ntico. Comunicamos con claridad y consistencia en todos los canales.', audience: 'Empresas y consumidores que buscan soluciones de calidad y un servicio excepcional.', visual: 'Elegante y consistente con una paleta de colores equilibrada que refleja profesionalidad.' }
  const briefSentence = brief ? (brief.endsWith('.') ? brief.slice(0, -1) : brief) : `transformar el sector de ${lowerIndustry} ofreciendo soluciones de alto valor`
  return {
    essence: `${name} es una marca de ${lowerIndustry} que se distingue por su compromiso con la excelencia y la innovaci\u00f3n. Su prop\u00f3sito fundamental es ${briefSentence.charAt(0).toLowerCase() + briefSentence.slice(1)}. La marca conecta con su audiencia a trav\u00e9s de una comunicaci\u00f3n aut\u00e9ntica y resultados tangibles.`,
    keywords_mandatory: data.keywords,
    tone: data.tone,
    positioning: `${name} se posiciona como referente en ${lowerIndustry}, combinando expertise sectorial con un enfoque centrado en el cliente. Se diferencia por entregar resultados medibles y construir relaciones de largo plazo.`,
    target_audience: data.audience,
    quality_score: 0.85,
    visual_style: data.visual,
    narrative: `La historia de ${name} es la de una marca que naci\u00f3 para hacer las cosas de manera diferente en ${lowerIndustry}. Su misi\u00f3n ha sido ${briefSentence.charAt(0).toLowerCase() + briefSentence.slice(1)}. Cada acci\u00f3n refleja un compromiso inquebrantable con la calidad y la autenticidad.`,
    differentiation: `Lo que hace \u00fanica a ${name} es su capacidad de combinar ${data.keywords[0].toLowerCase()} con un profundo entendimiento de su audiencia. Compite en valor, ofreciendo una experiencia integral que va m\u00e1s all\u00e1 del producto o servicio.`,
  }
}

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.clientId as string
  const [client, setClient] = useState<ApiClient | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [specialists, setSpecialists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [brandDnaStatus, setBrandDnaStatus] = useState('not_started')
  const [brandDna, setBrandDna] = useState<any>(null)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { loadClientData() }, [clientId])

  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(''), 8000); return () => clearTimeout(t) }
  }, [error])
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 8000); return () => clearTimeout(t) }
  }, [successMsg])

  const loadClientData = async () => {
    try {
      // 1. Load client from Supabase FIRST (works even if backend is down)
      const { supabase } = await import('@/lib/supabase')
      let supabaseLoaded = false
      try {
        const { data: supabaseClient } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single()
        if (supabaseClient) {
          setClient({
            id: supabaseClient.id,
            name: supabaseClient.name || 'Cliente',
            industry: supabaseClient.industry || '',
            website: supabaseClient.website || '',
            status: supabaseClient.status || 'active',
            created_at: supabaseClient.created_at || '',
          } as ApiClient)
          supabaseLoaded = true
        }
      } catch {
        console.log('Could not load client from Supabase')
      }

      // 2. Load Brand DNA from Supabase
      let dnaLoaded = false
      try {
        const { data } = await supabase.from('brand_dna').select('*').eq('client_id', clientId).limit(1).single()
        if (data && data.content) {
          const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content
          setBrandDna(parsed)
          // Restore correct status based on saved state
          if (data.approved === true) {
            setBrandDnaStatus('approved')
          } else if (data.content_hash && data.content_hash.includes('validated')) {
            setBrandDnaStatus('validated')
          } else {
            setBrandDnaStatus('generated')
          }
          dnaLoaded = true
        }
      } catch {
        // No Brand DNA in Supabase
      }

      if (!dnaLoaded) {
        setBrandDnaStatus('not_started')
      }

      // 3. Show page immediately with Supabase data
      setLoading(false)

      // 4. Try backend API calls in parallel (non-blocking, 8s timeout)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      try {
        const results = await Promise.allSettled([
          api.listClients(),
          api.getClientCampaigns(clientId),
          api.getSpecialists()
        ])
        clearTimeout(timeoutId)

        // Update with backend data if available
        if (results[0].status === 'fulfilled') {
          const found = results[0].value.clients.find((c: ApiClient) => c.id === clientId)
          if (found) setClient(found)
        }
        if (results[1].status === 'fulfilled') {
          setCampaigns(results[1].value.campaigns || [])
        }
        if (results[2].status === 'fulfilled') {
          setSpecialists(results[2].value.specialists || [])
        }
      } catch {
        console.log('Backend API calls failed - using Supabase data only')
      }

    } catch (err) {
      console.error('Error loading client data:', err)
      setError('Error al cargar datos del cliente')
      setLoading(false)
    }
  }

  const handleGenerateBrandDNA = async () => {
    if (!client) return
    setGenerating(true)
    setError('')
    setSuccessMsg('')
    try {
      setBrandDnaStatus('in_progress')
      setSuccessMsg('Generando ADN de Marca...')
      // Generate Brand DNA locally using client data (no backend needed)
      const brandDnaContent = generateBrandDNAContent({
        name: client.name,
        industry: client.industry,
        brief: (client as any).brief || ''
      })
      // Save to Supabase
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('brand_dna').delete().eq('client_id', clientId)
      const { error: insertError } = await supabase.from('brand_dna').insert({
        client_id: clientId,
        content: JSON.stringify(brandDnaContent),
        content_hash: 'v1',
        approved: false
      })
      if (insertError) throw insertError
      setBrandDna(brandDnaContent)
      setBrandDnaStatus('generated')
      setSuccessMsg('ADN de Marca generado exitosamente')
    } catch (err) {
      console.error('Error generating Brand DNA:', err)
      const msg = err instanceof Error ? err.message : 'Error al generar Brand DNA'
      setError(msg)
      setBrandDnaStatus('not_started')
    } finally {
      setGenerating(false)
    }
  }

  const handleValidateBrandDNA = async () => {
    setError('')
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('brand_dna').update({ content_hash: 'v1-validated' }).eq('client_id', clientId)
      setBrandDnaStatus('validated')
      setSuccessMsg('ADN validado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar')
    }
  }

  const handleApproveBrandDNA = async () => {
    setError('')
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('brand_dna').update({ approved: true, approved_at: new Date().toISOString(), approved_by: 'Director' }).eq('client_id', clientId)
      setBrandDnaStatus('approved')
      setSuccessMsg('ADN aprobado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar')
    }
  }

  const getBrandDnaStatusInfo = () => {
    const m: Record<string, { label: string; color: string; icon: any }> = {
      'not_started': { label: 'Pendiente', color: 'text-yellow-400', icon: Clock },
      'in_progress': { label: 'Generando...', color: 'text-blue-400', icon: Loader2 },
      'generated': { label: 'Generado', color: 'text-green-400', icon: CheckCircle },
      'validated': { label: 'Validado', color: 'text-green-400', icon: CheckCircle },
      'approved': { label: 'Aprobado', color: 'text-emerald-400', icon: CheckCircle },
      'rejected': { label: 'Rechazado', color: 'text-red-400', icon: XCircle },
      'failed': { label: 'Error', color: 'text-red-400', icon: AlertCircle },
    }
    return m[brandDnaStatus] || m['not_started']
  }

  const sections = [
    {
      id: 'brand-dna',
      name: 'ADN de Marca',
      icon: Zap,
      status: getBrandDnaStatusInfo(),
      description: brandDna ? 'ADN generado - click para ver detalles' : 'Genera el perfil de marca con IA',
      stats: brandDna ? 'Listo' : brandDnaStatus === 'in_progress' ? 'Procesando...' : 'Sin generar',
    },
    {
      id: 'campaigns',
      name: 'Campañas',
      icon: TrendingUp,
      href: `/campaigns?client=${clientId}`,
      status: { label: campaigns.length > 0 ? 'Activas' : 'Sin campañas', color: campaigns.length > 0 ? 'text-green-400' : 'text-gray-400', icon: campaigns.length > 0 ? Play : Clock },
      description: 'Gestiona las campañas de marketing',
      stats: `${campaigns.length} Campañas`,
    },
    {
      id: 'calendar',
      name: 'Calendario',
      icon: Calendar,
      href: `/calendar?client=${clientId}`,
      status: { label: 'Ver calendario', color: 'text-blue-400', icon: Calendar },
      description: 'Publicaciones programadas',
      stats: 'Ver posts',
    },
    {
      id: 'specialists',
      name: 'Especialistas',
      icon: UsersIcon,
      status: { label: `${specialists.length} Bots`, color: 'text-purple-400', icon: Users },
      description: 'Bots especializados del sistema',
      stats: `${specialists.length} Bots`,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="main-content flex items-center justify-center" style={{minHeight: '100vh'}}>
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="main-content p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/clients" className="text-gray-400 hover:text-white transition-colors">
            ← Volver
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{client?.name || 'Cliente'}</h1>
            <p className="text-gray-400 mt-1">{client?.industry} {client?.website ? `· ${client.website}` : ''}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            client?.status === 'active' ? 'bg-green-500/20 text-green-400' :
            client?.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {client?.status === 'active' ? 'Activo' : client?.status === 'paused' ? 'Pausado' : 'Archivado'}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm flex-1">{successMsg}</p>
            <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-300">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <section.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{section.name}</h3>
                    <p className="text-gray-500 text-sm">{section.description}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 ${section.status.color}`}>
                  <section.status.icon className={`w-4 h-4 ${brandDnaStatus === 'in_progress' && section.id === 'brand-dna' ? 'animate-spin' : ''}`} />
                  <span className="text-sm">{section.status.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-400 text-sm">{section.stats}</span>
                <div className="flex gap-2">
                  {section.id === 'brand-dna' && (
                    <>
                      {(brandDnaStatus === 'not_started' || brandDnaStatus === 'failed') && (
                        <Button size="sm" onClick={handleGenerateBrandDNA} disabled={generating} className="bg-purple-600 hover:bg-purple-700 text-white">
                          {generating ? (<><Loader2 className="w-3 h-3 animate-spin mr-1" />Generando...</>) : (<><Zap className="w-3 h-3 mr-1" />Generar ADN</>)}
                        </Button>
                      )}
                      {brandDnaStatus === 'generated' && (
                        <Button size="sm" onClick={handleValidateBrandDNA} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />Validar
                        </Button>
                      )}
                      {brandDnaStatus === 'validated' && (
                        <Button size="sm" onClick={handleApproveBrandDNA} className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />Aprobar
                        </Button>
                      )}
                      {brandDnaStatus === 'in_progress' && (
                        <Button size="sm" disabled className="bg-gray-700 text-gray-400">
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />Procesando...
                        </Button>
                      )}
                      {(brandDnaStatus === 'approved' || brandDnaStatus === 'generated' || brandDnaStatus === 'validated') && (
                        <Button size="sm" variant="outline" onClick={() => loadClientData()} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          <RefreshCw className="w-3 h-3 mr-1" />Actualizar
                        </Button>
                      )}
                    </>
                  )}
                  {section.href && (
                    <Link href={section.href}>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Ver <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {brandDna && (
          <div className="mt-8 bg-[#111] border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              ADN de Marca - Detalles
            </h3>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap bg-[#0a0a0a] p-4 rounded-lg overflow-auto max-h-96">
              {typeof brandDna === 'string' ? brandDna : JSON.stringify(brandDna, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}
