import { BehanceIcon, GithubIcon, LinkedinIcon } from '@src/lib/CompanyIcons'
import { ArrowUpRight, Box } from 'lucide-react'
import Link from 'next/link'
import GridDecoration from '../Background/GridDecoration'

const footerRoutes = {
  information: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  compliance: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/termsofservice' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socials = [
  {
    icon: <GithubIcon width="25" height="25" />,
    href: 'https://github.com/yannickullisch',
  },
  {
    icon: <LinkedinIcon width="25" height="25" />,
    href: 'https://linkedin.com/in/yannickullisch',
  },
  {
    icon: <BehanceIcon width="25" height="25" />,
    href: 'https://behance.net/aprex',
  },
]
export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-background pt-20 pb-10 overflow-hidden relative">
      <GridDecoration size="30" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(59,130,246,0.2)]">
                <Box className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter">
                MIRAMA<span className="text-primary">.</span>
              </span>
            </div>

            <p className="max-w-sm text-muted-foreground text-sm font-light italic leading-relaxed border-l-2 border-tertiary pl-6">
              A high-fidelity workspace designed to turn complex roadmaps into
              finished projects. Built for teams that value{' '}
              <span className="text-foreground font-medium">
                clarity, speed, and effortless collaboration.
              </span>
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-border flex items-center justify-center hover:bg-tertiary hover:text-white transition-all group shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            {/* Information Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Information
              </h4>
              <ul className="space-y-4">
                {footerRoutes.information.map((route) => (
                  <li key={route.name}>
                    <Link
                      href={route.href}
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-tertiary flex items-center gap-1 group"
                    >
                      {route.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Compliance
              </h4>
              <ul className="space-y-4">
                {footerRoutes.compliance.map((route) => (
                  <li key={route.name}>
                    <Link
                      href={route.href}
                      className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-tertiary flex items-center gap-1 group"
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specs Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Frontend Stack
              </h4>
              <p className="text-[10px] font-mono text-muted-foreground leading-loose">
                CORE: NEXT_JS_15
                <br />
                STYLE: TAILWIND_V4
                <br />
                DB: POSTGRES_EDGE, REDIS.IO
                <br />
                STATUS: DEV_STABLE_V2.0
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
                System Stable
              </span>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground/40 italic">
              v2.0.0_PRODUCTION
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
