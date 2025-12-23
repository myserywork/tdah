import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import Script from 'next/script'
import FacebookPixel from '@/components/FacebookPixel'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
})

const GA_TRACKING_ID = 'G-CX2GBYKFPM'
const META_PIXEL_ID = '1194474569538928'
const CLARITY_ID = 'uq82nudn0r'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0f',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mentecaotica.com.br'),
  title: {
    default: 'Mente Caótica - Teste de TDAH Gratuito com IA | Descubra se você tem TDAH',
    template: '%s | Mente Caótica'
  },
  description: 'Faça o teste de TDAH gratuito mais completo do Brasil. Descubra em 5 minutos se os sintomas de déficit de atenção estão sabotando sua vida. Relatório personalizado com Inteligência Artificial + App Life OS para gamificar sua rotina.',
  keywords: [
    'TDAH', 
    'teste TDAH', 
    'teste TDAH online',
    'teste TDAH gratuito',
    'déficit de atenção', 
    'hiperatividade', 
    'foco', 
    'concentração', 
    'produtividade',
    'TDAH adulto',
    'sintomas TDAH',
    'como saber se tenho TDAH',
    'teste déficit de atenção',
    'procrastinação',
    'Life OS',
    'gamificação TDAH',
    'tratamento TDAH',
    'autoavaliação TDAH'
  ],
  authors: [{ name: 'Mente Caótica', url: 'https://www.mentecaotica.com.br' }],
  creator: 'Mente Caótica',
  publisher: 'Mente Caótica',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Teste de TDAH Gratuito - Descubra se seu cérebro opera no modo TDAH',
    description: 'Faça o teste mais completo do Brasil. Relatório personalizado com IA em 5 minutos. Mais de 2.800 pessoas já descobriram a verdade sobre seus cérebros.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.mentecaotica.com.br',
    siteName: 'Mente Caótica',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mente Caótica - Teste de TDAH Gratuito',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teste de TDAH Gratuito - Mente Caótica',
    description: 'Descubra se seu cérebro opera no modo TDAH. Teste gratuito + relatório com IA + App Life OS.',
    images: ['/og-image.png'],
    creator: '@mentecaotica',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Adicione seu código de verificação do Google
  },
  alternates: {
    canonical: 'https://www.mentecaotica.com.br',
  },
  category: 'health',
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mente Caótica - Teste de TDAH',
  description: 'Teste de autoavaliação de TDAH com relatório personalizado por Inteligência Artificial',
  url: 'https://www.mentecaotica.com.br',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '19.90',
    priceCurrency: 'BRL',
    description: 'Guia Mente Caótica + App Life OS por 1 ano',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '2847',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: 'Mente Caótica',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* Meta Pixel noscript fallback */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1194474569538928&ev=PageView&noscript=1" />`
          }}
        />
        
        {/* Microsoft Clarity - Heatmaps & Session Recordings */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {/* Meta Pixel - Client Component */}
        <FacebookPixel />
        <div className="min-h-screen animated-bg noise-overlay">
          {children}
        </div>
      </body>
    </html>
  )
}
