// app/(app)/organization/[organizationId]/settings/(tenant-form)/general/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { Skeleton } from '@ui/skeleton'
import { Globe, Settings2 } from 'lucide-react'
import { useTenantSettingsForm } from '../_components/TenantSettingsFormContext'

const GeneralPage = () => {
  const { form, isLoading } = useTenantSettingsForm()

  if (isLoading) return <GeneralSkeleton />

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 bg-surface-dark">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
          <Settings2 className="w-4 h-4 text-white/70" />
          General
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid sm:grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Studio"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Visible to all team members.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                Timezone
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Europe/Amsterdam"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Used for scheduling and deadline display.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

const GeneralSkeleton = () => (
  <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
    <div className="h-12 bg-surface-dark" />
    <div className="p-6 grid sm:grid-cols-2 gap-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-36" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-44" />
      </div>
    </div>
  </div>
)

export default GeneralPage
