import { PrismaAdapter } from '@auth/prisma-adapter'
import db from '@db'
import { InvitationStatus, TenantRole } from '@prisma/client'

export const CreatePrismaAdapter = () => {
  const adapter = PrismaAdapter(db)

  adapter.createUser = async (user: any) => {
    // 1. Check for existing invitations to an Organization
    const invitation = await db.organizationInvitation.findFirst({
      where: { email: user.email, status: InvitationStatus.PENDING },
    })

    return await db.$transaction(async (tx) => {
      // 2. Create the User first with a placeholder or temporary link
      // or create Tenant first. Let's create Tenant then User.
      const newTenant = await tx.tenant.create({
        data: {
          name: `${user.name || 'My'}'s Workspace`,
          isActive: true,
          adminUserId: user.id, // We'll update this or use the ID from Cognito
          logoUrl: null,
          brandingColor: null,
          userId: user.id,
        },
      })

      const dbUser = await tx.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          tenant: {
            connect: {
              id: newTenant.id,
            },
          },
          role: TenantRole.USER,
          emailVerified: new Date(),
        },
      })

      // If there was an invitation, create the Member record immediately
      if (invitation) {
        await tx.member.create({
          data: {
            email: user.email,
            name: user.name,
            organizationId: invitation.organizationId,
            role: invitation.role,
          },
        })

        // Clean up invitation
        await tx.organizationInvitation.delete({
          where: { email: invitation.email, name: invitation.name },
        })
      }

      return dbUser
    })
  }

  return adapter
}
