import { ArrowUpRight, Box, Dribbble, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-background border-t-4 border-primary pt-20 pb-10 overflow-hidden relative">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent flex items-center justify-center">
                <Box className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter">
                .mirama
              </span>
            </div>
            <p className="max-w-sm text-muted-foreground text-sm font-light italic leading-relaxed border-l-2 border-[#3b82f6] pl-6">
              A high-precision framework for institutional-grade project
              execution. Built for teams that prioritize structural certainty.
            </p>

            {/* Social Matrix */}
            <div className="flex gap-4">
              {[
                { icon: <Github className="w-4 h-4" />, href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                { icon: <Dribbble className="w-4 h-4" />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 border border-border flex items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-all group shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Matrix */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Information
              </h4>
              <ul className="space-y-4">
                {['About Us', 'Case Studies', 'Executive Team'].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#3b82f6] flex items-center gap-1 group"
                    >
                      {link}{' '}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Compliance
              </h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#3b82f6] flex items-center gap-1 group"
                      >
                        {link}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Regional
              </h4>
              <p className="text-[10px] font-mono text-muted-foreground leading-loose">
                HQ_NORTH_AMERICA
                <br />
                EST_OPERATIONS_2024
                <br />
                LATENCY_OPTIMIZED
              </p>
            </div>
          </div>
        </div>

        {/* Footer Base */}
        <div className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/50">
            © {currentYear} .MIRAMA OPERATIONS. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                System_Stable
              </span>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground/40 italic">
              v2.0.44_BUILD
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
