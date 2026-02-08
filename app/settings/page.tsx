'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Zap, Save, Key } from 'lucide-react';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save settings to Supabase
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Configuración
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la configuración de tu cuenta y preferencias
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Zap className="h-4 w-4" />
            Integraciones
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input id="lastName" placeholder="Tus apellidos" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nombre de tu empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Input id="role" placeholder="Tu rol" defaultValue="Director" disabled />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preferencias de Notificaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nuevas Aprobaciones</p>
                  <p className="text-sm text-muted-foreground">Recibir notificaciones cuando haya nuevas propuestas</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de Campaña</p>
                  <p className="text-sm text-muted-foreground">Notificaciones sobre rendimiento de campañas</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Resumen Semanal</p>
                  <p className="text-sm text-muted-foreground">Recibir resumen semanal de actividad</p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emails de Marketing</p>
                  <p className="text-sm text-muted-foreground">Recibir actualizaciones y novedades del producto</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Autenticación de Dos Factores</h3>
            <p className="text-muted-foreground mb-4">
              Añade una capa extra de seguridad a tu cuenta
            </p>
            <Button variant="outline">Activar 2FA</Button>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Gestiona tus claves de API para integraciones
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-muted-foreground">Creada hace 2 días</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver</Button>
              </div>
            </div>
            <Button variant="outline" className="mt-4 gap-2">
              <Key className="h-4 w-4" />
              Generar Nueva Key
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conectar Servicios</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Google Analytics</p>
                  <p className="text-sm text-muted-foreground">No conectado</p>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Meta Business Suite</p>
                  <p className="text-sm text-muted-foreground">No conectado</p>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">No conectado</p>
                </div>
                <Button variant="outline" size="sm">Conectar</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
