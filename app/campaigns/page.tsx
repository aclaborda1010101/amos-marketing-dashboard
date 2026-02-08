'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  client_name: string;
  objective: string;
  budget: number;
  start_date: string;
  end_date: string;
  platforms: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch campaigns from Supabase
    // For now, show empty state
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando campañas...</p>
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
            <Megaphone className="h-8 w-8 text-primary" />
            Campañas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas las campañas activas de tus clientes
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Campañas Activas</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Presupuesto Total</p>
              <p className="text-2xl font-bold mt-1">€0</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Impresiones</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Empty State */}
      <Card className="p-12">
        <div className="text-center">
          <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No hay campañas todavía</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Comienza creando tu primera campaña o selecciona un cliente para ver sus campañas activas.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/clients">Ver Clientes</Link>
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Campaña
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
