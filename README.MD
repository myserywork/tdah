# Mente Caótica - Landing Page + Teste TDAH

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Criar arquivo .env.local com sua chave OpenAI
echo "OPENAI_API_KEY=sua-chave-aqui" > .env.local

# Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

---

## 📋 Visão Geral do Projeto

Este é um projeto de **landing page de alta conversão** + **ferramenta de captação de leads** para o produto digital "Mente Caótica", um guia de clareza mental para adultos com TDAH.

## 🎯 Objetivo Principal

Capturar leads qualificados através de um **teste gratuito de TDAH** que:
1. Engaja emocionalmente o usuário com perguntas profundas
2. Gera um relatório personalizado usando IA
3. Captura nome + WhatsApp para enviar o resultado completo
4. Oferece desconto exclusivo (50% OFF) após o teste

## 🏗️ Estrutura Atual

### Páginas Implementadas

#### 1. Landing Page Principal (`/`)
**Objetivo:** Convencer o visitante a fazer o teste gratuito

**Seções:**
- **Hero Section**: Headlines emocionais + CTA para fazer o teste
- **Seção de Dor**: Ataca profundamente as frustrações do público com TDAH
- **Prova Social**: Estatísticas + depoimentos de transformação
- **O Que Você Vai Descobrir**: Benefits do guia
- **Quem Precisa Deste Guia**: Público-alvo específico
- **Depoimentos Detalhados**: Com fotos e histórias reais
- **Pricing**: Oferta com desconto por tempo limitado
- **Garantia**: 7 dias ou dinheiro de volta
- **FAQ**: Elimina objeções
- **CTA Final**: Última chance de conversão

**Características de Design:**
- Copy agressivo focado na dor emocional
- Múltiplos CTAs estrategicamente posicionados
- Imagens geradas com IA mostrando pessoas com TDAH
- Gradientes e efeitos visuais modernos
- Cores vibrantes (roxo, verde, vermelho) para criar urgência

#### 2. Página do Teste TDAH (`/teste-tdah`)
**Objetivo:** Capturar leads qualificados através de um teste interativo

**Fluxo do Teste:**
1. **Introdução Empática**: Valida a dor e explica o teste
2. **12 Perguntas Profundas**: Cobre todas as áreas críticas
   - Foco e concentração
   - Memória e organização
   - Impulsividade
   - Procrastinação
   - Regulação emocional
   - Relacionamentos
   - Autoestima
   - Rotina diária
3. **Sistema de Pontuação**: 5 níveis de intensidade por pergunta (1-5)
4. **Geração de Relatório com IA**: Preview do resultado
5. **Formulário de Captura**: Nome + WhatsApp
6. **Oferta Exclusiva**: 50% OFF para quem fez o teste

**Perguntas do Teste:**
Cada pergunta tem:
- Título emocional e direto
- 5 opções de intensidade (Nunca → Sempre)
- Cores progressivas (verde → vermelho) conforme intensidade
- Emojis para facilitar escolha

**Classificação de Resultados:**
- **0-15 pontos**: Sintomas leves
- **16-30 pontos**: Sintomas moderados
- **31-45 pontos**: Sintomas significativos
- **46-60 pontos**: Sintomas severos

## 🤖 Integração com IA

### API Route: `/api/generate-adhd-report`

**Função:** Gerar relatório personalizado baseado nas respostas

**Tecnologia:** AI SDK by Vercel (modelo: `openai/gpt-4`)

**Input:**
```typescript
{
  answers: number[],  // Array com as 12 respostas (1-5)
  totalScore: number  // Soma total
}
```

**Output (Streaming):**
Relatório estruturado em markdown com:
- Análise do nível de sintomas
- Áreas mais afetadas
- Impactos identificados
- Primeiros passos recomendados
- Mensagem de esperança

## 🎨 Stack Técnica

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Fontes:** Geist Sans + Geist Mono
- **IA:** Vercel AI SDK (AI Gateway)
- **Imagens:** Geradas via placeholder com queries específicas

## 📁 Estrutura de Arquivos

```
/app
  ├── page.tsx              # Landing page principal
  ├── teste-tdah/
  │   └── page.tsx          # Página do teste interativo
  ├── api/
  │   └── generate-adhd-report/
  │       └── route.ts      # API para gerar relatório com IA
  ├── layout.tsx            # Layout global
  └── globals.css           # Estilos globais + design tokens

/components
  ├── email-capture.tsx     # Componente de captura (não usado no teste)
  └── adhd-quiz.tsx         # Componente antigo (substituído)

/public
  └── *.jpg                 # Imagens geradas (pessoas com TDAH, etc)
```

## 🎯 Estratégia de Conversão

### Funil de Vendas

1. **Topo do Funil (Landing Page)**
   - Visitante chega com dor/problema
   - Copy agressivo mostra que entendemos a dor
   - CTA: "Fazer teste gratuito"

2. **Meio do Funil (Teste TDAH)**
   - Engajamento através de perguntas pessoais
   - Usuário investe tempo (compromisso)
   - Antecipação do resultado

3. **Fundo do Funil (Captura)**
   - Preview do relatório gera desejo
   - Formulário simples (nome + WhatsApp)
   - Oferta irresistível (50% OFF exclusivo)

### Gatilhos Mentais Utilizados

