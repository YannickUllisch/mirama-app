'use client'

import { Button } from '@ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
