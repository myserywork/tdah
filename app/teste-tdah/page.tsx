'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { trackEvents } from '@/lib/gtag'
import { fbPixelEvents } from '@/lib/fbpixel'
import { 
  Brain, ArrowRight, ArrowLeft, Sparkles, Heart, Lightbulb, Shield, Clock, Zap, Check,
  Loader2, Phone, User, Target, Lock, AlertTriangle, CheckCircle, BarChart3, Star,
  Play, BookOpen, Trophy, TrendingUp, Filter, Database, Pause, Mountain, Waves,
  MessageSquare, Users, Award, Gift, ChevronRight, Quote, Flame, Calendar, FileText,
  Video, Headphones, X, Timer, Gamepad2, Smartphone, ShieldCheck, CreditCard, Fingerprint,
  PartyPopper, Rocket
} from 'lucide-react'

// OPTIMIZED: Reduced to 12 questions for better completion rate
const questions = [
  { id: 1, category: "Foco", question: "Com que frequência você começa várias tarefas e não termina nenhuma?", subtext: "Pense nos últimos 30 dias" },
  { id: 2, category: "Foco", question: "Quando alguém fala com você, percebe que não ouviu nada?", subtext: "Mesmo querendo prestar atenção" },
  { id: 3, category: "Memória", question: "Esquece compromissos importantes?", subtext: "Consultas, reuniões, encontros" },
  { id: 4, category: "Memória", question: "Perde objetos essenciais como chaves, celular ou carteira?", subtext: "Mesmo quando acabou de usar" },
  { id: 5, category: "Impulsividade", question: "Interrompe pessoas no meio da fala?", subtext: "Mesmo sabendo que é rude" },
  { id: 6, category: "Impulsividade", question: "Fala ou faz coisas por impulso e se arrepende?", subtext: "Comentários ou ações impulsivas" },
  { id: 7, category: "Procrastinação", question: "Deixa tarefas importantes para o último minuto?", subtext: "Mesmo sabendo das consequências" },
  { id: 8, category: "Procrastinação", question: "Sente paralisia quando precisa começar uma tarefa grande?", subtext: "Sem saber por onde começar" },
  { id: 9, category: "Emocional", question: "Suas emoções são mais intensas que as dos outros?", subtext: "Raiva, tristeza, empolgação extremas" },
  { id: 10, category: "Emocional", question: "Se sente sobrecarregado por coisas simples?", subtext: "Tarefas simples parecem montanhas" },
  { id: 11, category: "Autoestima", question: "Se sente 'diferente' ou 'defeituoso' comparado aos outros?", subtext: "Como se algo estivesse errado" },
  { id: 12, category: "Autoestima", question: "Se culpa por não conseguir fazer coisas 'fáceis'?", subtext: "Culpa constante por falhas" }
]

const answerOptions = [
  { value: 1, label: "Nunca", shortLabel: "Nunca", emoji: "😌" },
  { value: 2, label: "Raro", shortLabel: "Raro", emoji: "🤔" },
  { value: 3, label: "Às vezes", shortLabel: "Às vezes", emoji: "😐" },
  { value: 4, label: "Muito", shortLabel: "Muito", emoji: "😓" },
  { value: 5, label: "Sempre", shortLabel: "Sempre", emoji: "😰" }
]


const categoryConfig: Record<string, { label: string, color: string, barClass: string }> = {
  'Foco': { label: 'Foco e Atenção', color: 'hsl(175 85% 50%)', barClass: 'bar-focus' },
  'Memória': { label: 'Memória', color: 'hsl(265 85% 65%)', barClass: 'bar-memory' },
  'Impulsividade': { label: 'Impulsos', color: 'hsl(350 80% 60%)', barClass: 'bar-impulse' },
  'Procrastinação': { label: 'Produtividade', color: 'hsl(215 90% 60%)', barClass: 'bar-procrastination' },
  'Emocional': { label: 'Emoções', color: 'hsl(160 75% 50%)', barClass: 'bar-emotional' },
  'Autoestima': { label: 'Autoestima', color: 'hsl(35 95% 55%)', barClass: 'bar-selfesteem' }
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain, lightbulb: Lightbulb, target: Target, filter: Filter, database: Database,
  zap: Zap, pause: Pause, mountain: Mountain, clock: Clock, play: Play, heart: Heart,
  waves: Waves, shield: Shield, message: MessageSquare, users: Users, mask: Award
}

interface ReportData {
  headline: string
  summary: string
  insights: { title: string; description: string; icon: string }[]
  strengths: string[]
  challenges: string[]
  quickWins: { title: string; description: string; timeToResult: string }[]
  modulePreview: { title: string; description: string; topics: string[]; testimonial: { text: string; author: string } }
  nextStep: string
  score: number
  level: string
  categoryScores: { name: string; percentage: number }[]
  generated: boolean
}

