import HoverLink from '@src/components/HoverLink'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Activity, Box, ChevronRight, Zap } from 'lucide-react'

export const CallToAction = () => {
  const benefits = [
    'Full Dashboard Access',
    'Collaborative Workspaces',
    'Automated Reporting',
    'Priority Support',
  ]
  return (
    <section className="relative w-full py-24 lg:py-40 bg-primary overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '45px 45px',
            maskImage:
              'radial-gradient(circle at center, black 30%, transparent 90%)',
          }}
        />
        <div className="absolute top-1/2 -left-20 w-[140%] h-[2px] bg-white/20 rotate-12" />
        <div className="absolute top-1/4 -left-20 w-[140%] h-px bg-accent/40 -rotate-6" />

        <div className="absolute top-24 left-10 text-[8px] font-mono text-white/20 uppercase tracking-[1.5em] select-none">
          DESIGNED_FOR_GROWTH */ BUILT_TO_SCALE /*
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="w-16 h-[2px] bg-white" />
                <Badge
                  variant="outline"
                  className="border-white/40 text-white font-mono text-[10px] uppercase tracking-widest rounded-none bg-white/5"
                >
                  Ready for the next level?
                </Badge>
              </div>

              <h2 className="text-6xl md:text-[5.5rem] font-black text-white tracking-tighter leading-[0.85] uppercase">
                Elevate Your <br />
                <span className="italic font-serif opacity-90">Workflow</span>{' '}
                <br />
                <span className="text-accent">Forever</span>
              </h2>

              <p className="max-w-xl text-xl text-white/80 font-light italic leading-relaxed border-l-4 border-accent pl-8 py-4 bg-white/5 backdrop-blur-xs mx-auto lg:mx-0 text-left">
                "Stop fighting your tools and start shipping your best work. We
                provide the clarity your team needs to move faster, stay
                aligned, and hit every deadline with confidence."
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10">
                  <Activity className="w-4 h-4 text-accent animate-pulse" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-widest">
                    Available for all teams
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-dashed border-white/30 rounded-[2.5rem] rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-500" />

              <div className="relative bg-accent p-12 rounded-4xl shadow-[20px_20px_60px_rgba(0,0,0,0.3)] space-y-8 overflow-hidden">
                <Box className="absolute -bottom-6 -left-6 w-32 h-32 text-black/5 rotate-12 pointer-events-none" />

                <div className="space-y-6">
                  <h3 className="text-accent-foreground font-black uppercase text-lg tracking-widest border-b border-black/10 pb-4">
                    Early Access Plan
                  </h3>
                  <ul className="space-y-4">
                    {benefits.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-accent-foreground/80 text-[11px] font-black uppercase tracking-wider"
                      >
                        <ChevronRight className="w-4 h-4 text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6 pt-4">
                  <HoverLink href={'/auth/register'}>
                    <Button className="w-full h-16 bg-white text-primary font-black text-[13px] uppercase tracking-[0.3em] rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
                      Get Started Free <Zap className="w-5 h-5 fill-current" />
                    </Button>
                  </HoverLink>
                  <p className="text-center text-[9px] font-mono text-black/40 uppercase tracking-tighter">
                    Join today / No Setup Fee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 translate-y-px">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[80px] lg:h-[150px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <title>triangle transition</title>
          <path d="M1200 120L0 120 0 0 1200 120z" className="fill-background" />
        </svg>

        <div className="absolute bottom-0 right-0 w-full h-px bg-white/20 -rotate-6 origin-right translate-y-[-10px] lg:translate-y-[-20px]" />
      </div>
    </section>
  )
}
