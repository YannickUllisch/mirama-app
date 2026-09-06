'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import { AccessScope } from '@src/modules/tenant/iam/roles/role.types'
import { createInviteFn } from '@src/modules/tenant/organization/invitations/invitations.api'
import {
  type CreateOrganizationCommand,
  OrganizationRegion,
} from '@src/modules/tenant/organization/organization.types'
import { slugify } from '@src/modules/tenant/organization/slug'
import {
  type OrganizationSetupCommand,
  OrganizationSetupSchema,
} from '../setup.types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import axios from 'axios'
import { ImageIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { type Control, useForm } from 'react-hook-form'
import { useSetup } from '../SetupProvider'
import SetupShell from '../SetupShell'

const REGION_LABELS: Record<OrganizationRegion, string> = {
  [OrganizationRegion.EuropeanUnion]: 'European Union',
  [OrganizationRegion.UnitedStates]: 'United States',
  [OrganizationRegion.RestOfWorld]: 'Rest of world',
}

// Generic-enough that "Request failed with status code 409" would otherwise be all the
// user sees - the backend's actual reason (e.g. "This URL is already taken") lives in the
// ProblemDetails body's `title` (see ApiControllerBase.Problem on the backend).
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const title = error.response?.data?.title
    if (typeof title === 'string' && title.length > 0) return title
  }
  return 'Something went wrong creating your organization. Please try again.'
}

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
  // Once the user has typed into the slug field directly, stop overwriting it from the
  // name field - it's their URL to choose, the name-derived value is just a head start.
  const slugTouched = useRef(false)

  const { mutate: createOrganization } =
    apiRequest.organization.create.useMutation()

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
      slug: data.slug,
      street: '-',
      city: '-',
      country: '-',
      zipCode: '-',
      region: data.region,
      logo: data.logo,
      primaryColor: data.primaryColor,
      accentColor: data.secondaryColor,
    }

    createOrganization(orgPayload, {
      onSuccess: async (org) => {
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

        // Re-mints the session's org claims by slug (see GetOrgMembership on the backend) -
        // the Guid it returns is still what actually scopes every backend request from here on.
        await update({ organizationSlug: org.slug })
        router.push(`/organization/${org.slug}`)
      },
      onError: (error) => {
        setIsSubmitting(false)
        form.setError('slug', { message: extractErrorMessage(error) })
      },
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
                <Input
                  placeholder="Acme Inc."
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    if (!slugTouched.current) {
                      form.setValue('slug', slugify(e.target.value), {
                        shouldValidate: form.formState.isSubmitted,
                      })
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace URL</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                  <span className="pl-3 pr-1 text-sm text-body-text/60 select-none">
                    /organization/
                  </span>
                  <Input
                    placeholder="acme-inc"
                    className="border-0 focus-visible:ring-0 px-0"
                    {...field}
                    onChange={(e) => {
                      slugTouched.current = true
                      field.onChange(slugify(e.target.value))
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Select
                  value={String(field.value)}
                  onValueChange={(value) =>
                    field.onChange(Number(value) as OrganizationRegion)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REGION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
