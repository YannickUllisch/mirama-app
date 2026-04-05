import GridDecoration from '@src/modules/shared/components/Background/GridDecoration'
import { Badge } from '@ui/badge'
import { Activity, Database, Eye, Share2, ShieldCheck } from 'lucide-react'

const PrivacyPolicy = () => {
  const lastUpdated = 'MARCH 18, 2026'

  const dataNodes = [
    {
      id: 'NODE_01',
      title: 'Identity Auth',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      desc: 'Name, account credentials and encrypted authentication tokens required for system entry.',
    },
    {
      id: 'NODE_02',
      title: 'Project Metadata',
      icon: <Database className="w-5 h-5 text-red-500" />,
      desc: 'Task titles, descriptions, and workflow structures generated during active sessions.',
    },
    {
      id: 'NODE_03',
      title: 'Telemetry Logs',
      icon: <Activity className="w-5 h-5 text-slate-800" />,
      desc: 'Anonymized performance metrics, latency logs, and system error reports for optimization.',
    },
  ]

  return (
    <main className="relative w-full overflow-hidden py-24 lg:py-32 bg-background text-foreground">
      <GridDecoration size="40" />

      <div className="absolute top-10 left-10 text-[10px] font-mono text-blue-500/30 rotate-90 select-none uppercase tracking-[0.5em]">
        PRIVACY_SCHEMA {/* 0x441 */}
      </div>
      <div className="absolute bottom-10 right-10 text-[10px] font-mono text-red-500/30 select-none tracking-widest">
        ENCRYPTION: AES_GCM_256
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER SECTION */}
        <header className="relative flex flex-col items-center text-center mb-24">
          <Badge
            variant="outline"
            className="bg-primary text-white border-white px-5 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-1 mb-8"
          >
            Data Architecture
          </Badge>

          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-8 uppercase">
            Privacy <br />
            <span className="text-blue-600 italic font-serif">Policy</span>
          </h1>
          <p className="max-w-xl text-xl text-muted-foreground font-light leading-relaxed italic border-x-2 border-red-500/20 px-8">
            &ldquo;Security is not a feature; it is the foundation. This
            protocol defines how we isolate, encrypt, and manage your
            operational data.&rdquo;
          </p>
          <div className="mt-8 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">
            Last Updated: {lastUpdated}
          </div>
        </header>

        <div className="max-w-5xl mx-auto space-y-32">
          {/* SECTION 1 */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-blue-600" />
              <h2 className="text-2xl font-black uppercase tracking-widest">
                01. Information Intake
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dataNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-8 border-2 border-border bg-card shadow-xl relative group hover:border-blue-500/50 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-muted-foreground/20">
                    {node.id}
                  </div>
                  <div className="mb-6">{node.icon}</div>
                  <h3 className="text-lg font-black uppercase mb-4 tracking-tighter">
                    {node.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 02: UTILIZATION LOGIC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-red-500" />
                <h2 className="text-2xl font-black uppercase tracking-widest">
                  02. Usage Logic
                </h2>
              </div>
              <p className="text-lg text-muted-foreground font-light italic leading-relaxed border-l-4 border-red-500 pl-6">
                Collected data is processed to maintain system integrity,
                resolve synchronization conflicts, and provide real-time updates
                across team nodes.
              </p>
              <div className="pt-4">
                <div className="text-[10px] font-mono text-blue-600 uppercase mb-4 tracking-widest">
                  Authorized_Processes:
                </div>
                <ul className="space-y-3 font-mono text-[11px] uppercase text-muted-foreground">
                  <li className="flex items-center gap-2">
                    {' '}
                    <div className="w-1 h-1 bg-blue-600" /> Latency Optimization
                  </li>
                  <li className="flex items-center gap-2">
                    {' '}
                    <div className="w-1 h-1 bg-blue-600" /> Security Threat
                    Mitigation
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 p-10 border-2 border-dashed border-border rounded-[2.5rem] bg-accent/30 relative overflow-hidden">
              <Eye className="absolute -right-10 -bottom-10 w-40 h-40 text-foreground opacity-[0.03]" />
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                <Share2 className="w-5 h-5 text-blue-600" /> Sharing Constraints
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed italic mb-6">
                We do not sell user data. Sharing is restricted to professional
                infrastructure partners required for core hosting and law
                enforcement only when a legal warrant is validated.
              </p>
              <div className="p-4 bg-background border border-border rounded-xl">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase">
                  <span>Third_Party_Commercial_Sales:</span>
                  <span className="text-red-500 font-black tracking-widest">
                    [ BLOCKED ]
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 03: USER PRIVILEGES */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-slate-800" />
              <h2 className="text-2xl font-black uppercase tracking-widest">
                03. Operator Rights
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-tighter">
                  Data Portability & Erasure
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed italic border-l-4 border-blue-600 pl-6">
                  You maintain the right to export your project metadata or
                  request total node destruction. Erasure requests are processed
                  within 72 hours, resulting in the permanent removal of all
                  associated database records.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-tighter">
                  Security Safeguards
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed italic border-l-4 border-red-500 pl-6">
                  We implement AES-256 encryption at rest and TLS 1.3 in
                  transit. While our security matrix is robust, no architecture
                  is impenetrable. We maintain active monitoring to detect and
                  isolate threats.
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT / ADMIN BLOCK */}
          <div className="p-12 border-2 border-foreground bg-secondary text-background rounded-tr-[4rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                  Admin Contact
                </h2>
                <p className="text-background/70 font-light italic max-w-sm">
                  For data audits or policy inquiries, contact our compliance
                  office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy
