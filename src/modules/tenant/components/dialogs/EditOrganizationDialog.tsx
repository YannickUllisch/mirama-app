'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import {
  type UpdateOrganizationRequest,
  UpdateOrganizationSchema,
} from '@server/modules/account/organizations/features/update-organization/schema'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface EditOrganizationDialogProps {
  org: OrganizationListResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditOrganizationDialog = ({
  org,
  open,
  onOpenChange,
}: EditOrganizationDialogProps) => {
  const { mutate: updateOrganization, isPending } =
    apiRequest.organization.update.useMutation()

  const form = useForm<UpdateOrganizationRequest>({
    resolver: zodResolver(UpdateOrganizationSchema),
    defaultValues: {
      name: org.name,
      street: org.street,
      city: org.city,
      state: org.state,
      zipCode: org.zipCode,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: org.name,
        street: org.street,
        city: org.city,
        state: org.state,
        zipCode: org.zipCode,
      })
    }
  }, [open, org, form])

  const onSubmit = (data: UpdateOrganizationRequest) => {
    updateOrganization(
      { id: org.id, data },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Update the details for <strong>{org.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="CA" {...field} />
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
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="94105" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default EditOrganizationDialog
