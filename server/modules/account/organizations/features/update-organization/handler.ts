import type { AppContext } from '@/server/shared/infrastructure/types'
import { OrganizationEntity } from '../../domain/organization.entity'
import { OrganizationRepository } from '../../infrastructure/organization.repo'
import { toOrganizationResponse } from '../response'
import type { UpdateOrganizationRequest } from './schema'

export const UpdateOrganizationCommand =
  ({ db, logger }: AppContext) =>
  async (organizationId: string, input: UpdateOrganizationRequest) => {
    logger.info({ organizationId }, 'Updating organization')

    const repo = OrganizationRepository(db)
    const org = await repo.findById(organizationId)

    if (!org) throw new Error('Organization not found')

    const data: Record<string, unknown> = { ...input }

    // If name changed, regenerate slug and check uniqueness
    if (input.name) {
      const newSlug = OrganizationEntity.createSlug(input.name)
      const existing = await repo.findBySlug(newSlug)

      if (existing && existing.id !== organizationId) {
        throw new Error(
          'An organization with this name already exists in your account.',
        )
      }

      data.slug = newSlug
    }

    const updated = await repo.update(organizationId, data)

    return toOrganizationResponse(updated)
  }
