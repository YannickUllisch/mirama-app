import type { AppContext } from '@/server/shared/infrastructure/types'
import database from '@db'
import { OrganizationRole } from '@prisma/client'
import { OrganizationEntity } from '../../domain/organization.entity'
import { OrganizationRepository } from '../../infrastructure/organization.repo'
import { toOrganizationResponse } from '../response'
import type { CreateOrganizationRequest } from './schema'

export const CreateOrganizationCommand =
  ({ db, logger }: AppContext) =>
  async (
    input: CreateOrganizationRequest,
    creator: { name: string; email: string },
  ) => {
    logger.info('Creating organization')
    const slug = OrganizationEntity.createSlug(input.name)

    const repo = OrganizationRepository(db)
    const existing = await repo.findBySlug(slug)

    if (existing) {
      throw new Error(
        'An organization with this name already exists in your account.',
      )
    }

    // tenantId is auto-injected by ScopedDb
    const org = await repo.create({ ...input, slug })

    await database.member.create({
      data: {
        name: creator.name,
        email: creator.email,
        role: OrganizationRole.OWNER,
        organizationId: org.id,
      },
    })

    return toOrganizationResponse(org)
  }
