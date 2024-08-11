'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { InvitationSchema } from '@src/lib/schemas'
import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useTransition,
} from 'react'
import { useForm } from 'react-hook-form'
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
import type { User } from '@prisma/client'
import { Label } from '../ui/label'

interface AddMemberDialogProps {
  mutate: KeyedMutator<User[]>
}

const AddMemberDialog: FC<PropsWithChildren<AddMemberDialogProps>> = ({
  children,
  mutate,
}) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    reset,
    //formState: { errors },
  } = useForm<z.infer<typeof InvitationSchema>>({
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
          reset()
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 items-center gap-4 py-4">
            <Label className="text-right">Name</Label>
            <Input
              type="text"
              id="name"
              className="col-span-3"
              {...register('name')}
              placeholder="Enter Member Name"
              disabled={isPending}
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email</Label>
            <Input
              type="text"
              id="email"
              className="col-span-3"
              {...register('email')}
              placeholder="Enter Email"
              disabled={isPending}
              autoComplete="off"
            />
          </div>
          {/* TODO: Add Role Select */}
          <DialogFooter className="mt-4">
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
      </DialogContent>
    </Dialog>
  )
}

export default AddMemberDialog
