'use server'
import Link from 'next/link'
import { Button } from '@src/components/ui/button'
import { Leaf } from 'lucide-react'
import type { Session } from 'next-auth'
import type { FC } from 'react'

const PublicHeader: FC<React.PropsWithChildren<{ session: Session | null }>> =
  async ({ session }) => {
    return (
      <header className="sticky top-0 backdrop-blur-sm z-50 sm:flex py-1 px-4 mx-auto w-full max-w-8xl">
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Link
              href={'/'}
              className="md:ml-4  sm:ml-0 lg:ml-0 flex gap-2 items-start"
            >
              <span className="font-semibold" style={{ fontSize: 30 }}>
                MIRAGE.
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <Link href={'/app'} passHref legacyBehavior>
                <Button
                  variant={'destructive'}
                  className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={'/auth/login'} passHref legacyBehavior>
                  <Button
                    variant={'ghost'}
                    className="hover:bg-neutral-200 mr-4"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href={'/auth/register'} passHref legacyBehavior>
                  <Button
                    variant={'destructive'}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    )
  }

export default PublicHeader
