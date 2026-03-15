import { LandingBentoBox } from '@src/components/Landing/BentoBox'
import { CallToAction } from '@src/components/Landing/CallToAction'
import FeaturesShowcase from '@src/components/Landing/FeaturesShowcase'
import HeroSection from '@src/components/Landing/HeroSection'
import type { FC } from 'react'

const LandingPage: FC = () => {
  return (
    <>
      <HeroSection />

      <LandingBentoBox />

      <FeaturesShowcase />

      <CallToAction />
    </>
  )
}

export default LandingPage
