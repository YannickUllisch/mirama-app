import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks/query'
import { Role } from '@prisma/client'
import {
  UpdateUserSchema,
  type UpdateUserType,
  type UserResponseType,
} from '@server/domain/userSchema'
import { Button } from '@src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@src/components/ui/dialog'
import { Input } from '@src/components/ui/input'
import type { UpdateSession } from 'next-auth/react'
import type React from 'react'
import { type FC, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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

interface EditUserDialogProps {
  user: UserResponseType
  updateSession: UpdateSession
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EditUserDialog: FC<EditUserDialogProps> = ({
  user,
  updateSession,
  open,
  setOpen,
}) => {
  // States
  const [isPending, startTransition] = useTransition()

  // Form Logic and Functions
  const form = useForm<UpdateUserType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      ...user,
    },
  })

  const { mutate: mutateUser } = apiRequest.team.update.useMutation()

  const onSubmit = (vals: UpdateUserType) => {
    startTransition(() => {
      mutateUser(
        { id: user.id, payload: { ...vals } },
        {
          onSuccess: () => {
            updateSession()
          },
        },
      )
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

            <Button disabled={isPending} type="submit" variant={'primary'}>
              Save changes
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
