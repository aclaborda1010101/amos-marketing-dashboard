"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Filter,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    setLoading(false)
  }, [])

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-[var(--dark-border)]"></div>)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      day === new Date().getDate() && 
      currentMonth.getMonth() === new Date().getMonth() &&
      currentMonth.getFullYear() === new Date().getFullYear()

    days.push(
      <div 
        key={day} 
        className={`h-24 border border-[var(--dark-border)] p-2 hover:bg-[var(--dark-surface-hover)] transition-colors ${
          isToday ? 'bg-lime-500/10' : ''
        }`}
      >
        <div className={`text-sm font-semibold ${isToday ? 'text-lime-400' : 'text-[var(--dark-text-muted)]'}`}>
          {day}
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Este Mes",
      value: "0",
      subtitle: "posts"
    },
    {
      label: "Programados",
      value: "0",
      subtitle: "pendientes"
    },
    {
      label: "Publicados",
      value: "0",
      subtitle: "exitosos"
    },
    {
      label: "Borradores",
      value: "0",
      subtitle: "guardados"
    }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/calendar" />
      
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Calendario de Contenido</span>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar publicaciones..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <Filter className="w-4 h-4" />
            </button>
            
            <Button className="btn-primary" size="sm">
              <Plus className="w-4 h-4" />
              Nueva Publicación
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-label mb-1">{stat.label}</div>
                <div className="stat-value mb-1">{stat.value}</div>
                <div className="text-xs text-[var(--dark-text-subtle)]">{stat.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="card-dark">
            {/* Month Navigation */}
            <div className="card-header flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={previousMonth}
                className="text-white border-[var(--dark-border)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-white">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextMonth}
                className="text-white border-[var(--dark-border)]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="card-content p-0">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm py-2 border border-[var(--dark-border)] bg-[var(--dark-surface)]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0">
                {days}
              </div>
            </div>
          </div>

          {/* Empty State Helper */}
          {posts.length === 0 && (
            <div className="card-dark mt-6">
              <div className="card-content">
                <div className="empty-state py-8">
                  <CalendarIcon className="empty-state-icon" />
                  <h4 className="empty-state-title">No hay publicaciones programadas</h4>
                  <p className="empty-state-description max-w-sm mx-auto">
                    Comienza añadiendo contenido al calendario para visualizar tu estrategia
                  </p>
                  <Button variant="outline" className="text-white border-[var(--dark-border)] mt-4">
                    Ver Clientes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
