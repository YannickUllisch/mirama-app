import { Button } from '@ui/button'
import type { Session } from 'next-auth'
import Link from 'next/link'

const ModernPublicHeader = async ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Modern Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-[#3b82f6] rounded-sm transform group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute inset-0 border border-white/20 rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            mirama<span className="text-[#3b82f6]">.</span>
          </span>
        </Link>

        {/* Minimal Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {['Features', 'Solutions', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[13px] font-medium text-slate-500 hover:text-[#3b82f6] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:block text-[13px] font-medium text-slate-600 hover:text-slate-900 mr-2"
          >
            Contact
          </Link>

          {session ? (
            <Link href="/app">
              <Button className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold rounded-full transition-all shadow-lg shadow-slate-200">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="h-10 px-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-semibold rounded-full transition-all shadow-lg shadow-blue-100">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default ModernPublicHeader
