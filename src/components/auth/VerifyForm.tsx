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
import { confirmUser } from '@src/lib/auth/confirmUser'
import { resendConfirmationCode } from '@src/lib/auth/resendConfirmation'
import { VerifySchema } from '@src/lib/schemas'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@ui/input-otp'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

const VerifyForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      email:
        typeof window !== 'undefined'
          ? (localStorage.getItem('verify_email') ?? '')
          : '',
      confirmationCode: '',
    },
  })

  const onSubmit = (vals: z.infer<typeof VerifySchema>) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      try {
        await confirmUser({
          email: vals.email,
          code: vals.confirmationCode,
        })

        if (typeof window !== 'undefined') {
          localStorage.removeItem('verify_email')
        }

        router.push('/auth/login')
      } catch (err: any) {
        setError(err.message || 'Verification failed. Please try again.')
      }
    })
  }

  const handleResend = async () => {
    const result = await resendConfirmationCode(form.getValues('email'))
    if (result.success) {
      setSuccess('A new verification code has been sent')
    } else {
      setError(result.error)
    }
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl max-w-7xl tracking-tighter font-regular">
            Verify your email
          </h1>
          <p className="text-balance text-xs text-muted-foreground">
            Enter the 6-digit code sent to your email address
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
              name="confirmationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
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
              'Verify Email'
            ) : (
              <div className="w-full flex justify-center items-center">
                <Loader2 className="h-6 w-6 text-text-inverted animate-spin ml-2 m-1" />
              </div>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isPending}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </div>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-input">
          <span className="relative z-10 bg-transparent px-2 text-muted-foreground">
            Need help?
          </span>
        </div>

        <div className="text-center text-sm">
          Remember your password?{' '}
          <a href="/auth/login" className="underline underline-offset-4">
            Sign in
          </a>
        </div>
      </form>
    </Form>
  )
}

export default VerifyForm
