// src/modules/tenant/components/dialogs/CreateOrganizationDialog.tsx
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import {
  type CreateOrganizationRequest,
  CreateOrganizationSchema,
} from '@server/modules/account/organizations/features/create-organization/schema'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const CreateOrganizationDialog = () => {
  // States
  const [dialogOpen, setDialogOpen] = useState(false)

  const { mutate: createOrganization, isPending } =
    apiRequest.organization.create.useMutation()

  const form = useForm<CreateOrganizationRequest>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  const onSubmit = (data: CreateOrganizationRequest) => {
    createOrganization(data, {
      onSuccess: () => {
        form.reset()
        setDialogOpen(false)
      },
    })
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="tertiary" size="sm">
          <Plus className="w-4 h-4" />
          New Organization
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to your tenant. Fill in the details below.
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
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="94103" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrganizationDialog
