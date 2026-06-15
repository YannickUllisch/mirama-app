// src/components/SaveChangesOverlay.tsx
'use client'

import { Button } from '@ui/button'
import { useSidebar } from '@ui/sidebar'
import { CheckCircle2, Loader2, Save, X } from 'lucide-react'

interface SaveChangesOverlayProps {
  isDirty: boolean
  isPending: boolean
  onSubmit: () => void
  onCancel?: () => void
  submitLabel?: string
}

const SaveChangesOverlay = ({
  isDirty,
  isPending,
  onSubmit,
  onCancel,
  submitLabel = 'Save changes',
}: SaveChangesOverlayProps) => {
  const { state, isMobile } = useSidebar()

  const leftOffset = isMobile
    ? '0px'
    : state === 'collapsed'
      ? 'var(--sidebar-width-icon)'
      : 'var(--sidebar-width)'

  return (
    <div
      className="fixed bottom-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-4 md:px-10 py-3 flex items-center justify-between gap-3 transition-[left] duration-200 ease-linear"
      style={{ left: leftOffset }}
    >
      <div
        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs md:text-sm transition-all duration-300 ${
          isDirty ? 'bg-lava/15 text-text' : 'bg-white/8 text-text/70'
        }`}
      >
        {isDirty ? (
          <span className="w-1.5 h-1.5 rounded-full bg-lava animate-pulse shrink-0" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
        )}
        <span className="hidden sm:inline">
          {isDirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onCancel && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={!isDirty || isPending}
          onClick={onSubmit}
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{submitLabel}</span>
        </Button>
      </div>
    </div>
  )
}

export default SaveChangesOverlay
