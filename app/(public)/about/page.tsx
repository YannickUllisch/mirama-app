import HoverLink from '@src/components/HoverLink'
import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import { Separator } from '@src/components/ui/separator'
import GridDecoration from '@src/modules/shared/components/Background/GridDecoration'
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Cloud,
  Code2,
  InfinityIcon,
  Network,
  Terminal,
  Zap,
} from 'lucide-react'

const AboutUsPage = () => {
  return (
    <main className="relative w-full overflow-hidden text-foreground">
      <GridDecoration size="40" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge
              variant="outline"
              className="bg-primary text-white border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-1"
            >
              Lab_Manifesto_v2.4
            </Badge>

            <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] uppercase text-center">
              The Tech <br />
              <span className="text-blue-600 italic font-serif">
                Playground.
              </span>
            </h1>

            <div className="max-w-4xl text-left space-y-6 mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed italic border-l-4 border-red-500 pl-8">
                &ldquo;Mirama is a technical playground that is constantly
                alive. Originally built for a design startup, it has become my
                personal sandbox for architectural exploration. A space to test
                cloud infrastructure, AI integration and the limits of real-time
                web performance.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHASE 1: THE FOUNDATION (RED THEME) --- */}
      <section className="py-24 relative px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden bg-red-600 rounded-4xl p-8 md:p-16 shadow-[20px_20px_0px_0px_rgba(220,38,38,0.1)] border-4 border-red-700">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23fff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-8 text-white">
                <div className="flex items-center gap-3 text-red-100">
                  <InfinityIcon className="w-5 h-5" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
                    Phase_01: Standalone_Pragmatism
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  Next.js & <br />
                  <span className="text-red-200 italic font-serif">
                    Cognito Auth.
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-red-50 font-light leading-relaxed">
                  <p>
                    The first phase was about speed and efficiency. Built as a
                    standalone application, it allowed me to master{' '}
                    <strong>SSR, PPR, and Component Streaming</strong>. I
                    integrated <strong>AWS Cognito</strong> for secure identity
                    flows and optimized the frontend for{' '}
                    <strong>Optimistic Updates</strong>, ensuring a zero-latency
                    feel across Vercel and AWS deployments.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {[
                  'Optimistic_UI',
                  'Cognito_Auth',
                  'CI/CD_Vercel',
                  'AWS_Infra',
                ].map((label, i) => (
                  <div
                    key={i}
                    className="bg-red-500/50 p-6 border border-white/20 flex items-center justify-center text-center"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHASE 2: IN DEVELOPMENT (BLUE THEME) --- */}
      <section className="py-24 relative px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative group overflow-hidden bg-blue-600 rounded-4xl p-8 md:p-16 shadow-[20px_20px_0px_0px_rgba(59,130,246,0.1)] border-4 border-blue-700">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M36 34v-4H20v4h16zm0 2H20v4h16v-4zM6 34v-4H0v4h6zm0 2H0v4h6v-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-8 text-white">
                <div className="flex items-center gap-3">
                  <Terminal className="text-white w-5 h-5" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-blue-100">
                    Phase_02: Research_&_Development {/* [IN_PROGRESS] */}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                  ASP.NET & <br />
                  <span className="text-blue-200 italic font-serif">
                    Dockerized Services.
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-blue-50 font-light leading-relaxed">
                  <p>
                    I am currently evolving Mirama into a{' '}
                    <strong>Microservices Architecture</strong>. Using{' '}
                    <strong>ASP.NET and Docker</strong>, I am emulating
                    real-world system growth. Moving from a standalone app to a
                    distributed ecosystem.
                  </p>
                  <p>
                    This phase is a testing ground for{' '}
                    <strong>Cloud AI Engineering</strong> and service-specific
                    architectures. I’m implementing{' '}
                    <strong>Layered Architecture</strong> for Authorization and{' '}
                    <strong>Clean Architecture/Vertical Slices</strong> for
                    domain-heavy services like Account and Task Management.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Cloud />,
                      label: 'Cloud Infra',
                      color: 'bg-blue-500',
                    },
                    {
                      icon: <BrainCircuit />,
                      label: 'AI Insights',
                      color: 'bg-blue-400',
                    },
                    {
                      icon: <Network />,
                      label: 'Microservices',
                      color: 'bg-blue-800',
                    },
                    {
                      icon: <Activity />,
                      label: 'Stateless JWT',
                      color: 'bg-blue-700',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`${item.color} p-6 border border-white/20 flex flex-col items-center justify-center text-center gap-3 transition-transform hover:-translate-y-1`}
                    >
                      <div className="text-white w-6 h-6">{item.icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl space-y-16">
          <div className="space-y-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-1 bg-blue-600" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-foreground">
                Engineering Philosophy
              </h3>
            </div>
            <h4 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Architecture should serve the{' '}
              <span className="text-blue-600 italic">problem</span>, not the{' '}
              <span className="text-red-500 italic">ego.</span>
            </h4>
            <div className="text-muted-foreground font-light text-xl leading-relaxed italic">
              <p className="mb-6">
                I believe in making decisions that help the system work well,
                rather than showing off complexity. Mirama follows a
                Backend-for-Frontend (BFF) model to keep the frontend organized
                while I explore more complex event-driven microservices in the
                background.
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 p-8 border-l-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10">
              <Zap className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Optimistic State
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                Advanced caching ensures the UI stays ahead of the server,
                providing a tactile, responsive feel to every interaction.
              </p>
            </div>
            <div className="space-y-4 p-8 border-l-2 border-red-500 bg-red-50 dark:bg-red-900/10">
              <Code2 className="w-8 h-8 text-red-500 mb-2" />
              <h4 className="text-xl font-black uppercase tracking-tighter">
                Clean Domain Logic
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                Utilizing Vertical Slices to ensure features stay isolated,
                testable, and maintainable as requirements evolve.
              </p>
            </div>
          </div>

          <div className="bg-secondary text-background p-12 md:p-16 rounded-tr-[5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Explore the <br />
                <span className="text-blue-400 italic font-serif">
                  Laboratory
                </span>
              </h3>
              <p className="max-w-xl text-lg font-light opacity-80 leading-relaxed">
                Take a look around. This is a work in progress, a constant
                iteration, and a testament to my love for building complex,
                beautiful systems.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <HoverLink href="/auth/register">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[11px] tracking-[0.3em] h-14 px-10 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                    Create Account <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </HoverLink>
                <HoverLink href="https://docs.yannickullisch.com">
                  <Button
                    variant="default"
                    className="border-white/20 text-white hover:bg-white/10 font-black uppercase text-[11px] tracking-[0.3em] h-14 px-10 rounded-none"
                  >
                    View Docs
                  </Button>
                </HoverLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutUsPage
