'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import { Role } from '@prisma/client'
import type { CreateInvitationInput } from '@server/domain/invitationSchema'
import { InvitationSchema } from '@src/lib/schemas'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { type FC, type PropsWithChildren, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const AddMemberDialog: FC<PropsWithChildren> = ({ children }) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const form = useForm<CreateInvitationInput>({
    resolver: zodResolver(InvitationSchema),
    defaultValues: {
      email: '',
      name: '',
      role: Role.USER,
    },
  })

  const { mutate: useCreateInvitation } =
    apiRequest.invitation.create.useMutation()

  const onSubmit = (vals: CreateInvitationInput) => {
    startTransition(() => {
      useCreateInvitation(vals)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member to Team</DialogTitle>
          <DialogDescription>
            Input all required attributes to add Member.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-10 space-y-3 mx-[2%]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Name"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="email@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={Role.USER}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role for Member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(Role).map((role) => (
                          <SelectItem key={`role-item-${role}`} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="link">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} variant={'success'}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default AddMemberDialog
