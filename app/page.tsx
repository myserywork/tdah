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
  { icon: Brain, title: "Sua cabeça não para nunca", description: "É pensamento em cima de pensamento. Você deita pra dormir e a mente fica ligada que nem TV a noite toda. Cansa demais." },
  { icon: Clock, title: "O dia passa e você não viu", description: "Você olha pro relógio de manhã e quando vê já é de noite. Cadê o dia? Você não sabe onde foi parar." },
  { icon: Target, title: "Quer fazer mas não consegue", description: "Você SABE o que precisa fazer. Mas parece que tem uma parede entre você e a tarefa. E a culpa depois é horrível." },
  { icon: RefreshCw, title: "Todo dia é a mesma coisa", description: "\"Amanhã eu começo\". Mas amanhã chega e você faz igual. Parece que você tá preso num ciclo sem fim." },
  { icon: Heart, title: "As pessoas reclamam de você", description: "Dizem que você não presta atenção, que esquece tudo, que não se importa. Mas você se importa SIM. Muito." },
  { icon: Zap, title: "Não tem energia pra nada", description: "Pra ficar no celular você consegue. Pra coisa importante? Parece que sua energia acaba. É uma luta todo dia." }
]

const symptoms = [
  "Não consegue prestar atenção em coisa chata",
  "Deixa tudo pra depois mesmo sabendo que vai dar ruim",
  "Vive esquecendo das coisas e perdendo objeto",
  "Quando alguém explica muita coisa de uma vez você se perde",
  "Corta as pessoas sem querer quando tá empolgado",
  "Sentimento vem forte demais - raiva, tristeza, tudo intenso",
  "Sensação de que tá sempre atrasado ou devendo algo",
  "Consegue focar MUITO em coisa que gosta, mas no resto não"
]

const tdahFacts = [
  { number: "7.4M", label: "de brasileiros adultos têm TDAH" },
  { number: "80%", label: "nem sabem que têm" },
  { number: "3x", label: "mais chance de ter depressão" },
  { number: "94%", label: "melhoram quando entendem o problema" }
]

