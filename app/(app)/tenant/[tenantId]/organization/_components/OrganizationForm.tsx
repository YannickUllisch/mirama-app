// app/(app)/tenant/[tenantId]/organization/_components/OrganizationForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
import {
  type CreateOrganizationRequest,
  CreateOrganizationSchema,
} from '@server/modules/account/organizations/features/create-organization/schema'
import type { OrganizationResponse } from '@server/modules/account/organizations/features/response'
import { useTenantResource } from '@src/modules/tenant/tenantResourceContext'
import { Button } from '@ui/button'
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
  orgId?: string
}

const OrganizationForm = ({ orgId }: OrganizationFormProps) => {
  const router = useRouter()
  const { activeTenantId } = useTenantResource()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!orgId

  const { data: organizations = [], isLoading } =
    apiRequest.organization.fetchAll.useQuery()
  const { mutate: createOrganization } =
    apiRequest.organization.create.useMutation()
  const { mutate: updateOrganization } =
    apiRequest.organization.update.useMutation()

  const org = isEditing
    ? organizations.find((o: OrganizationResponse) => o.id === orgId)
    : undefined

  const form = useForm<CreateOrganizationRequest>({
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

  const goBack = () => router.push(`/tenant/${activeTenantId}`)

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
        <form onSubmit={handleSubmit} className="px-6 md:px-10 py-6 space-y-5">
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

          <div className="flex items-center gap-3 pt-2 justify-end">
            <Button type="button" variant="link" onClick={goBack}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default OrganizationForm
