// app/(app)/tenant/[tenantId]/settings/_components/SettingsContext.tsx
'use client'

import type { UpdateTenantSettingsRequest } from '@src/modules/tenant/tenant/tenant.types'
import { createContext, useContext } from 'react'
import type { UseFormReturn } from 'react-hook-form'

type SettingsContextValue = {
  form: UseFormReturn<UpdateTenantSettingsRequest>
  isPending: boolean
  isLoading: boolean
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

export const useSettingsContext = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx)
    throw new Error('useSettingsContext must be used inside SettingsShell')
  return ctx
}
