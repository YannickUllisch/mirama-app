import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { LoginSchema } from '@src/lib/schemas'
import bcrypt from 'bcryptjs'
import GoogleProvider from 'next-auth/providers/google'
import { getUserByEmail } from './helpers/AuthQueries'

export default {
  trustHost: true,
  providers: [
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
