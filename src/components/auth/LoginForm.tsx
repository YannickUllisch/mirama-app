'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@server/auth/login'
import { LoginSchema } from '@server/auth/schemas'
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
import { Loader2, Lock, ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import HoverLink from '../HoverLink'
import { Label } from '../ui/label'
import { PasswordInput } from './PasswordInput'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Security Protocol: Identity mismatch.'
      : ''

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (vals: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')
    startTransition(() => {
      login(vals).then((data) => {
        if (data) setError(data.error)
      })
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="bg-primary text-white border-none px-3 py-0.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] shadow-md -rotate-1 w-fit"
        >
          Auth Terminal
        </Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
          WELCOME <br />
          <span className="text-blue-600 italic font-serif text-3xl lg:text-5xl">
            Back!
          </span>
        </h1>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 relative"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Email Identification
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="NAME@EMAIL.COM"
                        className="h-11 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all rounded-none font-mono text-xs tracking-widest pl-10"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Security Key
                    </Label>
                    <HoverLink
                      href="/auth/forgot-password"
                      className="text-[9px] font-bold uppercase text-blue-600 hover:text-red-500 transition-colors"
                    >
                      Recover?
                    </HoverLink>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="••••••••"
                        className="h-11 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all rounded-none pl-10"
                      />
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[9px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3 pt-1">
            <FormSuccess message={success} />
            <FormError message={error || urlError} />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-14 bg-tertiary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-red-500 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ShieldCheck className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
