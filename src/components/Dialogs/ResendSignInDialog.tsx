'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmailLoginSchema } from '@src/lib/schemas'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Input } from '@src/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/components/ui/dialog'
import { Button } from '@src/components/ui/button'
import { Label } from '../ui/label'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { resendLogin } from '@src/lib/auth/login'
import { Mail } from 'lucide-react'

const ResendSigninDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const form = useForm<z.infer<typeof EmailLoginSchema>>({
    resolver: zodResolver(EmailLoginSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof EmailLoginSchema>) => {
    resendLogin(vals as any)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center w-full gap-x-2">
          <Button
            className="w-full gap-2"
            variant={'outline'}
            onClick={() => setIsOpen(true)}
          >
            <Mail height="15" width="15" />
            <span>Sign in with Email</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in via Email</DialogTitle>
          <DialogDescription>
            Please enter your accounts Email, you will be sent a 'Magic Link'
            which you can use to sign in!
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="focus-visible:ring-text"
                        name="email"
                        placeholder="Email"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" variant={'auth'}>
                Login
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ResendSigninDialog
