'use client'

import { useEffect } from 'react'

const FB_PIXEL_ID = '1194474569538928'

export default function FacebookPixel() {
  useEffect(() => {
    // Inject the exact Meta Pixel code
    const pixelCode = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;

    // Create and execute script
    const script = document.createElement('script')
    script.innerHTML = pixelCode
    document.head.appendChild(script)

    // Also add noscript img for tracking
    const noscript = document.createElement('noscript')
    const img = document.createElement('img')
    img.height = 1
    img.width = 1
    img.style.display = 'none'
    img.src = `https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`
    noscript.appendChild(img)
    document.head.appendChild(noscript)

    console.log('[Meta Pixel] Initialized with ID:', FB_PIXEL_ID)
  }, [])

  return null
}

