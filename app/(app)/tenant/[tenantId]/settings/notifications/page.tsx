// app/(app)/tenant/[tenantId]/settings/notifications/page.tsx
'use client'

import { useSettingsContext } from '../_components/SettingsContext'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@ui/form'
import { Skeleton } from '@ui/skeleton'
import { Switch } from '@ui/switch'
import { Bell, Mail } from 'lucide-react'

const NotificationsPage = () => {
  const { form, isLoading } = useSettingsContext()

  if (isLoading) return <NotificationsSkeleton />

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 bg-surface-dark">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
          <Bell className="w-4 h-4 text-white/70" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FormField
          control={form.control}
          name="receiveNotifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-6">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft border border-hairline">
                  <Mail className="w-4 h-4 text-body-text" />
                </div>
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium text-ink cursor-pointer">
                    Email notifications
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Project activity, client messages, and billing events.
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

const NotificationsSkeleton = () => (
  <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
    <div className="h-12 bg-surface-dark" />
    <div className="p-6 flex items-center justify-between gap-6">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-72" />
        </div>
      </div>
      <Skeleton className="h-6 w-11 rounded-full shrink-0" />
    </div>
  </div>
)

export default NotificationsPage
