import NextAuth from 'next-auth'
import { db } from '@src/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Role } from '@prisma/client'
import authConfig from './auth.config'
import { getUserByEmail, getUserById } from '../api/queries/User/UserQueries'

export const { handlers, auth, signIn, signOut } = NextAuth({
  events: {
    async linkAccount({ user }) {
      const existingUser = await getUserByEmail(user.email ?? 'undef')
      if (existingUser) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        })
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await getUserByEmail(profile?.email ?? 'undef')

        if (!existingUser?.emailVerified) {
          return false
        }
      }

      if (user.id && account?.provider === 'credentials') {
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

    async jwt({ token, account }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.teamId = existingUser.teamId
      token.role = existingUser.role
      token.name = existingUser.name

      if (account) {
        token.provider = account.provider
        token.providerAccountId = account.providerAccountId
      }

      return token
    },
  },
  pages: {
    error: '/error',
    newUser: '/',
    signIn: '/auth/login',
    signOut: '/',
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
})
