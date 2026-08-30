// app/(app)/organization/[organizationId]/settings/(tenant-form)/_components/TenantSettingsFormContext.tsx
'use client'

import type { UpdateTenantSettingsRequest } from '@src/modules/tenant/tenant/tenant.types'
import { createContext, useContext } from 'react'
import type { UseFormReturn } from 'react-hook-form'

type TenantSettingsFormContextValue = {
  form: UseFormReturn<UpdateTenantSettingsRequest>
  isPending: boolean
  isLoading: boolean
}

export const TenantSettingsFormContext =
  createContext<TenantSettingsFormContextValue | null>(null)

export const useTenantSettingsForm = () => {
  const ctx = useContext(TenantSettingsFormContext)
  if (!ctx)
    throw new Error(
      'useTenantSettingsForm must be used inside TenantSettingsFormProvider',
    )
  return ctx
}
