// src/components/SaveChangesOverlay.tsx
'use client'

import { Button } from '@ui/button'
import { CheckCircle2, CircleDot, Loader2, Save, X } from 'lucide-react'

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
  submitLabel = 'Save Changes',
}: SaveChangesOverlayProps) => {
  return (
    <div className="sticky bottom-0 -mx-5 -mb-5 bg-card border-t border-border px-10 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        {isDirty ? (
          <>
            <CircleDot className="w-3.5 h-3.5 text-signature-peach shrink-0" />
            <span className="text-sm text-text">Unsaved changes</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-success-border shrink-0" />
            <span className="text-sm text-text">All changes saved</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onCancel && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="text-muted-foreground"
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
