import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const questionCategories = [
  'Foco', 'Foco', 'Foco', 'Foco',
  'Memória', 'Memória', 'Memória', 'Memória',
  'Impulsividade', 'Impulsividade', 'Impulsividade', 'Impulsividade',
  'Procrastinação', 'Procrastinação', 'Procrastinação', 'Procrastinação',
  'Emocional', 'Emocional', 'Autoestima', 'Autoestima'
]

function getScoreLevel(totalScore: number) {
  if (totalScore <= 30) return 'leve'
  if (totalScore <= 50) return 'moderado'
  if (totalScore <= 70) return 'significativo'
  return 'alto'
}

function calculateCategoryScores(answers: number[]) {
  const categories: Record<string, { total: number; count: number }> = {}
  
  answers.forEach((score, index) => {
    const category = questionCategories[index]
    if (!categories[category]) {
      categories[category] = { total: 0, count: 0 }
    }
    categories[category].total += score
    categories[category].count += 1
  })

  return Object.entries(categories).map(([name, data]) => ({
    name,
    average: data.total / data.count,
    total: data.total,
    maxPossible: data.count * 5,
    percentage: Math.round((data.total / (data.count * 5)) * 100)
  })).sort((a, b) => b.percentage - a.percentage)
}

export async function POST(req: NextRequest) {
  try {
    const { answers, totalScore } = await req.json()
    const apiKey = process.env.OPENAI_API_KEY
    
    const categoryScores = calculateCategoryScores(answers)
    const level = getScoreLevel(totalScore)
    const weakestArea = categoryScores[0]
    
    // Se não tem API key, retorna relatório estruturado padrão
    if (!apiKey) {
      return NextResponse.json(generateStructuredReport(answers, totalScore, categoryScores, level))
    }

    // Prompt para gerar relatório com linguagem amigável
    const prompt = `Você é um especialista em TDAH que fala de forma SUPER acessível e amigável, como um amigo que entende o que a pessoa está passando.

DADOS DO USUÁRIO:
- Pontuação total: ${totalScore}/100 (nível ${level})
- Área mais afetada: ${weakestArea.name} (${weakestArea.percentage}%)

Retorne APENAS um JSON válido (sem markdown) com esta estrutura:

{
  "headline": "Uma frase curta e empática sobre o resultado (máx 12 palavras, sem termos técnicos)",
  "summary": "2-3 frases super simples explicando o que foi identificado. Use linguagem de conversa, como se estivesse falando com um amigo.",
  "insights": [
    {
      "title": "Título simples e amigável",
      "description": "Explicação fácil de entender, sem termos técnicos. Use exemplos do dia a dia.",
      "icon": "brain"
    },
    {
      "title": "Outro insight em linguagem simples",
      "description": "Explicação que qualquer pessoa entenderia",
      "icon": "lightbulb"
    },
    {
      "title": "Terceiro insight acessível",
      "description": "Continue com linguagem simples e exemplos práticos",
      "icon": "heart"
    }
  ],
  "strengths": [
    "Ponto forte em linguagem positiva e simples",
    "Outro ponto forte"
  ],
  "challenges": [
    "Desafio explicado de forma gentil",
    "Outro desafio sem termos difíceis"
  ],
  "quickWins": [
    {
      "title": "Dica prática 1",
      "description": "Como fazer isso de forma super simples",
      "timeToResult": "Resultado rápido"
    },
    {
      "title": "Dica prática 2",
      "description": "Explicação fácil",
      "timeToResult": "Em poucos dias"
    },
    {
      "title": "Dica prática 3",
      "description": "Bem prático e direto",
      "timeToResult": "Em 1 semana"
    }
  ],
  "modulePreview": {
    "title": "Módulo 1: Sistema de Captura Mental",
    "description": "Aprenda a tirar todas as preocupações da sua cabeça e colocar em um lugar seguro.",
    "topics": [
      "Como fazer um 'brain dump' em 5 minutos",
      "Criando seu sistema de lembretes",
      "Templates prontos pra usar"
    ],
    "testimonial": {
      "text": "Só essa técnica já mudou minha vida. Agora durmo em paz!",
      "author": "Lucas M., 29 anos"
    }
  },
  "nextStep": "Uma sugestão simples e encorajadora do que fazer agora"
}

REGRAS IMPORTANTES:
- NÃO use termos como: RAM, HD, dopamina, córtex, função executiva, disfunção
- Use comparações do dia a dia (computador lento, TV ligada, etc)
- Seja MUITO empático e gentil
- Fale como um amigo, não como um médico
- Retorne APENAS o JSON`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('OpenAI API error')
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      
      try {
        const jsonReport = JSON.parse(content)
        return NextResponse.json({
          ...jsonReport,
          score: totalScore,
          level,
          categoryScores,
          generated: true
        })
      } catch {
        return NextResponse.json(generateStructuredReport(answers, totalScore, categoryScores, level))
      }
    } catch {
      return NextResponse.json(generateStructuredReport(answers, totalScore, categoryScores, level))
    }

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(generateStructuredReport([], 50, [], 'moderado'))
  }
}

