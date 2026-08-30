// app/(app)/organization/[organizationId]/settings/_components/ResizableSettingsSidebar.tsx
'use client'

import { cn } from '@src/lib/utils'
import { useIsMobile } from '@src/modules/shared/hooks/utils/use-mobile'
import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_WIDTH = 220
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 256

interface ResizableSettingsSidebarProps {
  children: React.ReactNode
}

const ResizableSettingsSidebar = ({
  children,
}: ResizableSettingsSidebarProps) => {
  const isMobile = useIsMobile()
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
    <div
      style={{ width: isMobile ? 0 : width }}
      className={cn(
        'relative shrink-0 h-full overflow-hidden transition-[width] duration-200 ease-linear',
        isResizing && 'transition-none',
      )}
    >
      {children}
      <button
        type="button"
        aria-label="Resize settings navigation"
        onMouseDown={startResizing}
        className="group absolute inset-y-0 -right-1.5 z-10 w-3 cursor-col-resize touch-none"
      >
        <span
          className={cn(
            'block h-full w-px mx-auto bg-transparent transition-colors duration-150 group-hover:bg-lava/40',
            isResizing && 'bg-lava/60',
          )}
        />
      </button>
    </div>
  )
}

export default ResizableSettingsSidebar
