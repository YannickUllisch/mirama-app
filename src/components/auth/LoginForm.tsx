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

import { useState, useTransition } from 'react'
import { LoginSchema } from '@src/lib/schemas'
import { FormSuccess } from '@src/components/auth/popups/FormSuccess'
import { login } from '@src/lib/auth/login'
import { useSearchParams } from 'next/navigation'
import { Label } from '../ui/label'
import { AuthSocial } from './Socials'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    console.log(vals)

    startTransition(() => {
      login(vals).then((data) => {
        if (data) {
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
          <h1 className="text-4xl font-bold font-serif">Welcome Back</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      disabled={isPending}
                      placeholder="m@example.com"
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
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="/"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
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
          <FormError message={error || urlError} />
          <Button disabled={isPending} type="submit" variant={'auth'}>
            Login
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-transparent px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <AuthSocial />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <a href="/auth/register" className="underline underline-offset-4">
            Create an account
          </a>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
