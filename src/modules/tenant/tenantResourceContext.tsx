'use client'
import { createContext, useContext } from 'react'

type TenantResourceContextType = {
  activeTenantId: string
}

const TenantResourceContext = createContext<TenantResourceContextType | null>(
  null,
)

export const TenantResourceProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: TenantResourceContextType
}) => {
  return (
    <TenantResourceContext.Provider value={value}>
      {children}
    </TenantResourceContext.Provider>
  )
}

export const useTenantResource = () => {
  const ctx = useContext(TenantResourceContext)
  if (!ctx)
    throw new Error(
      'useTenantResource must be used within TenantResourceProvider',
    )
  return ctx
}
