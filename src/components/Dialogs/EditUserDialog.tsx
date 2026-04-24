'use client'
import type { MemberResponse } from '@/server/modules/account/members/features/response'
import {
  type UpdateMemberRequest,
  UpdateMemberSchema,
} from '@/server/modules/account/members/features/update-member/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import apiRequest from '@hooks'
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
  user: MemberResponse
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
  const form = useForm<UpdateMemberRequest>({
    resolver: zodResolver(UpdateMemberSchema),
    defaultValues: {
      email: user.email,
      name: user.name,
      iamRoleId: user.iamRoleId,
    },
  })

  const { mutate: mutateUser } = apiRequest.members.update.useMutation()

  const onSubmit = (vals: UpdateMemberRequest) => {
    startTransition(() => {
      mutateUser(
        { memberId: user.id, data: { ...vals } },
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
      <DialogContent className="sm:max-w-106.25">
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
                  name="iamRoleId"
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
                          <SelectItem key={'role-item'} value={'TODO'}>
                            TODO ADD ROLES
                          </SelectItem>
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