const faqs = [
  { 
    question: "Esse teste substitui ir no médico?", 
    answer: "Não, esse teste te ajuda a entender se você tem características de TDAH. Se o resultado mostrar sinais fortes, o ideal é procurar um médico especialista (psiquiatra ou neurologista) pra confirmar." 
  },
  { 
    question: "Demora muito pra fazer?", 
    answer: "Não! São só 12 perguntas rápidas, leva uns 3 minutinhos. Você responde do celular mesmo, de qualquer lugar." 
  },
  { 
    question: "É de graça mesmo ou vai cobrar depois?", 
    answer: "É 100% de graça, não pede cartão, não cobra nada. Você faz o teste e recebe seu resultado personalizado sem pagar nenhum centavo." 
  },
  { 
    question: "Por que eu deveria fazer esse teste?", 
    answer: "Porque milhões de pessoas vivem se culpando achando que são preguiçosas ou incapazes, quando na verdade o cérebro delas funciona diferente. Entender isso muda tudo." 
  },
  { 
    question: "TDAH não é coisa de criança?", 
    answer: "Muita gente acha isso, mas não é verdade. Você nasce com TDAH, mas muitos só descobrem adulto. A vida toda você pode ter se virado do jeito que dava, achando que era 'defeito' seu." 
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
              <span>Teste Gratuito • Resultado na Hora</span>
            </motion.div>

            <h1 className="heading-xl text-balance mb-6">
              Sua cabeça{' '}
              <span className="gradient-primary">não para</span>
              <br className="hidden sm:block" />
              e você não sabe{' '}
              <span className="relative inline-block">
                <span className="gradient-primary">por quê?</span>
                <motion.span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[hsl(175_85%_45%)] to-[hsl(195_85%_50%)] rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance leading-relaxed">
              Milhões de brasileiros vivem se culpando, achando que são <span className="text-foreground font-medium">preguiçosos</span> ou <span className="text-foreground font-medium">incapazes</span>. 
              Mas e se o problema não for você — e sim <span className="text-foreground font-medium">como seu cérebro funciona?</span>
            </p>

            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10">
              Faça o teste e descubra em <span className="text-primary font-bold">3 minutinhos</span> se você tem características de TDAH.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/teste-tdah">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-8 py-5 rounded-xl text-lg flex items-center gap-3 shadow-lg shadow-primary/25">
                  <Brain className="w-6 h-6" />
                  Quero Fazer o Teste Agora
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> De graça</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> 3 minutinhos</span>
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> Resultado na hora</span>
            </div>

            {/* Extra reassurance for C/D audience */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 text-sm text-muted-foreground">
              <p>✓ Não precisa baixar nada &nbsp;•&nbsp; ✓ Não pede cartão &nbsp;•&nbsp; ✓ Faz pelo celular</p>
            </motion.div>
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
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-amber mb-4"><AlertCircle className="w-3.5 h-3.5" /> Isso é sobre você?</span>
            <h2 className="heading-lg mb-4">Você sente que{' '}<span className="gradient-warm">algo tá errado?</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Todo mundo parece dar conta das coisas. Menos você. 
              <span className="text-foreground"> E se não for culpa sua?</span>
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
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 max-w-xl mx-auto mb-8">
              <p className="text-lg mb-2">
                🫂 Se você se identificou com alguma coisa aí em cima...
              </p>
              <p className="text-muted-foreground">
                Relaxa, <span className="text-foreground font-medium">você não é o único</span>. E a boa notícia é que tem explicação pra tudo isso.
              </p>
            </div>
            <Link href="/teste-tdah">
              <button className="btn-secondary px-8 py-4 rounded-xl inline-flex items-center gap-2 text-base">
                Fazer o Teste de Graça <ArrowRight className="w-4 h-4" />
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
      <section className="py-20 px-4 bg-card/30">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge badge-primary mb-4"><Activity className="w-3.5 h-3.5" /> Veja se você se reconhece</span>
            <h2 className="heading-lg mb-4">Quantas dessas coisas <span className="gradient-primary">parecem com você</span>?</h2>
            <p className="text-muted-foreground">Vai marcando mentalmente enquanto lê 👇</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {symptoms.map((symptom, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm leading-relaxed">{symptom}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/5 border border-primary/20 max-w-lg mx-auto mb-8">
              <p className="text-lg">
                Se você marcou <span className="text-primary font-bold">4 ou mais</span>...
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Não quer dizer que você tem TDAH, mas vale muito a pena investigar melhor.
              </p>
            </div>
            <Link href="/teste-tdah">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-8 py-4 rounded-xl text-base inline-flex items-center gap-3">
                <Brain className="w-5 h-5" />
                Quero Descobrir Mais
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Take Test */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-secondary mb-4"><Lightbulb className="w-3.5 h-3.5" /> O que você ganha</span>
            <h2 className="heading-lg">Entender é o <span className="gradient-secondary">primeiro passo</span></h2>
          </motion.div>

          <div className="space-y-5">
            {[
              { icon: Brain, title: "Para de se achar preguiçoso", description: "Quando você descobre que seu cérebro funciona diferente, para de se culpar por tudo. Não é falta de vontade — é o jeito que você nasceu." },
              { icon: Target, title: "Descobre o que funciona pra você", description: "Dica de produtividade normal não funciona pra todo mundo igual. Você vai entender O SEU jeito de fazer as coisas renderem." },
              { icon: Heart, title: "As pessoas vão te entender melhor", description: "Quando você sabe explicar por que faz certas coisas, quem tá do seu lado para de reclamar e começa a ajudar." },
              { icon: Zap, title: "Transforma o 'defeito' em vantagem", description: "TDAH não é só problema não. Criatividade, energia, pensamento diferente... tudo isso pode virar seu ponto forte." }
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-5 items-start card-elevated p-5 rounded-2xl">
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
      <section className="py-20 px-4 bg-card/30">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-primary mb-4"><Zap className="w-3.5 h-3.5" /> Super fácil</span>
            <h2 className="heading-lg">Como funciona?</h2>
            <p className="text-muted-foreground mt-2">Três passinhos e pronto 👇</p>
          </motion.div>

          <div className="space-y-5">
            {[
              { step: 1, title: "Responde 12 perguntinhas", description: "Coisas simples do dia a dia. Não precisa ficar pensando muito — responde o que vier na cabeça." },
              { step: 2, title: "A gente analisa suas respostas", description: "Nosso sistema olha suas respostas e monta um relatório explicando como seu cérebro funciona." },
              { step: 3, title: "Você recebe seu resultado", description: "Um relatório completo só seu, com dicas que você pode começar a usar HOJE mesmo." }
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[hsl(195_85%_50%)] flex items-center justify-center text-background font-bold text-xl shadow-lg shadow-primary/20">
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
              Mais de <span className="text-primary font-bold">2.800 pessoas</span> já fizeram esse teste
            </p>
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <div className="max-w-lg mx-auto p-4 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground italic">
                "Nossa, finalmente entendi por que eu sou assim. Até chorei lendo o resultado — me senti entendido pela primeira vez na vida."
              </p>
              <p className="text-xs text-primary mt-2">— Marina, 32 anos</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge badge-primary mb-4"><HelpCircle className="w-3.5 h-3.5" /> Dúvidas?</span>
            <h2 className="heading-lg mb-2">A gente responde!</h2>
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
      <section className="py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="heading-lg mb-4">
              E aí, bora{' '}<span className="gradient-primary">descobrir</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed">
              Chega de ficar se perguntando "o que tem de errado comigo?"
            </p>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Faz o teste, leva 3 minutinhos, é de graça, e você finalmente vai entender algumas coisas.
            </p>

            <Link href="/teste-tdah">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-10 py-5 rounded-xl text-lg font-semibold inline-flex items-center gap-3 shadow-lg shadow-primary/25">
                <Brain className="w-6 h-6" />
                Quero Fazer o Teste Agora
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>

            <p className="mt-8 text-sm text-muted-foreground flex flex-wrap justify-center gap-6">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> 3 minutinhos</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> De graça</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /> +2.800 já fizeram</span>
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
            <p className="text-xs text-muted-foreground text-center max-w-md">
              ⚠️ Esse teste não é diagnóstico médico. Se o resultado mostrar sinais fortes, o ideal é procurar um médico especialista.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
