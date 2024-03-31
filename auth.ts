import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { db } from '@src/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { getUserById } from '@/src/lib/user'
import type { UserRole } from '@prisma/client'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    // Can be used to block unverified users on signin
    // async signIn({ user }) {
    //   if (user.id) {
    //     const existingUser = await getUserById(user.id)
    //     if (!existingUser || !existingUser.emailVerified) {
    //       return false
    //     }
    //   }
    //   return true
    // },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }
      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
