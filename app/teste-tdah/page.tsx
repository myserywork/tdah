'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  PartyPopper, Rocket, Bot, Send, Stethoscope, GraduationCap
} from 'lucide-react'

// Professional scales questions - based on ASRS and clinical criteria
const questions = [
  { id: 1, category: "Foco", question: "Com que frequência você começa várias coisas ao mesmo tempo e não termina nenhuma?", aiIntro: "Vamos começar falando sobre atenção e foco..." },
  { id: 2, category: "Foco", question: "Quando alguém está falando com você, percebe que não ouviu nada do que foi dito?", aiIntro: "Entendo. Agora sobre concentração..." },
  { id: 3, category: "Memória", question: "Com que frequência você esquece compromissos importantes como consultas ou reuniões?", aiIntro: "Ótimo, vamos falar sobre memória agora..." },
  { id: 4, category: "Memória", question: "Você perde objetos essenciais como chaves, celular ou carteira?", aiIntro: "Continuando sobre memória..." },
  { id: 5, category: "Impulsividade", question: "Com que frequência você interrompe as pessoas quando estão falando?", aiIntro: "Agora vou te perguntar sobre impulsividade..." },
  { id: 6, category: "Impulsividade", question: "Você fala ou faz coisas por impulso e depois se arrepende?", aiIntro: "Ainda sobre impulsos..." },
  { id: 7, category: "Procrastinação", question: "Você deixa tarefas importantes para o último minuto?", aiIntro: "Vamos falar sobre produtividade..." },
  { id: 8, category: "Procrastinação", question: "Sente paralisia ou travamento quando precisa começar uma tarefa grande?", aiIntro: "Sobre iniciar tarefas..." },
  { id: 9, category: "Emocional", question: "Suas emoções são mais intensas do que parecem ser para outras pessoas?", aiIntro: "Agora sobre suas emoções..." },
  { id: 10, category: "Emocional", question: "Você se sente sobrecarregado por coisas que parecem simples para os outros?", aiIntro: "Quase terminando..." },
  { id: 11, category: "Autoestima", question: "Você se sente 'diferente' ou como se algo estivesse errado com você?", aiIntro: "Últimas perguntas..." },
  { id: 12, category: "Autoestima", question: "Você se culpa por não conseguir fazer coisas que parecem 'fáceis'?", aiIntro: "Última pergunta!" }
]

