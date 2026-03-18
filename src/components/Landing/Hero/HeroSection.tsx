import { MiramaRibbon } from '@src/components/Background/Ribbon'
import { Activity, Box, Sparkles, Zap } from 'lucide-react'
import HeroBackground from './HeroBackground'
import HeroScreenWidget from './HeroScreenWidget'
import HeroTextElements from './HeroTextElements'

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen lg:h-screen flex flex-col justify-between overflow-hidden">
      <HeroBackground />

      <div className="flex-1 flex flex-col lg:flex-row items-center w-full pt-20 lg:pt-0">
        <HeroTextElements />

        <HeroScreenWidget />
      </div>

      <MiramaRibbon
        variant="secondary"
        rotation={-1}
        centered={false}
        className="z-40"
      >
        <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.5em] mx-12 lg:mx-16 flex items-center gap-5">
          Task Management
          <Box className="w-3 h-3 lg:w-4 lg:h-4 text-accent" />
          Sprint Planning
          <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
        </span>
      </MiramaRibbon>

      <MiramaRibbon
        variant="accent"
        rotation={0}
        centered={false}
        className="z-20"
      >
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4">
          Automated Infrastructure
          <Zap className="w-3.5 h-3.5" />
          Real-time Sync
          <Activity className="w-3.5 h-3.5" />
          Core Module v2.0
          <Box className="w-3.5 h-3.5" />
        </span>
      </MiramaRibbon>
    </section>
  )
}

export default HeroSection
