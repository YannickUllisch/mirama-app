// src/modules/tenant/organization/components/OrganizationForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import ReturnLink from '@src/modules/shared/components/ReturnLink'
import {
  type CreateOrganizationCommand,
  CreateOrganizationSchema,
  type OrganizationResponse,
  OrganizationRegion,
} from '@src/modules/tenant/organization/organization.types'
import { slugify } from '@src/modules/tenant/organization/slug'
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
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { useForm } from 'react-hook-form'

type OrganizationFormProps = {
  returnHref: string
  orgId?: string
}

// Generic-enough that "Request failed with status code 409" would otherwise be all the
// user sees - the backend's actual reason (e.g. "This URL is already taken") lives in the
// ProblemDetails body's `title` (see ApiControllerBase.Problem on the backend).
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const title = error.response?.data?.title
    if (typeof title === 'string' && title.length > 0) return title
  }
  return 'Something went wrong. Please try again.'
}

const OrganizationForm = ({ orgId, returnHref }: OrganizationFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!orgId
  const slugTouched = useRef(false)

  const { items: organizations, isLoading } =
    apiRequest.organization.fetchAll.useQuery()
  const { mutate: createOrganization } =
    apiRequest.organization.create.useMutation()
  const { mutate: updateOrganization } =
    apiRequest.organization.update.useMutation()

  const org = isEditing
    ? organizations.find((o: OrganizationResponse) => o.id === orgId)
    : undefined

  const form = useForm<CreateOrganizationCommand>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: '',
      slug: '',
      street: '',
      city: '',
      country: '',
      zipCode: '',
      region: OrganizationRegion.RestOfWorld,
    },
  })

  useEffect(() => {
    if (org) {
      slugTouched.current = true
      form.reset({
        name: org.name,
        slug: org.slug,
        street: org.street,
        city: org.city,
        country: org.country,
        zipCode: org.zipCode,
        region: org.regionValue,
        logo: org.logo,
        primaryColor: org.primaryColor,
        accentColor: org.accentColor,
      })
    }
  }, [org, form])

  const isDirty = !isEditing || form.formState.isDirty

  const goBack = () => router.push(returnHref)

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      if (isEditing && orgId) {
        // Slug is frozen after creation (see Organization.Update on the backend) - sent
        // along here only because the form shares its shape with create, it's ignored.
        updateOrganization(
          { id: orgId, data },
          {
            onSuccess: goBack,
            onError: (error) =>
              form.setError('slug', { message: extractErrorMessage(error) }),
          },
        )
      } else {
        createOrganization(data, {
          onSuccess: goBack,
          onError: (error) =>
            form.setError('slug', { message: extractErrorMessage(error) }),
        })
      }
    })
  })

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isEditing && !org && !isLoading) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        Organization not found.
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-0">
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="px-6 md:px-10 py-6 pb-20 space-y-5"
        >
          <ReturnLink href={returnHref} text="Back to organizations" />

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
                  <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring has-[:disabled]:opacity-60">
                    <span className="pl-3 pr-1 text-sm text-body-text/60 select-none">
                      /organization/
                    </span>
                    <Input
                      placeholder="acme-inc"
                      className="border-0 focus-visible:ring-0 px-0"
                      disabled={isEditing}
                      {...field}
                      onChange={(e) => {
                        slugTouched.current = true
                        field.onChange(slugify(e.target.value))
                      }}
                    />
                  </div>
                </FormControl>
                {isEditing && (
                  <p className="text-xs text-body-text/60">
                    The workspace URL can't be changed after creation.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="San Francisco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="DE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="94103" {...field} />
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
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={String(OrganizationRegion.EuropeanUnion)}
                    >
                      European Union
                    </SelectItem>
                    <SelectItem value={String(OrganizationRegion.UnitedStates)}>
                      United States
                    </SelectItem>
                    <SelectItem value={String(OrganizationRegion.RestOfWorld)}>
                      Rest of World
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <SaveChangesOverlay
            isDirty={isDirty}
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={goBack}
            submitLabel={isEditing ? 'Save Changes' : 'Create Organization'}
          />
        </form>
      </Form>
    </div>
  )
}

export default OrganizationForm
