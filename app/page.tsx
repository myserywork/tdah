'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// TEMPORARY REDIRECT - Enviando direto pro teste
// Para restaurar a landing page, veja o arquivo: app/page.backup.tsx

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/teste-tdah')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando teste...</p>
      </div>
    </div>
  )
}
