import db from '@db'
import type { CreateTagType, UpdateTagType } from '@server/domain/tagSchema'
import { TagMapper } from '@server/mapping/tag/tagMapper'

const getAllTeamTags = async (teamId: string) => {
  const tags = await db.tag.findMany({
    where: {
      teamId,
    },
    orderBy: {
      title: 'asc',
    },
  })

  return tags.map((t) => TagMapper.mapDefaultToApi(t))
}

const createNewTeamTag = async (input: CreateTagType, teamId: string) => {
  const tag = await db.tag.create({
    data: {
      ...input,
      teamId,
    },
  })

  return TagMapper.mapDefaultToApi(tag)
}

const updateTag = async (
  tagId: string,
  input: UpdateTagType,
  teamId: string,
) => {
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
}

const deleteTag = async (id: string, teamId: string) => {
  return await db.tag.delete({
    where: {
      teamId,
      id: id,
    },
  })
}

export const TagService = {
  updateTag,
  createNewTeamTag,
  getAllTeamTags,
  deleteTag,
}
