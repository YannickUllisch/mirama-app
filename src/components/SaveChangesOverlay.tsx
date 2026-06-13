// src/components/SaveChangesOverlay.tsx
'use client'

import { Button } from '@ui/button'
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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-10 py-3 flex items-center justify-between gap-4" style={{ left: 'var(--sidebar-width, 0px)' }}>
      <div className="flex items-center gap-2.5">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all duration-300 ${
            isDirty ? 'bg-lava/15 text-text' : 'bg-white/8 text-text/70'
          }`}
        >
          {isDirty ? (
            <span className="w-1.5 h-1.5 rounded-full bg-lava animate-pulse shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
          )}
          <span>{isDirty ? 'Unsaved changes' : 'All changes saved'}</span>
        </div>
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
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={!isDirty || isPending}
          onClick={onSubmit}
          className="min-w-28"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}

export default SaveChangesOverlay
