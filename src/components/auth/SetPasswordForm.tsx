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
import { handleAuthChallenge } from '@src/lib/auth/cognito/handleAuthChallenge'
import { CognitoChangePasswordSchema } from '@src/lib/schemas'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import { PasswordInput } from './PasswordInput'

const SetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof CognitoChangePasswordSchema>>({
    resolver: zodResolver(CognitoChangePasswordSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      currentPassword: searchParams.get('token') ?? '',
      newPassword: '',
      verifyNewPassword: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof CognitoChangePasswordSchema>) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      try {
        const res = await handleAuthChallenge(vals)

        if (res?.error) {
          setError(`Error: ${res.error}`)
        } else {
          router.push('/auth/login')
        }
      } catch (err: any) {
        setError(err.message || ' failed. Please try again.')
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl max-w-7xl tracking-tighter font-regular">
            New Password Required
          </h1>
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
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="current-password"
                      id="currentPassword"
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

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      id="newPassword"
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

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="verifyNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      id="verifyNewPassword"
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
              'Update Password'
            ) : (
              <div className="w-full flex justify-center items-center">
                <Loader2 className="h-6 w-6 text-text-inverted animate-spin ml-2 m-1" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SetPasswordForm
