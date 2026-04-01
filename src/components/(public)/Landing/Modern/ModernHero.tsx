import { Button } from '@ui/button'
import {
  Activity,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layout,
  MoreHorizontal,
  Network,
  Search,
  ShieldCheck,
  Users2,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

const ModernHero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden bg-white">
      {/* --- BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* The Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1.5px, transparent 1.5px), linear-gradient(90deg, #3b82f6 1.5px, transparent 1.5px)`,
            backgroundSize: '45px 45px',
          }}
        />
        {/* Soft Radial Depth */}
        <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-linear-to-bl from-blue-50/50 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: STRATEGIC TEXT */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Manage <br />
                <span className="text-[#3b82f6]">everything</span> <br />
                in one place.
              </h1>
              <p className="text-lg text-slate-500 font-light leading-relaxed border-l-2 border-blue-100 pl-4">
                The streamlined workspace for modern studios. From task tracking
                to financial overviews—modeled for clarity, built for speed.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/signup">
                <Button className="h-14 px-8 bg-slate-900 hover:bg-[#3b82f6] text-white text-[14px] font-bold rounded-xl transition-all shadow-xl shadow-slate-200">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  className="h-14 px-6 text-slate-600 font-bold text-[14px] hover:bg-slate-50"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: THE ENHANCED DASHBOARD MODEL */}
          <div className="lg:col-span-8 relative h-[600px]">
            <div className="absolute top-0 left-0 w-[140%] h-full">
              {/* THE WINDOW FRAME */}
              <div className="relative w-full h-full bg-white rounded-3xl border border-slate-200 shadow-[0_50px_100px_rgba(0,0,0,0.1)] flex overflow-hidden">
                {/* 1. Sidebar (Matched to your Screenshot) */}
                <div className="w-56 border-r border-slate-100 bg-slate-50/30 flex flex-col">
                  <div className="p-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#3b82f6] rounded-full" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-slate-900">
                      .mirama
                    </span>
                  </div>

                  <nav className="p-4 space-y-1 flex-1">
                    {[
                      {
                        label: 'Dashboard',
                        icon: <Layout className="w-4 h-4" />,
                        active: true,
                      },
                      {
                        label: 'Projects',
                        icon: <Briefcase className="w-4 h-4" />,
                      },
                      {
                        label: 'My Tasks',
                        icon: <CheckCircle2 className="w-4 h-4" />,
                      },
                      {
                        label: 'Calendar',
                        icon: <Calendar className="w-4 h-4" />,
                      },
                      { label: 'Finances', icon: <Zap className="w-4 h-4" /> },
                      { label: 'Teams', icon: <Users2 className="w-4 h-4" /> },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-2.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${item.active ? 'bg-white shadow-xs text-[#3b82f6] border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}
                      >
                        {item.icon}
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* 2. Content (Enhanced version of your image) */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Global Search Bar */}
                  <div className="h-14 border-b border-slate-50 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 w-2/3 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-400">
                        Search projects, tasks, and client files...
                      </span>
                    </div>
                    <Bell className="w-4 h-4 text-slate-300" />
                  </div>

                  {/* Dashboard View */}
                  <div className="p-8 space-y-8 overflow-y-auto">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          Dashboard
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium italic">
                          Sunday, March 15, 2026
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                      {/* Recent Projects (Left Side) */}
                      <div className="col-span-7 space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                            Recent Projects{' '}
                            <span className="text-[#3b82f6] ml-1">1</span>
                          </h3>
                          <Button
                            variant="ghost"
                            className="h-7 text-[10px] font-bold bg-slate-50"
                          >
                            View All
                          </Button>
                        </div>

                        {/* Project Card */}
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 border-l-[#3b82f6] hover:shadow-md transition-shadow">
                          <div className="flex justify-between mb-4">
                            <span className="text-sm font-bold text-slate-900">
                              Mirama Launch
                            </span>
                            <MoreHorizontal className="w-4 h-4 text-slate-300" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <Calendar className="w-3 h-3" /> Oct 1 — Jan 23,
                              2026
                            </div>
                            <div className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-fit italic">
                              Overdue
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-900">
                              View Project
                            </span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Timeline Graphic */}
                        <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4 relative overflow-hidden">
                          <h3 className="text-[11px] font-black uppercase text-slate-400">
                            Project Timeline
                          </h3>
                          <div className="h-6 w-full bg-[#3b82f6] rounded-full relative shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <div className="absolute -top-1 left-4 w-3 h-3 bg-white border-2 border-[#3b82f6] rounded-full" />
                            <div className="absolute -top-1 left-1/2 w-3 h-3 bg-white border-2 border-[#3b82f6] rounded-full" />
                            <div className="absolute -top-1 right-8 w-3 h-3 bg-white border-2 border-[#3b82f6] rounded-full" />
                          </div>
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase italic">
                            <span>Refactor Start</span>
                            <span>Refactor Finish</span>
                            <span>Add more features</span>
                          </div>
                        </div>
                      </div>

                      {/* My Tasks (Right Side) */}
                      <div className="col-span-5 space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                            My Tasks{' '}
                            <span className="text-red-400 ml-1">2</span>
                          </h3>
                          <Button className="h-7 bg-red-500 hover:bg-red-600 text-white text-[9px] font-bold uppercase rounded-md">
                            + New Task
                          </Button>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] min-h-[300px] space-y-6">
                          <div className="flex gap-4 border-b border-slate-50 pb-4">
                            <span className="text-[10px] font-black text-slate-900 border-b-2 border-slate-900 pb-4">
                              Active (1)
                            </span>
                            <span className="text-[10px] font-black text-slate-300">
                              Upcoming
                            </span>
                            <span className="text-[10px] font-black text-slate-300">
                              Completed
                            </span>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 mt-0.5 group-hover:border-[#3b82f6]" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-900">
                                Story Test Phase 1
                              </p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Due Oct 12, 2025
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING DECORATION: ACTIVE FEED */}
              <div className="absolute -bottom-6 right-20 z-30 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce duration-5000">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Systems Normal
                  </p>
                  <p className="text-xs font-bold">12 Nodes Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE MOVING RIBBON (BOTTOM) --- */}
      <div className="relative mt-auto py-6 bg-slate-900 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-12">
              <span className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4 text-[#3b82f6]" /> Institutional
                Grade Security
              </span>
              <span className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <Zap className="w-4 h-4 text-[#3b82f6]" /> Real-time Task
                Precision
              </span>
              <span className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <Activity className="w-4 h-4 text-[#3b82f6]" /> Performance
                Engine v2
              </span>
              <span className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                <Network className="w-4 h-4 text-[#3b82f6]" /> Scaling
                Architecture
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ModernHero
