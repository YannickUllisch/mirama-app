import { getSystemRole } from '@/server/shared/domain/iam-defaults'
import { PrismaAdapter } from '@auth/prisma-adapter'
import db from '@db'
import { InvitationStatus, TenantRole } from '@prisma/client'

export const CreatePrismaAdapter = () => {
  const adapter = PrismaAdapter(db)

  adapter.createUser = async (user: any) => {
    const invitation = await db.organizationInvitation.findFirst({
      where: { email: user.email, status: InvitationStatus.PENDING },
    })

    return await db.$transaction(async (tx) => {
      const dbUser = await tx.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: TenantRole.USER,
          emailVerified: new Date(),
        },
      })

      await tx.tenant.create({
        data: {
          adminUserId: user.id,
          userId: user.id,
          settings: {
            create: {
              name: `${user.name || 'My'}'s Workspace`,
              isActive: true,
              brandingColor: '#000000',
              receiveNotifications: true,
            },
          },
        },
      })

      // If there was an invitation, create the Member record immediately
      if (invitation) {
        // Resolve the IAM role, use invitation's iamRoleId if present,
        // otherwise fall back to the system "Member" role
        const iamRole = invitation.iamRoleId
          ? await tx.role.findFirst({ where: { id: invitation.iamRoleId } })
          : await getSystemRole(tx, 'Member')

        if (!iamRole) {
          throw new Error('Could not resolve IAM role for invited member')
        }

        await tx.member.create({
          data: {
            email: user.email,
            name: user.name,
            userId: user.id,
            organizationId: invitation.organizationId,
            role: invitation.role,
            iamRoleId: iamRole.id,
          },
        })

        await tx.organizationInvitation.delete({
          where: { email: invitation.email },
        })
      }

      return dbUser
    })
  }

  return adapter
}
