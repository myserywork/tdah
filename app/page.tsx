'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, Sparkles, ArrowRight, Star, Shield, ChevronDown, Clock, CheckCircle2,
  Zap, Heart, Target, MessageCircle, RefreshCw, Lightbulb, TrendingUp, Gamepad2,
  Trophy, Smartphone, Lock, ShieldCheck, CreditCard, Fingerprint, Gift, Users,
  Play, Award, Calendar, BookOpen, Timer
} from 'lucide-react'

const painPoints = [
  { icon: Brain, title: "Mil pensamentos, zero ação", description: "Sua mente parece uma TV com 50 canais ligados. Você quer fazer tudo e não consegue fazer nada." },
  { icon: Clock, title: "O tempo simplesmente some", description: "Olha pro relógio: 9h. Pisca: 17h. Cadê o seu dia? Você não faz ideia do que aconteceu." },
  { icon: Target, title: "Paralisia total", description: "Você sabe EXATAMENTE o que precisa fazer. Mas algo te trava. E a culpa que vem depois é brutal." },
  { icon: RefreshCw, title: "O ciclo sem fim", description: "Amanhã vai ser diferente. Mas amanhã chega e é sempre a mesma história. Todo. Santo. Dia." },
  { icon: Heart, title: "Relacionamentos sofrendo", description: "As pessoas reclamam que você não presta atenção, esquece tudo, parece não se importar." },
  { icon: Zap, title: "Energia desperdiçada", description: "Energia INFINITA pra coisas triviais. Pro que importa? Zero. Nada. Vazio." }
]

const lifeOsFeatures = [
  { emoji: "🎮", title: "Missões Diárias", desc: "Tarefas viram missões com recompensas" },
  { emoji: "⭐", title: "Sistema de XP", desc: "Ganhe pontos por cada conquista" },
  { emoji: "🏆", title: "Conquistas", desc: "Desbloqueie badges e troféus" },
  { emoji: "🔥", title: "Streaks", desc: "Mantenha sequências e ganhe bônus" },
  { emoji: "📊", title: "Dashboard", desc: "Veja seu progresso em tempo real" },
  { emoji: "🎯", title: "Boss Fights", desc: "Enfrente seus maiores desafios" }
]

const modules = [
  { num: 1, title: "Sistema de Captura Mental", desc: "Tire tudo da cabeça", icon: Brain },
  { num: 2, title: "Rotina Flexível", desc: "Que sobrevive aos dias ruins", icon: Calendar },
  { num: 3, title: "Foco Sob Demanda", desc: "Quando você precisa", icon: Target },
  { num: 4, title: "Procrastinação Zero", desc: "Da paralisia pra ação", icon: Zap },
  { num: 5, title: "Regulação Emocional", desc: "Domar a montanha-russa", icon: Heart },
  { num: 6, title: "Hiperfoco Estratégico", desc: "Seu superpoder", icon: Trophy }
]

const testimonials = [
  { name: "Mariana S.", age: 32, role: "Designer", text: "Chorei lendo meu relatório. O app Life OS virou meu melhor amigo — finalmente terminei meu TCC!", result: "Terminou o TCC após 3 anos", avatar: "MS" },
  { name: "Rafael O.", age: 28, role: "Dev", text: "A gamificação do Life OS me fez criar hábitos que nunca consegui. Parece jogo, mas é minha vida melhorando!", result: "Promovido no trabalho", avatar: "RO" },
  { name: "Carla M.", age: 41, role: "Advogada", text: "Diagnosticada aos 38. Em semanas consegui o que 20 anos de 'só se esforce' nunca deram.", result: "Organizou toda a rotina", avatar: "CM" },
  { name: "Lucas P.", age: 25, role: "Estudante", text: "Reprovei 4 vezes na faculdade. Com o Life OS, passei em TODAS as matérias. A gamificação funciona demais!", result: "Passou em todas as matérias", avatar: "LP" }
]

