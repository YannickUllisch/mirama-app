'use client'
import { SessionProvider } from 'next-auth/react'
import type { FC, PropsWithChildren } from 'react'

const SessionWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children} </SessionProvider>
}

export default SessionWrapper
