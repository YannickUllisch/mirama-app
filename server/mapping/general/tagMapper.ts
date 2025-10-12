import type { Tag } from '@prisma/client'
import type { TagResponseType } from '@server/domain/tagSchema'

export const TagMapper = {
  mapDefaultToApi: (input: Tag): TagResponseType => {
    return {
      id: input.id,
      title: input.title,
    }
  },
}