✅ **Escassez**: Desconto por tempo limitado  
✅ **Urgência**: "Apenas hoje", "últimas vagas"  
✅ **Prova Social**: Depoimentos + estatísticas  
✅ **Autoridade**: Tom profissional + análise com IA  
✅ **Reciprocidade**: Teste + relatório gratuito  
✅ **Compromisso**: Usuário investe tempo no teste  
✅ **Dor vs Prazer**: Contraste entre situação atual e futura

## 🚀 O Que Falta Implementar

### Funcionalidades Pendentes

1. **Integração Real com WhatsApp**
   - Atualmente o botão só abre o WhatsApp
   - Precisa enviar automaticamente o relatório completo
   - Considerar usar API do WhatsApp Business

2. **Backend para Armazenar Leads**
   - Salvar leads em banco de dados (Supabase?)
   - Armazenar respostas do teste para análise
   - Dashboard para visualizar leads captados

3. **Sistema de Email Marketing**
   - Enviar relatório também por email
   - Sequência de follow-up automática
   - Nutrir leads que não compraram

4. **Pixel de Conversão**
   - Facebook Pixel
   - Google Analytics/Tag Manager
   - Rastreamento de eventos (iniciar teste, completar, converter)

5. **A/B Testing**
   - Testar diferentes headlines
   - Testar diferentes ofertas (30% vs 50% vs 70%)
   - Testar cores dos CTAs

6. **Melhorias no Teste**
   - Adicionar imagens/GIFs nas perguntas
   - Animações mais sofisticadas
   - Opção de voltar para perguntas anteriores
   - Salvar progresso (caso usuário saia)

7. **Página de Obrigado**
   - Após enviar WhatsApp
   - Reforçar a oferta
   - Adicionar temporizador de urgência

8. **Checkout Integrado**
   - Stripe ou Hotmart
   - Processo de compra direto na página
   - Upsells/Downsells

## 🎨 Diretrizes de Design Atuais

### Paleta de Cores

```css
/* Cores principais */
--color-primary: purple (#8b5cf6, #a78bfa)
--color-secondary: green (#10b981, #34d399)
--color-danger: red (#ef4444, #f87171)
--color-warning: orange (#f97316, #fb923c)

/* Neutrals */
--background: white/dark
--foreground: black/white
```

### Tipografia

- **Headings**: Geist Sans (weights: 700, 800, 900)
- **Body**: Geist Sans (weights: 400, 500, 600)
- **Line Height**: 1.4-1.6 para legibilidade

### Layout

- **Mobile-first**: Design responsivo
- **Flexbox**: Maioria dos layouts
- **Grid**: Seções de depoimentos e features
- **Spacing**: Tailwind scale (gap-4, p-6, etc)

## 📊 Métricas de Sucesso

**KPIs para Monitorar:**

1. **Taxa de Conversão Landing → Teste**: % de visitantes que clicam no CTA
2. **Taxa de Completude do Teste**: % que completa as 12 perguntas
3. **Taxa de Captura**: % que preenche nome + WhatsApp
4. **Custo por Lead**: Investimento em tráfego / leads captados
5. **Taxa de Conversão Final**: Leads → Vendas

**Metas Sugeridas:**

- Landing → Teste: 15-25%
- Completude: 60-80%
- Captura: 70-85%
- Lead → Venda: 3-10%

## 💡 Sugestões de Melhoria

### Copywriting

- Adicionar mais stories/narrativas de transformação
- Criar sensação de movimento/comunidade
- Usar mais "você" e menos "nós"
- Testar headlines mais polêmicas

### Design

- Adicionar vídeo explicativo no hero
- GIFs/animações nas seções de dor
- Countdown timer visível
- Pop-ups de exit intent

### Conversão

- Oferecer bônus para quem compra nas primeiras 24h
- Criar escassez real (limite de vagas)
- Adicionar chat ao vivo (ou chatbot)
- Implementar FOMO notifications ("5 pessoas compraram nas últimas 2h")

## 🔐 Considerações Técnicas

### Performance

- Imagens otimizadas (WebP)
- Lazy loading onde aplicável
- Code splitting automático (Next.js)

### SEO

- Metadata apropriada
- Open Graph tags
- Schema markup para FAQ

### Acessibilidade

- ARIA labels onde necessário
- Contrast ratio adequado
- Keyboard navigation

## 📞 Próximos Passos Sugeridos

1. **Configurar banco de dados** (Supabase) para armazenar leads
2. **Implementar integração real com WhatsApp API**
3. **Adicionar pixel de conversão** (Meta + Google)
4. **Criar página de checkout** com gateway de pagamento
5. **Configurar automação de email** para nurturing
6. **Testar e iterar** baseado em dados reais

---

## 🤝 Contexto para Continuação

**Linguagem:** Todo o conteúdo é em **português brasileiro**

**Tom de Voz:** 
- Direto e sem rodeios
- Empático mas não piegas
- Focado em resultados práticos
- Usa gatilhos emocionais fortes

**Público-Alvo:**
- Adultos (25-45 anos) com TDAH diagnosticado ou auto-identificado
- Frustrados com falta de foco e produtividade
- Buscam solução prática (não terapia)
- Dispostos a investir em si mesmos

**Produto:**
- E-book/Guia digital
- Preço: R$ 97 (com desconto de 30-50%)
- Promise: Clareza mental e produtividade para pessoas com TDAH
- Diferencial: Prático e direto ao ponto (não é conteúdo acadêmico)

---

**Criado para dar contexto completo ao Claude Opus ou qualquer outro modelo de IA que for continuar este projeto.**
