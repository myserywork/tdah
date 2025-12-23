import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { notifyPayment } from '@/lib/discord'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('payment_id')
    
    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
    }

    const payment = new Payment(client)
    const result = await payment.get({ id: paymentId })

    // If payment was approved, notify Discord
    if (result.status === 'approved') {
      await notifyPayment({
        name: `${result.payer?.first_name || ''} ${result.payer?.last_name || ''}`.trim() || 'Cliente',
        email: result.payer?.email || 'N/A',
        amount: result.transaction_amount || 0,
        method: result.payment_method_id || 'unknown',
        status: 'approved',
        paymentId: result.id?.toString()
      })
    }

    return NextResponse.json({
      status: result.status,
      status_detail: result.status_detail,
      approved: result.status === 'approved'
    })
  } catch (error: any) {
    console.error('Check payment error:', error)
    return NextResponse.json({ 
      error: 'Failed to check payment',
      details: error.message 
    }, { status: 500 })
  }
}