function generateStructuredReport(
  answers: number[], 
  totalScore: number, 
  categoryScores: ReturnType<typeof calculateCategoryScores>,
  level: string
) {
  const topArea = categoryScores[0]?.name || 'Foco'
  
  const headlines: Record<string, string> = {
    leve: 'Você está no caminho certo, com alguns pontos pra melhorar',
    moderado: 'Algumas coisas fazem mais sentido agora, né?',
    significativo: 'Agora você entende por que algumas coisas são tão difíceis',
    alto: 'Seu cérebro funciona diferente — e tá tudo bem!'
  }

  const summaries: Record<string, string> = {
    leve: 'Suas respostas mostram alguns padrões que podem estar te atrapalhando um pouco. A boa notícia? Com algumas mudanças simples, você pode melhorar muito!',
    moderado: 'Identificamos alguns padrões que provavelmente já te causaram frustração. Você não é o problema — é só que seu cérebro precisa de estratégias diferentes.',
    significativo: 'Agora faz sentido por que tantas coisas parecem mais difíceis pra você, né? Seu cérebro funciona de um jeito único, e com as ferramentas certas você vai longe!',
    alto: 'Uau, muita coisa deve estar fazendo sentido agora! Seu cérebro é diferente da maioria, e isso explica MUITA coisa. Mas olha: isso não é uma sentença, é um ponto de partida.'
  }

  const quickWinsByArea: Record<string, { title: string, description: string, timeToResult: string }[]> = {
    Foco: [
      { title: 'Timer de 15 minutos', description: 'Coloca um timer e foca só por 15 minutos. Quando tocar, você pode parar ou continuar. Simples assim!', timeToResult: 'Funciona na hora' },
      { title: 'Trabalhe com alguém por perto', description: 'Ter alguém trabalhando junto (mesmo em silêncio) ajuda MUITO a manter o foco. Pode ser até por videochamada!', timeToResult: 'Em 1 dia' },
      { title: 'Tire UMA distração', description: 'Escolha sua maior distração e elimine ela por hoje. Pode ser o celular, uma aba do navegador... só uma!', timeToResult: 'Em 3 dias' }
    ],
    Memória: [
      { title: 'Escreva tudo antes de dormir', description: 'Pegue um papel e escreva TUDO que está na sua cabeça. Não precisa organizar, só joga pra fora!', timeToResult: 'Funciona na hora' },
      { title: 'Um lugar fixo pra cada coisa', description: 'Chaves, carteira, celular: escolha UM lugar fixo pra cada um. Sempre o mesmo lugar!', timeToResult: 'Em 1 semana' },
      { title: 'Alarmes com nome', description: 'Em vez de alarme "Reunião", coloque "Sair em 10min pro dentista". Seu eu do futuro agradece!', timeToResult: 'Funciona na hora' }
    ],
    Impulsividade: [
      { title: 'Espera 24 horas', description: 'Quer comprar algo? Coloca no carrinho mas só compra amanhã. Você vai ver que metade das coisas nem quer mais!', timeToResult: 'Funciona na hora' },
      { title: 'Conta até 10', description: 'Antes de responder algo importante, conta até 10 na cabeça. Dá tempo pro seu cérebro pensar melhor.', timeToResult: 'Em 3 dias' },
      { title: 'Escreve mas não envia', description: 'Escreveu uma mensagem com raiva? Guarda por 1 hora antes de enviar. Você vai agradecer depois!', timeToResult: 'Funciona na hora' }
    ],
    Procrastinação: [
      { title: 'Se leva 2 minutos, faz agora', description: 'Qualquer coisa que leva menos de 2 minutos, faz NA HORA. Não anota, não adia, só faz!', timeToResult: 'Funciona na hora' },
      { title: 'O passo mais pequenininho', description: 'Em vez de "fazer relatório", seu primeiro passo é "abrir o documento". Só isso. O resto vem depois.', timeToResult: 'Funciona na hora' },
      { title: 'Cria urgência falsa', description: 'Marca um compromisso logo depois da tarefa. A pressão vai te ajudar a começar!', timeToResult: 'Em 1 dia' }
    ],
    Emocional: [
      { title: 'Dá nome pro que você sente', description: 'Quando sentir algo forte, fala em voz alta: "Tô sentindo frustração". Parece bobo mas ajuda muito!', timeToResult: 'Funciona na hora' },
      { title: 'Técnica 5-4-3-2-1', description: 'Quando estiver mal: veja 5 coisas, ouça 4 sons, toque 3 objetos, cheire 2 cheiros, saboreie 1 coisa.', timeToResult: 'Funciona na hora' },
      { title: 'Pausa de 10 minutos', description: 'Emoção forte chegou? Diz pra você mesmo "vou processar isso em 10 minutos" e coloca um timer.', timeToResult: 'Em 3 dias' }
    ],
    Autoestima: [
      { title: 'Anota uma vitória por dia', description: 'Todo dia, escreve UMA coisa que você conseguiu fazer. Pode ser pequena. Celebra!', timeToResult: 'Em 1 semana' },
      { title: 'Mude a pergunta', description: 'Em vez de "por que sou assim?", pergunta "o que isso me ensinou?". Muda tudo!', timeToResult: 'Em 3 dias' },
      { title: 'Compare com você de ontem', description: 'Para de se comparar com os outros. Seu jogo é diferente. Compare só com você de ontem.', timeToResult: 'Funciona na hora' }
    ]
  }

  return {
    headline: headlines[level] || headlines.moderado,
    summary: summaries[level] || summaries.moderado,
    insights: [], // Will use friendlyInsights from the page
    strengths: [
      'Você é criativo e pensa de formas únicas',
      'Quando algo te interessa, você consegue focar muito',
      'Você é resiliente — já passou por muita coisa e tá aqui',
      'Você entende outras pessoas que passam dificuldades'
    ].slice(0, 2),
    challenges: [
      `${topArea}: essa é a área que mais precisa de atenção`,
      categoryScores[1] ? `${categoryScores[1].name}: também merece cuidado` : 'Criar rotinas consistentes'
    ],
    quickWins: quickWinsByArea[topArea] || quickWinsByArea.Foco,
    modulePreview: {
      title: 'Módulo 1: Sistema de Captura Mental',
      description: 'Aprenda a tirar todas aquelas preocupações e pensamentos da sua cabeça e colocar em um lugar seguro. Sua mente vai agradecer!',
      topics: [
        'Como fazer um "brain dump" em 5 minutinhos',
        'Criando seu cantinho de lembretes digital',
        'Templates prontos pra você usar hoje',
        'Como nunca mais esquecer as coisas importantes'
      ],
      testimonial: {
        text: 'Só essa técnica do brain dump já mudou minha vida. Agora durmo em paz sem aquela sensação de estar esquecendo algo!',
        author: 'Lucas M., 29 anos'
      }
    },
    nextStep: level === 'alto' 
      ? 'Que tal começar aplicando uma dessas dicas hoje? Escolhe a mais fácil e testa por 3 dias. Você vai se surpreender!'
      : 'Comece por uma das dicas acima — a mais fácil. Teste por 3 dias e veja a diferença!',
    score: totalScore,
    level,
    categoryScores,
    generated: false
  }
}
