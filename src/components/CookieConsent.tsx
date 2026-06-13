'use client'

import { cn } from '@src/lib/utils'
import { Cookie, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export default function CookieConsent({
  variant = 'default',
  demo = false,
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hide, setHide] = useState(false)

  const accept = () => {
    setIsOpen(false)
    document.cookie =
      'cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT'
    setTimeout(() => setHide(true), 700)
    onAcceptCallback()
  }

  const decline = () => {
    setIsOpen(false)
    setTimeout(() => setHide(true), 700)
    onDeclineCallback()
  }

  useEffect(() => {
    try {
      setIsOpen(true)
      if (document.cookie.includes('cookieConsent=true')) {
        if (!demo) {
          setIsOpen(false)
          setTimeout(() => setHide(true), 700)
        }
      }
    } catch (e) {
      console.error('Error: ', e)
    }
  }, [demo])

  if (hide) return null

  const wrapperClass = cn(
    'fixed z-50 bottom-0 left-0 right-0 sm:left-5 sm:bottom-5 w-full sm:max-w-sm duration-500',
    !isOpen
      ? 'transition-[opacity,transform] translate-y-4 opacity-0 pointer-events-none'
      : 'transition-[opacity,transform] translate-y-0 opacity-100',
  )

  if (variant === 'small') {
    return (
      <div className={wrapperClass}>
        <div className="m-3 sm:m-0 bg-canvas border border-hairline rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-dark">
                <Cookie className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-sm font-medium text-ink">Cookie preferences</p>
            </div>
            <button
              type="button"
              onClick={decline}
              className="text-muted-foreground hover:text-ink transition-colors mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="px-4 pb-4 text-sm text-body-text leading-relaxed">
            We use cookies to improve your experience. See our{' '}
            <a href="/cookies" className="text-mirama hover:underline">
              cookie policy
            </a>
            .
          </p>
          <div className="px-4 pb-4 flex items-center gap-2">
            <Button
              onClick={accept}
              size="sm"
              variant="primary"
              className="flex-1"
            >
              Accept all
            </Button>
            <Button
              onClick={decline}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <div className="m-3 sm:m-0 bg-canvas border border-hairline rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-dark">
            <Cookie className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-medium text-ink">We use cookies</p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-body-text leading-relaxed">
            We use cookies to ensure you get the best experience on our website.
            For more information on how we use cookies, please see our cookie
            policy.
          </p>
          <p className="text-xs text-muted-foreground">
            By clicking{' '}
            <span className="font-medium text-ink">"Accept all"</span>, you
            agree to our use of cookies.{' '}
            <a href="/cookies" className="text-mirama hover:underline">
              Learn more
            </a>
          </p>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-hairline bg-surface-soft">
          <Button onClick={accept} variant="primary" className="flex-1">
            Accept all
          </Button>
          <Button onClick={decline} variant="secondary" className="flex-1">
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}
