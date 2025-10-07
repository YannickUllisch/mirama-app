import type { Tag } from '@prisma/client'
import type { TagResponseType } from '@server/domain/tagSchema'

const mapDefaultToApi = (input: Tag): TagResponseType => {
  return {
    id: input.id,
    title: input.title,
  }
}

export const TagMapper = {
  mapDefaultToApi,
}
