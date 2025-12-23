import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teste de TDAH Online Gratuito - 20 Perguntas com Relatório IA',
  description: 'Faça agora o teste de TDAH mais completo do Brasil. 20 perguntas cientificamente elaboradas + relatório personalizado com Inteligência Artificial. Descubra em 5 minutos se você tem sintomas de déficit de atenção.',
  keywords: [
    'teste TDAH online',
    'teste TDAH gratuito',
    'teste déficit de atenção',
    'autoavaliação TDAH',
    'sintomas TDAH adulto',
    'teste hiperatividade',
    'questionário TDAH',
    'avaliar TDAH',
  ],
  openGraph: {
    title: 'Teste de TDAH Gratuito - 20 Perguntas + Relatório com IA',
    description: 'Descubra em 5 minutos se seu cérebro opera no modo TDAH. Teste científico + análise personalizada.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faça o Teste de TDAH Gratuito',
    description: '20 perguntas + relatório personalizado com IA em 5 minutos.',
  },
  alternates: {
    canonical: 'https://www.mentecaotica.com.br/teste-tdah',
  },
}

export default function TesteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

