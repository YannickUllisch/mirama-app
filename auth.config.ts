import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { LoginSchema } from '@src/lib/schemas'
import { getUserByEmail } from './src/lib/user'
import Google from 'next-auth/providers/google'

import bcrypt from 'bcryptjs'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
