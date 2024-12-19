'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type * as z from 'zod'
import { Input } from '@src/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'
import { Button } from '@src/components/ui/button'
import { FormError } from '@src/components/auth/popups/FormError'
import { register } from '@src/lib/auth/register'
import { useState, useTransition } from 'react'
import { RegisterSchema } from '@src/lib/schemas'
import { FormSuccess } from '@src/components/auth/popups/FormSuccess'
import { AuthSocial } from './Socials'

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof RegisterSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      register(vals).then((data) => {
        if (data) {
          setSuccess(data.success)
          setError(data.error)
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold font-serif">
            Keep your business organized
          </h1>
          <p className="text-balance text-xs text-muted-foreground">
            We are currently not open for public registrations!
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
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
                      required
                      className="focus-visible:ring-black dark:focus-visible:ring-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      disabled={isPending}
                      required
                      className="focus-visible:ring-black dark:focus-visible:ring-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={isPending} type="submit" variant={'auth'}>
            Create Account
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-transparent px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
          <AuthSocial />
        </div>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <a href="/auth/login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm
