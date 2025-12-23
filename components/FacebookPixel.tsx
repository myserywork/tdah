'use client'

import { useEffect } from 'react'

const FB_PIXEL_ID = '1194474569538928'

export default function FacebookPixel() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    // Check if already loaded
    if ((window as any).fbq) return

    // Create fbq function
    const fbq = function(...args: any[]) {
      if ((fbq as any).callMethod) {
        (fbq as any).callMethod.apply(fbq, args)
      } else {
        (fbq as any).queue.push(args)
      }
    } as any
    
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    
    ;(window as any).fbq = fbq
    ;(window as any)._fbq = fbq

    // Load the Facebook SDK
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    
    script.onload = () => {
      // Initialize pixel after SDK loads
      ;(window as any).fbq('init', FB_PIXEL_ID)
      ;(window as any).fbq('track', 'PageView')
    }
    
    // Insert script
    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    } else {
      document.head.appendChild(script)
    }

    // Cleanup
    return () => {
      // Don't remove on cleanup as it might break other pages
    }
  }, [])

  return null
}

