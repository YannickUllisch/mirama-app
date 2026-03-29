'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { resendConfirmationCode } from '@server/auth/cognito/resendConfirmation'
import { VerifySchema } from '@server/auth/schemas'
import { verify } from '@server/auth/verify'
import { FormError } from '@src/components/auth/popups/FormError'
import { FormSuccess } from '@src/components/auth/popups/FormSuccess'
import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@ui/input-otp'
import { Loader2, RefreshCw, ShieldCheck } from 'lucide-react'
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
      await verify(vals).then((res) => {
        if (res.success) {
          router.push('/auth/login')
        } else {
          setError(res.error || 'Verification failed. Please try again.')
        }
      })
    })
  }

  const handleResend = async () => {
    setError('')
    setSuccess('')
    const result = await resendConfirmationCode(form.getValues('email'))
    if (result.success) {
      setSuccess('New verification code dispatched.')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-primary text-white border-none px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] shadow-md -rotate-1 w-fit"
        >
          Security Protocol
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
          VERIFY <br />
          <span className="text-blue-600 italic font-serif text-3xl">
            Identity
          </span>
        </h1>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
          Enter the 6-digit sequence sent to your node.
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Target Email Identification
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="NAME@EMAIL.COM"
                      className="h-11 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all rounded-none font-mono text-xs tracking-widest"
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmationCode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center block">
                    Verification_Sequence
                  </Label>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2 font-mono">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="w-10 h-12 border-2 border-border/60 bg-transparent rounded-none text-lg font-black focus:border-blue-600 transition-all"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500 text-center" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormSuccess message={success} />
            <FormError message={error} />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-14 bg-tertiary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-red-500 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Confirm Code
                  <ShieldCheck className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isPending}
              className="w-full text-center flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-blue-600 transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 ${isPending ? 'animate-spin' : ''}`}
              />
              Resend_Access_Code
            </button>
          </div>
        </form>
      </Form>

      <div className="relative pt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted/40" />
        </div>
        <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
          <span className="bg-background px-4 text-muted-foreground/60 italic">
            Need system support? Contact Admin
          </span>
        </div>
      </div>
    </div>
  )
}

export default VerifyForm
