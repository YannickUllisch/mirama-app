'use client'
import type { FC } from 'react'
import { LandingBentoBox } from '@src/components/Landing/BentoBox'
import { CallToAction } from '@src/components/Landing/CallToAction'
import { LandingView } from '@src/components/Landing/LandingView'
import { LandingFAQ } from '@src/components/Landing/FAQ'
import { ScrollAnimationWrapper } from '@src/components/Landing/ScrollWrapper'

const LandingPage: FC = () => {
  return (
    <>
      <ScrollAnimationWrapper>
        <LandingView />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <LandingBentoBox />
      </ScrollAnimationWrapper>

      {/* <ScrollAnimationWrapper>
        <FeaturesShowcase />
      </ScrollAnimationWrapper> */}

      {/* <ScrollAnimationWrapper>
        <ThemeShowcase />
      </ScrollAnimationWrapper> */}

      <ScrollAnimationWrapper>
        <LandingFAQ />
      </ScrollAnimationWrapper>

      <CallToAction />
    </>
  )
}

export default LandingPage
