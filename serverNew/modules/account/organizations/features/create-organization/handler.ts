import type { AppContext } from '@/serverNew/shared/infrastructure/types'
import { OrganizationEntity } from '../../domain/organization.entity'
import type { CreateOrganizationRequest } from './schema'

export const CreateOrganizationCommand =
  ({ db, logger }: AppContext) =>
  async (tenantId: string, input: CreateOrganizationRequest) => {
    logger.info('Creating org...')
    const slug = OrganizationEntity.createSlug(input.name)

    const existing = await db.organization.findFirst({ where: { slug } })
    if (existing)
      throw new Error(
        'An organization with this name already exists in your account.',
      )

    return await db.organization.create({
      data: { ...input, slug, tenantId },
    })
  }
