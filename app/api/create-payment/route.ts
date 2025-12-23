import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import { notifyPayment } from '@/lib/discord'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      paymentMethod, 
      amount, 
      email, 
      name,
      cpf,
      phone,
      orderBumps,
      // Card data for transparent checkout
      token,
      installments,
      issuerId,
      paymentMethodId
    } = body

    // Calculate total with order bumps
    let total = amount
    if (orderBumps) {
      if (orderBumps.coaching) total += 47
      if (orderBumps.community) total += 27
      if (orderBumps.templates) total += 17
    }

    // For PIX payment
    if (paymentMethod === 'pix') {
      const payment = new Payment(client)
      
      const result = await payment.create({
        body: {
          transaction_amount: total,
          description: 'Guia Mente Caótica + Life OS',
          payment_method_id: 'pix',
          payer: {
            email: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '',
            identification: {
              type: 'CPF',
              number: cpf.replace(/\D/g, '')
            }
          }
        }
      })

      // Send Discord notification
      await notifyPayment({
        name,
        email,
        amount: total,
        method: 'pix',
        status: result.status || 'pending',
        paymentId: result.id?.toString(),
        orderBumps
      })

      return NextResponse.json({
        success: true,
        paymentId: result.id,
        status: result.status,
        qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
        expirationDate: result.date_of_expiration
      })
    }

    // For Credit Card (transparent checkout)
    if (paymentMethod === 'credit_card' && token) {
      const payment = new Payment(client)
      
      const result = await payment.create({
        body: {
          transaction_amount: total,
          token: token,
          description: 'Guia Mente Caótica + Life OS',
          installments: installments || 1,
          payment_method_id: paymentMethodId,
          issuer_id: issuerId,
          payer: {
            email: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '',
            identification: {
              type: 'CPF',
              number: cpf.replace(/\D/g, '')
            }
          }
        }
      })

      // Send Discord notification
      await notifyPayment({
        name,
        email,
        amount: total,
        method: 'credit_card',
        status: result.status || 'pending',
        paymentId: result.id?.toString(),
        orderBumps
      })

      return NextResponse.json({
        success: true,
        paymentId: result.id,
        status: result.status,
        statusDetail: result.status_detail
      })
    }

    // For Boleto
    if (paymentMethod === 'boleto') {
      const payment = new Payment(client)
      
      const result = await payment.create({
        body: {
          transaction_amount: total,
          description: 'Guia Mente Caótica + Life OS',
          payment_method_id: 'bolbradesco',
          payer: {
            email: email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '',
            identification: {
              type: 'CPF',
              number: cpf.replace(/\D/g, '')
            }
          }
        }
      })

      // Cast to any to access barcode property that exists in API but not in types
      const resultAny = result as any

      // Send Discord notification
      await notifyPayment({
        name,
        email,
        amount: total,
        method: 'boleto',
        status: result.status || 'pending',
        paymentId: result.id?.toString(),
        orderBumps
      })

      return NextResponse.json({
        success: true,
        paymentId: result.id,
        status: result.status,
        boletoUrl: result.transaction_details?.external_resource_url,
        barcode: resultAny.barcode?.content
      })
    }

    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })

  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json({ 
      error: 'Payment failed', 
      details: error.message 
    }, { status: 500 })
  }
}