const testimonials = [
  { name: "Mariana S.", age: 32, role: "Designer", text: "Chorei lendo meu relatório. Pela primeira vez alguém descreveu EXATAMENTE o que eu sinto. O app Life OS virou meu melhor amigo!", result: "Terminou o TCC após 3 anos parada", avatar: "MS" },
  { name: "Rafael O.", age: 28, role: "Desenvolvedor", text: "A gamificação do Life OS me fez criar hábitos que nunca consegui antes. Parece um jogo, mas é minha vida melhorando!", result: "Organizou finanças e foi promovido", avatar: "RO" },
  { name: "Carla M.", age: 41, role: "Advogada", text: "Diagnosticada aos 38. Esse app me deu em semanas o que 20 anos de 'só se esforce mais' nunca deram.", result: "Promovida após anos estagnada", avatar: "CM" },
  { name: "Lucas P.", age: 25, role: "Estudante", text: "Reprovei 4 vezes na faculdade. Com o Life OS, passei em todas as matérias do semestre!", result: "Passou em todas as matérias", avatar: "LP" }
]

const modules = [
  { num: 1, title: "Sistema de Captura Mental", desc: "Tire TUDO da sua cabeça e coloque em um sistema", icon: Brain },
  { num: 2, title: "Rotina Flexível Anti-TDAH", desc: "Rotinas que sobrevivem aos dias ruins", icon: Calendar },
  { num: 3, title: "Foco Sob Demanda", desc: "Foco quando você PRECISA, não só quando quer", icon: Target },
  { num: 4, title: "Procrastinação Zero", desc: "Transforme paralisia em ação em 5 minutos", icon: Zap },
  { num: 5, title: "Regulação Emocional", desc: "Controle a montanha-russa emocional", icon: Heart },
  { num: 6, title: "Hiperfoco Estratégico", desc: "Transforme seu 'defeito' em superpoder", icon: Flame }
]

const bonuses = [
  { icon: FileText, title: "Templates Prontos", desc: "Sistema completo pronto para usar", value: "R$ 97" },
  { icon: Video, title: "Masterclass: TDAH no Trabalho", desc: "Como se destacar mesmo com TDAH", value: "R$ 147" },
  { icon: Headphones, title: "Áudios de Foco", desc: "Playlists e sons para concentração", value: "R$ 47" }
]

// Friendly insights
const friendlyInsights = {
  Foco: [
    { title: "Sua mente adora novidades", description: "Seu cérebro está sempre buscando coisas interessantes. Não é falta de vontade!", icon: "lightbulb" },
    { title: "Você tem superpoderes escondidos", description: "Quando algo te interessa, você tem um foco incrível! O segredo é usar isso a seu favor.", icon: "zap" },
    { title: "Tudo parece importante ao mesmo tempo", description: "É como ter várias TVs ligadas na sua cabeça — confuso, né? Mas tem solução!", icon: "brain" }
  ],
  Memória: [
    { title: "Sua mente tem muitas abas abertas", description: "Sabe quando o computador fica lento? Seu cérebro é assim. Por isso esquece coisas.", icon: "brain" },
    { title: "Você lembra quando está no lugar certo", description: "Seu cérebro funciona melhor com 'lembretes visuais'. Vamos usar isso!", icon: "lightbulb" },
    { title: "Você precisa de ajudantes", description: "Usar lembretes, alarmes e apps não é fraqueza. É inteligência!", icon: "heart" }
  ],
  Impulsividade: [
    { title: "Você sente tudo mais rápido", description: "Seu cérebro processa rapidinho — por isso às vezes age antes de pensar.", icon: "zap" },
    { title: "Você busca emoção naturalmente", description: "Seu cérebro precisa de mais estímulo. Vamos redirecionar essa energia!", icon: "heart" },
    { title: "Esperar é difícil pra você", description: "Seu cérebro não foi feito pra espera — ele quer ação AGORA.", icon: "clock" }
  ],
  Procrastinação: [
    { title: "Começar é a parte mais difícil", description: "Você não é preguiçoso! Seu cérebro trava quando a tarefa parece grande.", icon: "play" },
    { title: "Você funciona melhor na pressão", description: "Seu cérebro precisa de urgência para liberar a 'gasolina' da ação.", icon: "clock" },
    { title: "Tarefas chatas são kryptonita", description: "Seu cérebro não consegue se motivar sem interesse. É química, não preguiça!", icon: "mountain" }
  ],
  Emocional: [
    { title: "Você sente tudo mais intensamente", description: "Alegria, raiva, tristeza — tudo é 10x mais forte. Não é drama!", icon: "heart" },
    { title: "Voltar ao normal demora mais", description: "Depois de sentir algo forte, você demora mais pra se acalmar. É normal.", icon: "waves" },
    { title: "Críticas doem mais em você", description: "Você é mais sensível — e tudo bem ser assim. Vamos trabalhar isso!", icon: "shield" }
  ],
  Autoestima: [
    { title: "Você cresceu ouvindo coisas difíceis", description: "Provavelmente já te chamaram de preguiçoso. Essas palavras machucam.", icon: "message" },
    { title: "Você se compara o tempo todo", description: "Lembra: vocês têm cérebros diferentes! A comparação não é justa.", icon: "users" },
    { title: "Você é mais capaz do que pensa", description: "Muitas vezes consegue coisas incríveis e acha que foi sorte. Não foi!", icon: "target" }
  ]
}

