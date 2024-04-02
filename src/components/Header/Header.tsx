'use client'
import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '@src/components/ui/button'
import { Bell, Moon, Search, Sun } from 'lucide-react'
import ProfileButton from '@/src/components/Header/profilebutton'

const Header = () => {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex gap-2 p-4 justify-between">
      <div className="flex items-center justify-start">
        <Button
          variant={'ghost'}
          size={'icon'}
          className="mr-4"
          aria-label="Notifications"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant={'ghost'}
          size={'icon'}
          aria-label="Toggle Theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant={'ghost'} size={'icon'} aria-label="Notifications">
          <Bell className="h-6 w-6" />
        </Button>
        <ProfileButton />
      </div>
    </header>
  )
}

export default Header
