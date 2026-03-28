import type { AppContext } from '@/server/shared/infrastructure/types'
import { OrganizationEntity } from '../../domain/organization.entity'
import { OrganizationRepository } from '../../infrastructure/organization.repo'
import { toOrganizationResponse } from '../response'
import type { CreateOrganizationRequest } from './schema'

export const CreateOrganizationCommand =
  ({ db, logger }: AppContext) =>
  async (input: CreateOrganizationRequest) => {
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

    return toOrganizationResponse(org)
  }
