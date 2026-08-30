// app/(app)/setup/_components/SetupTabs.tsx
'use client'

import SetupSlider from './SetupSlider'
import SetupStepDots from './SetupStepDots'
import { useSetup } from './SetupProvider'
import InviteStepForm from './steps/InviteStepForm'
import OrganizationStepForm from './steps/OrganizationStepForm'
import ProfileStepForm from './steps/ProfileStepForm'

const SetupTabs = () => {
  const { stepIndex } = useSetup()

  return (
    <>
      <SetupSlider activeIndex={stepIndex}>
        <ProfileStepForm />
        <InviteStepForm />
        <OrganizationStepForm />
      </SetupSlider>
      <SetupStepDots />
    </>
  )
}

export default SetupTabs
