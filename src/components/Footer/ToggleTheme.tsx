'use client'
import { useTheme } from 'next-themes'
import React, { type FC } from 'react'
import { Moon, Sun } from 'lucide-react'

interface ToggleThemeProps {
  width: string
  height: string
}

const ToggleTheme: FC<ToggleThemeProps> = ({ width, height }) => {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <Sun
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`h-${height} w-${width} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 cursor-pointer`}
      />
      <Moon
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`absolute h-${height} w-${width} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 cursor-pointer`}
      />
    </>
  )
}

export default ToggleTheme
