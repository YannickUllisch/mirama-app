'use client'

import { publicRoutes } from '@src/routes'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const pathname = usePathname()

  const isPublicRoute = useMemo(() => {
    return publicRoutes.includes(pathname)
  }, [pathname])

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      forcedTheme={isPublicRoute ? 'light' : undefined}
      enableSystem={!isPublicRoute}
    >
      {children}
    </NextThemesProvider>
  )
}
