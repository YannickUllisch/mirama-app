'use client'

import {
  SidebarProvider,
  useSidebar,
} from '@src/components/ui/sidebar'
import { cn } from '@src/lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_WIDTH = 220
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 224
// Dragging the extender left past this point fully collapses the sidebar
// instead of just clamping the width at MIN_WIDTH.
const COLLAPSE_THRESHOLD = MIN_WIDTH - 60

interface PmSidebarProviderProps {
  children: React.ReactNode
}

const PmSidebarProvider = ({ children }: PmSidebarProviderProps) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH)

  return (
    <SidebarProvider
      className="h-screen overflow-hidden bg-sidebar"
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      {children}
      <PmSidebarResizeHandle onWidthChange={setWidth} />
    </SidebarProvider>
  )
}

interface PmSidebarResizeHandleProps {
  onWidthChange: (width: number) => void
}

const PmSidebarResizeHandle = ({
  onWidthChange,
}: PmSidebarResizeHandleProps) => {
  const { state, setOpen } = useSidebar()
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
        if (clientX < COLLAPSE_THRESHOLD) {
          stopResizing()
          setOpen(false)
          return
        }
        onWidthChange(Math.min(Math.max(clientX, MIN_WIDTH), MAX_WIDTH))
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
  }, [stopResizing, setOpen, onWidthChange])

  // Nothing to drag once fully collapsed - reopen via the trigger instead.
  if (state === 'collapsed') return null

  return (
    <button
      type="button"
      aria-label="Resize sidebar navigation"
      onMouseDown={startResizing}
      style={{ left: 'var(--sidebar-width)' }}
      className="group fixed inset-y-0 z-20 hidden w-3 -translate-x-1/2 cursor-col-resize touch-none lg:block"
    >
      <span
        className={cn(
          'mx-auto block h-full w-0.5 bg-transparent transition-colors duration-150 mask-[linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)] group-hover:bg-lava/40',
          isResizing && 'bg-lava/60',
        )}
      />
    </button>
  )
}

export default PmSidebarProvider
