import type { OrganizationRole, TenantRole } from '@prisma/client'
import NextAuth from 'next-auth'
import { CreatePrismaAdapter } from './adapters/PrismaAdapter'
import authConfig from './auth.config'
import { getUserById, tryGetOrganization } from './helpers/queries'

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
    async jwt({ token, user, trigger, session }) {
      if (!token.sub) return token

      if (user) {
      }
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.tenantId = existingUser.tenant?.id
      token.tenantRole = existingUser.role
      token.name = existingUser.name

      if (trigger === 'update' && session?.organizationId) {
        console.info(session.organizationId)

        const foundOrg = await tryGetOrganization(
          token.sub as string,
          session.organizationId,
        )

        console.info(foundOrg, token.sub)

        if (foundOrg) {
          token.organizationId = foundOrg.id
          token.orgRole = foundOrg.members[0].role
          token.tenantId = foundOrg.tenantId
        }
      }

      return token
    },
    session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.name = token.name as string
        session.user.tenantId = token.tenantId as string
        session.user.organizationId = token.organizationId as string
        session.user.orgRole = token.orgRole as OrganizationRole
        session.user.tenantRole = token.tenantRole as TenantRole
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
