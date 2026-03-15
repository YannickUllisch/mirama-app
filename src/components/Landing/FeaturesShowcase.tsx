import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Activity, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    title: 'KANBAN VIEW',
    description:
      'Visualize your workflow with high-fidelity boards. Drag and drop with zero latency, set adaptive priorities, and scale progress across global teams.',
    image: '/test.png',
    tag: 'AGILE',
  },
  {
    title: 'GANTT ENGINE',
    description:
      'Plan complex dependencies with our sub-millisecond timeline engine. Real-time path optimization and milestone tracking for high-stakes delivery.',
    image: '/test2.png',
    tag: 'STRATEGY',
  },
  {
    title: 'ANALYTICS HUB',
    description:
      'Transform raw project data into executive insights. Track velocity, detect bottlenecks before they happen, and optimize team allocation.',
    image: '/test3.png',
    tag: 'INSIGHTS',
  },
]

const FeaturesShowcase = () => {
  return (
    <section className="relative w-full overflow-hidden py-24 lg:py-20">
      <div
        className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Background Coordinate Markers */}
      <div className="absolute top-10 left-10 text-[10px] font-mono text-blue-500/30 rotate-90 select-none">
        COORD_X: 55.6761
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-red-500/30 select-none">
        COORD_Y: 12.5683
      </div>

      <div className="container mx-auto px-6">
        <header className="relative flex flex-col items-center text-center mb-32">
          <Badge
            variant="outline"
            className="bg-red-500 text-white border-white px-5 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 mb-8 hover:bg-red-600"
          >
            System Specs
          </Badge>

          <h2 className="text-6xl lg:text-9xl font-black text-foreground tracking-tighter leading-[0.8] mb-8">
            ENGINEERED <br />
            <span className="text-blue-600 italic font-serif">EFFICIENCY</span>
          </h2>
          <p className="max-w-xl text-xl text-muted-foreground font-light leading-relaxed italic">
            &ldquo;A technical framework for teams who build the future.
            High-performance project management without the bloat.&rdquo;
          </p>
        </header>

        {/* --- Features Grid --- */}
        <div className="space-y-40">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center group"
            >
              {/* Feature Content */}
              <div
                className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-1 bg-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-4xl lg:text-6xl font-black tracking-tighter text-foreground uppercase">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground font-light leading-relaxed italic border-l-4 border-accent pl-6">
                  {feature.description}
                </p>

                <Button
                  variant="ghost"
                  className="group/btn p-0 h-auto text-[11px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-blue-600 hover:bg-transparent transition-colors"
                >
                  Explore Architecture
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>

              {/* Feature Image with Blueprint Frame */}
              <div
                className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                {/* Asymmetric Red/Blue Frames */}
                <div className="absolute -top-6 -right-6 w-full h-full bg-blue-500/5 rounded-[3rem] rotate-3 border-2 border-dashed border-blue-500/20 -z-10 group-hover:rotate-1 transition-transform duration-500" />
                <div className="absolute -bottom-4 -left-4 w-full h-full bg-red-500/5 rounded-[3rem] -rotate-2 border-2 border-dashed border-red-500/20 -z-10 group-hover:rotate-0 transition-transform duration-500" />

                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border-2 border-border bg-card shadow-2xl">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Digital Overlay UI */}
                  <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-border shadow-sm flex items-center gap-3">
                    <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">
                      Live Matrix
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesShowcase
