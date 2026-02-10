"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api, type ScheduledPost } from '@/lib/api'
import { Plus, Search, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<ScheduledPost[]>([])

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await api.listScheduledPosts()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error loading scheduled posts:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getPostsForDay = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    return posts.filter(post => {
      const postDate = new Date(post.scheduled_date)
      return postDate.getFullYear() === year &&
             postDate.getMonth() === month &&
             postDate.getDate() === day
    })
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-[var(--dark-border)]"></div>)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === new Date().getDate() &&
      currentMonth.getMonth() === new Date().getMonth() &&
      currentMonth.getFullYear() === new Date().getFullYear()

    const dayPosts = getPostsForDay(day)

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
        {dayPosts.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {dayPosts.slice(0, 2).map((post, i) => (
              <div
                key={i}
                className={`text-xs px-1 py-0.5 rounded truncate ${
                  post.status === 'published'
                    ? 'bg-green-500/20 text-green-400'
                    : post.status === 'failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {post.platform}
              </div>
            ))}
            {dayPosts.length > 2 && (
              <div className="text-xs text-[var(--dark-text-subtle)]">
                +{dayPosts.length - 2} más
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const thisMonthPosts = posts.filter(post => {
    const postDate = new Date(post.scheduled_date)
    return postDate.getMonth() === currentMonth.getMonth() &&
           postDate.getFullYear() === currentMonth.getFullYear()
  })

  const stats = [
    { label: "Este Mes", value: thisMonthPosts.length.toString(), subtitle: "posts" },
    { label: "Programados", value: posts.filter(p => p.status === 'scheduled').length.toString(), subtitle: "pendientes" },
    { label: "Publicados", value: posts.filter(p => p.status === 'published').length.toString(), subtitle: "exitosos" },
    { label: "Borradores", value: posts.filter(p => p.status === 'draft').length.toString(), subtitle: "guardados" }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/calendar" />
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Dashboard
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
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
          {posts.length === 0 && !loading && (
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

          {/* Legend */}
          {posts.length > 0 && (
            <div className="card-dark mt-4 p-4">
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></div>
                  <span className="text-[var(--dark-text-muted)]">Programado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></div>
                  <span className="text-[var(--dark-text-muted)]">Publicado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div>
                  <span className="text-[var(--dark-text-muted)]">Error</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
