'use client'
import { createContext, useContext } from 'react'

type OrganizationResourceContextType = {
  activeOrganizationId: string
  activeTenantId: string
}

const OrganizationResourceContext =
  createContext<OrganizationResourceContextType | null>(null)

export const OrganizationResourceProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: OrganizationResourceContextType
}) => {
  return (
    <OrganizationResourceContext.Provider value={value}>
      {children}
    </OrganizationResourceContext.Provider>
  )
}

export const useOrganizationResource = () => {
  const ctx = useContext(OrganizationResourceContext)
  if (!ctx)
    throw new Error(
      'useOrganizationResource must be used within OrganizationResourceProvider',
    )
  return ctx
}
