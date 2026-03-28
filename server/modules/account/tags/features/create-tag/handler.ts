import type { AppContext } from '@/server/shared/infrastructure/types'
import { TagRepository } from '../../infrastructure/tag.repo'
import { toTagResponse } from '../response'
import type { CreateTagRequest } from './schema'

export const CreateTagCommand =
  ({ db, logger }: AppContext) =>
  async (input: CreateTagRequest) => {
    logger.info({ title: input.title }, 'Creating tag')

    const repo = TagRepository(db)
    // organizationId is auto-injected by ScopedDb
    const tag = await repo.create({ title: input.title })

    return toTagResponse(tag)
  }
