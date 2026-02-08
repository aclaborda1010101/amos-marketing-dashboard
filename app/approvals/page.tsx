'use client'

import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const mockApprovals = [
  {
    id: '1',
    request_id: 'brand_dna_001',
    client_name: 'Test Company',
    bot: 'Brand Architect',
    action: 'Brand DNA Generation',
    priority: 'p0',
    status: 'pending',
    submitted_at: '2024-02-08T10:30:00',
    summary: {
      title: 'Brand DNA Completo',
      description: 'Identidad de marca generada con posicionamiento y lineamientos'
    }
  },
  {
    id: '2',
    request_id: 'content_cal_002',
    client_name: 'Fashion Brand',
    bot: 'Content Bot',
    action: 'Content Calendar Approval',
    priority: 'p1',
    status: 'pending',
    submitted_at: '2024-02-08T09:15:00',
    summary: {
      title: 'Calendario Febrero 2024',
      description: '20 posts programados para redes sociales'
    }
  }
]

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals)

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id 
        ? { ...approval, status: decision }
        : approval
    ))
    
    // En producción, aquí llamarías a la API
    console.log(`Approval ${id} ${decision}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'p0': return 'bg-red-100 text-red-700'
      case 'p1': return 'bg-yellow-100 text-yellow-700'
      case 'p2': return 'bg-blue-100 text-blue-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'p0': return <AlertTriangle className="w-4 h-4" />
      case 'p1': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Cola de Aprobaciones</h1>
          <p className="text-slate-600 mt-2">
            Revisa y aprueba las propuestas de los especialistas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Pendientes</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">
              {approvals.filter(a => a.status === 'pending').length}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Aprobadas Hoy</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">5</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Rechazadas</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mt-2">0</div>
          </div>
        </div>

        {/* Approvals List */}
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {approval.summary.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(approval.priority)}`}>
                      {getPriorityIcon(approval.priority)}
                      {approval.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-3">{approval.summary.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Cliente: <strong>{approval.client_name}</strong></span>
                    <span>Bot: <strong>{approval.bot}</strong></span>
                    <span>Acción: <strong>{approval.action}</strong></span>
                  </div>
                </div>
                
                {approval.status === 'pending' ? (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDecision(approval.id, 'rejected')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleDecision(approval.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobar
                    </button>
                  </div>
                ) : (
                  <span className={`px-4 py-2 rounded-lg font-medium ${
                    approval.status === 'approved' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {approval.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Enviado {new Date(approval.submitted_at).toLocaleString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
