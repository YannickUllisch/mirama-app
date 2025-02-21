'use client'
import type { FC } from 'react'
import { LandingBentoBox } from '@src/components/Landing/BentoBox'
import { CallToAction } from '@src/components/Landing/CallToAction'
import { LandingView } from '@src/components/Landing/LandingView'
import { LandingFAQ } from '@src/components/Landing/FAQ'

const LandingPage: FC = () => {
  return (
    <>
      <LandingView />

      <LandingBentoBox />

      <LandingFAQ />

      <CallToAction />
    </>
  )
}

export default LandingPage
