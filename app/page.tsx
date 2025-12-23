'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, Sparkles, ArrowRight, Star, Shield, ChevronDown, Clock,
  Zap, Heart, Target, MessageCircle, RefreshCw, Lightbulb, 
  AlertCircle, Users, HelpCircle, CheckCircle, Activity
} from 'lucide-react'

const painPoints = [
  { icon: Brain, title: "Mil pensamentos, zero ação", description: "Sua mente parece uma TV com 50 canais ligados ao mesmo tempo. Você quer fazer tudo e no final não consegue fazer nada." },
  { icon: Clock, title: "O tempo simplesmente some", description: "Olha pro relógio: 9h da manhã. Pisca os olhos: 17h. Cadê o seu dia? Você não faz ideia do que aconteceu." },
  { icon: Target, title: "Paralisia total", description: "Você sabe EXATAMENTE o que precisa fazer. Mas algo te trava. E a culpa que vem depois é brutal." },
  { icon: RefreshCw, title: "O ciclo sem fim", description: "\"Amanhã vai ser diferente\". Mas amanhã chega e é sempre a mesma história. Todo. Santo. Dia." },
  { icon: Heart, title: "Relacionamentos sofrendo", description: "As pessoas reclamam que você não presta atenção, esquece tudo, parece que não se importa. Mas você se importa. Muito." },
  { icon: Zap, title: "Energia desperdiçada", description: "Energia INFINITA pra scrollar redes sociais. Pro que realmente importa? Zero. Nada. Vazio." }
]

const symptoms = [
  "Dificuldade em manter o foco em tarefas chatas",
  "Procrastinação crônica mesmo sabendo das consequências",
  "Esquecimentos frequentes de compromissos e objetos",
  "Dificuldade em seguir instruções com vários passos",
  "Interromper os outros durante conversas",
  "Emoções intensas e difíceis de controlar",
  "Sensação de estar sempre 'correndo atrás'",
  "Hiperfoco em coisas interessantes, zero foco no resto"
]

const tdahFacts = [
  { number: "7.4M", label: "Adultos com TDAH no Brasil" },
  { number: "80%", label: "Não sabem que têm" },
  { number: "3x", label: "Mais chance de depressão" },
  { number: "94%", label: "Melhoram com estratégias certas" }
]

const faqs = [
  { 
    question: "Isso substitui diagnóstico médico?", 
    answer: "Não. Este é um teste de autoavaliação baseado em critérios científicos. Ele ajuda você a entender melhor seus sintomas, mas para um diagnóstico oficial, procure um psiquiatra ou neurologista especializado em TDAH." 
  },
  { 
    question: "Quanto tempo leva o teste?", 
    answer: "Cerca de 3 minutos. São 12 perguntas diretas que vão te fazer refletir sobre padrões de comportamento que você talvez nunca tenha percebido antes." 
  },
  { 
    question: "O teste é realmente gratuito?", 
    answer: "Sim, 100% gratuito. Você recebe um relatório personalizado gerado por inteligência artificial no final, sem pagar nada." 
  },
  { 
    question: "Por que devo fazer esse teste?", 
    answer: "Milhões de adultos têm TDAH sem saber. Entender como seu cérebro funciona é o primeiro passo para parar de se culpar e começar a usar estratégias que funcionam para você." 
  },
  { 
    question: "TDAH pode aparecer na vida adulta?", 
    answer: "O TDAH é uma condição que nasce com você, mas muitos só descobrem na vida adulta. Os sintomas podem ter sido mascarados por estratégias compensatórias ou confundidos com 'preguiça' ou 'falta de força de vontade'." 
  }
]

