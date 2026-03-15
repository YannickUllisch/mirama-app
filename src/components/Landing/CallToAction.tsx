import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  Activity,
  Box,
  ChevronRight,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

export const CallToAction = () => {
  return (
    <section className="relative w-full py-24 lg:py-40 bg-primary overflow-hidden">
      {/* --- BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* White Grid - Low Opacity over the Blue */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '45px 45px',
            maskImage:
              'radial-gradient(circle at center, black 30%, transparent 90%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 30%, transparent 90%)',
          }}
        />

        {/* High-Velocity Sweep Lines */}
        <div className="absolute top-1/2 -left-20 w-[140%] h-[2px] bg-white/20 rotate-12" />
        <div className="absolute top-1/4 -left-20 w-[140%] h-[1px] bg-accent/40 -rotate-6" />

        {/* Technical Artifacts */}
        <div className="absolute top-10 left-10 text-[8px] font-mono text-white/20 uppercase tracking-[1.5em] select-none">
          SYSTEM_TERMINATION_PREVENTED {/* CORE_SYNC_ACTIVE */}
        </div>
      </div>

      {/* --- TOP RIBBON (RED ACCENT) --- */}
      <div className="absolute top-0 w-full py-4 bg-accent rotate-1 z-30 shadow-2xl">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-accent-foreground text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Access Granted <ShieldCheck className="w-3 h-3" />
              Instance Deployment <Terminal className="w-3 h-3" />
              No Credit Card Required <Sparkles className="w-3 h-3" />
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            {/* Left: The Content */}
            <div className="lg:col-span-7 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-[2px] bg-white" />
                <Badge
                  variant="outline"
                  className="border-white/40 text-white font-mono text-[10px] uppercase tracking-widest rounded-none bg-white/5"
                >
                  Phase_04: Deployment
                </Badge>
              </div>

              <h2 className="text-6xl md:text-[5.5rem] font-black text-white tracking-tighter leading-[0.85] uppercase">
                Optimize Your <br />
                <span className="italic font-serif opacity-90">Operations</span>{' '}
                <br />
                <span className="text-accent">Baseline</span>
              </h2>

              <p className="max-w-xl text-xl text-white/80 font-light italic leading-relaxed border-l-4 border-accent pl-8 py-4 bg-white/5 backdrop-blur-sm">
                ""Eliminate organizational friction. We provide the structural
                framework necessary for teams to deliver high-stakes projects
                with absolute certainty.""
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10">
                  <Activity className="w-4 h-4 text-accent animate-pulse" />
                  <span className="text-[10px] font-mono text-white uppercase tracking-widest">
                    Global Status: Operational
                  </span>
                </div>
              </div>
            </div>

            {/* Right: The Red Action Box */}
            <div className="lg:col-span-5 relative group">
              {/* Blue Outline Frame Backing */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-dashed border-white/30 rounded-[2.5rem] rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-500" />

              <div className="relative bg-accent p-12 rounded-[2rem] shadow-[20px_20px_60px_rgba(0,0,0,0.3)] space-y-8 overflow-hidden">
                {/* Visual Artifact */}
                <Box className="absolute -bottom-6 -left-6 w-32 h-32 text-black/5 rotate-12 pointer-events-none" />

                <div className="space-y-6">
                  <h3 className="text-accent-foreground font-black uppercase text-lg tracking-widest border-b border-black/10 pb-4">
                    Tier: Community
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Unlimited Tasks',
                      '3 Team Seats',
                      'Velocity Tracking',
                      'Cloud Sync',
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-accent-foreground/80 text-[11px] font-black uppercase tracking-wider"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6 pt-4">
                  <Button className="w-full h-16 bg-white text-primary font-black text-[13px] uppercase tracking-[0.3em] rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
                    Start Engine <Zap className="w-5 h-5 fill-current" />
                  </Button>
                  <p className="text-center text-[9px] font-mono text-black/40 uppercase tracking-tighter">
                    Kernel_v2.0 {/* Execution_Ready */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM RIBBON (WHITE/BLUE) --- */}
      <div className="absolute bottom-0 w-full py-6 bg-white rotate-[-0.5deg] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Scale Infrastructure <Box className="w-3 h-3 text-accent" />
              Optimize Output <Sparkles className="w-3 h-3" />
              Align Vision <LayoutGrid className="w-3 h-3" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
