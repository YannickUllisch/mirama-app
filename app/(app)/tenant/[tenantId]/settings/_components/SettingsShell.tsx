// app/(app)/tenant/[tenantId]/settings/_components/SettingsShell.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import InnerSidebar, { type InnerSidebarItem } from '@src/components/InnerSidebar'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import {
  type UpdateTenantSettingsRequest,
  UpdateTenantSettingsSchema,
} from '@src/modules/tenant/tenant/tenant.types'
import { Form } from '@ui/form'
import { Bell, Palette, Settings2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SettingsContext } from './SettingsContext'

const SettingsShell = ({ children }: { children: React.ReactNode }) => {
  const { tenantId } = useParams<{ tenantId: string }>()
  const base = `/tenant/${tenantId}/settings`

  const navItems: InnerSidebarItem[] = [
    { label: 'General', href: `${base}/general`, icon: Settings2 },
    { label: 'Branding', href: `${base}/branding`, icon: Palette },
    { label: 'Notifications', href: `${base}/notifications`, icon: Bell },
  ]

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
    <SettingsContext.Provider value={{ form, isPending, isLoading }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="flex gap-8 px-6 md:px-10 py-8 pb-20">
            <InnerSidebar items={navItems} />
            <div className="flex-1 min-w-0 space-y-4">{children}</div>
          </div>
          <SaveChangesOverlay
            isDirty={form.formState.isDirty}
            isPending={isPending}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </form>
      </Form>
    </SettingsContext.Provider>
  )
}

export default SettingsShell
