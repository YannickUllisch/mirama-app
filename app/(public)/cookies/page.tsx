import GridDecoration from '@src/components/(public)/Background/GridDecoration'
import HoverLink from '@src/components/HoverLink'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { BarChart3, Globe, Info, Settings2, ShieldCheck } from 'lucide-react'

export default function CookiePolicy() {
  return (
    <main className="relative w-full overflow-hidden py-24 lg:py-32">
      <GridDecoration size="40" />

      <div className="absolute top-10 left-10 text-[10px] font-mono text-blue-500/30 rotate-90 select-none uppercase tracking-widest">
        COMPLIANCE_PROTOCOL / 0xCOOKIE
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-red-500/30 select-none tracking-widest">
        REGION_EU: 55.6761 / 12.5683
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <header className="relative flex flex-col items-center text-center mb-24">
          <Badge
            variant="outline"
            className="bg-red-500 text-white border-white px-5 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 mb-8"
          >
            Data Governance
          </Badge>

          <h1 className="text-6xl lg:text-9xl font-black text-foreground tracking-tighter leading-[0.8] mb-8 uppercase">
            Cookie <br />
            <span className="text-blue-600 italic font-serif">Policy</span>
          </h1>
          <p className="max-w-xl text-xl text-muted-foreground font-light leading-relaxed italic border-x-2 border-blue-500/20 px-8">
            &ldquo;Managing session state with architectural precision. We use
            data packets to ensure your project environment remains stable and
            responsive.&rdquo;
          </p>
          <div className="mt-6 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">
            Revision Log: March 18. 2026
          </div>
        </header>

        <div className="max-w-5xl mx-auto space-y-32">
          {/* SECTION 1 */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-red-500" />
              <h2 className="text-2xl font-black uppercase tracking-widest">
                01. Data Classification
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'STRICTLY NECESSARY',
                  tag: 'CORE_ENGINE',
                  desc: 'Essential for login sessions, security tokens, and project state persistence. Disabling these will break the application.',
                  icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
                },
                {
                  title: 'PERFORMANCE LOGS',
                  tag: 'TELEMETRY',
                  desc: 'Anonymous tracking of task rendering speeds and API latency. Helps us optimize the engine for small business scale.',
                  icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
                },
                {
                  title: 'PREFERENCE STATE',
                  tag: 'UI_CUSTOM',
                  desc: 'Remembers your sidebar toggle, Kanban sort orders, and dark mode settings across different sessions.',
                  icon: <Settings2 className="w-5 h-5 text-slate-800" />,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-8 border-2 border-border bg-card shadow-xl group hover:border-blue-500/50 transition-colors"
                >
                  <div className="mb-6">{item.icon}</div>
                  <div className="text-[10px] font-black uppercase text-blue-600 mb-2">
                    {item.tag}
                  </div>
                  <h3 className="text-lg font-black uppercase mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-blue-600" />
                <h2 className="text-2xl font-black uppercase tracking-widest">
                  02. External Nodes
                </h2>
              </div>
              <p className="text-lg text-muted-foreground font-light italic leading-relaxed border-l-4 border-accent pl-6">
                We utilize a minimal set of third-party services (like Google
                Analytics or Vercel Speed Insights) to monitor system health.
                These "External Nodes" process anonymized data to prevent
                service bottlenecks.
              </p>
              <ul className="space-y-4 font-mono text-xs uppercase tracking-tight text-muted-foreground">
                <li className="flex gap-2">
                  {' '}
                  <span className="text-blue-600 font-bold">[ OK ]</span> No
                  advertising trackers installed
                </li>
                <li className="flex gap-2">
                  {' '}
                  <span className="text-blue-600 font-bold">[ OK ]</span> No
                  third-party data selling
                </li>
                <li className="flex gap-2">
                  {' '}
                  <span className="text-blue-600 font-bold">[ OK ]</span> GDPR /
                  CCPA compliant schema
                </li>
              </ul>
            </div>

            <div className="relative aspect-video border-2 border-dashed border-blue-500/20 rounded-[2.5rem] flex items-center justify-center p-8 bg-blue-500/5">
              <Globe className="absolute w-40 h-40 text-blue-500/10 animate-pulse" />
              <div className="relative text-center space-y-4">
                <Info className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="text-xs font-mono uppercase tracking-widest leading-relaxed">
                  Global_Data_Privacy_Standard <br />
                  <span className="text-muted-foreground">
                    Active_Encryption_Layer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="p-12 border-2 border-foreground bg-secondary text-background rounded-br-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                  Manual Override
                </h2>
                <p className="text-background/80 font-light leading-relaxed italic max-w-xl">
                  You have full control over your browser's data storage. Most
                  workstations allow you to purge cookies via browser settings.
                  Note that purging essential cookies will force an immediate
                  system logout.
                </p>
              </div>

              <div className="flex flex-col gap-4 justify-center">
                <HoverLink href="https://docs.yannickullisch.com/privacy">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/20 hover:bg-white/10 text-white rounded-none uppercase text-[10px] font-black tracking-widest"
                  >
                    Technical Deep-Dive
                  </Button>
                </HoverLink>
                <HoverLink href="/contact" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-none uppercase text-[10px] font-black tracking-widest border-none">
                    Request Data Audit
                  </Button>
                </HoverLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
