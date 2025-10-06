import db from '@db'
import type { CreateTagType, UpdateTagType } from '@server/domain/tagSchema'

const getAllTeamTags = async (teamId: string) => {
  return await db.tag.findMany({
    where: {
      teamId,
    },
  })
}

const createNewTeamTag = async (input: CreateTagType, teamId: string) => {
  const tag = await db.tag.create({
    data: {
      ...input,
      teamId,
    },
  })

  return tag
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

  return tag
}

const deleteTags = async (ids: string[], teamId: string) => {
  const tag = await db.tag.deleteMany({
    where: {
      teamId,
      id: { in: ids },
    },
  })

  return tag
}

export const TagService = {
  updateTag,
  createNewTeamTag,
  getAllTeamTags,
  deleteTags,
}
