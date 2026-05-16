'use client'

import { Button } from '@ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const OnboardingPage = () => {
  const { update } = useSession()
  const router = useRouter()

  const onCompletedOnboarding = async () => {
    await update({ isOnboarded: true })
    router.push('/portal')
  }
  return <Button onClick={onCompletedOnboarding}>Finish Onboarding</Button>
}

export default OnboardingPage
