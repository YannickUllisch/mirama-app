// app/(app)/tenant/[tenantId]/organization/_components/OrganizationForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import ReturnLink from '@src/modules/shared/components/ReturnLink'
import {
  type CreateOrganizationCommand,
  CreateOrganizationSchema,
  type OrganizationResponse,
} from '@src/modules/tenant/organization/organization.types'
import SaveChangesOverlay from '@src/components/SaveChangesOverlay'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'

type OrganizationFormProps = {
  tenantId: string
  orgId?: string
}

const OrganizationForm = ({ orgId, tenantId }: OrganizationFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!orgId

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
      street: '',
      city: '',
      country: '',
      zipCode: '',
    },
  })

  useEffect(() => {
    if (org) {
      form.reset({
        name: org.name,
        street: org.street,
        city: org.city,
        country: org.country,
        zipCode: org.zipCode,
      })
    }
  }, [org, form])

  const isDirty = !isEditing || form.formState.isDirty

  const goBack = () => router.push(`/tenant/${tenantId}`)

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      if (isEditing && orgId) {
        updateOrganization({ id: orgId, data }, { onSuccess: goBack })
      } else {
        createOrganization(data, { onSuccess: goBack })
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
        <form onSubmit={handleSubmit} className="px-6 md:px-10 py-6 pb-20 space-y-5">
          <ReturnLink
            href={`/tenant/${tenantId}`}
            text="Back to organizations"
          />

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
