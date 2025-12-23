export const GA_TRACKING_ID = 'G-CX2GBYKFPM'

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Pre-defined events for easy tracking
export const trackEvents = {
  // Test events
  testStarted: () => event({ action: 'test_started', category: 'engagement' }),
  testCompleted: (score: number) => event({ action: 'test_completed', category: 'engagement', value: score }),
  questionAnswered: (questionNumber: number) => event({ action: 'question_answered', category: 'engagement', label: `question_${questionNumber}` }),
  
  // Lead events
  leadCaptured: () => event({ action: 'lead_captured', category: 'conversion' }),
  
  // Checkout events
  checkoutStarted: () => event({ action: 'begin_checkout', category: 'ecommerce' }),
  paymentMethodSelected: (method: string) => event({ action: 'payment_method_selected', category: 'ecommerce', label: method }),
  orderBumpAdded: (bump: string, value: number) => event({ action: 'order_bump_added', category: 'ecommerce', label: bump, value }),
  orderBumpRemoved: (bump: string) => event({ action: 'order_bump_removed', category: 'ecommerce', label: bump }),
  purchaseCompleted: (value: number) => event({ action: 'purchase', category: 'ecommerce', value }),
  purchaseFailed: (reason: string) => event({ action: 'purchase_failed', category: 'ecommerce', label: reason }),
  
  // CTA clicks
  ctaClicked: (ctaName: string) => event({ action: 'cta_clicked', category: 'engagement', label: ctaName }),
  
  // Scroll depth
  scrollDepth: (percentage: number) => event({ action: 'scroll_depth', category: 'engagement', value: percentage }),
}