const faqs = [
  { question: "Isso substitui diagnóstico médico?", answer: "Não. Este é um teste de autoavaliação para você entender melhor seus sintomas. Para diagnóstico oficial, procure um psiquiatra ou neurologista especializado em TDAH." },
  { question: "Quanto tempo leva o teste?", answer: "Entre 5 a 8 minutos. São 20 perguntas que vão te fazer refletir sobre padrões que você talvez nunca tenha percebido." },
  { question: "O que é o Life OS?", answer: "É um aplicativo web que transforma sua rotina em um jogo. Com missões, XP, conquistas e streaks, você finalmente consegue criar hábitos sem sofrer. Acesso por 1 ano incluso!" },
  { question: "Posso pedir reembolso?", answer: "Sim! Você tem 7 dias de garantia incondicional. Se não gostar por qualquer motivo, devolvemos 100% do valor. Sem perguntas." }
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
    { Icon: Trophy, x: 80, y: 80, size: 36, delay: 2.5 },
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
          {/* Gradient Mesh */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(175_85%_45%/0.15),transparent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(265_85%_60%/0.08),transparent_50%)]" />
          </div>
          
          {/* Grid Pattern */}
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
          
          {/* Animated Orbs */}
          <motion.div
            className="absolute top-20 left-[20%] w-[300px] h-[300px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(175 85% 45% / 0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-[15%] w-[250px] h-[250px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(265 85% 60% / 0.12) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 right-[30%] w-[200px] h-[200px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(35 95% 55% / 0.08) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              y: [0, -40, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Neural Network Lines */}
          <NeuralLines />
          
          {/* Floating Particles */}
          <HeroParticles />
          
          {/* Floating Icons */}
          <FloatingIcons />

          {/* Glowing Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5">
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-secondary/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className="container max-w-5xl mx-auto relative z-10">
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.div className="badge badge-primary mb-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teste Gratuito + App Life OS por 1 ano</span>
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
              Descubra em <span className="text-foreground font-medium">5 minutos</span> se seu cérebro opera no 
              modo TDAH — e receba acesso ao <span className="text-secondary font-medium">Life OS</span>, o app que 
              <span className="text-foreground font-medium"> gamifica sua vida</span> e acaba com a paralisia.
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
              <span className="flex items-center gap-1.5"><Gamepad2 className="w-4 h-4 text-secondary/70" /> App Life OS incluso</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary/70" /> 5 minutos</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs font-medium tracking-wide uppercase">Saiba mais</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-amber mb-4"><Lightbulb className="w-3.5 h-3.5" /> Você se identifica?</span>
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
            {[
              { number: "7.4M", label: "Adultos com TDAH no Brasil" },
              { number: "80%", label: "Não sabem que têm" },
              { number: "2.8K+", label: "Pessoas usando o Life OS" },
              { number: "94%", label: "Melhoram com estratégias certas" }
            ].map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="stat-value gradient-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life OS Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-card/30 to-background">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-secondary mb-4"><Gamepad2 className="w-3.5 h-3.5" /> Exclusivo</span>
            <h2 className="heading-lg mb-4">
              Conheça o <span className="gradient-secondary">Life OS</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              O app que <span className="text-foreground font-medium">transforma sua vida em um jogo</span> — 
              e faz você vencer todos os dias. Chega de paralisia!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="card-purple p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-[hsl(285_80%_55%)] flex items-center justify-center mb-6 glow-purple">
                    <Gamepad2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Gamifique sua vida!</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    O Life OS transforma cada tarefa em uma missão, cada hábito em um power-up e cada dia em uma fase. 
                    Seu cérebro TDAH vai amar as recompensas constantes!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['🎮 Missões', '⭐ XP', '🏆 Troféus', '🔥 Streaks'].map((t, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4">
                {lifeOsFeatures.map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-elevated p-4 rounded-xl">
                    <div className="text-2xl mb-2">{feature.emoji}</div>
                    <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <Smartphone className="w-4 h-4" /> Acesso por 1 ano completo incluso na oferta
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-primary mb-4"><BookOpen className="w-3.5 h-3.5" /> Conteúdo completo</span>
            <h2 className="heading-lg mb-4">6 módulos para <span className="gradient-primary">dominar seu cérebro</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-elevated p-5 rounded-xl flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <mod.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-primary font-medium mb-1">Módulo {mod.num}</div>
                  <h4 className="font-bold mb-0.5">{mod.title}</h4>
                  <p className="text-sm text-muted-foreground">{mod.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-primary mb-4"><Star className="w-3.5 h-3.5" /> +2.847 pessoas</span>
            <h2 className="heading-lg">Quem usa <span className="gradient-primary">ama</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="testimonial-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-semibold text-background">{t.avatar}</div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.age} anos • {t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="pt-3 border-t border-border/50">
                  <div className="text-xs text-primary font-medium flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> {t.result}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-highlight p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                <Timer className="w-4 h-4" /> Oferta por tempo limitado
              </div>

              <h2 className="heading-lg mb-4">Tudo isso por apenas</h2>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg text-muted-foreground line-through">R$ 197</div>
                  <div className="text-sm text-muted-foreground">+ Bônus R$ 291</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary number-display">R$ 19,90</div>
                </div>
              </div>

              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Guia completo + App Life OS por 1 ano + Todos os bônus
              </p>

              <Link href="/teste-tdah">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-10 py-5 rounded-xl text-lg font-bold w-full sm:w-auto mb-6">
                  Fazer Teste e Garantir Oferta →
                </motion.button>
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
                  <Fingerprint className="w-3.5 h-3.5" /> Dados Protegidos
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> App Life OS por 1 ano</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Garantia de 7 dias</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suporte no WhatsApp</span>
              </div>

              {/* Guarantee */}
              <div className="mt-8 p-5 rounded-xl bg-background/50 border border-border max-w-md mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-emerald-400 text-sm">Garantia de 7 dias</h4>
                    <p className="text-xs text-muted-foreground">Não gostou? Devolvemos 100% do valor. Sem perguntas.</p>
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

      {/* How It Works */}
      <section className="py-24 px-4 bg-card/30">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge badge-primary mb-4"><Zap className="w-3.5 h-3.5" /> Simples e rápido</span>
            <h2 className="heading-lg">Como funciona</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: 1, title: "Faça o teste gratuito", description: "20 perguntas que vão te fazer refletir sobre padrões que você nunca percebeu.", icon: MessageCircle },
              { step: 2, title: "Receba seu relatório com IA", description: "Nossa inteligência artificial analisa suas respostas e gera um relatório personalizado.", icon: Brain },
              { step: 3, title: "Acesse o Life OS + Guia", description: "Desbloqueie o app gamificado e o guia completo por apenas R$ 19,90.", icon: Gamepad2 }
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="flex gap-6 items-start card-elevated p-6 rounded-2xl">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">Passo {item.step}</div>
                  <h3 className="text-lg font-semibold mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="heading-lg mb-2">Dúvidas frequentes</h2>
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
              Pronto para{' '}<span className="gradient-primary">virar o jogo</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              O primeiro passo é entender seu cérebro. 
              Faça o teste gratuito e comece sua transformação hoje.
            </p>

            <Link href="/teste-tdah">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-10 py-5 rounded-xl text-lg font-semibold inline-flex items-center gap-3">
                <Brain className="w-6 h-6" />
                Fazer Meu Teste Gratuito
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>

            <p className="mt-8 text-sm text-muted-foreground flex flex-wrap justify-center gap-3">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 minutos</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> 100% gratuito</span>
              <span className="flex items-center gap-1.5"><Gamepad2 className="w-4 h-4" /> Life OS incluso</span>
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
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Site 100% Seguro</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> SSL</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Mente Caótica • Não substitui diagnóstico médico
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
