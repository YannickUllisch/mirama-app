// app/(app)/organization/[organizationId]/settings/(tenant-form)/_components/TenantSettingsFormProvider.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import {
  type UpdateTenantSettingsRequest,
  UpdateTenantSettingsSchema,
} from '@src/modules/tenant/tenant/tenant.types'
import { Form } from '@ui/form'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TenantSettingsFormContext } from './TenantSettingsFormContext'

const TenantSettingsFormProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { data: tenant, isLoading } = apiRequest.tenant.fetch.useQuery()
  const { mutate: update, isPending } = apiRequest.tenant.update.useMutation()

  const form = useForm<UpdateTenantSettingsRequest>({
    resolver: zodResolver(UpdateTenantSettingsSchema),
    defaultValues: {
      name: '',
      timezone: '',
      brandingColor: null,
      receiveNotifications: true,
      logoUrl: '',
    },
  })

  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.settings.name,
        timezone: tenant.settings.timezone,
        brandingColor: tenant.settings.brandingColor,
        receiveNotifications: tenant.settings.receiveNotifications,
        logoUrl: tenant.settings.logoUrl,
      })
    }
  }, [tenant, form])

  const onSubmit = (data: UpdateTenantSettingsRequest) => update(data)

  return (
    <TenantSettingsFormContext.Provider value={{ form, isPending, isLoading }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="space-y-4 pb-20">{children}</div>
          <SaveChangesOverlay
            isDirty={form.formState.isDirty}
            isPending={isPending}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </TenantSettingsFormContext.Provider>
  )
}

export default TenantSettingsFormProvider