export default function TesteTDAH() {
  const [stage, setStage] = useState<'intro' | 'test' | 'analyzing' | 'capture' | 'result'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(12).fill(0))
  const [report, setReport] = useState<ReportData | null>(null)
  const [formData, setFormData] = useState({ name: '', whatsapp: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMicroReward, setShowMicroReward] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 })
  const [userLocation, setUserLocation] = useState({ city: '', state: '', regionPercent: 0 })

  const totalScore = answers.reduce((sum, val) => sum + val, 0)
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const remainingQuestions = questions.length - currentQuestion - 1

  // Phone mask function - formats as (00) 00000-0000
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : ''
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, whatsapp: formatted })
  }

  // Detect user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (response.ok) {
          const data = await response.json()
          const city = data.city || ''
          const state = data.region || ''
          // Generate a realistic percentage based on city size
          const percent = Math.floor(Math.random() * 8) + 19 // 19-26%
          setUserLocation({ city, state, regionPercent: percent })
        }
      } catch (e) {
        // Fallback to generic location
        setUserLocation({ city: 'sua região', state: '', regionPercent: 23 })
      }
    }
    detectLocation()
  }, [])

  // Online count simulation
  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 12) + 23) // 23-34
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        const newVal = prev + change
        return Math.max(18, Math.min(42, newVal))
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (stage === 'result' || stage === 'capture') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
          if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 }
          return prev
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [stage])

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    trackEvents.questionAnswered(currentQuestion + 1)
    
    // Show micro reward
    setShowMicroReward(true)
    setTimeout(() => setShowMicroReward(false), 800)
    
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
      } else { 
        const finalScore = newAnswers.reduce((sum, val) => sum + val, 0)
        setStage('analyzing')
        trackEvents.testCompleted(finalScore)
        fbPixelEvents.testCompleted(finalScore)
        generateReport(newAnswers) 
      }
    }, 300)
  }

  // Track page view on mount
  useEffect(() => {
    fbPixelEvents.viewContent({ content_name: 'Teste TDAH', content_ids: ['teste-tdah'] })
  }, [])

  // Scroll to top when stage changes to result
  useEffect(() => {
    if (stage === 'result') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [stage])

  const generateReport = async (finalAnswers: number[]) => {
    const score = finalAnswers.reduce((sum, val) => sum + val, 0)
    try {
      const response = await fetch('/api/generate-adhd-report', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, totalScore: score })
      })
      if (response.ok) {
        const reportData = await response.json()
        setReport(reportData)
        
        // Notify Discord about test completion
        const topCat = getTopCategoryFromAnswers(finalAnswers)
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'test_complete',
            data: { score, level: getScoreLevel(score).level, topCategory: topCat }
          })
        }).catch(() => {})
      }
    } catch (e) { console.error(e) }
    finally { setStage('result') }
  }
  
  // Helper to get top category from answers
  const getTopCategoryFromAnswers = (ans: number[]) => {
    const cats: Record<string, number[]> = {}
    questions.forEach((q, i) => {
      if (!cats[q.category]) cats[q.category] = []
      cats[q.category].push(ans[i] || 0)
    })
    let top = { cat: '', avg: 0 }
    Object.entries(cats).forEach(([cat, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      if (avg > top.avg) top = { cat, avg }
    })
    return categoryConfig[top.cat]?.label || top.cat
  }

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number - must have at least 14 chars: (00) 00000-0000
    const phoneNumbers = formData.whatsapp.replace(/\D/g, '')
    if (phoneNumbers.length < 10) {
      alert('Por favor, digite o número completo com DDD')
      return
    }
    
    setIsSubmitting(true)
    
    trackEvents.leadCaptured()
    fbPixelEvents.lead({ content_name: 'Teste TDAH', value: 0, currency: 'BRL' })
    fbPixelEvents.completeRegistration({ content_name: 'Teste TDAH' })
    
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_capture',
          data: { 
            name: formData.name, 
            whatsapp: formData.whatsapp, 
            score: totalScore, 
            level: getScoreLevel(totalScore).level, 
            topCategory: getTopCategory(),
            city: userLocation.city,
            state: userLocation.state
          }
        })
      })
    } catch (e) { console.error(e) }
    
    await new Promise(r => setTimeout(r, 500))
    setIsSubmitting(false); setStage('result')
  }

  const getScoreLevel = (score: number) => {
    const maxScore = questions.length * 5 // 60 for 12 questions
    const percentage = (score / maxScore) * 100
    if (percentage <= 30) return { level: 'Leve', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', barColor: 'hsl(160 75% 50%)' }
    if (percentage <= 50) return { level: 'Moderado', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', barColor: 'hsl(35 95% 55%)' }
    if (percentage <= 70) return { level: 'Significativo', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', barColor: 'hsl(25 95% 55%)' }
    return { level: 'Alto', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', barColor: 'hsl(350 80% 55%)' }
  }

  const getCategoryScores = () => {
    const cats: Record<string, { total: number, count: number }> = {}
    answers.forEach((s, i) => { if (s > 0) { const c = questions[i].category; if (!cats[c]) cats[c] = { total: 0, count: 0 }; cats[c].total += s; cats[c].count++ } })
    return Object.entries(cats).map(([n, d]) => ({ name: n, label: categoryConfig[n]?.label || n, color: categoryConfig[n]?.color || 'hsl(175 85% 50%)', barClass: categoryConfig[n]?.barClass || 'bar-focus', percentage: (d.total / (d.count * 5)) * 100 })).sort((a, b) => b.percentage - a.percentage)
  }

  const getTopCategory = () => {
    const scores = getCategoryScores()
    return scores.length > 0 ? scores[0].name : 'Foco'
  }

  const getFriendlyInsights = () => {
    const topCat = getTopCategory()
    return friendlyInsights[topCat as keyof typeof friendlyInsights] || friendlyInsights.Foco
  }

  const maxScore = questions.length * 5
  const scorePercentage = Math.round((totalScore / maxScore) * 100)

  // Blurred Preview - IMPRESSIVE VERSION
  const BlurredPreview = () => {
    const cats = getCategoryScores()
    const insights = getFriendlyInsights()
    return (
      <div className="relative rounded-2xl overflow-hidden">
        {/* Overlay with lock */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-background/40 via-background/60 to-background/90 pointer-events-none">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl mb-3 shadow-lg shadow-primary/20"
          >
            <Lock className="w-8 h-8 text-background" />
          </motion.div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="text-lg font-bold text-foreground mb-1"
          >
            Seu relatório está pronto!
          </motion.p>
          <motion.p 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            Preencha abaixo para desbloquear
          </motion.p>
        </div>
        
        {/* Blurred content - Rich preview */}
        <div className="blur-[8px] select-none pointer-events-none p-4 space-y-4 bg-card/50 border border-border rounded-2xl">
          
          {/* Score header */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl font-bold text-background">{scorePercentage}%</span>
            </div>
            <div>
              <div className="text-xl font-bold">{getScoreLevel(totalScore).level}</div>
              <div className="text-sm text-muted-foreground">Nível de compatibilidade TDAH</div>
            </div>
          </div>

          {/* Category bars - ALL categories */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="font-bold">Análise por Área</span>
            </div>
            <div className="space-y-3">
              {cats.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{c.label}</span>
                    <span className="font-bold" style={{ color: c.color }}>{Math.round(c.percentage)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.barClass}`} style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights preview */}
          <div className="grid grid-cols-2 gap-3">
            {insights.slice(0, 2).map((ins, i) => {
              const Icon = iconMap[ins.icon] || Brain
              return (
                <div key={i} className="p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-bold text-sm mb-1">{ins.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{ins.description}</div>
                </div>
              )
            })}
          </div>

          {/* Quick wins preview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-bold">3 Dicas Práticas para Hoje</span>
            </div>
            <div className="space-y-2">
              {['Técnica dos 2 minutos para começar', 'Sistema de recompensas pessoal', 'Hack do timer de 15 minutos'].map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-xs font-bold text-amber-400">{i + 1}</div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extra content blocks */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-lg bg-card border border-border text-center">
              <Brain className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-xs font-medium">Seu Perfil</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border text-center">
              <Target className="w-6 h-6 text-secondary mx-auto mb-1" />
              <div className="text-xs font-medium">Pontos Fortes</div>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border text-center">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-medium">Plano de Ação</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Micro Reward Animation */}
      <AnimatePresence>
        {showMicroReward && (
          <motion.div initial={{ opacity: 0, scale: 0.5, y: 0 }} animate={{ opacity: 1, scale: 1, y: -20 }} exit={{ opacity: 0, scale: 0.5, y: -40 }} className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="text-4xl">✨</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Intro */}
        {stage === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center animate-glow"><Brain className="w-10 h-10 text-background" /></div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Teste Rápido <span className="gradient-primary">TDAH</span></h1>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">12 perguntas rápidas para entender como seu cérebro funciona</p>
              
              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                <div className="flex -space-x-2">
                  {['MS', 'RO', 'CM'].map((a, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold text-background border-2 border-background">{a}</div>
                  ))}
                </div>
                <span className="text-muted-foreground"><span className="text-primary font-semibold">{onlineCount}</span> pessoas fazendo agora</span>
              </div>

              <div className="flex justify-center gap-4 mb-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary/70" /><span>~3 min</span></div>
                <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary/70" /><span>Relatório com IA</span></div>
                <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-primary/70" /><span>100% Privado</span></div>
              </div>
              
              <button onClick={() => { setStage('test'); trackEvents.testStarted(); fbPixelEvents.testStarted(); fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'test_start' }) }).catch(() => {}) }} className="btn-primary w-full py-5 rounded-xl text-lg font-bold flex items-center gap-3 justify-center">
                Começar Teste Grátis <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-[11px] text-muted-foreground mt-4">✓ Sem cadastro • ✓ Resultado imediato</p>
            </div>
          </motion.div>
        )}

        {/* Test */}
        {stage === 'test' && (
          <motion.div key={`q-${currentQuestion}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {remainingQuestions === 0 ? (
                      <span className="text-primary font-medium">🎯 Última pergunta!</span>
                    ) : (
                      <>Faltam <span className="text-primary font-bold">{remainingQuestions}</span> perguntas</>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{currentQuestion + 1}/{questions.length}</span>
                </div>
                <div className="progress-bar h-2"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
              </div>
              
              {/* Question Card */}
              <div className="question-card p-5 md:p-6 mb-5 rounded-2xl">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary mb-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {questions[currentQuestion].category}
                </span>
                <h2 className="text-lg md:text-xl font-semibold mb-1.5 leading-snug">{questions[currentQuestion].question}</h2>
                <p className="text-sm text-muted-foreground">{questions[currentQuestion].subtext}</p>
              </div>
              
              {/* Answer Options - Mobile optimized */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-4">
                {answerOptions.map(o => (
                  <button 
                    key={o.value} 
                    onClick={() => handleAnswer(o.value)} 
                    className={`p-2 sm:p-3 md:p-4 text-center rounded-lg sm:rounded-xl transition-all border-2 
                      ${answers[currentQuestion] === o.value 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{o.emoji}</div>
                    <div className="text-[10px] sm:text-xs font-medium leading-tight">{o.shortLabel}</div>
                  </button>
                ))}
              </div>
              
              {/* Back button */}
              {currentQuestion > 0 && (
                <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              )}
            </div>
          </motion.div>
        )}


        {/* Analyzing */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-sm w-full text-center">
              <Loader2 className="w-14 h-14 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Analisando...</h2>
              <p className="text-muted-foreground text-sm mb-6">IA processando suas respostas</p>
              <div className="space-y-2 text-left max-w-xs mx-auto">
                {['Identificando padrões...', 'Gerando insights...', 'Preparando resultado...'].map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{t}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Capture - IMPACTFUL VERSION */}
        {stage === 'capture' && (
          <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen py-6 px-4">
            <div className="max-w-2xl mx-auto">
              
              {/* Location-based alert */}
              {userLocation.city && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mb-4"
                >
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-sm text-amber-400">
                      📍 <span className="font-bold">{userLocation.city}{userLocation.state ? `, ${userLocation.state}` : ''}</span> está entre as regiões mais afetadas do Brasil
                    </p>
                    <p className="text-xs text-amber-400/80 mt-1">
                      Cerca de <span className="font-bold">{userLocation.regionPercent}%</span> dos adultos da sua região apresentam sinais de TDAH não diagnosticado
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Header celebration */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-center mb-6"
              >
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
                >
                  <CheckCircle className="w-4 h-4" />
                  Teste concluído com sucesso!
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold mb-2"
                >
                  Uau! Seu relatório ficou <span className="gradient-primary">incrível</span> 🎉
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Nossa IA identificou padrões únicos no seu cérebro
                </motion.p>
              </motion.div>

              {/* Main content - Blurred preview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <BlurredPreview />
              </motion.div>

              {/* Form card - sticky on mobile */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 }}
                className="card-highlight p-6 rounded-2xl relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
                      <Gift className="w-3.5 h-3.5" />
                      100% gratuito
                    </div>
                    <h2 className="text-xl font-bold mb-2">Só mais um passinho! 👇</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Pra gente <span className="text-foreground">personalizar seu relatório</span> e te mandar as <span className="text-foreground">dicas certas</span> pro seu perfil
                    </p>
                  </div>

                  <form onSubmit={handleSubmitLead} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Seu primeiro nome</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input 
                          type="text" 
                          required 
                          value={formData.name} 
                          onChange={e => setFormData({ ...formData, name: e.target.value })} 
                          placeholder="Ex: João" 
                          className="w-full pl-12 py-4 text-base rounded-xl" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Telefone (com DDD)</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input 
                          type="tel" 
                          required 
                          value={formData.whatsapp} 
                          onChange={handlePhoneChange}
                          placeholder="(11) 99999-9999" 
                          maxLength={15}
                          className="w-full pl-12 py-4 text-base rounded-xl" 
                        />
                      </div>
                    </div>
                    
                    {/* Why we need this - light explanation */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground text-center">
                        📱 <span className="text-foreground/80">Por que pedimos isso?</span> Pra enviar seu relatório salvo e dicas extras que vão te ajudar. <span className="text-emerald-400">Prometemos: sem spam!</span>
                      </p>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="btn-primary w-full py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Ver Meu Resultado
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Trust signals */}
                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Seguro</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Resultado na hora</span>
                  </div>
                </div>
              </motion.div>

              {/* Social proof */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.8 }}
                className="text-center mt-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {['MS', 'RO', 'CM', 'LP'].map((a, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-background border-2 border-background">{a}</div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">+2.800 pessoas já fizeram</span>
                </div>
                <div className="flex justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Result - MASTERPIECE SALES PAGE */}
        {stage === 'result' && report && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
            
            {/* ========== STICKY CTA BAR ========== */}
            <motion.div 
              initial={{ y: -100 }} 
              animate={{ y: 0 }} 
              transition={{ delay: 2, type: "spring" }}
              className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-emerald-500 py-3 px-4 shadow-lg"
            >
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="hidden sm:block text-background text-sm font-medium">
                  🎁 Oferta especial: <span className="font-bold">R$ 19,90</span> (de R$ 391)
                </div>
                <div className="flex-1 sm:flex-none">
                  <Link href="/checkout">
                    <button className="w-full sm:w-auto bg-background text-primary font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-background/90 transition-all shadow-md">
                      GARANTIR AGORA →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Spacer for sticky bar */}
            <div className="h-14" />
            
            {/* ========== HERO: EMOTIONAL CONNECTION ========== */}
            <section className="relative py-10 px-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
              <div className="max-w-3xl mx-auto relative">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  
                  {/* Location badge */}
                  {userLocation.city && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                      📍 {userLocation.city} • {userLocation.regionPercent}% dos adultos têm TDAH não diagnosticado
                    </motion.div>
                  )}

                  <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    Ei, agora eu preciso que você<br />
                    <span className="gradient-primary">leia isso com atenção</span>
                  </motion.h1>
                  
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                    O que você vai ver agora pode mudar <span className="text-foreground font-medium">completamente</span> a forma como você se enxerga. 
                    E mais importante: pode ser o primeiro passo para <span className="text-foreground font-medium">parar de sofrer em silêncio</span>.
                  </motion.p>

                  {/* Score Circle */}
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
                      <motion.circle cx="18" cy="18" r="16" fill="none" stroke={getScoreLevel(totalScore).barColor} strokeWidth="2.5" strokeLinecap="round" initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: `${scorePercentage} 100` }} transition={{ duration: 1.5, delay: 0.5 }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{scorePercentage}%</span>
                      <span className={`text-sm font-semibold ${getScoreLevel(totalScore).color}`}>{getScoreLevel(totalScore).level}</span>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className={`inline-block px-6 py-3 rounded-xl ${getScoreLevel(totalScore).bg} ${getScoreLevel(totalScore).border} border mb-8`}>
                    <p className="text-sm">
                      <span className="font-bold">Compatibilidade com TDAH:</span>{' '}
                      <span className={`font-bold ${getScoreLevel(totalScore).color}`}>{getScoreLevel(totalScore).level}</span>
                    </p>
                  </motion.div>

                  {/* EARLY CTA - Right after score */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/30 rounded-2xl p-6 max-w-md mx-auto">
                    <p className="text-lg font-bold mb-2">🎯 Quer saber como lidar com isso?</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Preparei um plano completo pra você por apenas <span className="text-primary font-bold">R$ 19,90</span>
                    </p>
                    <Link href="/checkout">
                      <button className="btn-primary w-full py-4 rounded-xl font-bold text-base">
                        Ver o Plano Completo →
                      </button>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      ✓ Garantia de 7 dias • ✓ Acesso imediato
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* ========== VALIDATION: "Agora faz sentido" ========== */}
            <section className="py-12 px-4 bg-card/50">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Sabe aquela sensação de que <span className="gradient-warm">algo está errado com você</span>?
                  </h2>
                  <p className="text-muted-foreground text-lg">Agora você tem a resposta.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {[
                    { emoji: "😔", text: "Você não é preguiçoso", subtext: "Seu cérebro só precisa de mais estímulo para começar tarefas" },
                    { emoji: "🧠", text: "Você não é burro", subtext: "Na verdade, pessoas com TDAH costumam ser extremamente criativas" },
                    { emoji: "💪", text: "Você não é fraco", subtext: "Você luta batalhas invisíveis que os outros nem imaginam" },
                    { emoji: "✨", text: "Você não é defeituoso", subtext: "Seu cérebro funciona diferente — e isso pode ser um superpoder" }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl bg-card border border-border">
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <h3 className="font-bold text-lg mb-1">{item.text}</h3>
                      <p className="text-sm text-muted-foreground">{item.subtext}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
                  <p className="text-lg text-muted-foreground">
                    Tudo que você passou até hoje —{' '}
                    <span className="text-foreground font-medium">as críticas, a frustração, a culpa</span>{' '}
                    — não foi porque você não se esforçou o suficiente.
                  </p>
                  <p className="text-xl font-bold mt-4 gradient-primary">Foi porque ninguém te ensinou a usar seu cérebro do jeito certo.</p>
                </motion.div>
              </div>
            </section>

            {/* ========== YOUR COMPLETE BRAIN MAP ========== */}
            <section className="py-12 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-primary mb-4"><BarChart3 className="w-3.5 h-3.5" /> Seu Mapa Cerebral Completo</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Como seu cérebro <span className="gradient-primary">realmente funciona</span></h2>
                </motion.div>

                <div className="space-y-4 mb-8">
                  {getCategoryScores().map((cat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                            {cat.name === 'Foco' && <Target className="w-5 h-5" style={{ color: cat.color }} />}
                            {cat.name === 'Memória' && <Brain className="w-5 h-5" style={{ color: cat.color }} />}
                            {cat.name === 'Impulsividade' && <Zap className="w-5 h-5" style={{ color: cat.color }} />}
                            {cat.name === 'Procrastinação' && <Clock className="w-5 h-5" style={{ color: cat.color }} />}
                            {cat.name === 'Emocional' && <Heart className="w-5 h-5" style={{ color: cat.color }} />}
                            {cat.name === 'Autoestima' && <Shield className="w-5 h-5" style={{ color: cat.color }} />}
                          </div>
                          <div>
                            <h4 className="font-bold">{cat.label}</h4>
                            <p className="text-xs text-muted-foreground">
                              {cat.percentage >= 70 ? '⚠️ Área que precisa de atenção' : cat.percentage >= 50 ? '📊 Nível moderado' : '✅ Relativamente controlado'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold" style={{ color: cat.color }}>{Math.round(cat.percentage)}%</span>
                        </div>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${cat.barClass}`} initial={{ width: 0 }} whileInView={{ width: `${cat.percentage}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========== INSIGHTS: What this means ========== */}
            <section className="py-12 px-4 bg-card/50">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-secondary mb-4"><Lightbulb className="w-3.5 h-3.5" /> Análise Personalizada</span>
                  <h2 className="text-2xl md:text-3xl font-bold">O que isso <span className="gradient-secondary">significa pra você</span></h2>
                </motion.div>

                <div className="space-y-4 mb-8">
                  {getFriendlyInsights().slice(0, 2).map((ins, i) => {
                    const Icon = iconMap[ins.icon] || Brain
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl bg-card border border-border">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">{ins.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">{ins.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* MID-PAGE CTA */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center p-6 rounded-2xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/30">
                  <p className="text-lg font-bold mb-2">💡 Quer aprender a lidar com TUDO isso?</p>
                  <p className="text-sm text-muted-foreground mb-4">Tenho um método completo por apenas R$ 19,90</p>
                  <Link href="/checkout">
                    <button className="btn-primary px-8 py-3 rounded-xl font-bold">
                      Quero o Método Completo →
                    </button>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* ========== OFFER SECTION - DIRETO AO PONTO ========== */}
            <section className="py-12 px-4 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    E agora? <span className="gradient-primary">O que você faz com isso?</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Você pode fechar essa página e continuar do mesmo jeito...<br />
                    <span className="text-foreground font-medium">Ou pode dar o próximo passo.</span>
                  </p>
                </motion.div>

                {/* The Offer */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  
                  <div className="relative">
                    <div className="text-center mb-6">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold mb-4">
                        🎁 OFERTA ESPECIAL
                      </span>
                      <h3 className="text-2xl font-bold mb-2">Guia Mente Caótica + App Life OS</h3>
                      <p className="text-muted-foreground text-sm">Tudo que você precisa pra dominar seu cérebro</p>
                    </div>

                    {/* What's included */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">Guia completo com 47+ técnicas práticas</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">App Life OS por 1 ano (gamifica sua rotina)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">Templates + Áudios de foco + Bônus</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-lg text-muted-foreground line-through">R$ 391,00</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold">-95%</span>
                      </div>
                      <div className="text-5xl font-bold text-primary mb-1">R$ 19,90</div>
                      <p className="text-xs text-muted-foreground">Pagamento único • Acesso imediato</p>
                    </div>

                    {/* CTA */}
                    <Link href="/checkout">
                      <button className="btn-primary w-full py-5 rounded-xl text-lg font-bold shadow-lg shadow-primary/30 mb-4">
                        QUERO COMEÇAR AGORA →
                      </button>
                    </Link>

                    {/* Trust */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Garantia 7 dias</span>
                      <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Pagamento seguro</span>
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Acesso imediato</span>
                    </div>
                  </div>
                </motion.div>

                {/* Testimonial */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 p-4 rounded-xl bg-card/50 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-background flex-shrink-0">MS</div>
                    <div>
                      <p className="text-sm text-muted-foreground italic mb-2">"Chorei lendo o guia. Pela primeira vez alguém me entendeu. O app virou meu melhor amigo!"</p>
                      <p className="text-xs text-primary font-medium">— Mariana S., 32 anos</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="py-12 px-4">
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  Você chegou até aqui por um motivo.
                </h2>
                <p className="text-muted-foreground mb-6">
                  Não deixa essa oportunidade passar. Por <span className="text-primary font-bold">R$ 19,90</span> você pode mudar tudo.
                </p>
                <Link href="/checkout">
                  <button className="btn-primary px-10 py-5 rounded-xl text-lg font-bold">
                    GARANTIR MINHA VAGA →
                  </button>
                </Link>
              </div>
            </section>


            {/* ========== LIFE OS: A Solução ========== */}
            <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 via-secondary/5 to-transparent">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-secondary mb-4"><Gamepad2 className="w-3.5 h-3.5" /> A Solução Completa</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Apresento a você o <span className="gradient-secondary">Life OS</span>
                  </h2>
                  <p className="text-xl text-muted-foreground">O sistema operacional para cérebros que funcionam diferente</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="card-purple p-8 rounded-3xl relative overflow-hidden mb-8">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
                  
                  <div className="relative">
                    <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-secondary to-[hsl(285_80%_55%)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/30">
                        <Gamepad2 className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">Sua vida. Gamificada. Dominada.</h3>
                        <p className="text-muted-foreground">Transforme cada tarefa em missão. Cada hábito em power-up. Cada dia em uma vitória.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { emoji: "🎮", title: "Missões Diárias", desc: "Tarefas viram quests com recompensas" },
                        { emoji: "⭐", title: "Sistema de XP", desc: "Evolua de nível completando objetivos" },
                        { emoji: "🏆", title: "Conquistas", desc: "Desbloqueie badges por marcos" },
                        { emoji: "🔥", title: "Streaks", desc: "Mantenha sequências, ganhe bônus" },
                        { emoji: "📊", title: "Analytics", desc: "Veja sua evolução em tempo real" },
                        { emoji: "⚔️", title: "Boss Fights", desc: "Enfrente seus maiores desafios" }
                      ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-background/50 border border-secondary/20 text-center">
                          <div className="text-2xl mb-2">{item.emoji}</div>
                          <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
                  <p className="text-lg text-muted-foreground mb-2">
                    Seu cérebro TDAH <span className="text-foreground font-bold">precisa de dopamina</span> para funcionar.
                  </p>
                  <p className="text-xl font-bold">O Life OS entrega isso em cada clique. ✨</p>
                </motion.div>
              </div>
            </section>

            {/* ========== TESTIMONIALS: Prova Social ========== */}
            <section className="py-16 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-primary mb-4"><Star className="w-3.5 h-3.5" /> Histórias Reais</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Pessoas como você que <span className="gradient-primary">transformaram suas vidas</span></h2>
                </motion.div>

                <div className="space-y-4">
                  {testimonials.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-xl bg-card border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-bold text-background flex-shrink-0">{t.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{t.name}</span>
                            <span className="text-xs text-muted-foreground">{t.age} anos • {t.role}</span>
                            <div className="flex gap-0.5 ml-auto">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed mb-3">"{t.text}"</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span className="font-bold text-primary">{t.result}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========== IRRESISTIBLE OFFER ========== */}
            <section className="py-16 px-4 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                    <Timer className="w-4 h-4" />
                    Oferta especial expira em {countdown.minutes}:{countdown.seconds.toString().padStart(2, '0')}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Tudo isso por um valor que <span className="gradient-primary">não faz sentido</span>
                  </h2>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="card-highlight p-8 rounded-3xl relative overflow-hidden mb-8">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                  
                  <div className="relative">
                    {/* What's included */}
                    <div className="mb-8">
                      <h3 className="font-bold text-lg mb-4 text-center">O que você recebe:</h3>
                      <div className="space-y-3">
                        {[
                          { item: "App Life OS por 1 ano completo", value: "R$ 197", emoji: "🎮" },
                          { item: "Guia Mente Caótica (6 módulos)", value: "R$ 147", emoji: "📚" },
                          { item: "Templates de Produtividade", value: "R$ 97", emoji: "📝" },
                          { item: "Masterclass: TDAH no Trabalho", value: "R$ 147", emoji: "🎓" },
                          { item: "Áudios de Foco e Concentração", value: "R$ 47", emoji: "🎧" },
                          { item: "Suporte via WhatsApp", value: "R$ 97", emoji: "💬" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{item.emoji}</span>
                              <span className="font-medium">{item.item}</span>
                            </div>
                            <span className="text-muted-foreground line-through text-sm">{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mt-4">
                        <span className="font-bold">Valor total:</span>
                        <span className="text-xl line-through text-muted-foreground">R$ 732</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <p className="text-muted-foreground mb-2">Hoje você leva tudo isso por apenas:</p>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-3xl text-muted-foreground line-through">R$ 197</span>
                        <div>
                          <span className="text-6xl font-bold text-primary">R$ 19,90</span>
                          <p className="text-sm text-muted-foreground">Pagamento único • Sem mensalidades</p>
                        </div>
                      </div>
                      <p className="text-emerald-400 font-bold mt-2">Você economiza R$ 712,10! 🎉</p>
                    </div>

                    {/* CTA */}
                    <Link href="/checkout">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full py-6 rounded-2xl text-xl font-bold shadow-lg shadow-primary/30 mb-4">
                        QUERO TRANSFORMAR MINHA VIDA AGORA →
                      </motion.button>
                    </Link>

                    {/* Trust */}
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                      {[
                        { icon: ShieldCheck, text: 'Site Seguro' },
                        { icon: Lock, text: 'SSL 256-bit' },
                        { icon: CreditCard, text: 'Pix ou Cartão' },
                        { icon: Fingerprint, text: 'Dados Protegidos' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                          <item.icon className="w-3.5 h-3.5" /> {item.text}
                        </div>
                      ))}
                    </div>

                    {/* Guarantee */}
                    <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-400 text-lg mb-1">Garantia Incondicional de 7 Dias</h4>
                          <p className="text-sm text-muted-foreground">Se você não ficar 100% satisfeito, devolvemos cada centavo. Sem perguntas, sem burocracia, sem estresse. <span className="text-foreground font-medium">Risco ZERO pra você.</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Final urgency */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
                  <p className="text-muted-foreground mb-4">
                    <span className="text-foreground font-bold">{onlineCount} pessoas</span> estão vendo essa oferta agora.
                  </p>
                  <p className="text-sm text-red-400">
                    ⚠️ Esse preço é exclusivo para quem acabou de fazer o teste. Ao sair dessa página, você perde o desconto.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="py-16 px-4">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    A escolha é sua.
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Você pode continuar lutando sozinho contra um cérebro que você não entende...<br />
                    <span className="text-foreground font-bold">Ou pode dar o primeiro passo hoje.</span>
                  </p>
                  <Link href="/checkout">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-12 py-6 rounded-2xl text-xl font-bold">
                      SIM, EU QUERO MUDAR MINHA VIDA →
                    </motion.button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-4">Acesso imediato • Garantia de 7 dias • Suporte humanizado</p>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-border/50">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-xs text-muted-foreground mb-3">* Este teste e material não substituem diagnóstico ou tratamento médico profissional</p>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Voltar ao início</Link>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
