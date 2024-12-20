import { Resend } from 'resend'
import { InvitationEmail } from './templates/InvitationEmail'

export const resend = new Resend(process.env.RESEND_API_KEY ?? '')

export const sendCompanyInvitationEmail = async (params: {
  identifier: string
  url: string
  teamName: string
  inviterName: string
}) => {
  const { identifier, url, teamName, inviterName } = params
  const { host } = new URL(url)

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
