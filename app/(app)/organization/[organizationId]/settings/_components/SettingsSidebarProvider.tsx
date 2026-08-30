// app/(app)/organization/[organizationId]/settings/_components/SettingsSidebarProvider.tsx
'use client'

import { SidebarProvider } from '@src/components/animate-ui/components/radix/sidebar'
import { cn } from '@src/lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_WIDTH = 220
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 224

interface SettingsSidebarProviderProps {
  children: React.ReactNode
}

const SettingsSidebarProvider = ({
  children,
}: SettingsSidebarProviderProps) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const isResizingRef = useRef(false)
  const frameRef = useRef<number | null>(null)

  const stopResizing = useCallback(() => {
    isResizingRef.current = false
    setIsResizing(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const startResizing = useCallback(() => {
    isResizingRef.current = true
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      const clientX = e.clientX
      frameRef.current = requestAnimationFrame(() => {
        setWidth(Math.min(Math.max(clientX, MIN_WIDTH), MAX_WIDTH))
      })
    }
    const handleMouseUp = () => {
      if (isResizingRef.current) stopResizing()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [stopResizing])

  return (
    <SidebarProvider
      className="flex h-screen overflow-hidden"
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      {children}
      <button
        type="button"
        aria-label="Resize settings navigation"
        onMouseDown={startResizing}
        style={{ left: 'var(--sidebar-width)' }}
        className="fixed inset-y-0 z-20 hidden w-3 -translate-x-1/2 cursor-col-resize touch-none lg:block"
      >
        <span
          className={cn(
            'mx-auto block h-full w-px bg-transparent transition-colors duration-150 hover:bg-lava/40',
            isResizing && 'bg-lava/60',
          )}
        />
      </button>
    </SidebarProvider>
  )
}

export default SettingsSidebarProvider
