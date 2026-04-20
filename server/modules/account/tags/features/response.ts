import type { Tag } from '@/prisma/generated/client'

export type TagResponse = {
  id: string
  title: string
}

export const toTagResponse = (tag: Tag): TagResponse => ({
  id: tag.id,
  title: tag.title,
})
