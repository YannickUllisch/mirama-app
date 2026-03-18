import { ArrowRight, Github, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'

export const ModernPublicFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#3b82f6] rounded-sm" />
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                mirama.
              </span>
            </Link>
            <p className="max-w-xs text-slate-500 text-[15px] leading-relaxed">
              Streamlining complex workflows with an intuitive, modern interface
              designed for the next generation of teams.
            </p>
            <div className="flex gap-5 pt-2">
              {[Github, Linkedin, Linkedin, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-slate-400 hover:text-[#3b82f6] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav Links Matrix */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-5">
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3">
                {['Features', 'Integrations', 'Pricing', 'Changelog'].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-[14px] text-slate-500 hover:text-[#3b82f6] transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  'About Us',
                  'Privacy Policy',
                  'Terms of Service',
                  'Cookie Policy',
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-[14px] text-slate-500 hover:text-[#3b82f6] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider">
                Subscribe
              </h4>
              <p className="text-[14px] text-slate-500">
                Get the latest updates directly.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
                <button className="absolute right-2 top-1.5 p-1 text-slate-400 group-focus-within:text-[#3b82f6] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} Mirama. All rights reserved.
          </p>
          <div className="flex gap-6 text-[12px] font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
