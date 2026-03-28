import type { AppContext } from '@/server/shared/infrastructure/types'
import { TagRepository } from '../../infrastructure/tag.repo'

export const DeleteTagCommand =
  ({ db, logger }: AppContext) =>
  async (tagId: string) => {
    logger.info({ tagId }, 'Deleting tag')

    const repo = TagRepository(db)
    await repo.remove(tagId)
  }
