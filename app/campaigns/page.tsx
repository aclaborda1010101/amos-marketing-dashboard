"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api, type Campaign, type ApiClient } from '@/lib/api'
import { Plus, Search, Filter, Megaphone, TrendingUp, Users, Calendar, DollarSign, BarChart3, Loader2, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [clients, setClients] = useState<ApiClient[]>([])
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [wizardStep, setWizardStep] = useState(1)
  const [form, setForm] = useState({
    client_id: '',
    name: '',
    objective: '',
    platforms: [] as string[],
    budget: '',
    start_date: '',
    end_date: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(''), 6000); return () => clearTimeout(t) }
  }, [error])
  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(''), 6000); return () => clearTimeout(t) }
  }, [success])

  const loadData = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')

      // Load clients from Supabase
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (clientsData) {
        setClients(clientsData.map((c: any) => ({
          id: c.id,
          name: c.name,
          industry: c.industry || '',
          website: c.website || '',
          status: c.status || 'active',
          brief: c.brief || ''
        })))
      }

      // Load campaigns from Supabase
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .order('id', { ascending: false })

      if (campaignsData) {
        setCampaigns(campaignsData.map((c: any) => ({
          id: String(c.id),
          client_id: c.client_id,
          name: c.campaign_name || '',
          objective: c.objective || '',
          platform: c.platform || '',
          budget: typeof c.budget === 'number' ? c.budget : (c.budget || 0),
          status: 'active',
          start_date: '',
          end_date: ''
        })))
      }

      // Also try URL param for pre-selected client
      const params = new URLSearchParams(window.location.search)
      const preClient = params.get('client')
      if (preClient) {
        setForm(prev => ({ ...prev, client_id: preClient }))
        setShowWizard(true)
      }
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const togglePlatform = (p: string) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p]
    }))
  }


  // Auto-generate campaign content (posts, calendar, approvals)
  const generateCampaignContent = async (campaignId: number, clientId: string, campaignName: string, platform: string, objective: string) => {
    const { supabase } = await import('@/lib/supabase')
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 28)

    let clientName = clientId
    try {
      const { data: cd } = await supabase.from('clients').select('name').eq('id', clientId).single()
      if (cd) clientName = cd.name
    } catch {}

    const makePosts = (obj: string): string[] => {
      const m: Record<string, string[]> = {
        awareness: ['Descubre por que ' + clientName + ' es lider. #Innovacion', 'Conoce nuestra historia. #MarcaLider', 'Cada detalle importa en ' + clientName + '.', 'Nuestra mision: lo mejor para ti.', 'Vision de futuro de ' + clientName + '.', 'Calidad y pasion. Bienvenido.'],
        engagement: ['Que valoras de ' + clientName + '? Cuentanos!', 'SORTEO! Etiqueta 2 amigos y siguenos.', 'Comparte tu experiencia con nosotros!', 'Cual es tu favorito? A) Clasico B) Premium', 'Detras de camaras en ' + clientName + '.', 'Que te gustaria ver proximamente?'],
        conversion: ['OFERTA: 20% en ' + clientName + '. Solo esta semana!', 'Los mas vendidos con envio gratis.', 'Ultimas unidades al mejor precio!', 'Flash Sale: 48h precios increibles.', 'La mejor inversion segun clientes.', 'Pack exclusivo con regalo incluido!'],
        branding: ['Innovacion, Calidad y Cercania. Somos ' + clientName + '.', 'Nuestra historia: de sueno a referente.', clientName + ' y la comunidad local.', 'El equipo detras de ' + clientName + '.', 'Diseno, calidad y proposito.', 'De lo local a lo global.'],
      }
      return m[obj] || m['awareness']
    }

    const templates = makePosts(objective)
    const posts = []
    const totalPosts = 8

    for (let i = 0; i < totalPosts; i++) {
      const postDate = new Date(startDate)
      const weekNum = Math.floor(i / 2)
      const dayInWeek = i % 2 === 0 ? 1 : 4
      postDate.setDate(postDate.getDate() + weekNum * 7 + dayInWeek)
      posts.push({
        post_id: 'post-' + campaignId + '-' + (i + 1),
        client_id: clientId,
        content: templates[i % templates.length],
        platform: platform,
        scheduled_date: postDate.toISOString().split('T')[0],
        status: 'draft',
        created_at: new Date().toISOString(),
      })
    }

    try { await supabase.from('posts').insert(posts) } catch {}

    try {
      await supabase.from('content_calendars').insert({
        campaign_id: campaignId, client_id: clientId,
        name: 'Calendario - ' + campaignName,
        status: 'active', objective: objective,
        platforms: JSON.stringify([platform]),
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        summary: totalPosts + ' publicaciones en ' + platform + ' durante 4 semanas.',
        submitted_at: new Date().toISOString(),
      })
    } catch {}

    try {
      await supabase.from('approval_queue').insert([
        { request_id: 'plan-' + campaignId, client_id: clientId, type: 'campaign_plan', status: 'pending',
          content: JSON.stringify({ campaign_name: campaignName, platform, objective, total_posts: totalPosts }),
          submitted_at: new Date().toISOString() },
        { request_id: 'content-' + campaignId, client_id: clientId, type: 'content_batch', status: 'pending',
          content: JSON.stringify({ campaign_name: campaignName, batch_size: totalPosts, samples: posts.slice(0,2).map(p => p.content) }),
          submitted_at: new Date().toISOString() },
      ])
    } catch {}

    return { postsCreated: posts.length }
  }
  const handleCreate = async () => {
    if (!form.client_id || !form.name || !form.objective) {
      setError('Completa los campos obligatorios: cliente, nombre y objetivo')
      return
    }
    setCreating(true)
    setError('')
    try {
      const { supabase } = await import('@/lib/supabase')

      const platforms = form.platforms.length > 0 ? form.platforms.join(', ') : 'meta'
      const month = form.start_date
        ? form.start_date.substring(0, 7)
        : new Date().toISOString().substring(0, 7)

      const { data: inserted, error: insertError } = await supabase.from('campaigns').insert({
        client_id: form.client_id,
        campaign_name: form.name,
        objective: form.objective,
        platform: platforms,
        budget: form.budget ? Number(form.budget) : 0,
        duration: '7 dias'
      }).select('id').single()

      if (insertError) throw insertError

      // Auto-generate campaign content
      const campaignId = inserted?.id || 0
      try {
        await generateCampaignContent(campaignId, form.client_id, form.name, platforms, form.objective)
        setSuccess('Campana creada con posts, calendario y propuestas generados!')
      } catch {
        setSuccess('Campana creada (contenido se generara luego)')
      }
      setShowWizard(false)
      setWizardStep(1)
      setForm({ client_id: '', name: '', objective: '', platforms: [], budget: '', start_date: '', end_date: '' })
      loadData()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear campa\u00f1a'
      setError(msg)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!campaignId) return
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error: delError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', Number(campaignId))
      if (delError) throw delError
      setSuccess('Campana eliminada')
      setDeleteConfirm(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
      setDeleteConfirm(null)
    }
  }

  const platformOptions = [
    { id: 'instagram', label: 'Instagram', icon: '📷' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'twitter', label: 'X/Twitter', icon: '🐦' },
    { id: 'facebook', label: 'Facebook', icon: '👍' },
    { id: 'youtube', label: 'YouTube', icon: '▶️' },
  ]

  const stats = [
    { label: "Campañas Activas", value: campaigns.filter(c => c.status === 'active').length.toString(), change: `${campaigns.length} total`, icon: TrendingUp, color: "text-green-500" },
    { label: "Presupuesto Total", value: "€0", change: `${campaigns.length} campañas`, icon: DollarSign, color: "text-blue-500" },
    { label: "Impresiones", value: "0", change: "Este mes", icon: Users, color: "text-purple-500" },
    { label: "En Curso", value: campaigns.filter(c => c.status === 'active').length.toString(), change: "Campañas", icon: Calendar, color: "text-orange-500" }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/campaigns" />
      <div className="main-content">
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">Dashboard</a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <Megaphone className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Campañas</span>
            </div>
          </div>
          <Button
            className="btn-primary"
            size="sm"
            onClick={() => { setShowWizard(true); setWizardStep(1) }}
          >
            <Plus className="w-4 h-4" />
            Nueva Campaña
          </Button>
        </header>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400"><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="stat-card hover:border-lime-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[var(--dark-surface-hover)] rounded-lg flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-[var(--dark-text-subtle)]">{stat.change}</span>
                  </div>
                  <div className="stat-value mb-1">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="card-dark">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-white font-semibold">Todas las Campañas</h2>
              <span className="text-sm text-[var(--dark-text-subtle)]">{campaigns.length} total</span>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-lime-400" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16">
                <Megaphone className="w-12 h-12 text-[var(--dark-text-subtle)] mx-auto mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">No hay campañas todavía</h3>
                <p className="text-[var(--dark-text-muted)] mb-6">
                  Crea tu primera campaña para empezar a gestionar tu marketing.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="text-white border-[var(--dark-border)]" onClick={() => window.location.href = '/clients'}>
                    Ver Clientes
                  </Button>
                  <Button className="btn-primary" onClick={() => { setShowWizard(true); setWizardStep(1) }}>
                    <Plus className="w-4 h-4" />
                    Nueva Campaña
                  </Button>
                </div>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Campaña</th>
                    <th>Cliente</th>
                    <th>Objetivo</th>
                    <th>Presupuesto</th>
                    <th>Estado</th>
                    <th>Creada</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id || campaign.campaign_id}>
                      <td className="font-medium text-white">{campaign.name}</td>
                      <td>{campaign.client_id?.substring(0, 8)}...</td>
                      <td className="max-w-[200px] truncate">{campaign.objective}</td>
                      <td>{campaign.budget ? `€${campaign.budget}` : '-'}</td>
                      <td>
                        <span className={`badge ${
                          campaign.status === 'active' ? 'badge-success' :
                          campaign.status === 'completed' ? 'badge-info' :
                          campaign.status === 'paused' ? 'badge-warning' :
                          'badge-muted'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="text-[var(--dark-text-muted)] text-sm">
                        {new Date(campaign.submitted_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="flex gap-1">
                        <button className="icon-btn">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="icon-btn text-red-400 hover:text-red-300" onClick={() => setDeleteConfirm(campaign.id)} title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Campaign Wizard Modal */}
        {showWizard && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-lg p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {wizardStep === 1 ? 'Paso 1: Informaci\u00f3n Básica' : wizardStep === 2 ? 'Paso 2: Plataformas y Fechas' : 'Paso 3: Confirmar'}
                </h2>
                <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= wizardStep ? 'bg-lime-400' : 'bg-gray-700'}`} />
                ))}
              </div>

              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Cliente *</label>
                    <select
                      value={form.client_id}
                      onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none"
                    >
                      <option value="">Seleccionar cliente...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nombre de la campaña *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Ej: Lanzamiento Primavera 2026"
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Objetivo *</label>
                    <textarea
                      value={form.objective}
                      onChange={e => setForm(p => ({ ...p, objective: e.target.value }))}
                      placeholder="Describe el objetivo principal de la campaña..."
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Presupuesto (€)</label>
                    <input
                      type="number"
                      value={form.budget}
                      onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                      placeholder="Ej: 5000"
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Plataformas</label>
                    <div className="grid grid-cols-2 gap-3">
                      {platformOptions.map(p => (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            form.platforms.includes(p.id)
                              ? 'border-lime-400 bg-lime-400/10 text-white'
                              : 'border-gray-700 bg-[#1a1a1a] text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <span className="mr-2">{p.icon}</span>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Fecha inicio</label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Fecha fin</label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-white focus:border-lime-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cliente:</span>
                      <span className="text-white">{clients.find(c => c.id === form.client_id)?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Campaña:</span>
                      <span className="text-white">{form.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Objetivo:</span>
                      <span className="text-white text-right max-w-[250px]">{form.objective || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plataformas:</span>
                      <span className="text-white">{form.platforms.length > 0 ? form.platforms.join(', ') : 'Todas'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Presupuesto:</span>
                      <span className="text-white">{form.budget ? `€${form.budget}` : 'No definido'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Periodo:</span>
                      <span className="text-white">{form.start_date && form.end_date ? `${form.start_date} - ${form.end_date}` : 'No definido'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Al confirmar, se generará automáticamente un calendario de contenido con publicaciones optimizadas por IA.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-8">
                {wizardStep > 1 && (
                  <Button variant="outline" className="flex-1 text-white border-gray-600" onClick={() => setWizardStep(s => s - 1)}>
                    Anterior
                  </Button>
                )}
                {wizardStep < 3 ? (
                  <Button
                    className="btn-primary flex-1"
                    onClick={() => setWizardStep(s => s + 1)}
                    disabled={wizardStep === 1 && (!form.client_id || !form.name || !form.objective)}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    className="btn-primary flex-1"
                    onClick={handleCreate}
                    disabled={creating}
                  >
                    {creating ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creando...</>
                    ) : (
                      <><CheckCircle className="w-4 h-4 mr-2" />Crear Campaña</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="modal-overlay" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50}}>
            <div className="card p-6" style={{maxWidth:'400px',width:'100%'}}>
              <h3 className="text-lg font-semibold text-white mb-3">Eliminar Campana</h3>
              <p className="text-[var(--dark-text-secondary)] mb-4">Estas seguro de que quieres eliminar esta campana? Esta accion no se puede deshacer.</p>
              <div className="flex gap-3 justify-end">
                <button className="btn-secondary px-4 py-2 rounded" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
                <button className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-medium" onClick={() => handleDeleteCampaign(deleteConfirm)}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
