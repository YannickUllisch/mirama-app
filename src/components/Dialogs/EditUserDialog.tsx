import { UserSchema } from '@/prisma/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role, type User } from '@prisma/client'
import type { UpdateSession } from 'next-auth/react'
import type React from 'react'
import { type FC, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@src/components/ui/dialog'
import { Input } from '@src/components/ui/input'
import { Button } from '@src/components/ui/button'
import { updateResourceById } from '@src/lib/api/updateResource'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

interface EditUserDialogProps {
  user: User
  updateSession: UpdateSession
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mutate?: () => any
}

const EditUserDialog: FC<EditUserDialogProps> = ({
  user,
  updateSession,
  open,
  setOpen,
  mutate,
}) => {
  // States
  const [isPending, startTransition] = useTransition()

  // Form Logic and Functions
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      ...user,
    },
  })

  const onSubmit = (vals: z.infer<typeof UserSchema>) => {
    startTransition(() => {
      // To make returning to unassigned state possible, we have to reset the undefined string
      updateResourceById('team/member', user.id, vals, {
        mutate: mutate,
        onSuccess: updateSession,
      }).then(() => {
        setOpen(false)
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to the Members profile here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            className={'grid items-start gap-4'}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Role</FormLabel>
                      <Select {...field} onValueChange={field.onChange}>
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
            </div>

            <Button disabled={isPending} type="submit" variant={'success'}>
              Save changes
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
