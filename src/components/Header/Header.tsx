'use client'
import { useTheme } from 'next-themes'
import React, { type FC } from 'react'
import { Button } from '@src/components/ui/button'
import { AlignLeft, Bell, Moon, Search, Sun } from 'lucide-react'
import ProfileButton from '@/src/components/Header/profilebutton'

interface HeaderProps {
  toggleSidebar: () => void
}

const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex gap-2 p-4 justify-between w-full">
      <div className="flex items-center justify-start">
        <Button
          variant="ghost"
          className="p-1 rounded-lg w-8 h-8"
          onClick={toggleSidebar}
        >
          <AlignLeft strokeWidth={1.3} className="transition-all" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant={'ghost'}
          size={'icon'}
          aria-label="Toggle Theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun
            strokeWidth={1.5}
            className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            strokeWidth={1.5}
            className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
        </Button>
        <Button variant={'ghost'} size={'icon'} aria-label="Notifications">
          <Search strokeWidth={1.5} className="h-5 w-5" />
        </Button>
        <Button variant={'ghost'} size={'icon'} aria-label="Notifications">
          <Bell strokeWidth={1.5} className="h-6 w-6" />
        </Button>
        <ProfileButton />
      </div>
    </header>
  )
}

export default Header
