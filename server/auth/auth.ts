import NextAuth from 'next-auth'
import authConfig from './auth.config'
import {
  getOrganizationMembership,
  getUserByEmail,
  getUserByExternalId,
  linkUserExternalId,
  setupUser,
} from './helpers/queries'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile, account }) {
      const externalId = account?.providerAccountId ?? user.id ?? ''
      const email = user.email ?? profile?.email ?? ''

      if (!externalId || !email) return false

      const existingById = await getUserByExternalId(externalId)
      if (existingById) return true

      const existingByEmail = await getUserByEmail(email)
      if (existingByEmail) {
        return linkUserExternalId(existingByEmail.userId, externalId)
      }

      return setupUser({
        id: externalId,
        name: user.name ?? profile?.name ?? 'Unknown',
        email,
        image: profile?.picture ?? user.image ?? null,
      })
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account) {
        token.sub = account.providerAccountId ?? user?.id ?? token.sub
      }

      if (!token.sub) return token

      const me = await getUserByExternalId(token.sub)
      if (!me) return token

      token.userId = me.userId
      token.tenantId = me.tenantId
      token.name = me.name
      token.tenantRole = me.tenantRole
      token.iss = process.env.NEXT_AUTH_ISS
      token.aud = process.env.NEXT_AUTH_AUD

      if (me.organizationInfo) {
        token.organizationId = me.organizationInfo.organizationId
        token.memberId = me.organizationInfo.memberId
        token.tenantId = me.organizationInfo.tenantId
        token.roleId = me.organizationInfo.iamRoleIds[0]
      }

      if (trigger === 'update' && session?.organizationId === null) {
        token.organizationId = undefined
        token.roleId = undefined
        token.memberId = undefined
        token.userId = undefined
        token.tenantRole = undefined
      } else if (trigger === 'update' && session?.organizationId) {
        const membership = await getOrganizationMembership(
          token.sub,
          session.organizationId,
        )
        if (membership) {
          token.organizationId = membership.organizationId
          token.roleId = membership.iamRoleIds[0]
          token.memberId = membership.memberId
          token.tenantId = membership.tenantId
          token.userId = membership.userId
          token.tenantRole = membership.tenantRole
        }
      }

      return token
    },
    session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.name = token.name
        session.user.tenantId = token.tenantId as string
        session.user.organizationId = token.organizationId as string | undefined
        session.user.roleId = token.roleId as string | undefined
        session.user.memberId = token.memberId as string | undefined
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
  session: {
    strategy: 'jwt',
  },
  providers: [...authConfig.providers],
})
