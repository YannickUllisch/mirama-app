import type { Role } from '@prisma/client'
import NextAuth from 'next-auth'
import { CreatePrismaAdapter } from './adapters/PrismaAdapter'
import authConfig from './auth.config'
import { getUserById } from './helpers/AuthQueries'

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.teamId = existingUser.teamId
      token.role = existingUser.role
      token.name = existingUser.name
      if (user && 'refreshToken' in user) {
        token.refreshToken = user.refreshToken ?? ''
      }

      return token
    },
    session({ token, session }) {
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

      if (token.provider && session.user) {
        session.user.refreshToken = token.refreshToken as string
      }

      return session
    },
  },
  pages: {
    error: '/error',
    newUser: '/',
    signIn: '/auth/login',
    signOut: '/',
    verifyRequest: '/auth/login',
  },
  adapter: CreatePrismaAdapter(),
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
  providers: [...authConfig.providers],
})