// Animated particles for hero
const HeroParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Neural network lines for hero
const NeuralLines = () => {
  const lines = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
  }))

  return (
    <svg className="absolute inset-0 w-full h-full opacity-20">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(175 85% 45%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(175 85% 45%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(265 85% 60%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {lines.map((line) => (
        <motion.line
          key={line.id}
          x1={`${line.startX}%`}
          y1={`${line.startY}%`}
          x2={`${line.endX}%`}
          y2={`${line.endY}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{
            duration: 4,
            delay: line.id * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  )
}

// Floating brain icons
const FloatingIcons = () => {
  const icons = [
    { Icon: Brain, x: 10, y: 20, size: 40, delay: 0 },
    { Icon: Sparkles, x: 85, y: 15, size: 30, delay: 0.5 },
    { Icon: Zap, x: 5, y: 70, size: 35, delay: 1 },
    { Icon: Target, x: 90, y: 60, size: 32, delay: 1.5 },
    { Icon: Lightbulb, x: 15, y: 85, size: 28, delay: 2 },
    { Icon: Heart, x: 80, y: 80, size: 36, delay: 2.5 },
  ]

  return (
    <>
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            opacity: { duration: 0.5, delay: item.delay },
            scale: { duration: 0.5, delay: item.delay },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: item.delay },
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: item.delay },
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [onlineCount, setOnlineCount] = useState(0)

  // Track page visit
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_visit', data: { page: 'Landing Page' } })
    }).catch(() => {})
  }, [])

  // Online count simulation
  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 15) + 28)
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        const newVal = prev + change
        return Math.max(22, Math.min(48, newVal))
      })
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[hsl(175_70%_40%/0.08)] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[hsl(265_70%_50%/0.06)] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[hsl(35_80%_50%/0.04)] rounded-full blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center px-4 py-20">
        {/* Hero Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(175_85%_45%/0.15),transparent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(265_85%_60%/0.08),transparent_50%)]" />
          </div>
          
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(hsl(175 85% 45%) 1px, transparent 1px),
                linear-gradient(90deg, hsl(175 85% 45%) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          
          <motion.div
            className="absolute top-20 left-[20%] w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, hsl(175 85% 45% / 0.15) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-[15%] w-[250px] h-[250px] rounded-full"
            style={{ background: 'radial-gradient(circle, hsl(265 85% 60% / 0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <NeuralLines />
          <HeroParticles />
          <FloatingIcons />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5">
            <motion.div className="absolute inset-0 rounded-full border border-primary/10" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute inset-8 rounded-full border border-secondary/10" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
          </div>
        </div>

        <div className="container max-w-5xl mx-auto relative z-10">
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Social proof badge */}
            <motion.div className="flex items-center justify-center gap-3 mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
              <div className="flex -space-x-2">
                {['MS', 'RO', 'CM', 'LP'].map((a, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-background border-2 border-background">{a}</div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-primary font-bold">{onlineCount}</span> pessoas fazendo o teste agora
              </div>
            </motion.div>

            <motion.div className="badge badge-primary mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teste Gratuito com Relatório por IA</span>
            </motion.div>

            <h1 className="heading-xl text-balance mb-6">
              Sua mente parece um{' '}
              <span className="gradient-primary">navegador</span>
              <br className="hidden sm:block" />
              com{' '}
              <span className="relative inline-block">
                <span className="gradient-primary">47 abas</span>
                <motion.span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[hsl(175_85%_45%)] to-[hsl(195_85%_50%)] rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
              </span>
              {' '}abertas?
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
              Descubra em <span className="text-foreground font-medium">3 minutos</span> se seu cérebro funciona 
              no modo TDAH — e finalmente entenda{' '}
              <span className="text-foreground font-medium">por que você é assim</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/teste-tdah">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-8 py-4 rounded-xl text-base flex items-center gap-3">
                  <Brain className="w-5 h-5" />
                  Fazer o Teste Gratuito
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary/70" /> 100% gratuito</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary/70" /> ~3 minutos</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-primary/70" /> Relatório com IA</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs font-medium tracking-wide uppercase">Você se identifica?</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-amber mb-4"><AlertCircle className="w-3.5 h-3.5" /> Você se identifica?</span>
            <h2 className="heading-lg mb-4">A sensação de que{' '}<span className="gradient-warm">algo está errado</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Todo mundo parece conseguir fazer as coisas. Por que você não? 
              A resposta pode estar no seu cérebro, não na sua vontade.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map((point, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="card-elevated p-6 rounded-2xl group hover:border-primary/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <point.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Se você leu isso e sentiu um aperto no peito...{' '}
              <span className="text-foreground font-medium">você não está sozinho.</span>
            </p>
            <Link href="/teste-tdah">
              <button className="btn-secondary px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm">
                Descobrir se é TDAH <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border/50">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {tdahFacts.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="stat-value gradient-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptoms Checklist */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge badge-primary mb-4"><Activity className="w-3.5 h-3.5" /> Sinais comuns</span>
            <h2 className="heading-lg mb-4">Quantos desses você <span className="gradient-primary">reconhece em você</span>?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {symptoms.map((symptom, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{symptom}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Se marcou <span className="text-primary font-bold">4 ou mais</span>, vale a pena investigar.
            </p>
            <Link href="/teste-tdah">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-8 py-4 rounded-xl text-base inline-flex items-center gap-3">
                <Brain className="w-5 h-5" />
                Fazer o Teste Completo
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Take Test */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-secondary mb-4"><Lightbulb className="w-3.5 h-3.5" /> Por que fazer?</span>
            <h2 className="heading-lg">O primeiro passo é <span className="gradient-secondary">entender</span></h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { icon: Brain, title: "Pare de se culpar", description: "Quando você entende que seu cérebro funciona diferente, para de se sentir preguiçoso ou incapaz. Não é falta de vontade — é neurologia." },
              { icon: Target, title: "Encontre o que funciona para VOCÊ", description: "Estratégias genéricas não funcionam para cérebros TDAH. Entender seus padrões é o primeiro passo para encontrar o que realmente ajuda." },
              { icon: Heart, title: "Melhore seus relacionamentos", description: "Quando você entende o porquê dos seus comportamentos, fica mais fácil explicar para quem você ama — e eles finalmente entendem você." },
              { icon: Zap, title: "Use seu cérebro a seu favor", description: "TDAH não é só problema. Criatividade, hiperfoco e pensamento 'fora da caixa' são superpoderes quando bem direcionados." }
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-6 items-start card-elevated p-6 rounded-2xl">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-primary mb-4"><Zap className="w-3.5 h-3.5" /> Simples e rápido</span>
            <h2 className="heading-lg">Como funciona o teste</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: 1, title: "Responda 12 perguntas", description: "Perguntas simples sobre seu dia a dia. Não precisa pensar muito — responda com o que vier à mente." },
              { step: 2, title: "IA analisa suas respostas", description: "Nossa inteligência artificial identifica padrões e gera um relatório personalizado sobre como seu cérebro funciona." },
              { step: 3, title: "Receba insights valiosos", description: "Entenda seus pontos fortes e desafios, com dicas práticas para começar a aplicar hoje mesmo." }
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center text-background font-bold text-lg">
                  {item.step}
                </div>
                <div className="card-elevated p-5 rounded-xl flex-1">
                  <h3 className="text-lg font-semibold mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {['MS', 'RO', 'CM', 'LP', 'JF', 'AS'].map((a, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-background border-2 border-background">{a}</div>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mb-2">
              Mais de <span className="text-primary font-bold">2.800 pessoas</span> já fizeram o teste
            </p>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-muted-foreground italic max-w-lg mx-auto">
              "Finalmente entendi por que eu sou assim. Chorei lendo o relatório — me senti visto pela primeira vez."
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge badge-primary mb-4"><HelpCircle className="w-3.5 h-3.5" /> Tire suas dúvidas</span>
            <h2 className="heading-lg mb-2">Perguntas frequentes</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="card-elevated rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors">
                  <span className="font-medium text-sm">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="heading-lg mb-4">
              Pronto para{' '}<span className="gradient-primary">entender seu cérebro</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              O primeiro passo é parar de se culpar e começar a se entender. 
              Faça o teste gratuito e descubra como você funciona.
            </p>

            <Link href="/teste-tdah">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-10 py-5 rounded-xl text-lg font-semibold inline-flex items-center gap-3">
                <Brain className="w-6 h-6" />
                Fazer Meu Teste Gratuito
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>

            <p className="mt-8 text-sm text-muted-foreground flex flex-wrap justify-center gap-4">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> ~3 minutos</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> 100% gratuito</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> +2.800 pessoas</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center">
                <Brain className="w-4 h-4 text-background" />
              </div>
              <span className="font-semibold tracking-tight">Mente Caótica</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Este teste não substitui diagnóstico médico profissional. Para diagnóstico oficial, procure um especialista.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
