'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleAuthChallenge } from '@server/auth/cognito/handleAuthChallenge'
import { CognitoChangePasswordSchema } from '@server/auth/schemas'
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
import { KeyRound, Loader2, Lock, User } from 'lucide-react'
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
      await handleAuthChallenge(vals).then((res) => {
        if (res?.error) setError(`Error: ${res.error}`)
        else {
          setSuccess('Password updated successfully. Redirecting...')
          setTimeout(() => router.push('/auth/login'), 2000)
        }
      })
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-red-500 text-white border-none px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] shadow-md -rotate-1 w-fit"
        >
          Password Update Required
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
          SET NEW <br />
          <span className="text-blue-600 italic font-serif text-3xl">
            Password
          </span>
        </h1>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-relaxed">
          Please update your temporary password to secure your account.
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5 md:col-span-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Email Address
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        disabled={true}
                        className="h-11 border-2 border-border/60 bg-muted/30 rounded-none font-mono text-xs pl-10"
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Current Password Field */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5 md:col-span-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Temporary Password
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="Enter temporary password"
                        className="h-11 border-2 border-border/60 bg-transparent rounded-none pl-10"
                      />
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    New Password
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="••••••••"
                        className="h-11 border-2 border-border/60 bg-transparent rounded-none pl-10"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />

            {/* Verify Password Field */}
            <FormField
              control={form.control}
              name="verifyNewPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Confirm Password
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="••••••••"
                        className="h-11 border-2 border-border/60 bg-transparent rounded-none pl-10"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-4">
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
                  Update Password
                  <Lock className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SetPasswordForm
