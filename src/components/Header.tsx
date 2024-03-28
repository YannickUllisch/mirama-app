'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import Container from './ui/container'
import Link from 'next/link'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import mirageLogoWhite from '@public/logo/mirage-logo-white.png'
import Image from 'next/image'
import { Button } from './ui/button'
import { Menu, Moon, Settings, Sun } from 'lucide-react'
import ProfileButton from './ui/profilebutton'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

const Header = () => {
  const { theme, setTheme } = useTheme()

  const routes = [
    {
      href: DEFAULT_LOGIN_REDIRECT,
      label: 'Overview',
      id: 1,
    },
    {
      href: '/gantt',
      label: 'Gantt',
      id: 2,
    },
  ]

  return (
    <header className="sm: flex sm: justify-between py-1 px-4 border-b dark:border-neutral-800">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6 md:hidden dark:text-white"> </Menu>
              </SheetTrigger>
              <SheetContent side={'left'} className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.id}
                      href={route.href}
                      className="block px-2 py-1 text-lg"
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href={DEFAULT_LOGIN_REDIRECT} className="ml-4 lg:ml-0">
              <Image
                height={30}
                src={theme === 'light' ? mirageLogoBlack : mirageLogoWhite}
                alt={'Logo'}
              />
            </Link>
          </div>
          <nav className="mx-6 items-center space-x-4 lg:space-x-6 hidden md:block">
            {routes.map((route) => (
              <Button asChild variant={'ghost'} key={route.id}>
                <Link
                  href={route.href}
                  className="text-sm font-medium transition-colors"
                >
                  {route.label}
                </Link>
              </Button>
            ))}
          </nav>
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
            <ProfileButton />
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
