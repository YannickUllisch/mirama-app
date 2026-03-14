import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  Activity,
  ArrowRight,
  Box,
  CheckCircle2,
  GanttChartSquare,
  LayoutGrid,
  Sparkles,
  Zap,
} from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[850px] flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Grid with Radial Mask - Fades out towards the edges to prevent "boxing" */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(circle at center, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 30%, transparent 80%)',
          }}
        />

        {/* Sweep Lines: Decorative background ribbons */}
        <div className="absolute top-[20%] -left-20 w-[120%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-12" />
        <div className="absolute top-[60%] -left-20 w-[120%] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent -rotate-6" />

        {/* Low-Opacity Metadata Lines */}
        <div className="absolute top-1/4 left-10 text-[8px] font-mono text-primary/20 rotate-90 tracking-[1em] uppercase whitespace-nowrap">
          Structural_Integrity_v2.0 / Latency_Shield_Active
        </div>
        <div className="absolute bottom-1/3 right-10 text-[8px] font-mono text-accent/20 -rotate-90 tracking-[1em] uppercase whitespace-nowrap">
          Data_Stream_0049_Verified
        </div>
      </div>

      {/* Hero Content Wrapper */}
      <div className="flex-1 container mx-auto px-6 flex items-center">
        {/* Added gap-24 for significant space between text and widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center w-full">
          {/* --- Left Column: Text --- */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  v2.0 Project Engine
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
                Streamline <br />
                <span className="text-primary italic font-serif">
                  Execution
                </span>
              </h1>
            </div>

            <p className="max-w-md text-xl text-muted-foreground font-light leading-relaxed italic border-l-4 border-accent pl-6 bg-gradient-to-r from-accent/5 to-transparent py-2">
              A high-performance project and task management solution. Plan,
              track, and deliver complex work with technical precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button className="h-12 px-8 bg-secondary text-secondary-foreground font-black text-[11px] uppercase tracking-[0.2em] rounded-none shadow-[6px_6px_0px_0px_hsl(var(--accent))] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                Start Building
                <Zap className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-12 px-6 font-black text-[11px] uppercase tracking-[0.2em] group transition-colors"
              >
                View Specs
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* --- Right Column: The Widget --- */}
          <div className="lg:col-span-7 relative group animate-in fade-in zoom-in-75 duration-1000 lg:ml-8">
            {/* Asymmetric Structural Frames (Backing) */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-primary/5 rounded-[3rem] rotate-3 border-2 border-dashed border-primary/20 -z-10 group-hover:rotate-1 transition-transform duration-700" />
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-accent/5 rounded-[3rem] -rotate-2 border-2 border-dashed border-accent/20 -z-10 group-hover:rotate-0 transition-transform duration-700" />

            {/* Main Visual "Window" */}
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2.5rem] border-2 border-border bg-card shadow-2xl flex flex-col">
              {/* Internal Mockup Header */}
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-4">
                  <GanttChartSquare className="w-5 h-5 text-primary" />
                  <div className="h-2 w-24 bg-primary/20 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent/40" />
                  <div className="w-2 h-2 rounded-full bg-primary/40" />
                </div>
              </div>

              {/* Internal UI Schematic - High Density Detail */}
              <div className="p-8 flex-1 flex flex-col gap-8 overflow-hidden">
                <div className="grid grid-cols-12 gap-8 h-full">
                  {/* --- Left Column: Task Queue --- */}
                  <div className="col-span-7 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          Active_Sprint_Backlog
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground/60">
                        ID: SF-204
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="relative group border-2 border-primary/20 bg-background/50 p-4 rounded-xl hover:border-primary/50 transition-all">
                        <div className="absolute top-0 right-0 p-2">
                          <Badge
                            variant="outline"
                            className="text-[8px] border-primary/20 text-primary h-4 px-1 rounded-sm"
                          >
                            P0
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <div className="h-2.5 w-3/4 bg-primary/20 rounded-full" />
                          </div>
                          <div className="pl-7 space-y-2">
                            <div className="h-1.5 w-full bg-muted/40 rounded-full" />
                            <div className="flex gap-4">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-accent/40" />
                                <div className="h-1 w-12 bg-muted/40 rounded-full" />
                              </div>
                              <div className="h-1 w-16 bg-muted/20 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-2 border-dashed border-border/60 bg-muted/5 p-4 rounded-xl opacity-80">
                        <div className="flex items-start gap-3">
                          <div className="w-4 h-4 border-2 border-muted rounded-md mt-0.5" />
                          <div className="flex-1 space-y-3">
                            <div className="h-2 w-1/2 bg-muted rounded-full" />
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className="h-1 w-full bg-muted/30 rounded-full" />
                              <div className="h-1 w-3/4 bg-muted/30 rounded-full" />
                              <div className="h-1 w-2/3 bg-muted/30 rounded-full" />
                              <div className="h-1 w-full bg-muted/30 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/10 rounded-lg p-3 border border-border/40 font-mono">
                      <div className="flex justify-between text-[8px] text-primary/60 uppercase mb-2">
                        <span>System_Log</span>
                        <span>100% Sync</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <span className="text-accent text-[8px] tracking-tighter">
                            [OK]
                          </span>
                          <div className="h-1 w-24 bg-muted/30 rounded-full mt-1" />
                        </div>
                        <div className="flex gap-2">
                          <span className="text-primary text-[8px] tracking-tighter">
                            [UPD]
                          </span>
                          <div className="h-1 w-32 bg-muted/30 rounded-full mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- Right Column: Metrics --- */}
                  <div className="col-span-5 space-y-6">
                    <div className="bg-primary/[0.03] border-2 border-primary/10 rounded-2xl p-4 flex flex-col h-full relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-primary uppercase block">
                            Velocity_Matrix
                          </span>
                          <span className="text-[8px] font-mono text-muted-foreground">
                            Rolling 7-day
                          </span>
                        </div>
                        <Activity className="w-4 h-4 text-accent animate-pulse" />
                      </div>

                      <div className="relative h-32 w-full flex items-end gap-2 border-b border-l border-primary/10 pl-2 pb-2">
                        {[40, 65, 35, 95, 55, 85, 70].map((h, i) => (
                          <div key={i} className="relative flex-1 group/bar">
                            <div
                              style={{ height: `${h}%` }}
                              className="w-full bg-primary/20 group-hover/bar:bg-primary/40 transition-all rounded-t-sm"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex justify-between text-[9px] font-black text-foreground uppercase tracking-tighter">
                          <span>Milestone_Q1</span>
                          <span className="text-primary">82%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-[2px] border border-border">
                          <div className="h-full bg-accent w-[82%] rounded-full shadow-[0_0_8px_hsl(var(--accent)/0.4)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Overlay */}
              <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-border shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                  Live Syncing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full py-5 bg-primary -rotate-1 bottom-10 z-100 translate-y-4">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-primary-foreground text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Task Management <Box className="w-3 h-3 text-accent" />
              Sprint Velocity <Sparkles className="w-3 h-3" />
              Resource Allocation <LayoutGrid className="w-3 h-3" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
