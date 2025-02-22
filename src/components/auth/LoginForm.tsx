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
import { PasswordInput } from './PasswordInput'
import { Loader2 } from 'lucide-react'

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
          <h1 className="text-4xl md:text-5xl max-w-4xl tracking-tighter font-regular">
            Welcome Back
          </h1>
          <p className="text-balance text-sm tracking-tighter text-muted-foreground">
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
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      disabled={isPending}
                      placeholder="email@example.com"
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
                className="ml-auto text-xs underline-offset-4 hover:underline"
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
                    <PasswordInput
                      {...field}
                      autoComplete="current-password"
                      id="password"
                      placeholder="*********"
                      disabled={isPending}
                      className="focus-visible:ring-black dark:focus-visible:ring-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error || urlError} />
          </div>

          <Button disabled={isPending} type="submit" variant={'default'}>
            {!isPending ? (
              'Login'
            ) : (
              <div className="w-full flex justify-center items-center min-h-[650px]">
                <Loader2 className="h-6 w-6 text-text-inverted animate-spin ml-2 m-1" />
              </div>
            )}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-input">
            <span className="relative z-10 bg-transparent px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
