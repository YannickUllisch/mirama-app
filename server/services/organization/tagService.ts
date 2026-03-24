import type { CreateTagType, UpdateTagType } from '@server/domain/tagSchema'
import { TagMapper } from '@server/mapping/organization/tagMapper'
import db from '@server/utils/db'

export const TagService = {
  getAllTeamTags: async (organizationId: string) => {
    const tags = await db.tag.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        title: 'asc',
      },
    })

    return tags.map((t) => TagMapper.mapDefaultToApi(t))
  },

  createNewTeamTag: async (input: CreateTagType, organizationId: string) => {
    const tag = await db.tag.create({
      data: {
        ...input,
        organizationId,
      },
    })

    return TagMapper.mapDefaultToApi(tag)
  },

  updateTag: async (
    tagId: string,
    input: UpdateTagType,
    organizationId: string,
  ) => {
    const tag = await db.tag.update({
      where: {
        organizationId,
        id: tagId,
      },
      data: {
        ...input,
      },
    })

    return TagMapper.mapDefaultToApi(tag)
  },

  deleteTag: async (id: string, organizationId: string) => {
    return await db.tag.delete({
      where: {
        organizationId,
        id: id,
      },
    })
  },
}
