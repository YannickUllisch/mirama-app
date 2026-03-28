import type { AppContext } from '@/server/shared/infrastructure/types'
import { TagRepository } from '../../infrastructure/tag.repo'
import { toTagResponse } from '../response'

export const GetTagsQuery =
  ({ db, logger }: AppContext) =>
  async () => {
    logger.info('Fetching all tags for the current organization')

    const repo = TagRepository(db)
    const tags = await repo.findAll()

    return tags.map(toTagResponse)
  }
