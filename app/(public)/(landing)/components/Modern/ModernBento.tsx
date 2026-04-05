import { Badge } from '@ui/badge'
import { BarChart3, Globe, Layout, Users, Zap } from 'lucide-react'

export const LandingBentoBox = () => (
  <section className="relative w-full py-24 overflow-hidden">
    {/* Background Decorative Element */}
    <div className="absolute top-0 right-0 w-125 h-125 bg-blue-50/50 rounded-full blur-[120px] -z-10" />

    <div className="container mx-auto px-6">
      <div className="flex flex-col gap-16">
        {/* Section Header */}
        <div className="max-w-2xl space-y-4">
          <Badge
            variant="outline"
            className="border-[#3b82f6]/20 text-[#3b82f6] font-medium tracking-wide rounded-full bg-blue-50 px-4 py-1"
          >
            Capabilities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Everything you need to <br />
            <span className="text-[#3b82f6]">scale with confidence.</span>
          </h2>
          <p className="text-lg text-slate-500 font-light leading-relaxed">
            A unified workspace built for modern teams who value speed,
            precision, and intuitive design.
          </p>
        </div>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[300px]">
          {/* Card 1: Large Feature (Team) */}
          <div className="group relative md:col-span-6 lg:col-span-8 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 p-8 flex flex-col justify-between hover:border-[#3b82f6]/30 transition-all">
            {/* Visual Spice: Abstract Node Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="absolute -top-10 -right-10 w-64 h-64 text-[#3b82f6]" />
            </div>

            <div className="w-12 h-12 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100 mb-4">
              <Users className="w-6 h-6 text-[#3b82f6]" />
            </div>

            <div className="max-w-md space-y-3 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900">
                Global Collaboration
              </h3>
              <p className="text-slate-500 leading-relaxed font-light">
                Connect your team across borders with real-time state
                persistence and shared environments that move as fast as you do.
              </p>
            </div>
          </div>

          {/* Card 2: Small Feature (Automation) */}
          <div className="group relative md:col-span-3 lg:col-span-4 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-100 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Smart Workflows
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Automate repetitive logic with our intuitive trigger engine.
              </p>
            </div>
          </div>

          {/* Card 3: Small Feature (Metrics) */}
          <div className="group relative md:col-span-3 lg:col-span-4 overflow-hidden rounded-3xl border border-slate-100 bg-slate-900 p-8 flex flex-col justify-between transition-all">
            {/* Dark Card Visual */}
            <div className="absolute inset-0 bg-linear-to-br from-[#3b82f6]/20 to-transparent opacity-50" />
            <BarChart3 className="w-10 h-10 text-[#3b82f6] mb-4 relative z-10" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-bold text-white">
                Velocity Insights
              </h3>
              <p className="text-sm text-slate-400 font-light">
                Monitor your sprint performance with high-fidelity analytics.
              </p>
            </div>
          </div>

          {/* Card 4: Large Feature (UI/Layout) */}
          <div className="group relative md:col-span-6 lg:col-span-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 flex flex-col md:flex-row gap-8 items-center hover:border-[#3b82f6]/30 transition-all">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Custom Dashboards
              </h3>
              <p className="text-slate-500 font-light">
                Tailor your view with modular widgets designed for deep focus
                and minimal context switching.
              </p>
            </div>

            {/* Visual Spice: Mock UI Element */}
            <div className="flex-1 w-full h-full bg-slate-50 rounded-2xl border border-slate-100 p-4 shadow-inner relative overflow-hidden">
              <div className="w-full h-4 bg-white rounded-full mb-3" />
              <div className="w-2/3 h-4 bg-white rounded-full mb-6" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 bg-[#3b82f6]/10 rounded-lg animate-pulse" />
                <div className="h-16 bg-slate-200/50 rounded-lg" />
              </div>
              <div className="absolute -bottom-4 right-4 w-24 h-24 bg-[#3b82f6] rounded-full blur-2xl opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
