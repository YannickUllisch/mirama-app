// app/(app)/setup/_components/SetupProvider.tsx
'use client'

import { OrganizationRegion } from '@src/modules/tenant/organization/organization.types'
import type {
  InviteSetupCommand,
  OrganizationSetupCommand,
  ProfileSetupCommand,
} from './setup.types'
import { createContext, useContext, useEffect, useState } from 'react'
import { SETUP_STEPS } from './steps'

type SetupDraft = {
  profile: ProfileSetupCommand
  invites: InviteSetupCommand
  organization: OrganizationSetupCommand
}

type SetupContextValue = {
  avatars: string[]
  draft: SetupDraft
  setProfile: (data: ProfileSetupCommand) => void
  setInvites: (data: InviteSetupCommand) => void
  setOrganization: (data: OrganizationSetupCommand) => void
  stepIndex: number
  goToStep: (index: number) => void
  nextStep: () => void
  prevStep: () => void
}

const SetupContext = createContext<SetupContextValue | null>(null)

export const useSetup = () => {
  const ctx = useContext(SetupContext)
  if (!ctx) throw new Error('useSetup must be used within SetupProvider')
  return ctx
}

const randomAvatar = (avatars: string[]) =>
  avatars.length > 0 ? avatars[Math.floor(Math.random() * avatars.length)] : ''

const SetupProvider = ({
  children,
  avatars,
  initialName,
}: {
  children: React.ReactNode
  avatars: string[]
  initialName: string
}) => {
  const [draft, setDraft] = useState<SetupDraft>({
    profile: { name: initialName, title: '', avatar: '' },
    invites: { emails: [] },
    organization: {
      name: '',
      logo: null,
      region: OrganizationRegion.EuropeanUnion,
      primaryColor: '#000000',
      secondaryColor: '#6b7280',
    },
  })
  const [stepIndex, setStepIndex] = useState(0)

  // Picked client-side only, after hydration - Math.random() during the
  // initial render would differ between server and client and break hydration.
  useEffect(() => {
    setDraft((d) =>
      d.profile.avatar === ''
        ? { ...d, profile: { ...d.profile, avatar: randomAvatar(avatars) } }
        : d,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatars])

  const goToStep = (index: number) =>
    setStepIndex(Math.min(Math.max(index, 0), SETUP_STEPS.length - 1))

  return (
    <SetupContext.Provider
      value={{
        avatars,
        draft,
        setProfile: (profile) => setDraft((d) => ({ ...d, profile })),
        setInvites: (invites) => setDraft((d) => ({ ...d, invites })),
        setOrganization: (organization) =>
          setDraft((d) => ({ ...d, organization })),
        stepIndex,
        goToStep,
        nextStep: () => goToStep(stepIndex + 1),
        prevStep: () => goToStep(stepIndex - 1),
      }}
    >
      {children}
    </SetupContext.Provider>
  )
}

export default SetupProvider
