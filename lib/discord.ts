const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1453114653721890836/tNjukhNxD8KEFWRVUb5PIx63hFVtIubZEe1yVx8G-YEOBQpWn4F7tkwN1Co25GP5J-cy'

interface DiscordEmbed {
  title: string
  description?: string
  color: number
  fields?: { name: string; value: string; inline?: boolean }[]
  footer?: { text: string }
  timestamp?: string
}

export async function sendDiscordNotification(content: string, embeds?: DiscordEmbed[]) {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        embeds
      })
    })
    return response.ok
  } catch (error) {
    console.error('Discord webhook error:', error)
    return false
  }
}

// Notification when someone visits the site
export async function notifyVisit(page: string, userAgent?: string, ip?: string) {
  const embed: DiscordEmbed = {
    title: '👀 Nova Visita no Site',
    color: 0x00D4AA, // Cyan/Teal
    fields: [
      { name: '📍 Página', value: page, inline: true },
      { name: '🌐 IP', value: ip || 'Desconhecido', inline: true },
      { name: '📱 Dispositivo', value: userAgent?.substring(0, 100) || 'Desconhecido', inline: false }
    ],
    footer: { text: 'Mente Caótica - TDAH' },
    timestamp: new Date().toISOString()
  }
  
  return sendDiscordNotification('', [embed])
}

// Notification when lead form is submitted
export async function notifyLeadCapture(data: {
  name: string
  whatsapp: string
  score: number
  level: string
  topCategory: string
}) {
  const embed: DiscordEmbed = {
    title: '🎯 Novo Lead Capturado!',
    description: `**${data.name}** completou o teste de TDAH`,
    color: 0x8B5CF6, // Purple
    fields: [
      { name: '📞 WhatsApp', value: data.whatsapp, inline: true },
      { name: '📊 Pontuação', value: `${data.score}/100`, inline: true },
      { name: '🎚️ Nível', value: data.level, inline: true },
      { name: '🧠 Maior Desafio', value: data.topCategory, inline: true }
    ],
    footer: { text: 'Mente Caótica - Lead Qualificado' },
    timestamp: new Date().toISOString()
  }
  
  return sendDiscordNotification('🚀 **NOVO LEAD!**', [embed])
}

// Notification when payment is made
export async function notifyPayment(data: {
  name: string
  email: string
  amount: number
  method: string
  status: string
  paymentId?: string
  orderBumps?: { coaching?: boolean; community?: boolean; templates?: boolean }
}) {
  // Color based on status
  const colorMap: Record<string, number> = {
    'approved': 0x10B981, // Green
    'pending': 0xF59E0B, // Amber
    'in_process': 0x3B82F6, // Blue
    'rejected': 0xEF4444 // Red
  }
  
  const statusEmoji: Record<string, string> = {
    'approved': '✅',
    'pending': '⏳',
    'in_process': '🔄',
    'rejected': '❌'
  }

  const bumpsList = []
  if (data.orderBumps?.coaching) bumpsList.push('Coaching (+R$47)')
  if (data.orderBumps?.community) bumpsList.push('Comunidade (+R$27)')
  if (data.orderBumps?.templates) bumpsList.push('Templates (+R$17)')

  const embed: DiscordEmbed = {
    title: `${statusEmoji[data.status] || '💳'} ${data.status === 'approved' ? 'VENDA CONFIRMADA!' : 'Novo Pagamento'}`,
    description: `**${data.name}** fez uma compra`,
    color: colorMap[data.status] || 0x6B7280,
    fields: [
      { name: '📧 Email', value: data.email, inline: true },
      { name: '💰 Valor', value: `R$ ${data.amount.toFixed(2)}`, inline: true },
      { name: '💳 Método', value: data.method.toUpperCase(), inline: true },
      { name: '📋 Status', value: data.status, inline: true },
      ...(data.paymentId ? [{ name: '🆔 ID', value: data.paymentId.toString(), inline: true }] : []),
      ...(bumpsList.length > 0 ? [{ name: '🎁 Order Bumps', value: bumpsList.join('\n'), inline: false }] : [])
    ],
    footer: { text: 'Mente Caótica - MercadoPago' },
    timestamp: new Date().toISOString()
  }

  const alertMessage = data.status === 'approved' 
    ? '💰💰💰 **DINHEIRO NA CONTA!** 💰💰💰' 
    : '💳 **Novo pagamento iniciado**'
  
  return sendDiscordNotification(alertMessage, [embed])
}

// Notification when someone starts the test
export async function notifyTestStart() {
  const embed: DiscordEmbed = {
    title: '🧪 Alguém Iniciou o Teste',
    color: 0x06B6D4, // Cyan
    footer: { text: 'Mente Caótica' },
    timestamp: new Date().toISOString()
  }
  
  return sendDiscordNotification('', [embed])
}

// Notification when someone reaches checkout
export async function notifyCheckoutVisit() {
  const embed: DiscordEmbed = {
    title: '🛒 Alguém Entrou no Checkout!',
    description: 'Um lead qualificado está na página de pagamento',
    color: 0xF59E0B, // Amber
    footer: { text: 'Mente Caótica - Checkout' },
    timestamp: new Date().toISOString()
  }
  
  return sendDiscordNotification('👀 **Possível venda a caminho!**', [embed])
}

