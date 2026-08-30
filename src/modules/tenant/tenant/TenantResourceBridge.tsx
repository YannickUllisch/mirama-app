// src/modules/tenant/tenant/TenantResourceBridge.tsx
'use client'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { TenantResourceProvider } from './tenantResourceContext'

const TenantResourceBridge = ({ children }: { children: React.ReactNode }) => {
  const { activeTenantId } = useOrganizationResource()

  return (
    <TenantResourceProvider value={{ activeTenantId }}>
      {children}
    </TenantResourceProvider>
  )
}

export default TenantResourceBridge
