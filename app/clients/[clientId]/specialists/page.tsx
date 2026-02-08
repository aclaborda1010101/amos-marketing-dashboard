'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ArrowLeft, Users, AlertCircle, CheckCircle } from 'lucide-react'

interface Specialist {
  id: string
  name: string
  category: string
  status: string
  description: string
}

export default function SpecialistsPage() {
  const params = useParams()
  const clientId = params.clientId as string
  
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSpecialists()
  }, [])

  const loadSpecialists = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.getSpecialists()
      setSpecialists(data.specialists || [])
    } catch (err) {
      console.error('Error loading specialists:', err)
      setError('Error al cargar especialistas')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategy':
        return 'bg-blue-100 text-blue-700'
      case 'content':
        return 'bg-purple-100 text-purple-700'
      case 'intelligence':
        return 'bg-green-100 text-green-700'
      case 'execution':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/clients/${clientId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Cliente
          </Link>
          
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Especialistas
            </h1>
            <p className="text-slate-600">
              Equipo de especialistas disponibles para este cliente
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Cargando especialistas...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium mb-2">{error}</p>
            <button
              onClick={loadSpecialists}
              className="text-red-600 hover:text-red-700 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Specialists Grid */}
        {!loading && !error && specialists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((specialist) => (
              <div
                key={specialist.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(specialist.category)}`}>
                    {specialist.category}
                  </span>
                  {specialist.status === 'active' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {specialist.name}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4">
                  {specialist.description}
                </p>

                {/* Status */}
                <div className="pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    specialist.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {specialist.status === 'active' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Activo
                      </>
                    ) : (
                      'Standby'
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && specialists.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <Users className="w-20 h-20 text-orange-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Sin especialistas disponibles
            </h3>
            <p className="text-slate-600">
              No hay especialistas configurados en el sistema
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
