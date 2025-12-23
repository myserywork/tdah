'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { 
  Brain, Shield, Lock, CreditCard, Smartphone, FileText, Check, ChevronDown,
  ShieldCheck, Fingerprint, Clock, Star, Zap, Gift, Users, Headphones,
  ArrowRight, Loader2, Copy, CheckCircle, AlertCircle, Timer, Trophy,
  Gamepad2, BookOpen, Video, MessageCircle, Crown, Sparkles, Heart
} from 'lucide-react'
import { trackEvents } from '@/lib/gtag'
import { fbPixelEvents } from '@/lib/fbpixel'

declare global {
  interface Window {
    MercadoPago: any
  }
}

const orderBumps = [
  {
    id: 'coaching',
    title: '🔥 Sessão de Coaching 1:1',
    description: '30 minutos comigo para montar seu plano personalizado',
    originalPrice: 197,
    price: 47,
    discount: '76% OFF',
    icon: Video,
    badge: 'Mais vendido'
  },
  {
    id: 'community',
    title: '👥 Comunidade VIP no Discord',
    description: 'Acesso vitalício ao grupo exclusivo de suporte',
    originalPrice: 97,
    price: 27,
    discount: '72% OFF',
    icon: Users,
    badge: 'Suporte 24/7'
  },
  {
    id: 'templates',
    title: '📋 Pack de Templates Premium',
    description: 'Notion, Obsidian e planilhas prontas para usar',
    originalPrice: 67,
    price: 17,
    discount: '75% OFF',
    icon: FileText,
    badge: 'Bônus extra'
  }
]

