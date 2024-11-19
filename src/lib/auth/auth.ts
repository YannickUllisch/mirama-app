import NextAuth from 'next-auth'
import { db } from '@src/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Role } from '@prisma/client'
import authConfig from './auth.config'
import { getUserByEmail, getUserById } from '../api/queries/User/UserQueries'
import ResendProvider from 'next-auth/providers/resend'
import { resend } from '@/src/email/mailer'

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
      if (account?.provider === 'google' && user.id) {
        const existingUser = await getUserByEmail(profile?.email ?? 'undef')

        if (!existingUser?.emailVerified) {
          return false
        }

        await db.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
          },
          create: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            type: account.type,
            scope: account.scope,
            id_token: account.id_token,
            token_type: account.token_type,
          },
        })

        return true
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

      if (token.provider && session.user) {
        session.user.provider = token.provider as string
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
  providers: [
    ...authConfig.providers,
    ResendProvider({
      from: 'noreply@onresend.com',
      apiKey: process.env.RESEND_API_KEY,
      // Currently doesnt work due to non verified from Email
    }),
  ],
})
