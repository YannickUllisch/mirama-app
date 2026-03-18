'use client'
import { FormError } from '@src/components/auth/popups/FormError'
import { FormSuccess } from '@src/components/auth/popups/FormSuccess'
import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import { Form } from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@ui/input-otp'
import { ArrowRight, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import HoverLink from '../HoverLink'
import { PasswordInput } from './PasswordInput'

// TODO: implement these server actions
// import { forgotPassword } from '@server/auth/cognito/forgotPassword'
// import { confirmForgotPassword } from '@server/auth/cognito/confirmForgotPassword'

const ForgotPasswordForm = () => {
  const [phase, setPhase] = useState<'REQUEST' | 'CONFIRM'>('REQUEST')
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '', code: '', password: '', confirmPassword: '' },
  })

  const onSendCode = async (_email: string) => {
    setError('')
    startTransition(async () => {
      // const res = await forgotPassword(email)
      // if (res.success) {
      setSuccess('Recovery sequence initiated. Check your email.')
      setPhase('CONFIRM')
      // } else { setError(res.error) }
    })
  }

  const onResetPassword = async (_values: any) => {
    setError('')
    startTransition(async () => {
      // const res = await confirmForgotPassword(values)
      // if (res.success) {
      setSuccess('Password updated. Redirecting to login...')
      setTimeout(() => router.push('/auth/login'), 2000)
      // } else { setError(res.error) }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-tertiary text-white border-none px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] shadow-md -rotate-1 w-fit"
        >
          {phase === 'REQUEST' ? 'Identity Recovery' : 'Verification Required'}
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
          {phase === 'REQUEST' ? (
            <>
              FORGOT <br />
              <span className="text-blue-600 italic font-serif text-3xl">
                Password?
              </span>
            </>
          ) : (
            <>
              RESET <br />
              <span className="text-red-500 italic font-serif text-3xl">
                Password
              </span>
            </>
          )}
        </h1>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-relaxed">
          {phase === 'REQUEST'
            ? 'Enter your email to receive a recovery code.'
            : 'Enter the 6-digit code and your new password.'}
        </p>
      </div>

      <Form {...form}>
        <form className="flex flex-col gap-5">
          {phase === 'REQUEST' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Registered Email
                </Label>
                <div className="relative group">
                  <Input
                    placeholder="NAME@EMAIL.COM"
                    onChange={(e) => form.setValue('email', e.target.value)}
                    className="h-11 border-2 border-border/60 bg-transparent rounded-none font-mono text-xs pl-10"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600" />
                </div>
              </div>
              <Button
                onClick={() => onSendCode(form.getValues('email'))}
                disabled={isPending}
                type="button"
                className="w-full h-14 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-none shadow-[4px_4px_0px_0px_rgba(59,130,246,0.2)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    Request Code <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* OTP Slots */}
              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center block">
                  Verification_Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    onChange={(val) => form.setValue('code', val)}
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-10 h-12 border-2 border-border/60 bg-transparent rounded-none text-lg font-black focus:border-red-500"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Password Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    New Password
                  </Label>
                  <PasswordInput
                    onChange={(e) => form.setValue('password', e.target.value)}
                    className="h-11 border-2 border-border/60 bg-transparent rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Confirm Password
                  </Label>
                  <PasswordInput
                    onChange={(e) =>
                      form.setValue('confirmPassword', e.target.value)
                    }
                    className="h-11 border-2 border-border/60 bg-transparent rounded-none"
                  />
                </div>
              </div>

              <Button
                onClick={form.handleSubmit(onResetPassword)}
                disabled={isPending}
                className="w-full h-14 bg-tertiary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-red-500 transition-all flex items-center justify-center gap-2 group"
              >
                {isPending ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <>
                    Update Password{' '}
                    <ShieldCheck className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          )}

          <FormSuccess message={success} />
          <FormError message={error} />
        </form>
      </Form>

      <div className="text-center">
        <HoverLink
          href="/auth/login"
          className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-blue-600 transition-colors"
        >
          Return_to_Login
        </HoverLink>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