const testimonialsMini = [
  { name: 'Mariana S.', text: 'Valeu cada centavo! Mudou minha vida.' },
  { name: 'Rafael O.', text: 'A melhor decisão que tomei esse ano.' },
  { name: 'Lucas P.', text: 'Finalmente algo que funciona pra mim!' }
]

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card')
  const [selectedBumps, setSelectedBumps] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeBase64: string } | null>(null)
  const [boletoData, setBoletoData] = useState<{ url: string; barcode: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [mpReady, setMpReady] = useState(false)
  const [cardForm, setCardForm] = useState<any>(null)
  const [installments, setInstallments] = useState(1)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: ''
  })

  // Card data
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  })

  // Calculate totals
  const basePrice = 19.90
  const bumpsTotal = Object.entries(selectedBumps)
    .filter(([_, selected]) => selected)
    .reduce((sum, [id]) => {
      const bump = orderBumps.find(b => b.id === id)
      return sum + (bump?.price || 0)
    }, 0)
  const total = basePrice + bumpsTotal

  // Initialize MercadoPago
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MercadoPago) {
      setMpReady(true)
    }
  }, [])

  // Track checkout visit
  useEffect(() => {
    trackEvents.checkoutStarted()
    fbPixelEvents.initiateCheckout({ value: 19.90, currency: 'BRL' })
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'checkout_visit' })
    }).catch(() => {})
  }, [])

  // Redirect to thank you page on successful payment
  const redirectToThankYou = (method: string, id?: string) => {
    const params = new URLSearchParams({
      email: formData.email,
      method,
      total: total.toFixed(2),
      ...(id && { payment_id: id })
    })
    router.push(`/obrigado?${params.toString()}`)
  }

  const handleMPLoad = () => {
    setMpReady(true)
  }

  // Poll for PIX payment confirmation
  const startPollingPayment = (paymentIdToPoll: string) => {
    let attempts = 0
    const maxAttempts = 60 // Poll for 5 minutes (5 second intervals)
    
    const pollInterval = setInterval(async () => {
      attempts++
      
      try {
        const response = await fetch(`/api/check-payment?payment_id=${paymentIdToPoll}`)
        const data = await response.json()
        
        if (data.approved) {
          clearInterval(pollInterval)
          trackEvents.purchaseCompleted(total)
          redirectToThankYou('pix', paymentIdToPoll)
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          // Keep showing PIX code - user can still pay
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 5000) // Check every 5 seconds
    
    // Cleanup on component unmount
    return () => clearInterval(pollInterval)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19)
  }

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5)
  }

  const toggleBump = (id: string) => {
    setSelectedBumps(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPaymentStatus('processing')

    try {
      let paymentData: any = {
        paymentMethod,
        amount: basePrice,
        email: formData.email,
        name: formData.name,
        cpf: formData.cpf,
        phone: formData.phone,
        orderBumps: selectedBumps
      }

      // For credit card, we need to tokenize first
      if (paymentMethod === 'credit_card' && mpReady && window.MercadoPago) {
        const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)
        
        // Create card token
        const cardToken = await mp.createCardToken({
          cardNumber: cardData.number.replace(/\s/g, ''),
          cardholderName: cardData.holder,
          cardExpirationMonth: cardData.expiry.split('/')[0],
          cardExpirationYear: '20' + cardData.expiry.split('/')[1],
          securityCode: cardData.cvv,
          identificationType: 'CPF',
          identificationNumber: formData.cpf.replace(/\D/g, '')
        })

        paymentData.token = cardToken.id
        paymentData.installments = installments
        paymentData.paymentMethodId = 'visa' // This should be detected from card number
      }

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()

      if (result.success) {
        setPaymentId(result.paymentId?.toString())
        
        if (paymentMethod === 'pix' && result.qrCode) {
          setPixData({ qrCode: result.qrCode, qrCodeBase64: result.qrCodeBase64 })
          setPaymentStatus('success')
          // Start polling for payment confirmation
          startPollingPayment(result.paymentId)
        } else if (paymentMethod === 'boleto' && result.boletoUrl) {
          setBoletoData({ url: result.boletoUrl, barcode: result.barcode })
          setPaymentStatus('success')
          // Redirect after showing boleto info
          setTimeout(() => {
            redirectToThankYou('boleto', result.paymentId?.toString())
          }, 3000)
        } else if (result.status === 'approved') {
          // Credit card approved - redirect immediately
          trackEvents.purchaseCompleted(total)
          redirectToThankYou('credit_card', result.paymentId?.toString())
        } else {
          setPaymentStatus('processing')
        }
      } else {
        setPaymentStatus('error')
        trackEvents.purchaseFailed(result.error || 'Unknown error')
      }
    } catch (error) {
      console.error(error)
      setPaymentStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script 
        src="https://sdk.mercadopago.com/js/v2" 
        onLoad={handleMPLoad}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 py-4 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center">
                <Brain className="w-4 h-4 text-background" />
              </div>
              <span className="font-semibold">Mente Caótica</span>
            </Link>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Compra Segura</span>
              <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-emerald-400" /> SSL</span>
            </div>
          </div>
        </header>

        {/* Urgency Bar */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 py-2 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm">
            <Timer className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-red-400 font-medium">⚡ Oferta especial expira em breve!</span>
            <span className="text-muted-foreground">Garanta seu acesso agora</span>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Left Column - Form */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* What you're getting */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated p-6 rounded-2xl"
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  O que você está levando
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Guia Mente Caótica</div>
                      <div className="text-xs text-muted-foreground">6 módulos completos</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground line-through">R$ 97</div>
                      <div className="text-primary font-bold">Incluso</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/20">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">App Life OS</div>
                      <div className="text-xs text-muted-foreground">Acesso por 1 ano</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground line-through">R$ 197</div>
                      <div className="text-secondary font-bold">Incluso</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Bônus Exclusivos</div>
                      <div className="text-xs text-muted-foreground">Templates + Áudios + Masterclass</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground line-through">R$ 97</div>
                      <div className="text-amber-400 font-bold">GRÁTIS</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Bumps */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Turbine seu resultado
                  <span className="badge badge-amber text-[10px]">Oferta única</span>
                </h2>
                
                {orderBumps.map((bump, i) => (
                  <motion.div
                    key={bump.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => toggleBump(bump.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedBumps[bump.id] 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    {bump.badge && (
                      <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black">
                        {bump.badge}
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedBumps[bump.id] ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                      }`}>
                        {selectedBumps[bump.id] && <Check className="w-4 h-4 text-background" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm">{bump.title}</span>
                          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">{bump.discount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{bump.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground line-through">R$ {bump.originalPrice}</span>
                          <span className="text-lg font-bold text-primary">+ R$ {bump.price}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Payment Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-elevated p-6 rounded-2xl"
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Dados de Pagamento
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1.5">Nome completo</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Seu nome"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1.5">E-mail</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="seu@email.com"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1.5">CPF</label>
                      <input
                        type="text"
                        required
                        value={formData.cpf}
                        onChange={e => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1.5">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Forma de pagamento</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'credit_card', icon: CreditCard, label: 'Cartão' },
                        { id: 'pix', icon: Smartphone, label: 'Pix' },
                        { id: 'boleto', icon: FileText, label: 'Boleto' }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                            paymentMethod === method.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-xs font-medium ${paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`}>{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === 'credit_card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">Número do cartão</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={e => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">Nome no cartão</label>
                          <input
                            type="text"
                            value={cardData.holder}
                            onChange={e => setCardData({...cardData, holder: e.target.value.toUpperCase()})}
                            placeholder="NOME COMO NO CARTÃO"
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-muted-foreground mb-1.5">Validade</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={e => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-muted-foreground mb-1.5">CVV</label>
                            <input
                              type="text"
                              value={cardData.cvv}
                              onChange={e => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                              placeholder="000"
                              maxLength={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">Parcelas</label>
                          <select 
                            value={installments} 
                            onChange={e => setInstallments(Number(e.target.value))}
                            className="w-full"
                          >
                            <option value={1}>1x de R$ {total.toFixed(2)} (sem juros)</option>
                            <option value={2}>2x de R$ {(total / 2).toFixed(2)} (sem juros)</option>
                            <option value={3}>3x de R$ {(total / 3).toFixed(2)} (sem juros)</option>
                            <option value={6}>6x de R$ {(total / 6 * 1.05).toFixed(2)}</option>
                            <option value={12}>12x de R$ {(total / 12 * 1.1).toFixed(2)}</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'pix' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-emerald-400 text-sm">Pix - Aprovação instantânea!</div>
                            <div className="text-xs text-muted-foreground">Após o pagamento, você recebe acesso imediatamente</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'boleto' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-amber-400 text-sm">Boleto Bancário</div>
                            <div className="text-xs text-muted-foreground">Prazo de compensação: 1-3 dias úteis</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Finalizar Compra - R$ {total.toFixed(2)}
                      </>
                    )}
                  </button>

                  {/* Security badges */}
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Site Seguro
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL 256-bit
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Fingerprint className="w-3.5 h-3.5 text-emerald-400" /> Dados Protegidos
                    </span>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Order Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-highlight p-6 rounded-2xl sticky top-4"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Resumo do Pedido
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guia + Life OS (1 ano)</span>
                    <span>R$ {basePrice.toFixed(2)}</span>
                  </div>
                  
                  {Object.entries(selectedBumps).filter(([_, v]) => v).map(([id]) => {
                    const bump = orderBumps.find(b => b.id === id)
                    return bump && (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{bump.title.replace(/[🔥👥📋]/g, '').trim()}</span>
                        <span className="text-primary">+ R$ {bump.price.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground line-through">R$ {(391 + bumpsTotal).toFixed(2)}</div>
                      <div className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400 text-right mt-1">
                    Você economiza R$ {(391 - basePrice).toFixed(2)}!
                  </div>
                </div>

                {/* Guarantee */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-400" />
                    <div>
                      <div className="font-bold text-emerald-400 text-sm">Garantia de 7 dias</div>
                      <div className="text-xs text-muted-foreground">Não gostou? Devolvemos 100%</div>
                    </div>
                  </div>
                </div>

                {/* Mini testimonials */}
                <div className="space-y-2">
                  {testimonialsMini.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
                      </div>
                      <span className="text-muted-foreground">"{t.text}"</span>
                      <span className="font-medium">- {t.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trust Elements */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-elevated p-4 rounded-xl"
              >
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>+2.847 alunos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>4.9/5 estrelas</span>
                  </div>
                </div>
              </motion.div>

              {/* Payment logos */}
              <div className="flex justify-center gap-4 py-2">
                <div className="px-3 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">💳 Visa</div>
                <div className="px-3 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">💳 Master</div>
                <div className="px-3 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">📱 Pix</div>
              </div>
            </div>
          </div>
        </main>

        {/* PIX/Boleto Modal */}
        <AnimatePresence>
          {paymentStatus === 'success' && (pixData || boletoData) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
              >
                {pixData && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Pix gerado!</h3>
                    <p className="text-sm text-muted-foreground mb-4">Escaneie o QR Code ou copie o código</p>
                    
                    {pixData.qrCodeBase64 && (
                      <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                        <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => copyToClipboard(pixData.qrCode)}
                      className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copiado!' : 'Copiar código Pix'}
                    </button>
                  </div>
                )}
                
                {boletoData && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Boleto gerado!</h3>
                    <p className="text-sm text-muted-foreground mb-4">Pague até a data de vencimento</p>
                    
                    <a
                      href={boletoData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 mb-3"
                    >
                      <FileText className="w-5 h-5" />
                      Abrir Boleto
                    </a>
                    
                    <button
                      onClick={() => copyToClipboard(boletoData.barcode)}
                      className="w-full btn-secondary py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copiado!' : 'Copiar código de barras'}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {paymentStatus === 'success' && !pixData && !boletoData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pagamento Aprovado! 🎉</h3>
                <p className="text-muted-foreground mb-6">Seu acesso foi liberado. Verifique seu e-mail!</p>
                <Link href="/acesso">
                  <button className="btn-primary w-full py-4 rounded-xl font-bold">
                    Acessar Agora →
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {paymentStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center"
              >
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ops! Algo deu errado</h3>
                <p className="text-muted-foreground mb-6">Não foi possível processar o pagamento. Tente novamente.</p>
                <button 
                  onClick={() => setPaymentStatus('idle')}
                  className="btn-primary w-full py-4 rounded-xl font-bold"
                >
                  Tentar Novamente
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6 px-4 mt-12">
          <div className="max-w-6xl mx-auto text-center text-xs text-muted-foreground">
            <p>© 2024 Mente Caótica • Todos os direitos reservados</p>
            <p className="mt-1">Pagamento processado de forma segura pelo MercadoPago</p>
          </div>
        </footer>
      </div>
    </>
  )
}


