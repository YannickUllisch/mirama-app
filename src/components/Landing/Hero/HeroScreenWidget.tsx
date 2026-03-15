import { Button } from '@ui/button'
import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  FolderOpen,
  LayoutDashboard,
  Search,
  Sparkles,
  Users2,
} from 'lucide-react'
import { DateTime } from 'luxon'

const HeroScreenWidget = () => {
  return (
    <div className="w-full lg:w-[55%] h-full flex justify-end items-center relative mt-16 lg:mt-0 pb-32 lg:pb-0">
      <div className="relative w-[95%] lg:w-full max-w-[800px] h-[500px] lg:h-[600px] group animate-in fade-in slide-in-from-right-12 duration-1000">
        <div className="absolute -bottom-6 -left-6 right-0 h-full bg-primary/10 border-2 border-dashed rounded-l-[3.5rem] -rotate-1 border-secondary/20 -z-10 group-hover:rotate-0 transition-transform duration-700" />

        <div className="relative w-full h-full overflow-hidden rounded-l-[3.5rem] border-y-2 border-l-2 border-border bg-card shadow-[-50px_50px_100px_rgba(0,0,0,0.15)] flex">
          {/* Sidebar */}
          <div className="w-48 bg-background flex flex-col py-6 z-20 shrink-0">
            <div className="px-6 mb-3 flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-foreground">
                  MIRAMA<span className="text-primary">.</span>
                </span>
              </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-primary text-white rounded-lg text-[13px] font-black tracking-widest cursor-pointer shadow-sm">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </div>
              {[
                { icon: Briefcase, label: 'Projects' },
                { icon: CheckCircle2, label: 'My Tasks' },
                { icon: Calendar, label: 'Calendar' },
                { icon: CircleDollarSign, label: 'Finances' },
                { icon: Users2, label: 'Teams' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary/5 hover:text-secondary rounded-lg text-[13px] font-bold transition-all cursor-pointer group"
                >
                  <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />{' '}
                  {item.label}
                </div>
              ))}

              <div className="pt-6">
                <div className="flex items-center justify-between px-3 py-2 text-muted-foreground text-[11px] font-black uppercase tracking-[0.15em] cursor-pointer">
                  <span>Management</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </div>
                <div className="ml-4 mt-1 space-y-1">
                  <div className="px-3 py-1.5 text-[12px] text-muted-foreground hover:text-secondary cursor-pointer border-l border-border hover:border-secondary transition-all">
                    Company
                  </div>
                  <div className="px-3 py-1.5 text-[12px] text-muted-foreground hover:text-secondary cursor-pointer border-l border-border hover:border-secondary transition-all">
                    Archive
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Parent background matches header */}
            <header className="h-16 px-8 flex items-center justify-between bg-background shrink-0">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                <input
                  disabled
                  placeholder="Search projects..."
                  className="w-full h-10 bg-muted/20 border border-border/50 rounded-full pl-10 pr-4 text-[13px] font-medium outline-none"
                />
              </div>
              <div className="flex items-center gap-5 ml-4">
                <div className="relative">
                  <Bell className="w-5 h-5 text-muted-foreground/40" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border-2 border-white" />
                </div>
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[11px] text-secondary-foreground font-black ring-4 ring-secondary/10">
                  YU
                </div>
              </div>
            </header>

            {/* Inner Dashboard Content */}
            <div className="flex-1 overflow-y-auto rounded-xl bg-card p-8 space-y-8 z-20">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" />
                    <h1 className="text-2xl font-black text-foreground uppercase">
                      Dashboard
                    </h1>
                  </div>
                  <p className="text-[13px] text-muted-foreground font-medium italic">
                    Status: 12 Active Projects
                  </p>
                </div>
                <div className="text-[10px] font-black text-secondary bg-secondary/5 border border-secondary/10 px-4 py-2 rounded-lg tracking-widest uppercase">
                  {DateTime.utc().toFormat('MMMM dd, yyyy')}
                </div>
              </div>

              <div className="flex gap-8">
                {/* Recent Projects Section */}
                <div className="flex-[2] space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      Active Projects{' '}
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-[10px] font-black uppercase tracking-widest bg-white text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground transition-all"
                    >
                      Add Project
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {[
                      {
                        name: 'Brand Refresh 2026',
                        client: 'Mirage.xyz',
                        progress: 75,
                      },
                      {
                        name: 'SaaS Dashboard UI',
                        client: 'MBJH',
                        progress: 40,
                      },
                    ].map((project, i) => (
                      <div
                        key={i}
                        className="p-5 bg-white border border-border/60 rounded-2xl hover:border-secondary hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <div className="p-2.5 rounded-xl bg-secondary/5 border border-secondary/10 transition-colors">
                            <FolderOpen className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                            {project.client}
                          </span>
                        </div>
                        <h4 className="text-[14px] font-bold mb-4 truncate text-foreground">
                          {project.name}
                        </h4>
                        <div className="space-y-2">
                          <div className="w-full h-1 bg-muted/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-1000"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <span>Health</span>
                            <span className="text-secondary">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Featured Project Card - Using Accent for Contrast */}
                  <div className="w-full p-6 bg-accent/20 border-2 border-secondary/10 border-dashed rounded-2xl mt-4 relative overflow-hidden group shadow-lg shadow-accent/10">
                    <div className="relative z-10">
                      <span className="text-[10px] font-black text-accent-foreground/60 uppercase tracking-[0.3em]">
                        Critical Action
                      </span>
                      <h4 className="text-accent-foreground text-[18px] font-black mt-1 tracking-tight">
                        Finalize Investor Pitch Deck
                      </h4>
                      <p className="text-accent-foreground/80 text-[13px] mt-2 max-w-[320px] font-medium leading-relaxed">
                        System review of financial projections for the upcoming
                        series B expansion phase.
                      </p>
                      <div className="flex items-center gap-4 mt-6">
                        <button
                          type="button"
                          className="px-5 py-2.5 bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all shadow-md"
                        >
                          Execute Brief
                        </button>
                        <span className="text-[10px] text-accent-foreground/50 font-black uppercase tracking-widest">
                          T-Minus 48 Hours
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-[-40%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroScreenWidget
