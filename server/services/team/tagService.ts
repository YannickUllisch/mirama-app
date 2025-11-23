import type { CreateTagType, UpdateTagType } from '@server/domain/tagSchema'
import { TagMapper } from '@server/mapping/general/tagMapper'
import db from '@server/utils/db'

export const TagService = {
  getAllTeamTags: async (teamId: string) => {
    const tags = await db.tag.findMany({
      where: {
        teamId,
      },
      orderBy: {
        title: 'asc',
      },
    })

    return tags.map((t) => TagMapper.mapDefaultToApi(t))
  },

  createNewTeamTag: async (input: CreateTagType, teamId: string) => {
    const tag = await db.tag.create({
      data: {
        ...input,
        teamId,
      },
    })

    return TagMapper.mapDefaultToApi(tag)
  },

  updateTag: async (tagId: string, input: UpdateTagType, teamId: string) => {
    const tag = await db.tag.update({
      where: {
        teamId,
        id: tagId,
      },
      data: {
        ...input,
      },
    })

    return TagMapper.mapDefaultToApi(tag)
  },

  deleteTag: async (id: string, teamId: string) => {
    return await db.tag.delete({
      where: {
        teamId,
        id: id,
      },
    })
  },
}
