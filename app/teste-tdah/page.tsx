'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, ArrowRight, ArrowLeft, Sparkles, Heart, Lightbulb, Shield, Clock, Zap, Check,
  Loader2, Phone, User, Target, Lock, AlertTriangle, CheckCircle, BarChart3, Star,
  Play, BookOpen, Trophy, TrendingUp, Filter, Database, Pause, Mountain, Waves,
  MessageSquare, Users, Award, Gift, ChevronRight, Quote, Flame, Calendar, FileText,
  Video, Headphones, X, Timer, Gamepad2, Smartphone, ShieldCheck, CreditCard, Fingerprint
} from 'lucide-react'

// Questions
const questions = [
  { id: 1, category: "Foco", question: "Com que frequência você começa várias tarefas ao mesmo tempo e não consegue terminar nenhuma?", subtext: "Pense nos últimos 30 dias" },
  { id: 2, category: "Foco", question: "Quando alguém está falando com você, com que frequência percebe que não ouviu nada?", subtext: "Mesmo querendo prestar atenção" },
  { id: 3, category: "Foco", question: "Com que frequência você entra em hiperfoco e esquece de comer, beber água ou dormir?", subtext: "Quando algo te interessa muito" },
  { id: 4, category: "Foco", question: "Com que frequência você precisa reler um texto várias vezes porque sua mente divagou?", subtext: "Mesmo quando é importante" },
  { id: 5, category: "Memória", question: "Com que frequência você esquece compromissos importantes?", subtext: "Consultas, reuniões, encontros" },
  { id: 6, category: "Memória", question: "Com que frequência você perde objetos essenciais como chaves, celular ou carteira?", subtext: "Mesmo quando acabou de usar" },
  { id: 7, category: "Memória", question: "Com que frequência você esquece o que ia fazer no meio do caminho?", subtext: "Levanta e esquece o porquê" },
  { id: 8, category: "Memória", question: "Com que frequência você tem dificuldade em seguir instruções com múltiplos passos?", subtext: "Receitas, montagens, procedimentos" },
  { id: 9, category: "Impulsividade", question: "Com que frequência você interrompe pessoas no meio da fala?", subtext: "Mesmo sabendo que é rude" },
  { id: 10, category: "Impulsividade", question: "Com que frequência você fala coisas sem pensar e se arrepende depois?", subtext: "Comentários impulsivos" },
  { id: 11, category: "Impulsividade", question: "Com que frequência você faz compras por impulso que depois se arrepende?", subtext: "Gastos não planejados" },
  { id: 12, category: "Impulsividade", question: "Com que frequência você toma decisões importantes sem pensar nas consequências?", subtext: "Trabalho, relacionamentos, finanças" },
  { id: 13, category: "Procrastinação", question: "Com que frequência você deixa tarefas importantes para o último minuto?", subtext: "Mesmo sabendo das consequências" },
  { id: 14, category: "Procrastinação", question: "Com que frequência você sente paralisia quando precisa começar uma tarefa grande?", subtext: "Sem saber por onde começar" },
  { id: 15, category: "Procrastinação", question: "Com que frequência você se distrai com coisas triviais quando deveria estar trabalhando?", subtext: "Celular, redes sociais" },
  { id: 16, category: "Procrastinação", question: "Com que frequência você precisa de pressão (deadline) para conseguir fazer algo?", subtext: "Só funciona no desespero" },
  { id: 17, category: "Emocional", question: "Com que frequência você sente que suas emoções são mais intensas que as dos outros?", subtext: "Raiva, tristeza, empolgação extremas" },
  { id: 18, category: "Emocional", question: "Com que frequência você se sente sobrecarregado por coisas que outros lidam facilmente?", subtext: "Tarefas simples parecem montanhas" },
  { id: 19, category: "Autoestima", question: "Com que frequência você se sente 'diferente' ou 'defeituoso' comparado aos outros?", subtext: "Como se algo estivesse errado" },
  { id: 20, category: "Autoestima", question: "Com que frequência você se culpa por não conseguir fazer coisas 'fáceis'?", subtext: "Culpa constante por falhas" }
]

