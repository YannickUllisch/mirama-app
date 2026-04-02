'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ContactRequestSchema,
  type ContactRequestType,
} from '@server/modules/public/contact/features/send-contact-request/schema'
import { Button } from '@src/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@src/components/ui/form'
import { Input } from '@src/components/ui/input'
import { postResource } from '@src/lib/api/postResource'
import { Loader2, Send } from 'lucide-react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { PhoneInput } from '../ui/phone-input'
import { Textarea } from '../ui/textarea'

const ContactForm = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactRequestType>({
    resolver: zodResolver(ContactRequestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (vals: ContactRequestType) => {
    startTransition(() => {
      postResource(
        'contact',
        vals,
        undefined,
        'Your message has been Sent!',
      ).then(() => form.reset())
    })
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col gap-4 relative'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid gap-3">
          {' '}
          {/* Tightened from gap-6 */}
          {/* Name Row */}
          <div className="grid gap-3 grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    First Name
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="FIRST"
                      className="h-10 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 rounded-none font-mono text-xs uppercase tracking-widest"
                    />
                  </FormControl>
                  <FormMessage className="text-[8px] uppercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Last Name
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="LAST"
                      className="h-10 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 rounded-none font-mono text-xs uppercase tracking-widest"
                    />
                  </FormControl>
                  <FormMessage className="text-[8px] uppercase" />
                </FormItem>
              )}
            />
          </div>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Email Address
                </Label>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="YOU@COMPANY.COM"
                    className="h-10 border-2 border-border/60 bg-transparent focus-visible:ring-0 focus-visible:border-blue-600 rounded-none font-mono text-xs uppercase tracking-widest"
                  />
                </FormControl>
                <FormMessage className="text-[8px] uppercase" />
              </FormItem>
            )}
          />
          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Phone Number
                </Label>
                <FormControl>
                  <PhoneInput
                    {...field}
                    defaultCountry="GB"
                    disabled={isPending}
                    placeholder="PHONE (OPTIONAL)"
                    className="h-10 [&_input]:h-10" // Force height on phone input internal
                  />
                </FormControl>
                <FormMessage className="text-[8px] uppercase" />
              </FormItem>
            )}
          />
          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Message
                </Label>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    placeholder="LEAVE US A MESSAGE..."
                    className="focus-visible:ring-0 focus-visible:border-blue-600 min-h-[80px] rounded-none border-2 border-border/60 bg-transparent font-mono text-xs uppercase tracking-widest"
                  />
                </FormControl>
                <FormMessage className="text-[8px] uppercase" />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            variant="secondary"
            className="h-12 bg-tertiary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-red-500 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Send Message{' '}
                <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ContactForm
