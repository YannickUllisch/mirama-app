'use server'
import Link from 'next/link'
import { Button } from '@src/components/ui/button'
import type { Session } from 'next-auth'
import ToggleTheme from '../Footer/ToggleTheme'

const PublicHeader = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-50 sm:flex py-1 px-4 mx-auto w-full max-w-8xl">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">.mirage</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ToggleTheme height="4" width="4" />
          <Link href={'/contact'} passHref>
            <Button variant={'ghost'}>Contact Us</Button>
          </Link>
          {session ? (
            <Link href={'/app'} passHref>
              <Button variant={'auth'}>Dashboard</Button>
            </Link>
          ) : (
            <Link href={'/auth/login'} passHref>
              <Button variant={'auth'}>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
