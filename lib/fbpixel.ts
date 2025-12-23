export const FB_PIXEL_ID = '1194474569538928'

// Helper to check if fbq is ready
const isFbqReady = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).fbq === 'function'
}

// Track standard events with retry
export const event = (name: string, options = {}) => {
  const track = () => {
    if (isFbqReady()) {
      (window as any).fbq('track', name, options)
      return true
    }
    return false
  }
  
  // Try immediately
  if (!track()) {
    // Retry after a short delay if fbq not ready yet
    setTimeout(() => track(), 500)
    setTimeout(() => track(), 1500)
  }
}

// Track custom events with trackCustom
export const customEvent = (name: string, options = {}) => {
  const track = () => {
    if (isFbqReady()) {
      (window as any).fbq('trackCustom', name, options)
      return true
    }
    return false
  }
  
  if (!track()) {
    setTimeout(() => track(), 500)
    setTimeout(() => track(), 1500)
  }
}

// Pre-defined Facebook Pixel events
export const fbPixelEvents = {
  // Standard Events
  pageView: () => event('PageView'),
  
  // Lead events - IMPORTANT for lead ads
  lead: (data?: { content_name?: string; value?: number; currency?: string }) => 
    event('Lead', {
      content_name: data?.content_name || 'Teste TDAH',
      value: data?.value || 0,
      currency: data?.currency || 'BRL',
    }),
  
  completeRegistration: (data?: { content_name?: string; value?: number; currency?: string }) => 
    event('CompleteRegistration', {
      content_name: data?.content_name || 'Lead Teste TDAH',
      value: data?.value || 0,
      currency: data?.currency || 'BRL',
      status: 'complete'
    }),
  
  // Checkout events
  initiateCheckout: (data?: { value?: number; currency?: string; content_ids?: string[]; num_items?: number }) => 
    event('InitiateCheckout', {
      value: data?.value || 19.90,
      currency: data?.currency || 'BRL',
      content_ids: data?.content_ids || ['guia-mente-caotica', 'life-os'],
      content_type: 'product',
      num_items: data?.num_items || 2,
    }),
  
  addPaymentInfo: (data?: { value?: number; currency?: string; content_ids?: string[] }) => 
    event('AddPaymentInfo', {
      value: data?.value || 19.90,
      currency: data?.currency || 'BRL',
      content_ids: data?.content_ids || ['guia-mente-caotica', 'life-os'],
      content_type: 'product',
    }),
  
  // Purchase event - MOST IMPORTANT for conversion tracking
  purchase: (data: { value: number; currency?: string; content_ids?: string[]; content_name?: string; num_items?: number }) => 
    event('Purchase', {
      value: data.value,
      currency: data.currency || 'BRL',
      content_ids: data.content_ids || ['guia-mente-caotica', 'life-os'],
      content_name: data.content_name || 'Guia Mente Caótica + Life OS',
      content_type: 'product',
      num_items: data.num_items || 2,
    }),
  
  // Content views
  viewContent: (data?: { content_name?: string; content_ids?: string[]; value?: number; currency?: string }) => 
    event('ViewContent', {
      content_name: data?.content_name || 'Teste TDAH',
      content_ids: data?.content_ids || ['teste-tdah'],
      content_type: 'product',
      value: data?.value || 0,
      currency: data?.currency || 'BRL',
    }),
  
  // Custom events for the funnel
  testStarted: () => customEvent('TestStarted', { content_name: 'Teste TDAH' }),
  testCompleted: (score: number) => customEvent('TestCompleted', { score, content_name: 'Teste TDAH' }),
  reportViewed: () => customEvent('ReportViewed', { content_name: 'Relatório TDAH' }),
}
