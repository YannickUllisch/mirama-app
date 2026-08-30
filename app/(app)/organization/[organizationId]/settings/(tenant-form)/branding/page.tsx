// app/(app)/organization/[organizationId]/settings/(tenant-form)/branding/page.tsx
'use client'

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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Label } from '@ui/label'
import { Skeleton } from '@ui/skeleton'
import { CloudUpload, ImageIcon, Palette, Trash2 } from 'lucide-react'
import { useTenantSettingsForm } from '../_components/TenantSettingsFormContext'

const BrandingPage = () => {
  const { form, isLoading } = useTenantSettingsForm()

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

  if (isLoading) return <BrandingSkeleton />

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 bg-surface-dark">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
          <Palette className="w-4 h-4 text-white/70" />
          Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <FormField
          control={form.control}
          name="brandingColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand color</FormLabel>
              <FormDescription>
                Applied to client-facing surfaces and exported documents.
              </FormDescription>
              <div className="flex items-center gap-3 mt-2">
                <FormControl>
                  <ColorPicker
                    value={field.value ?? '#000000'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div
                  className="h-9 w-20 rounded-md border border-hairline shrink-0 transition-colors"
                  style={{ backgroundColor: field.value ?? '#000000' }}
                />
                <span className="text-sm font-mono text-body-text">
                  {(field.value ?? '#000000').toUpperCase()}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Logo</Label>
          <p className="text-sm text-muted-foreground">
            Shown on client portals and exported PDFs.
          </p>
          <Dropzone {...dropzone}>
            <DropZoneArea className="flex-col gap-3 p-8 rounded-lg border-dashed">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-medium">
                <ImageIcon className="w-5 h-5 text-body-text" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm">
                  <DropzoneTrigger className="font-medium text-mirama">
                    Click to upload
                  </DropzoneTrigger>
                  <span className="text-muted-foreground">
                    {' '}
                    or drag and drop
                  </span>
                </p>
                <DropzoneDescription className="text-xs text-muted-foreground">
                  PNG, JPG, SVG or WebP - max 2 MB
                </DropzoneDescription>
              </div>
            </DropZoneArea>

            <DropzoneMessage />

            <DropzoneFileList>
              {dropzone.fileStatuses.map((file) => (
                <DropzoneFileListItem key={file.id} file={file}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-medium">
                        <CloudUpload className="w-3.5 h-3.5 text-body-text" />
                      </div>
                      <span className="text-sm truncate text-ink">
                        {file.fileName}
                      </span>
                    </div>
                    <DropzoneRemoveFile
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
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
  )
}

const BrandingSkeleton = () => (
  <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
    <div className="h-12 bg-surface-dark" />
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-64" />
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-3 w-52" />
        <Skeleton className="h-36 w-full rounded-lg" />
      </div>
    </div>
  </div>
)

export default BrandingPage
