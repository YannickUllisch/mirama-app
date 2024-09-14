'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePasswordSchema } from '@src/lib/schemas'
import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useTransition,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Button } from '../ui/button'
import { changePassword } from '@src/lib/auth/changePassword'
import { toast } from 'sonner'
import { Input } from '../ui/input'

const ChangePasswordDialog: FC<PropsWithChildren> = ({ children }) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      new: '',
      newValidated: '',
      old: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof ChangePasswordSchema>) => {
    startTransition(() => {
      changePassword(vals).then((res) => {
        if (res.success) {
          toast.success(res.success)
          form.reset()
          setIsOpen(false)
        }
        if (res.error) {
          toast.error(res.error)
        }
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
          <DialogTitle>Change you password</DialogTitle>
          <DialogDescription>
            Please input your current password as well as your new desired
            password.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-10 space-y-3 mx-[2%]">
              <FormField
                control={form.control}
                name="old"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newValidated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validate New Password</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="password" />
                    </FormControl>
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
                Change
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog
