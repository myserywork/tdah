import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Obrigado pela compra! - Mente Caótica',
  description: 'Sua compra foi realizada com sucesso. Confira seu e-mail para acessar o Guia Mente Caótica e o App Life OS.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ObrigadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

