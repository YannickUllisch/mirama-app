'use client'

import {
  UpdateTenantSettingsSchema,
  type UpdateTenantSettingsRequest,
} from '@/server/modules/account/tenant/settings/features/update-settings/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import PageHeader from '@src/components/PageHeader'
import tenantSettings from '@src/modules/tenant/settings/hooks/hooks'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { ColorPicker } from '@ui/color-picker'
import {
  Dropzone,
  DropZoneArea,
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
import { Separator } from '@ui/separator'
import { Skeleton } from '@ui/skeleton'
import { Switch } from '@ui/switch'
import {
  Bell,
  Globe,
  ImageIcon,
  Loader2,
  Palette,
  Save,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const SettingsPage = () => {
  const { data: settings, isLoading } = tenantSettings.fetch.useQuery()
  const { mutate: update, isPending } = tenantSettings.update.useMutation()

  const form = useForm<UpdateTenantSettingsRequest>({
    resolver: zodResolver(UpdateTenantSettingsSchema),
    defaultValues: {
      name: '',
      timezone: '',
      brandingColor: null,
      receiveNotifications: true,
      isActive: true,
    },
  })

  const dropzone = useDropzone<string>({
    onDropFile: async (_file) => {
      // TODO: Hook up to S3 upload here.
      // 1. Get a presigned URL from the API
      // 2. Upload the file directly to S3
      // 3. Return { status: 'success', result: s3Url } on success
      // 4. Return { status: 'error', error: 'message' } on failure
      // 5. Save the returned S3 URL via form.setValue('logoUrl', s3Url)
      return { status: 'success', result: 'placeholder' }
    },
    validation: {
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
      maxSize: 2 * 1024 * 1024, // 2 MB
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        name: settings.name,
        timezone: settings.timezone,
        brandingColor: settings.brandingColor,
        receiveNotifications: settings.receiveNotifications,
        isActive: settings.isActive,
      })
    }
  }, [settings, form])

  const onSubmit = (data: UpdateTenantSettingsRequest) => {
    update(data)
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader
          icon={Settings}
          title="Settings"
          description="Tenant configuration"
        />
        <div className="px-6 md:px-10 py-6 space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Tenant configuration"
      >
        <Button
          size="sm"
          variant={'tertiary'}
          disabled={!form.formState.isDirty || isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 mr-1.5" />
          )}
          Save Changes
        </Button>
      </PageHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 md:px-10 py-6 space-y-6"
        >
          {/* General */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Separator />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Disable to suspend this tenant account
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={field.value ? 'default' : 'secondary'}
                        className="text-[10px]"
                      >
                        {field.value ? 'Active' : 'Inactive'}
                      </Badge>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
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
        </form>
      </Form>
    </div>
  )
}

export default SettingsPage
