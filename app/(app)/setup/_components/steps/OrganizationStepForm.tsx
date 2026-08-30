// app/(app)/setup/_components/steps/OrganizationStepForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { createInviteFn } from '@src/modules/tenant/organization/invitations/invitations.api'
import type { CreateOrganizationCommand } from '@src/modules/tenant/organization/organization.types'
import {
  type OrganizationSetupCommand,
  OrganizationSetupSchema,
} from '@src/modules/tenant/setup/setup.types'
import { Button } from '@ui/button'
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from '@ui/color-picker'
import { Dropzone, DropzoneTrigger, useDropzone } from '@ui/dropzone'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { type Control, useForm } from 'react-hook-form'
import { useSetup } from '../SetupProvider'
import SetupShell from '../SetupShell'

const ColorSwatchField = ({
  control,
  name,
  label,
}: {
  control: Control<OrganizationSetupCommand>
  name: 'primaryColor' | 'secondaryColor'
  label: string
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col items-center gap-1.5 space-y-0">
        <FormControl>
          <ColorPicker
            value={field.value ?? '#000000'}
            onValueChange={field.onChange}
          >
            <ColorPickerTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-hairline hover:border-ink"
              >
                <ColorPickerSwatch className="h-full w-full rounded-full border-0" />
              </Button>
            </ColorPickerTrigger>
            <ColorPickerContent>
              <ColorPickerArea />
              <ColorPickerHueSlider />
              <ColorPickerInput withoutAlpha />
            </ColorPickerContent>
          </ColorPicker>
        </FormControl>
        <span className="text-[0.65rem] text-body-text">{label}</span>
      </FormItem>
    )}
  />
)

const OrganizationStepForm = () => {
  const router = useRouter()
  const { update } = useSession()
  const { draft, setOrganization } = useSetup()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutate: createOrganization } =
    apiRequest.organization.create.useMutation()
  const { mutate: updateTenantSettings } =
    apiRequest.tenant.update.useMutation()
  const { data: tenantSettings } = apiRequest.tenant.fetch.useQuery()
  const { data: roles } = apiRequest.role.fetchAllByScope.useQuery(
    AccessScope.Organization,
  )

  const form = useForm<OrganizationSetupCommand>({
    resolver: zodResolver(OrganizationSetupSchema),
    defaultValues: draft.organization,
  })

  const dropzone = useDropzone<string>({
    onDropFile: async () => ({ status: 'success', result: 'placeholder' }),
    onFileUploaded: (result) =>
      form.setValue('logo', result, { shouldDirty: true }),
    validation: {
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
      maxSize: 2 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  })

  const onContinue = form.handleSubmit((data) => {
    setOrganization(data)
    setIsSubmitting(true)

    const orgPayload: CreateOrganizationCommand = {
      name: data.name,
      // Address isn't collected during setup anymore - filled in later via org settings.
      street: '-',
      city: '-',
      country: '-',
      zipCode: '-',
      logo: data.logo,
    }

    createOrganization(orgPayload, {
      onSuccess: async (org) => {
        if (tenantSettings) {
          updateTenantSettings({
            name: tenantSettings.settings.name,
            timezone: tenantSettings.settings.timezone,
            receiveNotifications: tenantSettings.settings.receiveNotifications,
            logoUrl: tenantSettings.settings.logoUrl,
            brandingColor: data.primaryColor ?? null,
          })
        }

        // secondaryColor has no backend home yet - kept in local draft only,
        // ready to send once the API grows a field for it.

        const memberRole =
          roles?.find((role) => role.name.toLowerCase().includes('member')) ??
          roles?.[0]

        if (memberRole && draft.invites.emails.length > 0) {
          await Promise.allSettled(
            draft.invites.emails.map((email) =>
              createInviteFn(org.id, {
                email,
                name: email,
                iamRoleId: memberRole.id,
              }),
            ),
          )
        }

        await update({ organizationId: org.id })
        router.push(`/organization/${org.id}`)
      },
      onError: () => setIsSubmitting(false),
    })
  })

  return (
    <Form {...form}>
      <SetupShell
        title="Set up your organization"
        description="Give it a name and a face"
        onContinue={onContinue}
        continueLabel="Create workspace"
        isPending={isSubmitting}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Logo</FormLabel>
          <Dropzone {...dropzone}>
            <DropzoneTrigger
              aria-label="Upload logo"
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-hairline bg-surface-soft/60 p-0 text-body-text transition-colors hover:border-ink hover:bg-surface-soft hover:text-ink has-[input:focus-visible]:ring-ink"
            >
              <ImageIcon className="h-5 w-5" />
            </DropzoneTrigger>
          </Dropzone>
        </div>

        <div className="space-y-2">
          <FormLabel>Brand colors</FormLabel>
          <div className="flex items-center gap-4">
            <ColorSwatchField
              control={form.control}
              name="primaryColor"
              label="Primary"
            />
            <ColorSwatchField
              control={form.control}
              name="secondaryColor"
              label="Secondary"
            />
          </div>
        </div>
      </SetupShell>
    </Form>
  )
}

export default OrganizationStepForm
