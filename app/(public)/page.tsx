import { LandingBentoBox } from '@src/components/Landing/BentoBox'
import { CallToAction } from '@src/components/Landing/CallToAction'
import { LandingFAQ } from '@src/components/Landing/FAQ'
import { LandingView } from '@src/components/Landing/LandingView'
import { ScrollAnimationWrapper } from '@src/components/Landing/ScrollWrapper'
import type { FC } from 'react'

const LandingPage: FC = () => {
  return (
    <>
      <ScrollAnimationWrapper>
        <LandingView />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <LandingBentoBox />
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <LandingFAQ />
      </ScrollAnimationWrapper>

      <CallToAction />
    </>
  )
}

export default LandingPage
