import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { getUserByEmail } from '@src/lib/user'
import { LoginSchema } from '@src/lib/schemas'

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedfields = LoginSchema.safeParse(credentials)

        if (validatedfields.success) {
          const { email } = validatedfields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          //const passwordMatch = await bcrypt.compare(password, user.password)

          //if (passwordMatch) return user

          return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
