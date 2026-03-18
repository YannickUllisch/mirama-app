import { Badge } from '@ui/badge'
import { CheckCircle2, Kanban, MousePointer2, Scan, Zap } from 'lucide-react'
import { SectionDivider } from '../Background/SectionDivider'

export const StrategicOverview = () => {
  const specs = [
    {
      label: 'Performance',
      value: 'Real-Time Sync Between Teams',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      label: 'Framework',
      value: 'Full Agile Lifecycle',
      icon: <Kanban className="w-4 h-4" />,
    },
    {
      label: 'Reliability',
      value: '99.9% Uptime Guaranteed',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ]

  return (
    <section className="relative w-full py-24 lg:py-40 bg-secondary overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '45px 45px',
            maskImage:
              'radial-gradient(circle at center, black 40%, transparent 95%)',
          }}
        />

        <div className="absolute top-20 right-10 text-[8px] font-mono text-white/30 uppercase tracking-[1em] [writing-mode:vertical-rl]">
          WORKFLOW_ENGINE_V1 / 0x2289
        </div>

        <div className="absolute -top-24 -left-20 w-[140%] h-[1px] bg-white/10 -rotate-3" />
        <div className="absolute bottom-40 -left-20 w-[140%] h-[2px] bg-white/5 rotate-6" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="border-white/40 text-white font-mono text-[10px] uppercase tracking-widest rounded-none bg-white/10"
                >
                  Project Management
                </Badge>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                Optimized for <br />
                <span className="italic font-serif text-white/80">
                  Small Team
                </span>{' '}
                <br />
                Efficiency
              </h2>

              <p className="max-w-xl text-lg text-blue-50 font-light italic leading-relaxed border-l-4 border-white/40 pl-8">
                "We don't just track tasks; we accelerate delivery. This system 
                removes the friction from project management, allowing small 
                teams to operate with the discipline of an enterprise-grade organization."
              </p>

              {/* Technical Spec Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-4 border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors"
                  >
                    <div className="text-white/40 mb-3 group-hover:text-white transition-colors">
                      {spec.icon}
                    </div>
                    <div className="text-[9px] font-mono text-blue-200 uppercase tracking-tighter mb-1">
                      {spec.label}
                    </div>
                    <div className="text-sm font-black text-white uppercase">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Artifact */}
            <div className="lg:col-span-5 relative lg:mt-12">
              <div className="relative aspect-square border-2 border-dashed border-white/20 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                {/* Orbitals */}
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-none -translate-x-1/2 -translate-y-1/2 rotate-45" />
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white/20 border border-white rounded-none -translate-x-1/2 translate-y-1/2 rotate-45" />
              </div>

              {/* Center Content Piece */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4">
                <Scan className="w-12 h-12 text-white opacity-20" />
                <div className="space-y-1">
                  <div className="text-white font-black text-2xl tracking-widest uppercase">
                    Results
                  </div>
                  <div className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em]">
                    Project_Complete
                  </div>
                </div>
                <MousePointer2 className="w-5 h-5 text-white animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider direction="left" />
    </section>
  )
}