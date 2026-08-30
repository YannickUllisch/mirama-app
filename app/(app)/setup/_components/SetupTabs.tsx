'use client'

import { useSetup } from './SetupProvider'
import SetupSlider from './SetupSlider'
import SetupStepDots from './SetupStepDots'
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
