import GridDecoration from '@src/components/(public)/Background/GridDecoration'
import { Badge } from '@ui/badge'
import { Activity, Cpu, HardDrive } from 'lucide-react'

const TermsOfServicesPage = () => {
  const lastUpdated = 'MARCH 18, 2026'

  const clauses = [
    {
      id: '01',
      title: 'LICENSE PROVISION',
      icon: <Cpu className="w-5 h-5 text-blue-600" />,
      content:
        'We grant you a non-exclusive, revocable license to use this task management engine for internal business operations. Reverse engineering of the core logic is strictly prohibited.',
    },
    {
      id: '02',
      title: 'DATA INTEGRITY',
      icon: <HardDrive className="w-5 h-5 text-red-500" />,
      content:
        'You retain ownership of all project metadata. However, you grant us the right to process this data to ensure system stability and cross-node synchronization.',
    },
    {
      id: '03',
      title: 'SYSTEM UPTIME',
      icon: <Activity className="w-5 h-5 text-slate-800" />,
      content:
        'While we architect for 99.9% availability, we are not liable for latency or data desync caused by external network failures or local workstation issues.',
    },
  ]

  return (
    <main className="relative w-full overflow-hidden py-24 lg:py-32">
      <GridDecoration size="40" />

      {/* Background Coordinate Markers */}
      <div className="absolute top-10 left-10 text-[10px] font-mono text-blue-500/30 rotate-90 select-none uppercase tracking-[0.5em]">
        LEGAL_FRAMEWORK / V2.0
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-red-500/30 select-none tracking-widest">
        ENFORCEMENT_NODE: 0x992B
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER SECTION */}
        <header className="relative flex flex-col items-center text-center mb-24">
          <Badge
            variant="outline"
            className="bg-blue-600 text-white border-white px-5 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-lg rotate-1 mb-8"
          >
            Operating Agreement
          </Badge>

          <h1 className="text-6xl lg:text-9xl font-black text-foreground tracking-tighter leading-[0.8] mb-8 uppercase">
            Terms of <br />
            <span className="text-red-500 italic font-serif">Service</span>
          </h1>
          <p className="max-w-xl text-xl text-muted-foreground font-light leading-relaxed italic border-l-4 border-red-500 pl-8 text-left">
            &ldquo;This document defines the structural boundaries of our
            collaboration. By accessing the engine, you agree to these
            operational constraints.&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <span>Active Since: {lastUpdated}</span>
          </div>
        </header>

        <div className="max-w-5xl mx-auto space-y-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clauses.map((clause) => (
              <div
                key={clause.id}
                className="relative p-8 border-2 border-border bg-card shadow-xl overflow-hidden group hover:border-blue-600 transition-all"
              >
                <div className="absolute top-0 right-0 p-2 text-[40px] font-black text-blue-500/5 leading-none select-none">
                  {clause.id}
                </div>
                <div className="mb-6">{clause.icon}</div>
                <h3 className="text-lg font-black uppercase mb-4 tracking-tighter">
                  {clause.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {clause.content}
                </p>
              </div>
            ))}
          </div>

          {/* DETAILED ARTICLES */}
          <div className="space-y-32">
            {/* Article 04 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                  <div className="text-red-500 font-black text-4xl">04.</div>
                  <h2 className="text-xl font-black uppercase tracking-widest">
                    Security <br />
                    Protocols
                  </h2>
                  <div className="w-12 h-1 bg-red-500" />
                </div>
              </div>
              <div className="lg:col-span-8 space-y-6 text-muted-foreground font-light leading-relaxed text-lg italic">
                <p>
                  User accounts are protected by multi-factor authentication
                  protocols. You are solely responsible for maintaining the
                  confidentiality of your access keys and node credentials.
                </p>
                <p>
                  Any unauthorized access or security breach must be reported to
                  the system administrator within 24 hours of detection to
                  prevent cascading data integrity failures.
                </p>
              </div>
            </div>

            {/* Article 05 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 text-right order-last lg:order-first">
                <div className="sticky top-24 space-y-4">
                  <div className="text-blue-600 font-black text-4xl">05.</div>
                  <h2 className="text-xl font-black uppercase tracking-widest">
                    Termination <br />
                    Logic
                  </h2>
                  <div className="w-12 h-1 bg-blue-600 ml-auto" />
                </div>
              </div>
              <div className="lg:col-span-8 space-y-6 text-muted-foreground font-light leading-relaxed text-lg italic border-r-4 border-blue-600 pr-8 text-right">
                <p>
                  We reserve the right to terminate or suspend access to the
                  engine immediately, without prior notice or liability, for any
                  reason whatsoever, including without limitation if you breach
                  the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease
                  immediately. If you wish to terminate your account, you may
                  simply discontinue using the Service.
                </p>
              </div>
            </div>

            {/* Article 06 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                  <div className="text-slate-800 font-black text-4xl">06.</div>
                  <h2 className="text-xl font-black uppercase tracking-widest">
                    Governing <br />
                    Directives
                  </h2>
                  <div className="w-12 h-1 bg-slate-800" />
                </div>
              </div>
              <div className="lg:col-span-8 space-y-6 text-muted-foreground font-light leading-relaxed text-lg italic">
                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws of the jurisdiction in which the provider operates,
                  without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights. If any
                  provision is held to be invalid by a court, the remaining
                  provisions will remain in effect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TermsOfServicesPage
