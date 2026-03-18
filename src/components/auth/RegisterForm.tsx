'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { register } from '@server/auth/register'
import { RegisterSchema } from '@server/auth/schemas'
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
import { Loader2, Mail, ShieldPlus, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'
import HoverLink from '../HoverLink'
import { Label } from '../ui/label'
import { PasswordInput } from './PasswordInput'

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', name: '' },
  })

  const onSubmit = (vals: z.infer<typeof RegisterSchema>) => {
    setError('')
    setSuccess('')
    startTransition(async () => {
      await register(vals).then((res) => {
        if (res.success) {
          if (typeof window !== 'undefined')
            localStorage.setItem('verify_email', vals.email)
          router.push('/auth/verify')
        } else {
          setError(res.error)
        }
      })
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <Badge
          variant="outline"
          className="bg-primary text-white border-none px-2.5 py-0.5 rounded-full font-black text-[8px] uppercase tracking-[0.2em] shadow-md -rotate-1 w-fit mb-1"
        >
          Registration Portal
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-[0.8] uppercase">
          CREATE new <br />
          <span className="text-tertiary italic font-serif text-3xl lg:text-4xl">
            Account
          </span>
        </h1>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-3 relative"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-2.5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">
                    Username
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="USERNAME"
                        className="h-10 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all rounded-none font-mono text-xs tracking-widest pl-9"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[8px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Email Identification
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="NAME@SYSTEM.IO"
                        className="h-10 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all rounded-none font-mono text-xs tracking-widest pl-9"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[8px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Password
                  </Label>
                  <FormControl>
                    <div className="relative group">
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="••••••••"
                        className="h-10 border-2 placeholder:text-text/50 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 transition-all rounded-none pl-9"
                      />
                      <ShieldPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[8px] font-bold uppercase text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 pt-1">
            <FormSuccess message={success} />
            <FormError message={error} />
            <div className="py-2">
              <p className="text-[9px] font-mono leading-relaxed text-muted-foreground uppercase tracking-tighter">
                By initializing this account, you acknowledge the
                <HoverLink
                  href="/termsofservice"
                  className="text-blue-600 hover:text-red-500 underline underline-offset-2 mx-1"
                >
                  Terms of Service
                </HoverLink>
                and authorize the
                <HoverLink
                  href="/privacy"
                  className="text-blue-600 hover:text-red-500 underline underline-offset-2 mx-1"
                >
                  Privacy Policy
                </HoverLink>
                .
              </p>
            </div>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-12 bg-tertiary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-red-500 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Start your journey
                  <ShieldPlus className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RegisterForm
