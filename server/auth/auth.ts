import NextAuth from 'next-auth'
import authConfig from './auth.config'
import {
  getOrganizationMembership,
  getUserByExternalId,
  setupUser,
} from './helpers/queries'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile }) {
      const externalId = user.id ?? ''
      if (!externalId) return false

      const existing = await getUserByExternalId(externalId)
      if (existing) return true

      const ok = await setupUser({
        id: externalId,
        name: user.name ?? profile?.name ?? 'Unknown',
        email: user.email ?? profile?.email ?? '',
        image: profile?.picture ?? user.image ?? null,
      })

      return ok
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account) {
        token.sub = user?.id ?? token.sub
      }

      if (!token.sub) return token

      const me = await getUserByExternalId(token.sub)
      if (!me) return token

      token.tenantId = me.tenantId
      token.name = me.name
      token.iss = process.env.NEXT_AUTH_ISS
      token.aud = process.env.NEXT_AUTH_AUD

      if (!me.isOnboarded) {
        token.isOnboarded = false
      } else {
        delete token.isOnboarded
      }

      if (trigger === 'update' && session?.isOnboarded === true) {
        delete token.isOnboarded
      }

      if (me.organizationInfo) {
        token.organizationId = me.organizationInfo.id
        token.memberId = me.organizationInfo.memberId
        token.tenantId = me.organizationInfo.tenantId
        token.roleId = me.organizationInfo.iamRoleId
      }

      if (trigger === 'update' && session?.organizationId === null) {
        token.organizationId = undefined
        token.roleId = undefined
        token.memberId = undefined
      } else if (trigger === 'update' && session?.organizationId) {
        const membership = await getOrganizationMembership(
          token.sub,
          session.organizationId,
        )
        if (membership) {
          token.organizationId = membership.id
          token.roleId = membership.iamRoleId
          token.memberId = membership.memberId
          token.tenantId = membership.tenantId
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

        if (token.isOnboarded !== undefined) {
          session.user.isOnboarded = token.isOnboarded as boolean
        } else {
          delete session.user.isOnboarded
        }
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