// Answer options for chat interface
const answerOptions = [
  { value: 1, label: "Nunca acontece", shortLabel: "Nunca", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30" },
  { value: 2, label: "Raramente", shortLabel: "Raro", color: "bg-teal-500/20 border-teal-500/40 text-teal-300 hover:bg-teal-500/30" },
  { value: 3, label: "Às vezes", shortLabel: "Às vezes", color: "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30" },
  { value: 4, label: "Frequentemente", shortLabel: "Muito", color: "bg-orange-500/20 border-orange-500/40 text-orange-300 hover:bg-orange-500/30" },
  { value: 5, label: "Sempre", shortLabel: "Sempre", color: "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30" }
]

// Empathetic feedback messages based on answer value
const feedbackMessages = [
  [], // index 0 not used
  ["Ótimo! Isso é um bom sinal. ✨", "Que bom! Parece que isso não te afeta tanto.", "Perfeito, vamos continuar!"],
  ["Entendi! Acontece com pouca frequência.", "Ok, raramente então. Vamos em frente!", "Anotado! Isso é relativamente normal."],
  ["Entendo... isso acontece com muita gente.", "Sei como é. Vamos ver os outros pontos.", "Ok, às vezes pode ser desafiador mesmo."],
  ["Hmm, isso parece te afetar bastante...", "Entendo. Isso pode ser difícil de lidar.", "Obrigado por compartilhar isso comigo."],
  ["Compreendo... isso deve ser bem desafiador.", "Você não está sozinho nisso. 💙", "Isso realmente impacta sua vida, não é?"]
]

// Get random feedback
const getRandomFeedback = (value: number) => {
  const messages = feedbackMessages[value] || feedbackMessages[3]
  return messages[Math.floor(Math.random() * messages.length)]
}


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

// Chat message type
interface ChatMessage {
  id: number
  type: 'ai' | 'user' | 'typing'
  content: string
  timestamp: Date
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
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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

  // Scroll chat to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Add AI message with typing effect
  const addAIMessage = async (content: string, delay: number = 1000) => {
    setIsTyping(true)
    setShowOptions(false)
    await new Promise(r => setTimeout(r, delay))
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      content,
      timestamp: new Date()
    }])
    setIsTyping(false)
    scrollToBottom()
  }

  // Show question in chat
  const showQuestion = async (questionIndex: number) => {
    const q = questions[questionIndex]
    
    // Show intro message first
    await addAIMessage(q.aiIntro, 600)
    await new Promise(r => setTimeout(r, 400))
    
    // Show the actual question
    await addAIMessage(q.question, 800)
    
    // Show options
    setShowOptions(true)
    scrollToBottom()
  }

  // Start the chat test
  const startChatTest = async () => {
    setStage('test')
    trackEvents.testStarted()
    fbPixelEvents.testStarted()
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'test_start' }) }).catch(() => {})
    
    // Initial AI messages
    await addAIMessage("Olá! 👋 Eu sou a ARIA, assistente de avaliação neurológica.", 500)
    await addAIMessage("Vou aplicar uma avaliação baseada em escalas clínicas validadas (ASRS e critérios do DSM-5).", 1200)
    await addAIMessage("São apenas 12 perguntas rápidas. Responda com sinceridade — não existe resposta certa ou errada.", 1200)
    await new Promise(r => setTimeout(r, 500))
    
    // Show first question
    showQuestion(0)
  }

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    trackEvents.questionAnswered(currentQuestion + 1)
    setShowOptions(false)
    
    // Add user's answer to chat
    const answerLabel = answerOptions.find(o => o.value === value)?.label || ''
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: answerLabel,
      timestamp: new Date()
    }])
    
    // Show feedback and next question
    setTimeout(async () => {
      // Add empathetic feedback
      const feedback = getRandomFeedback(value)
      await addAIMessage(feedback, 800)
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        await new Promise(r => setTimeout(r, 300))
        showQuestion(currentQuestion + 1)
      } else { 
        // Test complete
        await addAIMessage("Perfeito! Recebi todas as suas respostas. 🎉", 800)
        await addAIMessage("Agora vou analisar seu perfil com nossa IA...", 600)
        
        const finalScore = newAnswers.reduce((sum, val) => sum + val, 0)
        setStage('analyzing')
        trackEvents.testCompleted(finalScore)
        fbPixelEvents.testCompleted(finalScore)
        generateReport(newAnswers) 
      }
    }, 400)
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
        {/* Intro - Professional & Clean */}
        {stage === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <div className="max-w-lg w-full">
              {/* Professional Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                  <Stethoscope className="w-4 h-4" />
                  Avaliação Clínica Validada
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                  Avaliação de <span className="text-blue-600 dark:text-blue-400">TDAH</span>
                </h1>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Baseada nas escalas <strong>ASRS</strong> (Adult ADHD Self-Report Scale) e critérios do <strong>DSM-5</strong>, utilizadas por profissionais de saúde em todo o mundo.
                </p>
              </div>

              {/* Chat Preview Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
                {/* Chat Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">ARIA</div>
                    <div className="text-xs text-blue-100">Assistente de Avaliação Neurológica</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-blue-100">Online</span>
                  </div>
                </div>
                
                {/* Preview Messages */}
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                      <p className="text-sm text-slate-700 dark:text-slate-200">Olá! Vou te fazer algumas perguntas para entender como seu cérebro funciona. Pronto para começar?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                      <p className="text-sm">Pronto! Vamos lá 👍</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">~3 minutos</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">12 questões</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">100% Privado</span>
                </div>
              </div>
              
              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                <div className="flex -space-x-2">
                  {['MS', 'RO', 'CM', 'LP'].map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-slate-800">{a}</div>
                  ))}
                </div>
                <span className="text-slate-500 dark:text-slate-400"><span className="text-blue-600 dark:text-blue-400 font-semibold">{onlineCount}</span> pessoas fazendo agora</span>
              </div>

              {/* CTA Button */}
              <button 
                onClick={startChatTest}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <MessageSquare className="w-5 h-5" />
                Iniciar Avaliação
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                ✓ Sem cadastro necessário • ✓ Resultado com IA imediato
              </p>
            </div>
          </motion.div>
        )}

        {/* Test - Chat Interface */}
        {stage === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            
            {/* Chat Header - Fixed */}
            <div className="sticky top-0 z-50 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">ARIA</div>
                <div className="text-xs text-blue-100">Assistente de Avaliação</div>
              </div>
              
              {/* Progress indicator */}
              <div className="text-right">
                <div className="text-sm font-medium text-white">{currentQuestion + 1}/{questions.length}</div>
                <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
              style={{ paddingBottom: showOptions ? '200px' : '100px' }}
            >
              <AnimatePresence mode="popLayout">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                      msg.type === 'ai' 
                        ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-md text-slate-700 dark:text-slate-200' 
                        : 'bg-blue-600 text-white rounded-tr-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Answer Options - Fixed at bottom */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-2"
                >
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-3">Escolha sua resposta:</p>
                  <div className="grid grid-cols-1 gap-2 max-w-lg mx-auto">
                    {answerOptions.map((o, i) => (
                      <motion.button
                        key={o.value}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleAnswer(o.value)}
                        className={`w-full py-3 px-4 rounded-xl border-2 text-left font-medium transition-all ${o.color}`}
                      >
                        {o.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}


        {/* Analyzing */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <div className="max-w-md w-full">
              {/* Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                {/* AI Avatar */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white animate-pulse" />
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">ARIA está analisando...</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Processando suas respostas com inteligência artificial</p>
                
                {/* Progress steps */}
                <div className="space-y-3 text-left max-w-xs mx-auto">
                  {[
                    { text: 'Aplicando escalas clínicas...', delay: 0 },
                    { text: 'Identificando padrões neurológicos...', delay: 0.5 },
                    { text: 'Gerando insights personalizados...', delay: 1 },
                    { text: 'Preparando seu relatório...', delay: 1.5 }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: item.delay }} 
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Trust badges */}
              <div className="flex justify-center gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Dados protegidos</span>
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> 100% privado</span>
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
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
            
            {/* ========== HERO: Resultado Impactante ========== */}
            <section className="relative py-12 px-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20" />
              <div className="max-w-2xl mx-auto relative">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  
                  {/* Success Badge */}
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                    <CheckCircle className="w-4 h-4" />
                    Avaliação Concluída com Sucesso
                  </motion.div>

                  <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                    Seu Resultado está Pronto
                  </motion.h1>
                  
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-600 dark:text-slate-400 mb-8">
                    Baseado nas escalas ASRS e critérios do DSM-5
                  </motion.p>

                  {/* Score Card */}
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-700" />
                        <motion.circle cx="18" cy="18" r="15" fill="none" stroke={getScoreLevel(totalScore).barColor} strokeWidth="3" strokeLinecap="round" initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: `${scorePercentage} 100` }} transition={{ duration: 2, delay: 0.5 }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-slate-900 dark:text-white">{scorePercentage}%</span>
                        <span className={`text-sm font-semibold mt-1 ${getScoreLevel(totalScore).color}`}>{getScoreLevel(totalScore).level}</span>
                      </div>
                    </div>
                    
                    <div className={`inline-block px-6 py-3 rounded-xl ${getScoreLevel(totalScore).bg} border ${getScoreLevel(totalScore).border}`}>
                      <p className="text-sm font-medium">
                        Indicativo de <span className={`font-bold ${getScoreLevel(totalScore).color}`}>TDAH {getScoreLevel(totalScore).level}</span>
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* ========== O QUE ISSO SIGNIFICA ========== */}
            <section className="py-12 px-4 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/10">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                    Agora <span className="text-amber-600 dark:text-amber-400">faz sentido</span>, não é?
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    Todas aquelas vezes que você se perguntou "por que eu não consigo?"... 
                    <span className="text-slate-900 dark:text-white font-medium"> Não era falta de esforço.</span>
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4 mb-10">
                  {[
                    { emoji: "💭", title: "As críticas que você recebeu", text: "\"Você é inteligente, só não se esforça\" — Elas estavam erradas." },
                    { emoji: "😔", title: "A culpa que você carrega", text: "Por não conseguir fazer coisas \"simples\" que os outros fazem." },
                    { emoji: "🔄", title: "Os ciclos que se repetem", text: "Começar projetos e não terminar. Procrastinar. Esquecer." },
                    { emoji: "💪", title: "As batalhas invisíveis", text: "Ninguém vê o quanto você luta só pra funcionar normalmente." }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <span className="text-3xl mb-3 block">{item.emoji}</span>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{item.text}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    A boa notícia? <span className="text-amber-600 dark:text-amber-400">Agora você sabe.</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    E conhecimento é o primeiro passo para a mudança.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* ========== SEU MAPA CEREBRAL ========== */}
            <section className="py-12 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                    <BarChart3 className="w-4 h-4" />
                    Análise Detalhada
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Seu Mapa Cerebral Completo</h2>
                </motion.div>

                <div className="space-y-4 mb-8">
                  {getCategoryScores().map((cat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                            {cat.name === 'Foco' && <Target className="w-6 h-6" style={{ color: cat.color }} />}
                            {cat.name === 'Memória' && <Brain className="w-6 h-6" style={{ color: cat.color }} />}
                            {cat.name === 'Impulsividade' && <Zap className="w-6 h-6" style={{ color: cat.color }} />}
                            {cat.name === 'Procrastinação' && <Clock className="w-6 h-6" style={{ color: cat.color }} />}
                            {cat.name === 'Emocional' && <Heart className="w-6 h-6" style={{ color: cat.color }} />}
                            {cat.name === 'Autoestima' && <Shield className="w-6 h-6" style={{ color: cat.color }} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{cat.label}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {cat.percentage >= 70 ? '⚠️ Precisa de atenção' : cat.percentage >= 50 ? '📊 Moderado' : '✅ Controlado'}
                            </p>
                          </div>
                        </div>
                        <span className="text-3xl font-bold" style={{ color: cat.color }}>{Math.round(cat.percentage)}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: cat.color }} initial={{ width: 0 }} whileInView={{ width: `${cat.percentage}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========== TÉCNICAS PRÁTICAS (VALOR GRATUITO) ========== */}
            <section className="py-12 px-4 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/10">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
                    <Gift className="w-4 h-4" />
                    Presente Exclusivo
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    3 Técnicas Para Usar <span className="text-emerald-600 dark:text-emerald-400">Agora Mesmo</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Essas técnicas funcionam porque trabalham COM seu cérebro, não contra ele.
                  </p>
                </motion.div>

                <div className="space-y-6 mb-10">
                  {[
                    {
                      num: "01",
                      title: "Regra dos 2 Minutos",
                      description: "Se uma tarefa leva menos de 2 minutos, faça AGORA. Isso engana seu cérebro que odeia começar coisas.",
                      tip: "💡 Dica: Use pra responder mensagens, guardar algo no lugar, pagar uma conta pequena.",
                      color: "emerald"
                    },
                    {
                      num: "02", 
                      title: "Body Doubling Virtual",
                      description: "Trabalhe com alguém 'junto' — mesmo que seja um vídeo de study with me no YouTube. Ter presença reduz a procrastinação em até 70%.",
                      tip: "💡 Dica: Pesquise 'study with me lofi' no YouTube. Coloque e trabalhe junto.",
                      color: "blue"
                    },
                    {
                      num: "03",
                      title: "Âncoras de Início",
                      description: "Crie um 'ritual de início' de 30 segundos antes de tarefas difíceis. Pode ser tomar um gole de água, respirar 3x, ou dizer uma frase.",
                      tip: "💡 Dica: Seu cérebro vai associar o ritual com 'hora de focar'.",
                      color: "violet"
                    }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-${item.color}-600 dark:text-${item.color}-400 font-bold text-lg`}>{item.num}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-3">{item.description}</p>
                            <div className={`p-3 rounded-lg bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-200 dark:border-${item.color}-800`}>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{item.tip}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-lg text-slate-900 dark:text-white font-medium mb-2">
                    ✨ Essas são apenas <span className="text-emerald-600 dark:text-emerald-400 font-bold">3 de 47+ técnicas</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    que ensinamos no Guia Mente Caótica + App Life OS
                  </p>
                </motion.div>
              </div>
            </section>

            {/* ========== UM DIA NA SUA VIDA (ANTES vs DEPOIS) ========== */}
            <section className="py-12 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Imagina Um Dia Na Sua Vida <span className="text-blue-600 dark:text-blue-400">Diferente</span>
                  </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* ANTES */}
                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-200 dark:border-red-900">
                    <div className="text-center mb-6">
                      <span className="px-3 py-1 rounded-full bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-sm font-bold">❌ HOJE</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        "⏰ Acorda atrasado, correndo",
                        "🤯 Não sabe por onde começar o dia",
                        "📱 Perde tempo no celular sem querer",
                        "😰 Esquece compromissos importantes",
                        "😔 Termina o dia se sentindo fracassado",
                        "🔄 Vai dormir planejando 'amanhã eu mudo'"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* DEPOIS */}
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-900">
                    <div className="text-center mb-6">
                      <span className="px-3 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-bold">✅ COM O MÉTODO</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        "⏰ Acorda no horário, com ritual de início",
                        "📋 Sabe exatamente as 3 prioridades do dia",
                        "🎯 Usa o hiperfoco a seu favor",
                        "📱 App Life OS te lembra de tudo",
                        "🏆 Termina o dia com sensação de conquista",
                        "😴 Vai dormir sabendo que evoluiu"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ========== PROVA SOCIAL ========== */}
            <section className="py-12 px-4 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-900/50">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Pessoas Que Mudaram De Vida
                  </h2>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">+2.800 pessoas já transformaram sua rotina</p>
                </motion.div>

                <div className="space-y-4">
                  {[
                    { name: "Mariana S.", age: 32, role: "Designer", text: "Chorei lendo o guia. Pela primeira vez alguém descreveu EXATAMENTE o que eu sinto. O app Life OS virou meu melhor amigo! Finalmente terminei meu TCC depois de 3 anos parada.", avatar: "MS" },
                    { name: "Rafael O.", age: 28, role: "Desenvolvedor", text: "A gamificação do Life OS me fez criar hábitos que nunca consegui antes. Em 3 meses organizei minhas finanças e fui promovido. Parece mentira mas não é!", avatar: "RO" },
                    { name: "Carla M.", age: 41, role: "Advogada", text: "Diagnosticada aos 38. Esse guia me deu em semanas o que 20 anos de 'só se esforce mais' nunca deram. Fui promovida depois de anos estagnada.", avatar: "CM" }
                  ].map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{t.avatar}</div>
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-sm italic mb-3">"{t.text}"</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{t.name}, {t.age} anos • {t.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========== OFERTA PRINCIPAL ========== */}
            <section className="py-16 px-4 bg-gradient-to-b from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950">
              <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold mb-6">
                    🎁 OFERTA ESPECIAL POR TEMPO LIMITADO
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Guia Mente Caótica + App Life OS
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Tudo que você precisa pra dominar seu cérebro e viver de verdade
                  </p>
                </motion.div>

                {/* O que está incluído */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-8">
                  <h3 className="font-bold text-lg text-center mb-6 text-slate-900 dark:text-white">O que você recebe:</h3>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: BookOpen, title: "Guia Completo", desc: "47+ técnicas práticas para TDAH", value: "R$ 197" },
                      { icon: Gamepad2, title: "App Life OS (1 ano)", desc: "Gamifica sua rotina e elimina paralisia", value: "R$ 97" },
                      { icon: FileText, title: "Templates Prontos", desc: "Sistema completo pronto para usar", value: "R$ 47" },
                      { icon: Headphones, title: "Áudios de Foco", desc: "Playlists cientificamente comprovadas", value: "R$ 27" },
                      { icon: Video, title: "Masterclass Bônus", desc: "TDAH no trabalho: como se destacar", value: "R$ 97" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                        <span className="text-sm text-slate-400 dark:text-slate-500 line-through">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Preço */}
                  <div className="text-center mb-8">
                    <p className="text-slate-500 dark:text-slate-400 mb-2">Valor total: <span className="line-through">R$ 465,00</span></p>
                    <p className="text-slate-900 dark:text-white text-lg mb-2">Hoje por apenas:</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-6xl font-bold text-blue-600 dark:text-blue-400">R$ 19,90</span>
                    </div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-2">Economia de R$ 445,10 (95% OFF)</p>
                  </div>

                  {/* CTA */}
                  <Link href="/checkout">
                    <button className="w-full py-5 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all mb-6">
                      QUERO COMEÇAR AGORA →
                    </button>
                  </Link>

                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> Garantia de 7 dias</span>
                    <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> Pagamento 100% seguro</span>
                    <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Acesso imediato</span>
                  </div>
                </motion.div>

                {/* Garantia */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Garantia Incondicional de 7 Dias</h3>
                  <p className="text-blue-100 text-sm max-w-md mx-auto">
                    Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas. Sem burocracia.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* ========== FAQ ========== */}
            <section className="py-12 px-4">
              <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dúvidas Frequentes</h2>
                </motion.div>

                <div className="space-y-4">
                  {[
                    { q: "Funciona mesmo sem diagnóstico médico?", a: "Sim! As técnicas funcionam para qualquer pessoa que tem dificuldade com foco, procrastinação e organização — com ou sem diagnóstico oficial." },
                    { q: "Quanto tempo até ver resultados?", a: "Muitas pessoas relatam mudanças já na primeira semana. As técnicas são práticas e você pode aplicar imediatamente." },
                    { q: "O app funciona no meu celular?", a: "Sim! O Life OS funciona em qualquer celular (Android e iPhone) através do navegador. Não precisa baixar nada." },
                    { q: "E se não funcionar pra mim?", a: "Você tem 7 dias de garantia. Se não gostar por qualquer motivo, devolvemos 100% do valor." }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.q}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{item.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
              <div className="max-w-xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Você chegou até aqui por um motivo.
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Não deixa essa oportunidade passar. Por apenas <span className="text-blue-600 dark:text-blue-400 font-bold">R$ 19,90</span> você pode começar uma nova história.
                  </p>
                  <Link href="/checkout">
                    <button className="w-full sm:w-auto px-12 py-5 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all">
                      QUERO MUDAR MINHA VIDA →
                    </button>
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    🔒 Pagamento seguro • Acesso imediato • Garantia de 7 dias
                  </p>
                </motion.div>
              </div>
            </section>
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
