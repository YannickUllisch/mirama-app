'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormError } from '@src/components/auth/popups/FormError'
import { FormSuccess } from '@src/components/auth/popups/FormSuccess'
import { Button } from '@src/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import { register } from '@src/lib/auth/register'
import { RegisterSchema } from '@src/lib/schemas'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { PasswordInput } from './PasswordInput'

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
          setError(data.error)
        }
      })
    })
  }

  return (
    <>
      <Form {...form}>
        <form
          className={'flex flex-col gap-6'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl max-w-5xl tracking-tighter font-regular">
              Keep your business organized
            </h1>
            <p className="text-balance text-xs text-muted-foreground">
              Get started today by entering your Email and Password
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
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button disabled={isPending} type="submit" variant={'default'}>
              {!isPending ? (
                'Create Account'
              ) : (
                <div className="w-full flex justify-center items-center min-h-[650px]">
                  <Loader2 className="h-6 w-6 text-text-inverted animate-spin ml-2 m-1" />
                </div>
              )}
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-input">
            <span className="relative z-10 bg-transparent px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <a href="/auth/login" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </form>
      </Form>
    </>
  )
}

export default RegisterForm
