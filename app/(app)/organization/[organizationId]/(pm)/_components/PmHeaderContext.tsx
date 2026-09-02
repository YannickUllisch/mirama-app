'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type SetPmHeaderContent = (content: React.ReactNode) => void

// Split in two so a page calling usePmHeader only ever subscribes to the
// (stable) setter, never to the content value itself - otherwise writing
// content would re-render the writer, which recreates its JSX and writes
// again, forever.
const PmHeaderContentContext = createContext<React.ReactNode>(null)
const PmHeaderSetContentContext = createContext<SetPmHeaderContent | null>(null)

interface PmHeaderProviderProps {
  children: React.ReactNode
}

export const PmHeaderProvider = ({ children }: PmHeaderProviderProps) => {
  const [content, setContent] = useState<React.ReactNode>(null)

  return (
    <PmHeaderSetContentContext.Provider value={setContent}>
      <PmHeaderContentContext.Provider value={content}>
        {children}
      </PmHeaderContentContext.Provider>
    </PmHeaderSetContentContext.Provider>
  )
}

export const usePmHeaderContent = () => useContext(PmHeaderContentContext)

// Fills the shared PM header with page-owned content; cleared on unmount.
export const usePmHeader = (content: React.ReactNode) => {
  const setContent = useContext(PmHeaderSetContentContext)
  if (!setContent) {
    throw new Error('usePmHeader must be used within a PmHeaderProvider')
  }

  useEffect(() => {
    setContent(content)
    return () => setContent(null)
  }, [content, setContent])
}
