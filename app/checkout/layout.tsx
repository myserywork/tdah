import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout Seguro - Guia Mente Caótica + Life OS',
  description: 'Finalize sua compra com segurança. Guia Mente Caótica + App Life OS por 1 ano. Pagamento seguro via Pix, Cartão ou Boleto. Garantia de 7 dias.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Checkout - Mente Caótica',
    description: 'Finalize sua compra e comece sua transformação hoje.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

