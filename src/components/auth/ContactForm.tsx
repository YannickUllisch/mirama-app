'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ContactRequestSchema,
  type ContactRequestType,
} from '@server/domain/contactSchema'
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
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { PhoneInput } from '../ui/phone-input'
import { Textarea } from '../ui/textarea'

const RegisterForm = () => {
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
    <>
      <Form {...form}>
        <form
          className={'flex flex-col gap-6'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-left gap-2 text-left">
            <h1 className="text-4xl font-bold">Let's Get in Touch</h1>
            <p className="text-balance text-xs text-muted-foreground">
              Our lovely team would love to hear from you.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2 grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label>First Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="First Name"
                        type="text"
                        className="focus-visible:ring-black dark:focus-visible:ring-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Last Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Last Name"
                        type="text"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="you@company.com"
                        type="email"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label>Phone Number</Label>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        defaultCountry="GB"
                        disabled={isPending}
                        placeholder="Phone (Optional)"
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
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <Label>Message</Label>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        className="focus-visible:ring-black dark:focus-visible:ring-white min-h-[100px]"
                        {...form.register('message')}
                        placeholder="Leave us a message.."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isPending} type="submit" variant={'primary'}>
              Send Message
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default RegisterForm
