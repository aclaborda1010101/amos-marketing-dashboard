"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Upload, Building2, Globe, Briefcase, Save, X } from 'lucide-react'

export default function NewClientPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    status: 'active' as 'active' | 'paused' | 'archived'
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('El nombre del cliente es obligatorio')
      return
    }

    setSaving(true)
    setError('')

    try {
      let logo_url: string | undefined

      // Upload logo if provided
      if (logoFile) {
        try {
          const fileExt = logoFile.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `logos/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('client-logos')
            .upload(filePath, logoFile, { cacheControl: '3600', upsert: false })

          if (uploadError) {
            console.error('Logo upload error:', uploadError)
            // Don't block client creation if logo upload fails
            // Just continue without logo
          } else {
            const { data: urlData } = supabase.storage
              .from('client-logos')
              .getPublicUrl(filePath)
            logo_url = urlData.publicUrl
          }
        } catch (uploadErr) {
          console.error('Logo upload exception:', uploadErr)
          // Continue without logo
        }
      }

      // Insert client into Supabase
      const insertData: any = {
        name: form.name.trim(),
        industry: form.industry.trim() || 'Otros',
        website: form.website.trim() || null,
        status: form.status,
        brief: ''
      }

      if (logo_url) {
        insertData.logo_url = logo_url
      }

      const { data, error: insertError } = await supabase
        .from('clients')
        .insert([insertData])
        .select()

      if (insertError) {
        throw insertError
      }

      // Redirect to clients list
      router.push('/clients')
    } catch (err: any) {
      console.error('Error creating client:', err)
      setError(err.message || 'Error al crear el cliente')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-[var(--dark-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/clients">
            <Button variant="ghost" size="sm" className="text-[var(--dark-text-muted)] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Clientes
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Nuevo Cliente</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-[var(--dark-card)] rounded-xl border border-[var(--dark-border)] p-6 space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text-subtle)] mb-2">
                Logo del cliente (opcional)
              </label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border border-[var(--dark-border)]"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--dark-border)] flex flex-col items-center justify-center cursor-pointer hover:border-lime-400/50 transition-colors">
                    <Upload className="w-5 h-5 text-[var(--dark-text-muted)]" />
                    <span className="text-xs text-[var(--dark-text-muted)] mt-1">Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-[var(--dark-text-muted)]">
                  PNG, JPG o SVG. Maximo 2MB.
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text-subtle)] mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Nombre del cliente *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre de la empresa"
                className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--dark-text-muted)] focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50"
                required
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text-subtle)] mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Industria
              </label>
              <input
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="Ej: Tecnologia, Retail, Servicios..."
                className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--dark-text-muted)] focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text-subtle)] mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Sitio web
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://ejemplo.com"
                className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-lg px-4 py-3 text-white placeholder:text-[var(--dark-text-muted)] focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text-subtle)] mb-2">
                Estado
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full bg-[var(--dark-bg)] border border-[var(--dark-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50"
              >
                <option value="active">Activo</option>
                <option value="paused">Pausado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--dark-border)]">
              <Button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="btn-primary"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Cliente
                  </>
                )}
              </Button>
              <Link href="/clients">
                <Button type="button" variant="ghost" className="text-[var(--dark-text-muted)]">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

