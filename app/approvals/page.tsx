"use client"

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { api, type Approval } from '@/lib/api'
import { Search, Filter, CheckSquare, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, string>>({})

  useEffect(() => {
    loadApprovals()
  }, [filter])

  const loadApprovals = async () => {
    try {
      setLoading(true)
      const filterParam = filter !== 'all' ? filter : undefined
      const data = await api.listApprovals(filterParam)
      setApprovals(data.approvals || [])
    } catch (error) {
      console.error('Error loading approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      setActionLoading(requestId)
      const comment = comments[requestId] || 'Aprobado'
      await api.decideApproval(requestId, 'approved', comment, 'Director')
      await loadApprovals()
    } catch (error) {
      console.error('Error approving:', error)
      alert('Error al aprobar la solicitud')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(requestId)
      const comment = comments[requestId] || 'Rechazado'
      await api.decideApproval(requestId, 'rejected', comment, 'Director')
      await loadApprovals()
    } catch (error) {
      console.error('Error rejecting:', error)
      alert('Error al rechazar la solicitud')
    } finally {
      setActionLoading(null)
    }
  }

  const stats = [
    { label: "Pendientes", value: approvals.filter(a => a.status === 'pending').length, subtitle: "Esperando decisión", icon: Clock, color: "text-orange-500" },
    { label: "Aprobadas", value: approvals.filter(a => a.status === 'approved').length, subtitle: "Últimas decisiones", icon: CheckCircle, color: "text-green-500" },
    { label: "Rechazadas", value: approvals.filter(a => a.status === 'rejected').length, subtitle: "Necesitan revisión", icon: XCircle, color: "text-red-500" }
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPath="/approvals" />
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <a href="/" className="text-[var(--dark-text-subtle)] hover:text-lime-400 transition-colors">
                Dashboard
              </a>
              <span className="text-[var(--dark-text-subtle)]">/</span>
              <CheckSquare className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">Aprobaciones</span>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dark-text-subtle)]" />
                <input
                  type="text"
                  placeholder="Buscar aprobaciones..."
                  className="search-input pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="icon-btn">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="stat-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[var(--dark-surface-hover)] rounded-lg flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="stat-value mb-1">{stat.value}</div>
                  <div className="stat-label mb-1">{stat.label}</div>
                  <div className="text-xs text-[var(--dark-text-subtle)]">{stat.subtitle}</div>
                </div>
              )
            })}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 border-b border-[var(--dark-border)]">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  filter === status
                    ? 'border-lime-500 text-lime-400'
                    : 'border-transparent text-[var(--dark-text-muted)] hover:text-white'
                }`}
              >
                {status === 'pending' ? 'Pendientes' : status === 'approved' ? 'Aprobadas' : status === 'rejected' ? 'Rechazadas' : 'Todas'}
                {status === 'pending' && approvals.filter(a => a.status === 'pending').length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-lime-500/20 text-lime-400 rounded-full">
                    {approvals.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Approvals List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : approvals.length === 0 ? (
              <div className="card-dark">
                <div className="card-content">
                  <div className="empty-state py-12">
                    <CheckSquare className="empty-state-icon" />
                    <h4 className="empty-state-title">No hay aprobaciones {filter !== 'all' && filter}</h4>
                    <p className="empty-state-description max-w-sm mx-auto">
                      {filter === 'pending'
                        ? 'No hay propuestas pendientes de aprobación'
                        : 'No hay aprobaciones en esta categoría'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              approvals.map((approval) => (
                <div key={approval.request_id} className="card-dark hover:border-lime-500/50 transition-all">
                  <div className="card-content">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {approval.summary?.title || approval.bot}
                          </h3>
                          <span className={`badge ${
                            approval.priority === 'p1' ? 'badge-error' :
                            approval.priority === 'p2' ? 'badge-warning' :
                            'badge-neutral'
                          }`}>
                            {approval.priority}
                          </span>
                          <span className={`badge ${
                            approval.status === 'pending' ? 'badge-warning' :
                            approval.status === 'approved' ? 'badge-success' :
                            'badge-error'
                          }`}>
                            {approval.status}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--dark-text-muted)] mb-3">
                          {approval.summary?.description || typeof approval.summary === 'string' ? approval.summary : 'Aprobación requerida'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[var(--dark-text-subtle)]">
                          <span>Bot: {approval.bot}</span>
                          <span>â¢</span>
                          <span>Cliente: {approval.client_id}</span>
                          <span>â¢</span>
                          <span>{new Date(approval.submitted_at).toLocaleString('es-ES')}</span>
                        </div>

                        {/* Comments for pending */}
                        {approval.status === 'pending' && (
                          <div className="mt-3">
                            <textarea
                              value={comments[approval.request_id] || ''}
                              onChange={(e) => setComments({
                                ...comments,
                                [approval.request_id]: e.target.value
                              })}
                              placeholder="Comentarios opcionales..."
                              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--dark-surface)] border border-[var(--dark-border)] text-white placeholder-[var(--dark-text-subtle)] focus:outline-none focus:border-lime-500"
                              rows={2}
                            />
                          </div>
                        )}
                      </div>

                      {approval.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white border-[var(--dark-border)]"
                            onClick={() => handleReject(approval.request_id)}
                            disabled={actionLoading === approval.request_id}
                          >
                            <XCircle className="w-4 h-4" />
                            {actionLoading === approval.request_id ? '...' : 'Rechazar'}
                          </Button>
                          <Button
                            className="btn-primary"
                            size="sm"
                            onClick={() => handleApprove(approval.request_id)}
                            disabled={actionLoading === approval.request_id}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {actionLoading === approval.request_id ? '...' : 'Aprobar'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
