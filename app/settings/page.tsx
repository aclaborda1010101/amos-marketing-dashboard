"use client"

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Zap,
  Save,
  Key
} from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const handleSave = async () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
    }, 1000)
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'integrations', label: 'Integraciones', icon: Zap }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/settings" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <SettingsIcon className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Configuración</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-[var(--dark-border)]">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-lime-500 text-lime-400'
                        : 'border-transparent text-[var(--dark-text-muted)] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="font-semibold text-white">Información Personal</h3>
                  </div>
                  <div className="card-content space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">Nombre</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Tu nombre" 
                          className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Apellidos</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Tus apellidos" 
                          className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@email.com" 
                        className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-white">Empresa</Label>
                      <Input 
                        id="company" 
                        placeholder="Nombre de tu empresa" 
                        className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-white">Rol</Label>
                      <Input 
                        id="role" 
                        defaultValue="Director" 
                        disabled 
                        className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-[var(--dark-text-muted)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="btn-primary">
                    <Save className="w-4 h-4" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card-dark">
                <div className="card-header">
                  <h3 className="font-semibold text-white">Preferencias de Notificaciones</h3>
                </div>
                <div className="card-content space-y-4">
                  {[
                    {
                      title: 'Nuevas Aprobaciones',
                      description: 'Recibir notificaciones cuando haya nuevas propuestas',
                      defaultChecked: true
                    },
                    {
                      title: 'Alertas de Campaña',
                      description: 'Notificaciones sobre rendimiento de campañas',
                      defaultChecked: true
                    },
                    {
                      title: 'Resumen Semanal',
                      description: 'Recibir resumen semanal de actividad',
                      defaultChecked: true
                    },
                    {
                      title: 'Emails de Marketing',
                      description: 'Recibir actualizaciones y novedades del producto',
                      defaultChecked: false
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[var(--dark-border)] last:border-0">
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-sm text-[var(--dark-text-muted)]">{item.description}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        defaultChecked={item.defaultChecked}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="font-semibold text-white">Cambiar Contraseña</h3>
                  </div>
                  <div className="card-content space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-white">Contraseña Actual</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-white">Nueva Contraseña</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">Confirmar Nueva Contraseña</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        className="bg-[var(--dark-surface)] border-[var(--dark-border)] text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="font-semibold text-white">Autenticación de Dos Factores</h3>
                  </div>
                  <div className="card-content">
                    <p className="text-[var(--dark-text-muted)] mb-4">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                    <Button variant="outline" className="text-white border-[var(--dark-border)]">
                      Activar 2FA
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="font-semibold text-white">API Keys</h3>
                  </div>
                  <div className="card-content space-y-4">
                    <p className="text-[var(--dark-text-muted)] mb-4">
                      Gestiona tus claves de API para integraciones
                    </p>
                    <div className="flex items-center justify-between p-4 border border-[var(--dark-border)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-[var(--dark-text-muted)]" />
                        <div>
                          <p className="font-medium text-white">Production API Key</p>
                          <p className="text-sm text-[var(--dark-text-muted)]">Creada hace 2 días</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-white border-[var(--dark-border)]">
                        Ver
                      </Button>
                    </div>
                    <Button variant="outline" className="text-white border-[var(--dark-border)]">
                      <Key className="w-4 h-4" />
                      Generar Nueva Key
                    </Button>
                  </div>
                </div>

                <div className="card-dark">
                  <div className="card-header">
                    <h3 className="font-semibold text-white">Conectar Servicios</h3>
                  </div>
                  <div className="card-content space-y-3">
                    {['Google Analytics', 'Meta Business Suite', 'LinkedIn'].map((service) => (
                      <div key={service} className="flex items-center justify-between p-4 border border-[var(--dark-border)] rounded-lg">
                        <div>
                          <p className="font-medium text-white">{service}</p>
                          <p className="text-sm text-[var(--dark-text-muted)]">No conectado</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-white border-[var(--dark-border)]">
                          Conectar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
