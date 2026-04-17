'use client'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const scriptProps =
    typeof window === 'undefined'
      ? undefined
      : ({ type: 'application/json' } as const)

  return (
    <NextThemesProvider
      {...props}
      scriptProps={scriptProps}
      attribute="class"
      defaultTheme="light"
    >
      {children}
    </NextThemesProvider>
  )
}
