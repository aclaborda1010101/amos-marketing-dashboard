'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch calendar data from Supabase
    setLoading(false);
  }, []);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-border/50"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      day === new Date().getDate() && 
      currentMonth.getMonth() === new Date().getMonth() &&
      currentMonth.getFullYear() === new Date().getFullYear();

    days.push(
      <div 
        key={day} 
        className={`h-24 border border-border/50 p-2 hover:bg-accent/50 transition-colors ${
          isToday ? 'bg-primary/10' : ''
        }`}
      >
        <div className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
          {day}
        </div>
        {/* TODO: Add posts/events for this day */}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando calendario...</p>
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
            <CalendarIcon className="h-8 w-8 text-primary" />
            Calendario de Contenido
          </h1>
          <p className="text-muted-foreground mt-1">
            Planifica y gestiona todas las publicaciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Publicación
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Este Mes</p>
          <p className="text-2xl font-bold mt-1">0 posts</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Programados</p>
          <p className="text-2xl font-bold mt-1 text-blue-500">0</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Publicados</p>
          <p className="text-2xl font-bold mt-1 text-green-500">0</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Borradores</p>
          <p className="text-2xl font-bold mt-1 text-orange-500">0</p>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-0">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center font-semibold text-sm py-2 border border-border/50 bg-muted/50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {days}
        </div>
      </Card>

      {/* Empty State Helper */}
      {daysInMonth > 0 && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No hay publicaciones programadas</p>
            <p className="text-sm mt-1 mb-4">
              Comienza añadiendo contenido al calendario para visualizar tu estrategia
            </p>
            <Button variant="outline" asChild>
              <Link href="/clients">Ver Clientes</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
