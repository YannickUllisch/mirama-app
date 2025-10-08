import type { Role } from '@prisma/client'
import NextAuth from 'next-auth'
import { CreatePrismaAdapter } from './adapters/PrismaAdapter'
import authConfig from './auth.config'
import { getUserById } from './helpers/queries'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile, account }) {
      const adapter = CreatePrismaAdapter()
      const existingUser = await getUserById(user.id ?? '')

      if (!existingUser) {
        if (account?.provider === 'credentials') {
          if (typeof adapter.createUser === 'function') {
            await adapter.createUser({
              email: user.email ?? '',
              emailVerified: new Date(),
              name: user.name ?? '',
              id: user.id ?? profile?.sub ?? '',
            })
          } else {
            console.error('Create User is not Defined')
            return false
          }
        }

        if (account?.provider === 'cognito') {
          if (typeof adapter.createUser === 'function') {
            await adapter.createUser({
              email: profile?.email ?? user.email ?? '',
              emailVerified: new Date(),
              name: profile?.name ?? user.name ?? '',
              id: profile?.sub ?? user.id ?? '',
            })
          } else {
            console.error('Create User is not Defined')
            return false
          }
          if (typeof adapter.linkAccount === 'function') {
            await adapter.linkAccount({
              ...account,
              userId: profile?.sub ?? user.id ?? '',
              type: account.type as any,
            })
          } else {
            console.error('Link Account is not Defined')
            return false
          }
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
