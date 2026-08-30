// app/(app)/setup/_components/SetupStepDots.tsx
'use client'

import { cn } from '@src/lib/utils'
import { useSetup } from './SetupProvider'
import { SETUP_STEPS } from './steps'

const SetupStepDots = () => {
  const { stepIndex, goToStep } = useSetup()

  return (
    <div className="mt-10 flex items-center justify-center">
      {SETUP_STEPS.map((step, index) => (
        <button
          key={step.id}
          type="button"
          aria-label={`Go to ${step.label}`}
          aria-current={index === stepIndex}
          onClick={() => goToStep(index)}
          className="group p-2 flex items-center justify-center"
        >
          <span
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === stepIndex
                ? 'w-6 bg-ink'
                : 'w-1.5 bg-hairline group-hover:bg-body-text',
            )}
          />
        </button>
      ))}
    </div>
  )
}

export default SetupStepDots
