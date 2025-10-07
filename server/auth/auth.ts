import type { Role } from '@prisma/client'
import NextAuth from 'next-auth'
import { CreatePrismaAdapter } from './adapters/PrismaAdapter'
import authConfig from './auth.config'
import { getUserById } from './helpers/queries'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const adapter = CreatePrismaAdapter()
      const existingUser = getUserById(user.id ?? '')

      if (!existingUser) {
        try {
          // We call adapter function to reuse logic
          if (typeof adapter.createUser === 'function') {
            await adapter.createUser({
              emailVerified: new Date(),
              name: user.name ?? '',
              id: user.id ?? '',
              email: user.email ?? '',
            })
          } else {
            console.error('Create User is not Defined')
            return false
          }
        } catch (e) {
          console.error('Create User failed:', e)
          return false
        }
      }

      return true
    },
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
