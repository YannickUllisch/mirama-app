import { Button } from '@ui/button'
import { LayoutGrid } from 'lucide-react'
import type { Session } from 'next-auth'
import Link from 'next/link'

const PublicHeader = async ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b-2 border-primary/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-500">
              <LayoutGrid className="w-4 h-4 text-white -rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-foreground">
              .mirama
            </span>
          </Link>

          {/* Engineering Mark */}
          <div className="hidden md:flex items-center gap-2 border-l border-border pl-8">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Ref_System_2026
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex items-center gap-6">
          <Link
            href="/contact"
            className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>

          {session ? (
            <Link href="/app">
              <Button className="h-11 px-6 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-none shadow-[4px_4px_0px_0px_#3b82f6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button className="h-11 px-6 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-none shadow-[4px_4px_0px_0px_#3b82f6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
