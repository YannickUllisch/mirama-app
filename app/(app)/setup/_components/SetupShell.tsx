// app/(app)/setup/_components/SetupShell.tsx
'use client'

import { Button } from '@ui/button'
import { useSetup } from './SetupProvider'

type SetupShellProps = {
  title: string
  description: string
  children: React.ReactNode
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  isPending?: boolean
  onSkip?: () => void
}

const SetupShell = ({
  title,
  description,
  children,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  isPending,
  onSkip,
}: SetupShellProps) => {
  const { stepIndex, prevStep } = useSetup()

  return (
    <>
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="text-sm text-body-text mt-1">{description}</p>

      <div className="mt-8 space-y-5">{children}</div>

      <div className="mt-8 flex items-center justify-end gap-4">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={prevStep}
            className="text-sm text-body-text hover:text-ink transition-colors"
          >
            Back
          </button>
        )}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-body-text hover:text-ink transition-colors"
          >
            Skip
          </button>
        )}
        <Button
          type="button"
          variant="primary"
          disabled={continueDisabled || isPending}
          onClick={onContinue}
        >
          {continueLabel}
        </Button>
      </div>
    </>
  )
}

export default SetupShell
