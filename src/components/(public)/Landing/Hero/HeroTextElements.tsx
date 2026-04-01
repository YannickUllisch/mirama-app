import HoverLink from '@src/components/HoverLink'
import { Button } from '@ui/button'
import { Mail, Zap } from 'lucide-react'

const HeroTextElements = () => {
  return (
    <div className="w-full lg:w-[45%] flex justify-center lg:justify-start items-center px-6 md:px-12 lg:pl-32 xl:pl-52 z-20 animate-in fade-in slide-in-from-left-8 duration-1000">
      <div className="max-w-xl space-y-8 text-center lg:text-left">
        <div className="space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="w-8 lg:w-12 h-1 bg-accent" />
            <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-primary">
              v2.0 Project Engine
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black text-foreground tracking-tighter leading-[0.85] uppercase">
            Streamline <br />
            <span className="text-primary italic font-serif">Execution</span>
          </h1>
        </div>

        <p className="max-w-md mx-auto lg:mx-0 text-base md:text-lg text-muted-foreground font-light leading-relaxed italic border-l-4 border-accent pl-6 lg:pl-8 bg-linear-to-r from-accent/5 to-transparent py-4 text-left">
          A streamlined project engine built for growing modern teams. Map out your entire strategy and ship every feature with complete confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
          <HoverLink href={'/auth/login'}>
            <Button className="w-full sm:w-auto h-14 px-10 bg-secondary text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-none shadow-[8px_8px_0px_0px_hsl(var(--accent))] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Start Today <Zap className="ml-2 w-5 h-5 fill-current" />
            </Button>
          </HoverLink>
          <HoverLink href={'/contact'}>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 px-10 border-2 border-primary/20 bg-background/50 font-black text-[12px] uppercase tracking-[0.2em] rounded-none hover:bg-primary/5 transition-all"
            >
              Contact Us <Mail className="ml-2 w-5 h-5 opacity-70" />
            </Button>
          </HoverLink>
        </div>
      </div>
    </div>
  )
}

export default HeroTextElements
