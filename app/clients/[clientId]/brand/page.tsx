'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ArrowLeft, Zap, Sparkles, AlertCircle } from 'lucide-react'

interface BrandDNA {
  values: string[]
  voice: string
  positioning: string
  target_audience: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function BrandPage() {
  const params = useParams()
  const clientId = params.clientId as string
  
  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBrandDNA()
  }, [])

  const loadBrandDNA = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Implementar llamada real al backend
      // const state = await api.getClientState(clientId)
      // setBrandDNA(state.brand_dna)
      
      // Mock data por ahora
      setTimeout(() => {
        setBrandDNA({
          values: ['Innovación', 'Transparencia', 'Excelencia'],
          voice: 'Profesional y cercano',
          positioning: 'Líder en soluciones tecnológicas',
          target_audience: 'Empresas B2B tech-savvy',
          status: 'pending'
        })
        setLoading(false)
      }, 1000)
    } catch (err) {
      console.error('Error loading brand DNA:', err)
      setError('Error al cargar Brand DNA')
      setLoading(false)
    }
  }

  const handleGenerateBrandDNA = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await api.generateBrandDNA(clientId, {
        name: 'Company Name',
        industry: 'Technology'
      })
      
      await loadBrandDNA()
    } catch (err) {
      console.error('Error generating brand DNA:', err)
      setError('Error al generar Brand DNA')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/clients/${clientId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Cliente
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Brand DNA
              </h1>
              <p className="text-slate-600">
                Identidad y posicionamiento de marca
              </p>
            </div>
            
            <button
              onClick={handleGenerateBrandDNA}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {brandDNA ? 'Regenerar' : 'Generar'} Brand DNA
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Cargando Brand DNA...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && brandDNA && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Estado</h3>
                  <p className="text-sm text-slate-600">
                    {brandDNA.status === 'pending' && 'Pendiente de aprobación'}
                    {brandDNA.status === 'approved' && 'Aprobado'}
                    {brandDNA.status === 'rejected' && 'Rechazado'}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  brandDNA.status === 'approved' ? 'bg-green-100 text-green-700' :
                  brandDNA.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {brandDNA.status}
                </span>
              </div>
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Valores de Marca</h3>
              <div className="flex flex-wrap gap-2">
                {brandDNA.values.map((value, i) => (
                  <span key={i} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {value}
                  </span>
                ))}
              </div>
            </div>

            {/* Voice */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Tono de Voz</h3>
              <p className="text-slate-700">{brandDNA.voice}</p>
            </div>

            {/* Positioning */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Posicionamiento</h3>
              <p className="text-slate-700">{brandDNA.positioning}</p>
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Audiencia Objetivo</h3>
              <p className="text-slate-700">{brandDNA.target_audience}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !brandDNA && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <Zap className="w-20 h-20 text-blue-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Sin Brand DNA
            </h3>
            <p className="text-slate-600 mb-6">
              Genera el ADN de marca para este cliente
            </p>
            <button
              onClick={handleGenerateBrandDNA}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generar Brand DNA
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
