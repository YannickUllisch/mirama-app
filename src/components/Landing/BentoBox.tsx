import { Badge } from '@ui/badge'
import {
  Activity,
  Box,
  ClipboardCheck,
  Clock,
  MessageSquare,
  Users,
  Zap,
} from 'lucide-react'

export const LandingBentoBox = () => (
  <section className="relative w-full overflow-hidden">
    {/* --- Top Ribbon (Reversed Direction) --- */}
    <div className="relative w-full py-4 bg-accent rotate-1 shadow-xl top-2 z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-accent-foreground text-[9px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
          >
            Automated Infrastructure <Zap className="w-3 h-3" />
            Real-time Sync <Activity className="w-3 h-3" />
            Core Module v2.0 <Box className="w-3 h-3" />
          </span>
        ))}
      </div>
    </div>

    <div className="w-full py-24 lg:py-32 relative">
      {/* Background Blueprint Grid (Faded) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="flex gap-6 flex-col items-start border-l-4 border-primary pl-8">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary font-mono text-[10px] uppercase tracking-widest rounded-none bg-primary/5"
            >
              System_Capabilities
            </Badge>
            <div className="flex gap-4 flex-col">
              <h2 className="text-4xl md:text-6xl tracking-tighter max-w-2xl font-black uppercase leading-[0.9]">
                Engineered for <br />
                <span className="text-primary italic font-serif">
                  Peak Productivity
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl font-light italic leading-relaxed">
                A high-performance toolkit designed to eliminate friction and
                enforce technical precision across your entire project
                lifecycle.
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Team Collaboration (Large) */}
            <div className="group relative lg:col-span-2 overflow-hidden border-2 border-border bg-card p-8 flex flex-col justify-between min-h-[350px]">
              {/* Internal Schematic UI Artifacts */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="flex gap-1">
                  <div className="w-8 h-1 bg-primary" />
                  <div className="w-2 h-1 bg-accent" />
                </div>
              </div>

              <Users className="w-10 h-10 text-primary mb-8" />
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Team Synchronization
                </h3>
                <p className="text-muted-foreground max-w-md font-light italic border-l border-primary/30 pl-4">
                  Deploy shared task environments with real-time state
                  persistence and streamlined peer-to-peer workflows.
                </p>
              </div>
              {/* Asymmetric Frame Effect inside bento */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            </div>

            {/* Feature 2: Task Automation */}
            <div className="group border-2 border-border bg-card p-8 flex flex-col justify-between aspect-square hover:border-primary/50 transition-colors">
              <ClipboardCheck className="w-10 h-10 text-accent" />
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Logic Automation
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Offload repetitive operational overhead to our autonomous
                  task-triggering engine.
                </p>
              </div>
            </div>

            {/* Feature 3: Time Tracking */}
            <div className="group border-2 border-border bg-card p-8 flex flex-col justify-between aspect-square hover:border-primary/50 transition-colors">
              <Clock className="w-10 h-10 text-primary" />
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Velocity Tracking
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Monitor sprint progress with granular, time-series insights
                  and real-time performance metrics.
                </p>
              </div>
            </div>

            {/* Feature 4: Communication (Large) */}
            <div className="group relative lg:col-span-2 overflow-hidden border-2 border-border bg-card p-8 flex flex-col justify-between min-h-[350px]">
              {/* Asymmetric Structural Frames (Mirroring Hero) */}
              <div className="absolute -top-6 -right-6 w-1/2 h-full bg-accent/5 rounded-[3rem] rotate-3 border-2 border-dashed border-accent/10 -z-10" />

              <MessageSquare className="w-10 h-10 text-accent mb-8" />
              <div className="space-y-4 relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Communication Bus
                </h3>
                <p className="text-muted-foreground max-w-md font-light italic border-l border-accent/30 pl-4">
                  Unified thread-based collaboration designed to minimize
                  context switching and maximize signal-to-noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
