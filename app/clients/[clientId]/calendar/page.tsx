'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function CalendarRedirect() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string

  useEffect(() => {
    // Redirect to current month
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const currentMonth = `${year}-${month}`
    
    router.replace(`/clients/${clientId}/calendar/${currentMonth}`)
  }, [clientId, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-slate-600">Redirigiendo al calendario...</p>
      </div>
    </div>
  )
}
