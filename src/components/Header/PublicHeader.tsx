'use server'
import { Button } from '@src/components/ui/button'
import type { Session } from 'next-auth'
import Link from 'next/link'
import ToggleTheme from '../Footer/ToggleTheme'

const PublicHeader = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 bg-background z-50 sm:flex py-1 px-4 mx-auto ">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">.mirama</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ToggleTheme height="4" width="4" />
          <Link href={'/contact'}>
            <Button variant={'ghost'}>Contact</Button>
          </Link>
          {session ? (
            <Link href={'/app'}>
              <Button
                variant="default"
                className="hover:bg-secondary dark:hover:bg-secondary"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href={'/auth/login'}>
              <Button
                variant="default"
                className="hover:bg-secondary dark:hover:bg-secondary"
              >
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
