import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { LoginSchema } from '@src/lib/schemas'
import bcrypt from 'bcryptjs'
import GoogleProvider from 'next-auth/providers/google'
import ResendProvider from 'next-auth/providers/resend'
import { getUserByEmail } from '../api/queries/User/UserQueries'
import { resend } from '@/src/email/mailer'
import { db } from '@db'

export default {
  providers: [
    // ResendProvider({
    //   from: 'noreply@onresend.com',
    //   apiKey: process.env.RESEND_API_KEY,
    //   async sendVerificationRequest({ identifier, url, token, expires }) {
    //     const baseUrl = new URL(url).origin
    //     console.log(baseUrl, identifier)
    //     await db.verificationToken.create({
    //       data: {
    //         identifier: identifier,
    //         expires,
    //         token,
    //       },
    //     })
    //     // Construct the sign-in link
    //     const signInUrl = `${baseUrl}/auth/verify?token=${token}&email=${encodeURIComponent(
    //       identifier,
    //     )}`

    //     await resend.emails.send({
    //       from: 'noreply@onresend.com',
    //       to: identifier,
    //       subject: 'Your sign-in link',
    //       text: `Sign in to your account using the following link: ${signInUrl}`,
    //       html: `<p>Sign in to your account using the following link:</p>
    //        <p><a href="${signInUrl}">${signInUrl}</a></p>`,
    //     })
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      issuer: 'https://accounts.google.com',
      profile: (profile) => {
        return {
          id: profile.sub,
          email: profile.email,
          image: profile.image,
          name: profile.name,
          teamId: profile.tid,
        }
      },
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope:
            'openid email profile https://www.googleapis.com/auth/calendar',
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedfields = LoginSchema.safeParse(credentials)

        if (validatedfields.success) {
          const { email, password } = validatedfields.data

          const user = await getUserByEmail(email)

          if (!user || !user.password) return null

          const passwordMatch = await bcrypt.compare(password, user.password)

          if (passwordMatch) {
            return user
          }
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
