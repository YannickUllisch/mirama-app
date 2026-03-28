import type { AppContext } from '@/server/shared/infrastructure/types'
import { TagRepository } from '../../infrastructure/tag.repo'
import { toTagResponse } from '../response'
import type { UpdateTagRequest } from './schema'

export const UpdateTagCommand =
  ({ db, logger }: AppContext) =>
  async (tagId: string, input: UpdateTagRequest) => {
    logger.info({ tagId }, 'Updating tag')

    const repo = TagRepository(db)
    const tag = await repo.update(tagId, { title: input.title })

    return toTagResponse(tag)
  }
