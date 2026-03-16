import { Button } from '@ui/button'
import { ArrowUpRight, BoxIcon, Fingerprint, HomeIcon } from 'lucide-react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import MiramaIcon from '../MiramaIcon'

const PublicHeader = async ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border/40">
      <div className="w-full h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-20" />

      <div className="w-full px-8 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 border-2 border-primary rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                <BoxIcon className="w-4 h-4 text-primary group-hover:text-background transition-colors" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-background" />
            </div>
            <MiramaIcon />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/about"
              className="group flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
            >
              About
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/app">
                <Button variant={'neo'}>
                  <span className="relative z-10 flex items-center gap-2">
                    Dashboard <HomeIcon className="w-4 h-4" />
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant={'neo'}>
                  <span className="relative z-10 flex items-center gap-2">
                    Sign In <Fingerprint className="w-4 h-4" />
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