const answerOptions = [
  { value: 1, label: "Nunca", description: "Isso não acontece comigo" },
  { value: 2, label: "Raramente", description: "Poucas vezes" },
  { value: 3, label: "Às vezes", description: "De vez em quando" },
  { value: 4, label: "Frequentemente", description: "Quase sempre" },
  { value: 5, label: "Sempre", description: "Todo dia" }
]

const breathingMoments = [
  { afterQuestion: 4, title: "Você está indo bem", message: "Cada resposta nos ajuda a entender melhor como seu cérebro funciona. Continue no seu ritmo.", icon: Heart },
  { afterQuestion: 8, title: "Você sabia?", message: "Pessoas com TDAH frequentemente têm uma memória de trabalho diferente. Não é preguiça — é como seu cérebro processa informações.", icon: Lightbulb },
  { afterQuestion: 12, title: "Falta pouco", message: "A impulsividade não é falta de caráter. É seu cérebro buscando dopamina de formas que outros não precisam.", icon: Shield },
  { afterQuestion: 16, title: "Quase lá", message: "Milhões de pessoas vivem exatamente isso. A procrastinação no TDAH não é preguiça — é uma disfunção executiva real.", icon: Target }
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
  { name: "Carla M.", age: 41, role: "Advogada", text: "Diagnosticada aos 38. Esse app me deu em semanas o que 20 anos de 'só se esforce mais' nunca deram. Vale cada centavo.", result: "Promovida após anos estagnada", avatar: "CM" },
  { name: "Lucas P.", age: 25, role: "Estudante", text: "Reprovei 4 vezes na faculdade. Com o Life OS, passei em todas as matérias do semestre. A gamificação funciona demais!", result: "Passou em todas as matérias", avatar: "LP" }
]

const modules = [
  { num: 1, title: "Sistema de Captura Mental", desc: "Tire TUDO da sua cabeça e coloque em um sistema que funciona", icon: Brain },
  { num: 2, title: "Rotina Flexível Anti-TDAH", desc: "Rotinas que sobrevivem aos dias ruins (e funcionam nos bons)", icon: Calendar },
  { num: 3, title: "Foco Sob Demanda", desc: "Técnicas para conseguir foco quando você PRECISA, não só quando quer", icon: Target },
  { num: 4, title: "Procrastinação Zero", desc: "O método que transforma paralisia em ação em 5 minutos", icon: Zap },
  { num: 5, title: "Regulação Emocional", desc: "Como lidar com a montanha-russa sem perder o controle", icon: Heart },
  { num: 6, title: "Hiperfoco Estratégico", desc: "Transforme seu 'defeito' no seu maior superpoder", icon: Flame }
]

const bonuses = [
  { icon: FileText, title: "Templates Prontos", desc: "Sistema completo pronto para usar", value: "R$ 97" },
  { icon: Video, title: "Masterclass: TDAH no Trabalho", desc: "Como se destacar mesmo com TDAH", value: "R$ 147" },
  { icon: Headphones, title: "Áudios de Foco", desc: "Playlists e sons para concentração", value: "R$ 47" }
]

