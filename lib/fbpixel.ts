export const FB_PIXEL_ID = '1194474569538928'

// Track custom events
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', name, options)
  }
}

// Track custom events with trackCustom
export const customEvent = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', name, options)
  }
}

// Pre-defined Facebook Pixel events
export const fbPixelEvents = {
  // Standard Events
  pageView: () => event('PageView'),
  
  // Lead events
  lead: (data?: { content_name?: string; value?: number; currency?: string }) => 
    event('Lead', data),
  
  completeRegistration: (data?: { content_name?: string; value?: number; currency?: string }) => 
    event('CompleteRegistration', data),
  
  // Checkout events
  initiateCheckout: (data?: { value?: number; currency?: string; content_ids?: string[]; num_items?: number }) => 
    event('InitiateCheckout', {
      value: data?.value || 19.90,
      currency: data?.currency || 'BRL',
      content_ids: data?.content_ids || ['guia-mente-caotica', 'life-os'],
      num_items: data?.num_items || 2,
    }),
  
  addPaymentInfo: (data?: { value?: number; currency?: string; content_ids?: string[] }) => 
    event('AddPaymentInfo', {
      value: data?.value || 19.90,
      currency: data?.currency || 'BRL',
      content_ids: data?.content_ids || ['guia-mente-caotica', 'life-os'],
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
      value: data?.value || 0,
      currency: data?.currency || 'BRL',
    }),
  
  // Custom events for the funnel
  testStarted: () => customEvent('TestStarted'),
  testCompleted: (score: number) => customEvent('TestCompleted', { score }),
  reportViewed: () => customEvent('ReportViewed'),
}

