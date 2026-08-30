// app/(app)/setup/_components/steps/InviteStepForm.tsx
'use client'

import { InviteSetupSchema } from '@src/modules/tenant/setup/setup.types'
import { useState } from 'react'
import EmailTagInput from '../EmailTagInput'
import { useSetup } from '../SetupProvider'
import SetupShell from '../SetupShell'

const InviteStepForm = () => {
  const { draft, setInvites, nextStep } = useSetup()
  const [emails, setEmails] = useState<string[]>(draft.invites.emails)

  const error = InviteSetupSchema.safeParse({ emails }).success
    ? undefined
    : 'Too many invitations'

  const goNext = (finalEmails: string[]) => {
    setInvites({ emails: finalEmails })
    nextStep()
  }

  return (
    <SetupShell
      title="Invite teammates"
      description="Get your team into Mirama"
      onContinue={() => goNext(emails)}
      onSkip={() => goNext([])}
      continueLabel="Send invitations"
    >
      <div className="space-y-2">
        <span className="text-sm font-medium text-ink">Invitations</span>
        <EmailTagInput value={emails} onChange={setEmails} />
        {error && (
          <p className="text-[0.7rem] font-medium text-red-700">{error}</p>
        )}
      </div>
    </SetupShell>
  )
}

export default InviteStepForm
