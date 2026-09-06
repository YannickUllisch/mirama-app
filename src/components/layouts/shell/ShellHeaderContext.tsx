'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type SetShellHeaderContent = (content: React.ReactNode) => void

// Split in two so a page calling useShellHeader only ever subscribes to the
// (stable) setter, never to the content value itself - otherwise writing
// content would re-render the writer, which recreates its JSX and writes
// again, forever.
const ShellHeaderContentContext = createContext<React.ReactNode>(null)
const ShellHeaderSetContentContext =
  createContext<SetShellHeaderContent | null>(null)

interface ShellHeaderProviderProps {
  children: React.ReactNode
}

export const ShellHeaderProvider = ({ children }: ShellHeaderProviderProps) => {
  const [content, setContent] = useState<React.ReactNode>(null)

  return (
    <ShellHeaderSetContentContext.Provider value={setContent}>
      <ShellHeaderContentContext.Provider value={content}>
        {children}
      </ShellHeaderContentContext.Provider>
    </ShellHeaderSetContentContext.Provider>
  )
}

export const useShellHeaderContent = () => useContext(ShellHeaderContentContext)

// Fills the shared PM header with page-owned content; cleared on unmount.
export const useShellHeader = (content: React.ReactNode) => {
  const setContent = useContext(ShellHeaderSetContentContext)
  if (!setContent) {
    throw new Error('useShellHeader must be used within a ShellHeaderProvider')
  }

  useEffect(() => {
    setContent(content)
    return () => setContent(null)
  }, [content, setContent])
}
