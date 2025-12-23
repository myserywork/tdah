'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  CheckCircle, Mail, Clock, ArrowRight, Download, 
  Gamepad2, BookOpen, Gift, Star, Heart, Shield,
  MessageCircle, Sparkles, Trophy, Zap, Brain, Loader2
} from 'lucide-react'
import { trackEvents } from '@/lib/gtag'
import { fbPixelEvents } from '@/lib/fbpixel'

function ObrigadoContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [total, setTotal] = useState('')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Get data from URL params
    setEmail(searchParams.get('email') || '')
    setPaymentMethod(searchParams.get('method') || 'pix')
    setTotal(searchParams.get('total') || '19.90')
    
    // Track purchase completion in GA
    const totalValue = parseFloat(searchParams.get('total') || '19.90')
    trackEvents.purchaseCompleted(totalValue)
    
    // Track purchase in Facebook Pixel - IMPORTANT for ads optimization
    fbPixelEvents.purchase({ 
      value: totalValue, 
      currency: 'BRL',
      content_name: 'Guia Mente Caótica + Life OS',
      content_ids: ['guia-mente-caotica', 'life-os'],
      num_items: 2
    })
    
    // Send conversion event to Google
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'G-CX2GBYKFPM/purchase',
        value: totalValue,
        currency: 'BRL',
        transaction_id: searchParams.get('payment_id') || `${Date.now()}`
      })
    }
  }, [searchParams])

  const getDeliveryTime = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return 'instantâneo'
      case 'pix':
        return 'até 5 minutos após confirmação'
      case 'boleto':
        return 'até 3 dias úteis após pagamento'
      default:
        return 'em breve'
    }
  }

  const getPaymentStatus = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return { text: 'Pagamento Aprovado!', color: 'text-emerald-400' }
      case 'pix':
        return { text: 'Aguardando Pagamento PIX', color: 'text-amber-400' }
      case 'boleto':
        return { text: 'Aguardando Pagamento do Boleto', color: 'text-amber-400' }
      default:
        return { text: 'Processando...', color: 'text-primary' }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Confetti effect for approved payments */}
      {mounted && paymentMethod === 'credit_card' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#00D4AA', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6'][Math.floor(Math.random() * 5)]
              }}
              initial={{ y: -20, opacity: 1 }}
              animate={{ 
                y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800, 
                x: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 360,
                opacity: 0 
              }}
              transition={{ 
                duration: Math.random() * 2 + 2, 
                delay: Math.random() * 0.5,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Header */}
      <header className="border-b border-border/50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center">
              <Brain className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold">Mente Caótica</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border-2 border-emerald-500/30">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            🎉 Parabéns pela decisão!
          </h1>
          <p className={`text-lg font-medium ${getPaymentStatus().color}`}>
            {getPaymentStatus().text}
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6 rounded-2xl mb-8"
        >
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold mb-1">Confira seu e-mail</h2>
              <p className="text-sm text-muted-foreground">
                {email ? (
                  <>Enviamos os dados de acesso para <span className="text-foreground font-medium">{email}</span></>
                ) : (
                  'Enviamos os dados de acesso para seu e-mail'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold mb-1">Prazo de entrega</h2>
              <p className="text-sm text-muted-foreground">
                Seu acesso será liberado <span className="text-foreground font-medium">{getDeliveryTime()}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* What you'll receive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            O que você vai receber
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-elevated p-5 rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Guia Mente Caótica</h3>
                <p className="text-sm text-muted-foreground">6 módulos completos para dominar seu cérebro TDAH</p>
              </div>
            </div>

            <div className="card-elevated p-5 rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Gamepad2 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">App Life OS</h3>
                <p className="text-sm text-muted-foreground">Acesso por 1 ano ao app que gamifica sua vida</p>
              </div>
            </div>

            <div className="card-elevated p-5 rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Gift className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Bônus Exclusivos</h3>
                <p className="text-sm text-muted-foreground">Templates, áudios de foco e masterclass</p>
              </div>
            </div>

            <div className="card-elevated p-5 rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Suporte no WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Time pronto para te ajudar quando precisar</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-highlight p-6 rounded-2xl mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Próximos passos
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-0.5">Verifique seu e-mail (inclusive spam!)</h3>
                <p className="text-sm text-muted-foreground">Enviamos um e-mail com seus dados de acesso</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-0.5">Acesse o Life OS</h3>
                <p className="text-sm text-muted-foreground">Use o link e credenciais que enviamos</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-0.5">Comece pelo Módulo 1</h3>
                <p className="text-sm text-muted-foreground">Sistema de Captura Mental - tire tudo da sua cabeça!</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Precisa de ajuda?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nosso suporte está disponível para te ajudar em qualquer dúvida.
            </p>
            <a 
              href="https://wa.me/5511999999999?text=Olá! Acabei de comprar o Guia Mente Caótica e preciso de ajuda."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2024 Mente Caótica • Obrigado por confiar em nós! 💜</p>
        </div>
      </main>
    </div>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

// Main page component wrapped with Suspense
export default function ObrigadoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ObrigadoContent />
    </Suspense>
  )
}
