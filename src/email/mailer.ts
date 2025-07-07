import { Resend } from 'resend'
import { InvitationEmail } from './templates/InvitationEmail'
import type { z } from 'zod'
import type { ContactSchema } from '@src/lib/schemas'
import { ContactEmail } from './templates/ContactEmail'

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY ?? '')
}

export const sendCompanyInvitationEmail = async (params: {
  identifier: string
  url: string
  teamName: string
  inviterName: string
}) => {
  const { identifier, url, teamName, inviterName } = params
  const { host } = new URL(url)

  const resend = getResendClient()
  const email = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: identifier,
    subject: `Invitation to ${host}`,
    react: InvitationEmail({ inviterName, teamName, url: url }),
  })

  if (email.error) {
    throw new Error(`Email could not be sent, ${email.error}`)
  }
}

export const sendContactEmail = async ({
  email,
  firstName,
  lastName,
  message,
  phone,
}: z.infer<typeof ContactSchema>) => {
  const resend = getResendClient()
  const res = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: 'nussartz@gmail.com',
    subject: 'New Contact Message',
    react: ContactEmail({ email, firstName, lastName, message, phone }),
  })

  if (res.error) {
    throw new Error(`Email could not be sent, ${res.error}`)
  }
}
