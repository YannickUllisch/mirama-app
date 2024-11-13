import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { LoginSchema } from '@src/lib/schemas'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '../api/queries/User/UserQueries'

export default {
  providers: [
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