// Insights mais amigáveis
const friendlyInsights = {
  Foco: [
    { title: "Sua mente adora novidades", description: "Seu cérebro está sempre buscando coisas interessantes. Por isso você se distrai — não é falta de vontade, é que seu cérebro funciona assim!", icon: "lightbulb" },
    { title: "Você tem superpoderes escondidos", description: "Quando algo te interessa de verdade, você consegue um foco incrível! O segredo é aprender a usar isso a seu favor.", icon: "zap" },
    { title: "Tudo parece importante ao mesmo tempo", description: "Seu cérebro tem dificuldade em escolher o que fazer primeiro. É como ter várias TVs ligadas na sua cabeça — confuso, né?", icon: "brain" }
  ],
  Memória: [
    { title: "Sua mente tem muitas abas abertas", description: "Sabe quando o computador fica lento de tantas abas? Seu cérebro é assim. Por isso você esquece coisas no meio do caminho.", icon: "brain" },
    { title: "Você lembra quando está no lugar certo", description: "Já notou que lembra de coisas quando passa pelo mesmo lugar? Seu cérebro funciona melhor com 'lembretes visuais'.", icon: "lightbulb" },
    { title: "Você precisa de ajudantes", description: "Não tem problema usar lembretes, alarmes e apps. Seu cérebro funciona melhor quando tem ajuda externa!", icon: "heart" }
  ],
  Impulsividade: [
    { title: "Você sente tudo mais rápido", description: "Seu cérebro processa as coisas rapidinho — por isso às vezes você fala ou age antes de pensar. Não é maldade!", icon: "zap" },
    { title: "Você busca emoção naturalmente", description: "Seu cérebro precisa de mais estímulo para se sentir bem. Por isso você pode ser impulsivo em compras ou decisões.", icon: "heart" },
    { title: "Esperar é muito difícil pra você", description: "Ficar esperando é tortura, né? Seu cérebro não foi feito pra espera — ele quer ação AGORA.", icon: "clock" }
  ],
  Procrastinação: [
    { title: "Começar é a parte mais difícil", description: "Você não é preguiçoso! É que seu cérebro trava quando a tarefa parece grande demais. Tipo um carro que não pega.", icon: "play" },
    { title: "Você funciona melhor na pressão", description: "Deadline chegando = energia liberada! Seu cérebro precisa de urgência para liberar a 'gasolina' da ação.", icon: "clock" },
    { title: "Tarefas chatas são quase impossíveis", description: "Coisas chatas são kryptonita pra você. Não é frescura — seu cérebro literalmente não consegue se motivar sem interesse.", icon: "mountain" }
  ],
  Emocional: [
    { title: "Você sente tudo mais intensamente", description: "Alegria, raiva, tristeza — tudo é 10x mais forte pra você. Não é drama, é como seu cérebro funciona!", icon: "heart" },
    { title: "Voltar ao normal demora mais", description: "Depois de sentir algo forte, você demora mais pra se acalmar. É como um rádio que continua tocando depois de desligar.", icon: "waves" },
    { title: "Críticas doem mais em você", description: "Quando alguém te critica, dói de verdade. Você é mais sensível — e tudo bem ser assim.", icon: "shield" }
  ],
  Autoestima: [
    { title: "Você cresceu ouvindo coisas difíceis", description: "Provavelmente já te chamaram de preguiçoso ou disseram que você 'não se esforça'. Essas palavras machucam e ficam.", icon: "message" },
    { title: "Você se compara o tempo todo", description: "Ver outros fazendo coisas 'fáceis' que são difíceis pra você é frustrante. Mas lembra: vocês têm cérebros diferentes!", icon: "users" },
    { title: "Você é mais capaz do que pensa", description: "Muitas vezes você consegue coisas incríveis e acha que foi sorte. Não foi. Foi você!", icon: "target" }
  ]
}

