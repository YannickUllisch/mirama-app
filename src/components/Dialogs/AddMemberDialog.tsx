'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { InvitationSchema } from '@src/lib/schemas'
import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useTransition,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Input } from '@src/components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import { Button } from '@src/components/ui/button'
import { postResource } from '@src/lib/api/postResource'
import type { KeyedMutator } from 'swr'
import { Role, type User } from '@prisma/client'
import { Label } from '../ui/label'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface AddMemberDialogProps {
  mutate: KeyedMutator<User[]>
}

const AddMemberDialog: FC<PropsWithChildren<AddMemberDialogProps>> = ({
  children,
  mutate,
}) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof InvitationSchema>>({
    resolver: zodResolver(InvitationSchema),
    defaultValues: {
      email: '',
      name: '',
      role: 'USER',
    },
  })

  const onSubmit = (vals: z.infer<typeof InvitationSchema>) => {
    startTransition(() => {
      postResource('team/member', vals, { mutate })
        .then(() => {
          form.reset()
          setIsOpen(false)
        })
        .catch(() => {
          setIsOpen(false)
        })
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
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
                        <SelectItem value={Role.USER}>{Role.USER}</SelectItem>
                        <SelectItem value={Role.FREELANCE}>
                          {Role.FREELANCE}
                        </SelectItem>
                        <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
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
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
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
