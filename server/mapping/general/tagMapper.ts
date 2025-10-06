import type { Tag } from '@prisma/client'
import type { TagResponseType } from '@server/domain/tagSchema'

const mapDefaultToApi = (input: Tag): TagResponseType => {
  return {
    ...input,
  }
}

export const TagMapper = {
  mapDefaultToApi,
}
