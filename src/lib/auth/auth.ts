import NextAuth from 'next-auth'
import { db } from '@src/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Role } from '@prisma/client'
import authConfig from './auth.config'
import { getUserById } from '../api/queries/user'

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user }) {
      if (user.id) {
        const existingUser = await getUserById(user.id)

        // Prevent SignIn without email verification
        if (
          !existingUser ||
          !existingUser.emailVerified ||
          !existingUser.password
        ) {
          return false
        }
      }
      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role
      }

      if (token.teamId && session.user) {
        session.user.teamId = token.teamId as string
      }

      if (token.name && session.user) {
        session.user.name = token.name
      }

      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.teamId = existingUser.teamId
      token.role = existingUser.role
      token.name = existingUser.name

      return token
    },
  },
  pages: {
    error: '/',
    newUser: '/',
    signIn: '/auth/login',
    signOut: '/',
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
