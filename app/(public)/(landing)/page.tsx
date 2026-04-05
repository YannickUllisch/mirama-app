import { CallToAction } from '@/app/(public)/(landing)/components/CallToAction'
import FeaturesShowcase from '@/app/(public)/(landing)/components/FeaturesShowcase'
import HeroSection from '@/app/(public)/(landing)/components/Hero/HeroSection'
import { StrategicOverview } from '@/app/(public)/(landing)/components/StrategicSection'
import { LayoutGrid, ShieldCheck, Sparkles } from 'lucide-react'
import type { FC } from 'react'

const LandingPage: FC = () => {
  return (
    <>
      <HeroSection />
      <StrategicOverview />
      <FeaturesShowcase />

      {/* Cross Section Ribbon */}
      <div className="relative h-32 w-full z-40 overflow-x-clip">
        <div className="absolute top-32.5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] py-7 bg-secondary -rotate-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-y-2 border-white/20">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="text-white text-[11px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
              >
                Start Free <ShieldCheck className="w-3 h-3 text-accent" />
                Scale Your Team <LayoutGrid className="w-3 h-3 text-accent" />
                Cancel Anytime <Sparkles className="w-3 h-3 text-accent" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <CallToAction />
    </>
  )
}

export default LandingPage
