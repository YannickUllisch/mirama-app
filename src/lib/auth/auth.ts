import NextAuth from 'next-auth'
import db from '@db'
import type { Role } from '@prisma/client'
import authConfig from './auth.config'
import ResendProvider from 'next-auth/providers/resend'
import { CreatePrismaAdapter } from './adapters/PrismaAdapter'
import { getValidCompanyInvitation } from '../api/queries/Invite/InviteQueries'
import { getUserByEmail, getUserById } from './helpers/AuthQueries'

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

        // If invited but account hasnt been created
        if (!existingUser) {
          const existingInvite = await getValidCompanyInvitation({
            email: user.email ?? 'undef',
          })

          if (existingInvite) {
            await db.user.create({
              data: {
                email: existingInvite.email,
                name: existingInvite.name,
                role: existingInvite.role,
                teamId: existingInvite.teamId,
                emailVerified: new Date(),
              },
            })

            // Deleting invitation in DB for cleanup
            // We remove all invites since we to this point only assume that they can be invited to a single company
            await db.companyInvitation.deleteMany({
              where: {
                email: existingInvite.email,
              },
            })

            return true
          }
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
    verifyRequest: '/auth/login',
  },
  adapter: CreatePrismaAdapter(),
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    ResendProvider({
      from: process.env.RESEND_EMAIL_FROM,
      apiKey: process.env.RESEND_API_KEY,
    }),
  ],
})