export default function TesteTDAH() {
  const [stage, setStage] = useState<'intro' | 'test' | 'breathing' | 'analyzing' | 'capture' | 'result'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(20).fill(0))
  const [currentBreathing, setCurrentBreathing] = useState<typeof breathingMoments[0] | null>(null)
  const [breathingProgress, setBreathingProgress] = useState(0)
  const [report, setReport] = useState<ReportData | null>(null)
  const [formData, setFormData] = useState({ name: '', whatsapp: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalScore = answers.reduce((sum, val) => sum + val, 0)
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
    setTimeout(() => {
      const bm = breathingMoments.find(b => b.afterQuestion === currentQuestion + 1)
      if (bm) { setCurrentBreathing(bm); setStage('breathing'); setBreathingProgress(0) }
      else if (currentQuestion + 1 < questions.length) setCurrentQuestion(currentQuestion + 1)
      else { setStage('analyzing'); generateReport(newAnswers) }
    }, 300)
  }

  const handleBreathingComplete = () => {
    setCurrentBreathing(null)
    if (currentQuestion + 1 < questions.length) { setCurrentQuestion(currentQuestion + 1); setStage('test') }
    else { setStage('analyzing'); generateReport(answers) }
  }

  useEffect(() => {
    if (stage === 'breathing') {
      const timer = setInterval(() => {
        setBreathingProgress(p => { if (p >= 100) { clearInterval(timer); return 100 } return p + 2.5 })
      }, 100)
      return () => clearInterval(timer)
    }
  }, [stage])

  const generateReport = async (finalAnswers: number[]) => {
    const score = finalAnswers.reduce((sum, val) => sum + val, 0)
    try {
      const response = await fetch('/api/generate-adhd-report', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, totalScore: score })
      })
      if (response.ok) setReport(await response.json())
    } catch (e) { console.error(e) }
    finally { setStage('capture') }
  }

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true)
    
    // Send Discord notification
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
            topCategory: getTopCategory()
          }
        })
      })
    } catch (e) { console.error(e) }
    
    await new Promise(r => setTimeout(r, 500))
    setIsSubmitting(false); setStage('result')
  }

  const getScoreLevel = (score: number) => {
    if (score <= 30) return { level: 'Leve', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', barColor: 'hsl(160 75% 50%)' }
    if (score <= 50) return { level: 'Moderado', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', barColor: 'hsl(35 95% 55%)' }
    if (score <= 70) return { level: 'Significativo', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', barColor: 'hsl(25 95% 55%)' }
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

  // Blurred Preview
  const BlurredPreview = () => {
    const cats = getCategoryScores()
    return (
      <div className="relative">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-background/70 to-background pointer-events-none">
          <div className="bg-primary/15 backdrop-blur-sm rounded-full p-4 mb-3 border border-primary/20"><Lock className="w-7 h-7 text-primary" /></div>
          <p className="text-sm text-muted-foreground">Preencha para desbloquear</p>
        </div>
        <div className="blur-[6px] select-none pointer-events-none space-y-4">
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-primary" /><span className="font-semibold text-sm">Análise por Área</span></div>
            <div className="space-y-3">{cats.map((c, i) => (<div key={i}><div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">{c.label}</span><span style={{ color: c.color }}>{Math.round(c.percentage)}%</span></div><div className="h-2.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.barClass}`} style={{ width: `${c.percentage}%` }} /></div></div>))}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border"><Lightbulb className="w-5 h-5 text-primary mb-2" /><div className="text-sm font-medium">3 Insights</div></div>
            <div className="p-4 rounded-xl bg-card border border-border"><Gamepad2 className="w-5 h-5 text-amber-400 mb-2" /><div className="text-sm font-medium">App Life OS</div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* Intro */}
        {stage === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center animate-glow"><Brain className="w-10 h-10 text-background" /></div>
              <h1 className="text-3xl font-bold mb-4 tracking-tight">Teste de Autoavaliação <span className="gradient-primary">TDAH</span></h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">As próximas 20 perguntas vão te ajudar a entender como seu cérebro funciona. Responda com honestidade.</p>
              <div className="flex justify-center gap-6 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary/70" /><span>5-8 min</span></div>
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary/70" /><span>Relatório com IA</span></div>
              </div>
              <button onClick={() => { setStage('test'); fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'test_start' }) }).catch(() => {}) }} className="btn-primary px-8 py-4 rounded-xl text-base flex items-center gap-3 mx-auto">Começar Teste <ArrowRight className="w-5 h-5" /></button>
            </div>
          </motion.div>
        )}

        {/* Test */}
        {stage === 'test' && (
          <motion.div key={`q-${currentQuestion}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2"><span>Pergunta {currentQuestion + 1} de {questions.length}</span><span className="number-display">{Math.round(progress)}%</span></div>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="question-card p-6 md:p-8 mb-6">
                <span className="badge badge-primary mb-4">{questions[currentQuestion].category}</span>
                <h2 className="text-xl md:text-2xl font-semibold mb-2 leading-snug tracking-tight">{questions[currentQuestion].question}</h2>
                <p className="text-sm text-muted-foreground">{questions[currentQuestion].subtext}</p>
              </div>
              <div className="space-y-3">{answerOptions.map(o => (<button key={o.value} onClick={() => handleAnswer(o.value)} className={`answer-option w-full p-4 text-left ${answers[currentQuestion] === o.value ? 'selected' : ''}`}><div className="flex items-center justify-between"><div><div className="font-medium text-sm">{o.label}</div><div className="text-sm text-muted-foreground">{o.description}</div></div><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === o.value ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>{answers[currentQuestion] === o.value && <Check className="w-3 h-3 text-background" />}</div></div></button>))}</div>
              {currentQuestion > 0 && <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Voltar</button>}
            </div>
          </motion.div>
        )}

        {/* Breathing */}
        {stage === 'breathing' && currentBreathing && (
          <motion.div key="breathing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center breathing-card p-8 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center animate-breathe"><currentBreathing.icon className="w-8 h-8 text-secondary" /></div>
              <h2 className="text-2xl font-bold mb-3 text-secondary tracking-tight">{currentBreathing.title}</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{currentBreathing.message}</p>
              <div className="w-full max-w-xs mx-auto mb-6"><div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full transition-all duration-100" style={{ width: `${breathingProgress}%` }} /></div></div>
              <button onClick={handleBreathingComplete} disabled={breathingProgress < 100} className={`btn-secondary px-6 py-3 rounded-xl text-sm ${breathingProgress < 100 ? 'opacity-50 cursor-not-allowed' : ''}`}>{breathingProgress < 100 ? 'Aguarde...' : 'Continuar →'}</button>
            </div>
          </motion.div>
        )}

        {/* Analyzing */}
        {stage === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">Analisando suas respostas</h2>
              <p className="text-muted-foreground mb-8">Nossa IA está criando seu relatório...</p>
              <div className="space-y-3 text-left max-w-xs mx-auto">{['Processando respostas...', 'Identificando padrões...', 'Gerando insights...', 'Preparando seu acesso...'].map((t, i) => (<motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.6 }} className="flex items-center gap-3 text-sm text-muted-foreground"><div className="w-2 h-2 rounded-full bg-primary animate-pulse" />{t}</motion.div>))}</div>
            </div>
          </motion.div>
        )}

        {/* Capture */}
        {stage === 'capture' && (
          <motion.div key="capture" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="max-w-xl w-full">
              <div className="text-center mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center border border-primary/20"><Sparkles className="w-8 h-8 text-primary" /></motion.div>
                <h2 className="text-2xl font-bold mb-2 tracking-tight">Seu relatório está pronto!</h2>
                <p className="text-muted-foreground text-sm">Análise completa + acesso ao app Life OS</p>
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-5 rounded-xl ${getScoreLevel(totalScore).bg} ${getScoreLevel(totalScore).border} border mb-6`}>
                <div className="flex items-center justify-between">
                  <div><div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Resultado</div><div className={`text-3xl font-bold ${getScoreLevel(totalScore).color}`}>{getScoreLevel(totalScore).level}</div></div>
                  <div className="text-right"><div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Pontuação</div><div className="text-2xl font-bold number-display">{totalScore}<span className="text-lg text-muted-foreground">/100</span></div></div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8"><BlurredPreview /></motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-elevated p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4"><Lock className="w-4 h-4 text-primary" /><span className="text-sm font-semibold">Desbloqueie seu relatório completo</span></div>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div><label className="block text-sm text-muted-foreground mb-2">Seu nome</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Como podemos te chamar?" className="w-full pl-12" /></div></div>
                  <div><label className="block text-sm text-muted-foreground mb-2">WhatsApp</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="tel" required value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="(00) 00000-0000" className="w-full pl-12" /></div></div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 rounded-xl text-base flex items-center justify-center gap-3">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-5 h-5" /> Desbloquear Relatório</>}</button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Result - Sales Page */}
        {stage === 'result' && report && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
            
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(175_70%_40%/0.08)] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[hsl(265_70%_50%/0.06)] rounded-full blur-[80px]" />
              </div>
              
              <div className="max-w-3xl mx-auto relative">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                    <CheckCircle className="w-4 h-4" /> Análise completa desbloqueada
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    {formData.name}, <span className="gradient-primary">agora faz sentido</span>, não é?
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Você não é preguiçoso. Não é burro. Não é incapaz. <br className="hidden sm:block" />
                    <span className="text-foreground font-medium">Seu cérebro funciona diferente</span> — e isso muda tudo.
                  </p>
                </motion.div>

                {/* Score Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`p-6 rounded-2xl ${getScoreLevel(totalScore).bg} ${getScoreLevel(totalScore).border} border`}>
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2">{report.headline}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">{report.summary}</p>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted" />
                          <motion.circle cx="18" cy="18" r="15" fill="none" stroke={getScoreLevel(totalScore).barColor} strokeWidth="2.5" strokeLinecap="round" initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: `${totalScore} 100` }} transition={{ duration: 1.2 }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold number-display">{totalScore}</span></div>
                      </div>
                      <div className={`text-sm font-semibold mt-1 ${getScoreLevel(totalScore).color}`}>{getScoreLevel(totalScore).level}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Category Analysis */}
            <section className="py-12 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-elevated p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Como seu cérebro funciona</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {getCategoryScores().map((cat, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl bg-muted/30">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{cat.label}</span>
                          <span className="number-display font-bold" style={{ color: cat.color }}>{Math.round(cat.percentage)}%</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <motion.div className={`h-full rounded-full ${cat.barClass}`} initial={{ width: 0 }} whileInView={{ width: `${cat.percentage}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Pain Point Section */}
            <section className="py-16 px-4 bg-card/30">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                    A verdade que ninguém te contou <span className="gradient-warm">sobre você</span>
                  </h2>
                </motion.div>

                <div className="space-y-4">
                  {[
                    { icon: X, color: 'text-red-400', title: 'Você NÃO é preguiçoso', desc: 'Seu cérebro funciona diferente. Ele precisa de mais estímulo pra começar tarefas chatas. É química, não caráter.' },
                    { icon: X, color: 'text-red-400', title: 'Você NÃO é burro', desc: 'Na verdade, muitas pessoas com TDAH são super inteligentes! O problema não é capacidade — é como o cérebro organiza as coisas.' },
                    { icon: X, color: 'text-red-400', title: 'Você NÃO faz de propósito', desc: 'Esquecer coisas, procrastinar, se distrair... tudo isso são SINTOMAS. Você não escolhe fazer isso.' },
                    { icon: Check, color: 'text-emerald-400', title: 'Você SÓ precisa das ferramentas certas', desc: 'Com as estratégias certas, você pode usar seu cérebro a seu favor. E é exatamente isso que vamos te dar!' }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color === 'text-emerald-400' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Friendly Insights Section */}
            <section className="py-16 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-primary mb-4"><Lightbulb className="w-3.5 h-3.5" /> Baseado nas suas respostas</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">O que descobrimos sobre você</h2>
                  <p className="text-muted-foreground mt-2">De um jeito simples e sem termos difíceis</p>
                </motion.div>
                <div className="space-y-4">
                  {getFriendlyInsights().map((ins, i) => {
                    const Icon = iconMap[ins.icon] || Brain
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-elevated p-5 rounded-xl flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Icon className="w-6 h-6 text-primary" /></div>
                        <div><h4 className="font-bold mb-1">{ins.title}</h4><p className="text-muted-foreground text-sm leading-relaxed">{ins.description}</p></div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Life OS App Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-card/50 to-background">
              <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                  <span className="badge badge-secondary mb-4"><Gamepad2 className="w-3.5 h-3.5" /> Exclusivo</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    Conheça o <span className="gradient-secondary">Life OS</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    O app que <span className="text-foreground font-medium">transforma sua vida em um jogo</span> — e faz você vencer todos os dias.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-purple p-8 rounded-2xl mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                  <div className="relative flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-secondary to-[hsl(285_80%_55%)] flex items-center justify-center flex-shrink-0 glow-purple">
                      <Gamepad2 className="w-16 h-16 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Gamifique sua vida e vença a paralisia!</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        O Life OS transforma cada tarefa em uma missão, cada hábito em um power-up e cada dia em uma fase a ser conquistada. 
                        <span className="text-foreground font-medium"> Chega de paralisia! Chega de culpa!</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['🎮 Missões diárias', '⭐ Sistema de XP', '🏆 Conquistas', '📊 Estatísticas', '🔥 Streaks'].map((t, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: Target, title: "Sem mais paralisia", desc: "Tarefas viram missões fáceis de começar" },
                    { icon: Trophy, title: "Dopamina saudável", desc: "Recompensas que seu cérebro ama" },
                    { icon: TrendingUp, title: "Progresso visível", desc: "Veja sua evolução em tempo real" }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-elevated p-5 rounded-xl text-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3"><item.icon className="w-6 h-6 text-secondary" /></div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    <Smartphone className="w-4 h-4" /> Acesso por 1 ano completo incluso
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Quick Wins */}
            <section className="py-16 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-amber mb-4"><Zap className="w-3.5 h-3.5" /> Comece agora</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">3 dicas pra você <span className="gradient-warm">começar hoje</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-4">
                  {report.quickWins.map((qw, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-highlight p-5 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                        <span className="badge badge-primary text-[10px] py-0.5">{qw.timeToResult}</span>
                      </div>
                      <h4 className="font-bold mb-2">{qw.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{qw.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Modules */}
            <section className="py-16 px-4 bg-card/30">
              <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-primary mb-4"><BookOpen className="w-3.5 h-3.5" /> Conteúdo completo</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">O que você vai aprender</h2>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-4">
                  {modules.map((mod, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-elevated p-5 rounded-xl flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><mod.icon className="w-6 h-6 text-primary" /></div>
                      <div>
                        <div className="text-xs text-primary font-medium mb-1">Módulo {mod.num}</div>
                        <h4 className="font-bold mb-1">{mod.title}</h4>
                        <p className="text-sm text-muted-foreground">{mod.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-primary mb-4"><Star className="w-3.5 h-3.5" /> +2.847 pessoas</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quem já está usando <span className="gradient-primary">ama</span></h2>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-4">
                  {testimonials.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="testimonial-card p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-background">{t.avatar}</div>
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.age} anos • {t.role}</div>
                        </div>
                        <div className="ml-auto flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                      </div>
                      <Quote className="w-6 h-6 text-primary/30 mb-2" />
                      <p className="text-sm text-foreground/80 leading-relaxed mb-4">{t.text}</p>
                      <div className="pt-3 border-t border-border/50">
                        <div className="text-xs text-muted-foreground mb-1">Resultado:</div>
                        <div className="text-sm text-primary font-semibold flex items-center gap-2"><Trophy className="w-4 h-4" /> {t.result}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bonuses */}
            <section className="py-16 px-4 bg-card/30">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                  <span className="badge badge-amber mb-4"><Gift className="w-3.5 h-3.5" /> Só hoje</span>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Bônus <span className="gradient-warm">grátis</span> inclusos</h2>
                </motion.div>
                <div className="space-y-4">
                  {bonuses.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-5 rounded-xl bg-card border border-amber-500/20">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><b.icon className="w-6 h-6 text-amber-400" /></div>
                      <div className="flex-1">
                        <h4 className="font-bold">{b.title}</h4>
                        <p className="text-sm text-muted-foreground">{b.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground line-through">{b.value}</div>
                        <div className="text-amber-400 font-bold">GRÁTIS</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4">
              <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-highlight p-8 md:p-12 rounded-3xl text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                      <Timer className="w-4 h-4" /> Oferta por tempo limitado
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                      Comece sua <span className="gradient-primary">transformação</span> agora
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                      Guia completo + App Life OS por 1 ano + Todos os bônus
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground line-through">R$ 197</div>
                        <div className="text-lg text-muted-foreground">+ Bônus R$ 291</div>
                      </div>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary number-display">R$ 19,90</div>
                        <div className="text-sm text-primary font-medium">Acesso completo</div>
                      </div>
                    </div>

                    <Link href="/checkout">
                      <button className="btn-primary px-10 py-5 rounded-xl text-lg font-bold w-full sm:w-auto mb-6">
                        Quero Começar Agora por R$ 19,90 →
                      </button>
                    </Link>

                    {/* Security Badges */}
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" /> Site Seguro
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        <Lock className="w-3.5 h-3.5" /> SSL 256-bit
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        <CreditCard className="w-3.5 h-3.5" /> Pagamento Seguro
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        <Fingerprint className="w-3.5 h-3.5" /> Dados Criptografados
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> App Life OS por 1 ano</span>
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Garantia de 7 dias</span>
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Suporte no WhatsApp</span>
                    </div>

                    {/* Guarantee */}
                    <div className="mt-8 p-5 rounded-xl bg-background/50 border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-emerald-400">Garantia de 7 dias - Risco ZERO</h4>
                          <p className="text-sm text-muted-foreground">Se você não gostar, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-6 flex justify-center gap-2">
                      <div className="px-3 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">💳 Cartão</div>
                      <div className="px-3 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">📱 Pix</div>
                      <div className="px-3 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">🏦 Boleto</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-border/50">
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="w-4 h-4" /> Site 100% Seguro</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="w-4 h-4" /> Criptografia SSL</div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">* Este teste e guia não substituem diagnóstico ou tratamento médico profissional</p>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Voltar para o início</Link>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
