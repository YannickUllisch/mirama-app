'use server'
import { Button } from '@src/components/ui/button'
import type { Session } from 'next-auth'
import Link from 'next/link'
import HoverLink from '../HoverLink'

const PublicHeader = async ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 bg-background z-50 sm:flex py-1 px-4 mx-auto ">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <HoverLink href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">.mirama</span>
          </HoverLink>
        </div>
        <div className="flex items-center gap-3">
          <HoverLink href={'/contact'}>
            <Button variant={'ghost'}>Contact</Button>
          </HoverLink>
          {session ? (
            <Link href={'/app'}>
              <Button variant="primary" className="hover:bg-secondary">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href={'/auth/login'}>
              <Button variant="primary" className="hover:bg-secondary">
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
