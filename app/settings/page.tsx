"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Zap,
  Save,
  Key,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
}

interface NotificationSettings {
  newApprovals: boolean
  campaignAlerts: boolean
  weeklySummary: boolean
  marketingEmails: boolean
}

interface IntegrationStatus {
  name: string
  connected: boolean
  checking: boolean
  detail?: string
}

const STORAGE_KEYS = {
  profile: 'manias_settings_profile',
  notifications: 'manias_settings_notifications'
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: 'Director'
  })

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newApprovals: true,
    campaignAlerts: true,
    weeklySummary: true,
    marketingEmails: false
  })

  // Integrations state
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    { name: 'ManIAS Backend API', connected: false, checking: true },
    { name: 'Supabase', connected: false, checking: true },
    { name: 'Google Analytics', connected: false, checking: false },
    { name: 'Meta Business Suite', connected: false, checking: false },
    { name: 'LinkedIn', connected: false, checking: false }
  ])
  const [backendDetail, setBackendDetail] = useState<Record<string, unknown> | null>(null)

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.profile)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      }
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.notifications)
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs))
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Check integrations on mount
  useEffect(() => {
    checkIntegrations()
  }, [])

  const checkIntegrations = async () => {
    setIntegrations(prev => prev.map(i =>
      i.name === 'ManIAS Backend API' || i.name === 'Supabase'
        ? { ...i, checking: true }
        : i
    ))

    // Check ManIAS Backend
    try {
      const health = await api.getHealthDetail()
      setBackendDetail(health)
      setIntegrations(prev => prev.map(i =>
        i.name === 'ManIAS Backend API'
          ? { ...i, connected: true, checking: false, detail: 'Operativo' }
          : i
      ))
    } catch {
      setIntegrations(prev => prev.map(i =>
        i.name === 'ManIAS Backend API'
          ? { ...i, connected: false, checking: false, detail: 'Sin conexión' }
          : i
      ))
    }

    // Check Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl) {
        setIntegrations(prev => prev.map(i =>
          i.name === 'Supabase'
            ? { ...i, connected: true, checking: false, detail: 'Configurado' }
            : i
        ))
      } else {
        setIntegrations(prev => prev.map(i =>
          i.name === 'Supabase'
            ? { ...i, connected: false, checking: false, detail: 'URL no configurada' }
            : i
        ))
      }
    } catch {
      setIntegrations(prev => prev.map(i =>
        i.name === 'Supabase'
          ? { ...i, connected: false, checking: false, detail: 'Error' }
          : i
      ))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      if (activeTab === 'profile') {
        localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
      } else if (activeTab === 'notifications') {
        localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications))
      }
      // Small delay for UX
      await new Promise(r => setTimeout(r, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciónes', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'integrations', label: 'Integraciónes', icon: Zap }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/settings" />
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Dashboard
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <SettingsIcon className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Configuración</span>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar configuración..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[var(--dark-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSaved(false) }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-lime-400 border-lime-400'
                    : 'text-[var(--dark-text-muted)] border-transparent hover:text-white hover:border-[var(--dark-border)]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card-dark max-w-2xl">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Información Personal</h3>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[var(--dark-text-muted)]">Nombre</Label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      placeholder="Tu nombre"
                      className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--dark-text-muted)]">Apellidos</Label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      placeholder="Tus apellidos"
                      className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--dark-text-muted)]">Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--dark-text-muted)]">Empresa</Label>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    placeholder="Nombre de tu empresa"
                    className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--dark-text-muted)]">Rol</Label>
                  <Input
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    placeholder="Director"
                    className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card-dark max-w-2xl">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-white">Preferencias de Notificaciónes</h3>
              </div>
              <div className="card-content space-y-1">
                {[
                  { key: 'newApprovals' as const, label: 'Nuevas Aprobaciones', desc: 'Recibir notificaciónes cuando haya nuevas propuestas' },
                  { key: 'campaignAlerts' as const, label: 'Alertas de Campana', desc: 'Notificaciónes sobre rendimiento de campanas' },
                  { key: 'weeklySummary' as const, label: 'Resumen Semanal', desc: 'Recibir resumen semanal de actividad' },
                  { key: 'marketingEmails' as const, label: 'Emails de Marketing', desc: 'Recibir actualizaciones y novedades del producto' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-[var(--dark-border)] last:border-0">
                    <div>
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-sm text-[var(--dark-text-muted)]">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[var(--dark-surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-white">Cambiar Contrasena</h3>
                </div>
                <div className="card-content space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[var(--dark-text-muted)]">Contrasena Actual</Label>
                    <Input
                      type="password"
                      className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--dark-text-muted)]">Nueva Contrasena</Label>
                    <Input
                      type="password"
                      className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--dark-text-muted)]">Confirmar Nueva Contrasena</Label>
                    <Input
                      type="password"
                      className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-white">Autenticacion de Dos Factores</h3>
                </div>
                <div className="card-content">
                  <p className="text-[var(--dark-text-muted)] mb-4">
                    Anade una capa extra de seguridad a tu cuenta
                  </p>
                  <Button variant="outline" className="text-white border-[var(--dark-border)]">
                    <Shield className="w-4 h-4 mr-2" />
                    Activar 2FA
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 max-w-2xl">
              {/* Backend Connection Status */}
              <div className="card-dark">
                <div className="card-header flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Estado de Conexiónes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-[var(--dark-border)]"
                    onClick={checkIntegrations}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Verificar
                  </Button>
                </div>
                <div className="card-content space-y-3">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between py-3 border-b border-[var(--dark-border)] last:border-0">
                      <div className="flex items-center gap-3">
                        {integration.checking ? (
                          <Loader2 className="w-5 h-5 text-[var(--dark-text-muted)] animate-spin" />
                        ) : integration.connected ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <div className="text-white font-medium">{integration.name}</div>
                          <div className="text-xs text-[var(--dark-text-muted)]">
                            {integration.checking ? 'Verificando...' :
                             integration.detail || (integration.connected ? 'Conectado' : 'No conectado')}
                          </div>
                        </div>
                      </div>
                      {!integration.checking && !integration.connected && (
                        integration.name !== 'ManIAS Backend API' && integration.name !== 'Supabase' ? (
                          <Button variant="outline" size="sm" className="text-white border-[var(--dark-border)]">
                            Conectar
                          </Button>
                        ) : null
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* API Info */}
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-white">Información de API</h3>
                </div>
                <div className="card-content space-y-3">
                  <div>
                    <div className="text-sm text-[var(--dark-text-muted)] mb-1">Backend URL</div>
                    <code className="text-xs text-lime-400 bg-[var(--dark-surface)] px-3 py-2 rounded block">
                      {process.env.NEXT_PUBLIC_API_URL || 'No configurada'}
                    </code>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--dark-text-muted)] mb-1">Supabase URL</div>
                    <code className="text-xs text-lime-400 bg-[var(--dark-surface)] px-3 py-2 rounded block">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No configurada'}
                    </code>
                  </div>
                  {backendDetail && (
                    <div>
                      <div className="text-sm text-[var(--dark-text-muted)] mb-1">Backend Status</div>
                      <code className="text-xs text-green-400 bg-[var(--dark-surface)] px-3 py-2 rounded block whitespace-pre-wrap">
                        {JSON.stringify(backendDetail, null, 2)}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              {/* API Keys */}
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-white">API Keys</h3>
                  <p className="text-sm text-[var(--dark-text-muted)]">Gestiona tus claves de API para integraciónes</p>
                </div>
                <div className="card-content">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--dark-border)] bg-[var(--dark-surface)]">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-[var(--dark-text-muted)]" />
                      <div>
                        <div className="text-white font-medium">Production API Key</div>
                        <div className="text-xs text-[var(--dark-text-muted)]">Creada hace 2 dias</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-white border-[var(--dark-border)]">
                      Ver
                    </Button>
                  </div>
                  <Button variant="outline" className="text-white border-[var(--dark-border)] mt-4">
                    <Key className="w-4 h-4 mr-2" />
                    Generar Nueva Key
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button - shown for profile and notifications */}
          {(activeTab === 'profile' || activeTab === 'notifications' || activeTab === 'security') && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              {saved && (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Guardado correctamente
                </span>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
