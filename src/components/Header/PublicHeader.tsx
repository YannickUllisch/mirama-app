'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import Container from '@src/components/ui/container'
import Link from 'next/link'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import mirageLogoWhite from '@public/logo/mirage-logo-white.png'
import Image from 'next/image'
import { Button } from '@src/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

const PublicHeader = () => {
  const [logo, setLogo] = useState(mirageLogoWhite)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (theme === 'light') {
      setLogo(mirageLogoBlack)
    } else {
      setLogo(mirageLogoWhite)
    }
  }, [theme])

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black sm:flex sm:justify-between py-1 px-4 border-b dark:border-neutral-800">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Link href={DEFAULT_LOGIN_REDIRECT} className="ml-4 lg:ml-0">
              <Image height={30} src={logo} alt={'Logo'} />
            </Link>
          </div>
          <div className="flex items-center">
            <Button
              variant={'ghost'}
              size={'icon'}
              className="mr-6"
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Link href={'/auth/login'} className="mr-4">
              <Button variant={'ghost'}>Sign In</Button>
            </Link>
            <Link href={'/auth/register'}>
              <Button
                variant={'destructive'}
                className="bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default PublicHeader
