import { NextRequest, NextResponse } from 'next/server'
import { notifyVisit, notifyTestStart, notifyCheckoutVisit, notifyLeadCapture } from '@/lib/discord'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, data } = body
    
    const userAgent = req.headers.get('user-agent') || undefined
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined

    switch (event) {
      case 'page_visit':
        await notifyVisit(data?.page || '/', userAgent, ip)
        break
      
      case 'test_start':
        await notifyTestStart()
        break
      
      case 'checkout_visit':
        await notifyCheckoutVisit()
        break
      
      case 'lead_capture':
        await notifyLeadCapture({
          name: data.name,
          whatsapp: data.whatsapp,
          score: data.score,
          level: data.level,
          topCategory: data.topCategory
        })
        break
      
      default:
        return NextResponse.json({ error: 'Unknown event' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}

