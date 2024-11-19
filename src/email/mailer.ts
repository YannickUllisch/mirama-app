import { Resend } from 'resend'
import { EmailTemplate } from './templates/SignInEmailTemplate'

export const resend = new Resend(process.env.RESEND_API_KEY ?? '')

export const sendVerificationRequest = async (params: {
  identifier: string
  url: string
  expires: Date
  token: string
  request: Request
}) => {
  const { identifier, url } = params
  const { host } = new URL(url)

  // Use azure mailer to send email
  const result = await resend.emails.send({
    from: 'Mirama <noreply@mirama.dev',
    to: identifier,
    subject: `Sign in to ${host}`,
    react: EmailTemplate({ firstName: 'John' }),
  })

  if (result.error) {
    throw new Error(`Email could not be sent, ${result.error}`)
  }
}
