'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import Container from '@src/components/ui/container'
import Link from 'next/link'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import mirageLogoWhite from '@public/logo/mirage-logo-white.png'
import Image from 'next/image'
import { Button } from '@src/components/ui/button'

const PublicHeader = () => {
  const [logo, setLogo] = useState(mirageLogoWhite)
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'light') {
      setLogo(mirageLogoBlack)
    } else {
      setLogo(mirageLogoWhite)
    }
  }, [theme])

  return (
    <header className="sticky top-0 z-50 sm:flex sm:justify-between py-1 px-4">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Link href={'/'} className="ml-4 lg:ml-0">
              <Image height={30} src={logo} alt={'Logo'} />
            </Link>
          </div>
          <div className="flex items-center">
            <Link href={'/auth/login'} passHref legacyBehavior>
              <Button variant={'ghost'} className="hover:bg-neutral-200 mr-4">
                Sign In
              </Button>
            </Link>
            <Link href={'/auth/register'} passHref legacyBehavior>
              <Button
                variant={'destructive'}
                className="bg-orange-500 hover:bg-orange-400 dark:bg-orange-600 dark:hover:bg-orange-500"
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
