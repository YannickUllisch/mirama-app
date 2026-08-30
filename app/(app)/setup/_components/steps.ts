// app/(app)/setup/_components/steps.ts
export const SETUP_STEPS = [
  { id: 'profile', label: 'Profile' },
  { id: 'invite', label: 'Invite' },
  { id: 'organization', label: 'Organization' },
] as const

export type SetupStepId = (typeof SETUP_STEPS)[number]['id']
