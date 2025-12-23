import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata: Metadata = {
  title: 'Mente Caótica - Descubra se seu cérebro opera no modo TDAH',
  description: 'Faça o teste gratuito e descubra se os sintomas de TDAH estão sabotando sua vida. Relatório personalizado com IA em 3 minutos.',
  keywords: ['TDAH', 'teste TDAH', 'déficit de atenção', 'hiperatividade', 'foco', 'concentração', 'produtividade'],
  authors: [{ name: 'Mente Caótica' }],
  openGraph: {
    title: 'Mente Caótica - Teste de TDAH Gratuito',
    description: 'Descubra se seu cérebro opera no modo TDAH. Teste gratuito + relatório personalizado com IA.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mente Caótica - Teste de TDAH Gratuito',
    description: 'Descubra se seu cérebro opera no modo TDAH. Teste gratuito + relatório personalizado com IA.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <div className="min-h-screen animated-bg noise-overlay">
          {children}
        </div>
      </body>
    </html>
  )
}

