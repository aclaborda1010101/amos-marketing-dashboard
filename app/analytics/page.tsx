'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, TrendingDown, Activity, DollarSign, Users, Eye, MousePointer } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch analytics data from Supabase
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Métricas y análisis de rendimiento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Últimos 7 días</Button>
          <Button variant="outline">Últimos 30 días</Button>
          <Button>Exportar Reporte</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Impresiones Totales</p>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">0</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+0%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Clics</p>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">0</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+0%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Conversiones</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">0</p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">0% CTR</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Gasto Total</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">€0</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">€0 CPC</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rendimiento por Plataforma</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico de rendimiento</p>
              <p className="text-sm">(próximamente)</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tendencias de Engagement</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Gráfico de tendencias</p>
              <p className="text-sm">(próximamente)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contenido de Mayor Rendimiento</h3>
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay datos disponibles todavía</p>
          <p className="text-sm mt-1">Los datos aparecerán aquí cuando tengas campañas activas</p>
        </div>
      </Card>
    </div>
  );
}
