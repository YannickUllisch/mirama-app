// app/(app)/tenant/[tenantId]/settings/SettingsForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import {
  type UpdateTenantSettingsRequest,
  UpdateTenantSettingsSchema,
} from '@src/modules/tenant/hooks/types'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { ColorPicker } from '@ui/color-picker'
import {
  DropZoneArea,
  Dropzone,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  InfiniteProgress,
  useDropzone,
} from '@ui/dropzone'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { Label } from '@ui/label'
import { Switch } from '@ui/switch'
import {
  Bell,
  Globe,
  ImageIcon,
  Palette,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import SettingsFormSkeleton from './SettingsFormSkeleton'

const SettingsForm = () => {
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

  const dropzone = useDropzone<string>({
    onDropFile: async (_file) => {
      return { status: 'success', result: 'placeholder' }
    },
    validation: {
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
      maxSize: 2 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
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

  const onSubmit = (data: UpdateTenantSettingsRequest) => {
    update(data)
  }

  if (isLoading) {
    return <SettingsFormSkeleton />
  }

  const isDirty = form.formState.isDirty

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 pb-6 px-4">
          {/* General */}
          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 bg-signature-coral">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                <Settings className="w-4 h-4 text-white/70" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Tenant name"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
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
                        placeholder="e.g. Europe/Amsterdam"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Branding */}
          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 bg-signature-cream">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-ink">
                <Palette className="w-4 h-4 text-ink/60" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <FormField
                control={form.control}
                name="brandingColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Color</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <ColorPicker
                          value={field.value ?? '#000000'}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <span className="text-xs font-mono text-muted-foreground">
                        {(field.value ?? '#000000').toUpperCase()}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-1.5">
                <Label>Logo</Label>
                <Dropzone {...dropzone}>
                  <DropZoneArea className="flex-col gap-3 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <DropzoneTrigger className="text-sm font-medium">
                        Click to upload
                      </DropzoneTrigger>
                      <span className="text-sm text-muted-foreground">
                        {' '}
                        or drag and drop
                      </span>
                    </div>
                    <DropzoneDescription>
                      PNG, JPG, SVG or WebP — max 2 MB
                    </DropzoneDescription>
                  </DropZoneArea>

                  <DropzoneMessage />

                  <DropzoneFileList>
                    {dropzone.fileStatuses.map((file) => (
                      <DropzoneFileListItem key={file.id} file={file}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <Upload className="w-4 h-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm truncate">
                              {file.fileName}
                            </span>
                          </div>
                          <DropzoneRemoveFile
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </DropzoneRemoveFile>
                        </div>
                        <InfiniteProgress status={file.status} />
                        <DropzoneFileMessage />
                      </DropzoneFileListItem>
                    ))}
                  </DropzoneFileList>
                </Dropzone>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="overflow-hidden">
            <CardHeader className="px-6 py-4 bg-signature-mint">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-ink">
                <Bell className="w-4 h-4 text-ink/60" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <FormField
                control={form.control}
                name="receiveNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Email Notifications</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Receive email notifications for important account events
                      </p>
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
        </div>

        <SaveChangesOverlay
          isDirty={isDirty}
          isPending={isPending}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      </form>
    </Form>
  )
}

export default SettingsForm
