import { CreateTagSchema, UpdateTagSchema } from '@server/domain/tagSchema'
import { TagService } from '@server/services/team/tagService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

const getTags = async (
  _req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const tags = await TagService.getAllTeamTags(session.user.teamId)
  return Response.json(tags, { status: 200 })
}

const createTag = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  // Parsing and validating body
  const body = await req.json()
  const input = CreateTagSchema.parse(body)

  const tag = await TagService.createNewTeamTag(input, session.user.teamId)
  return Response.json(tag, { status: 201 })
}

const updateTag = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  // Fetching ID from query
  const tid = getDynamicRoute(req)

  // Parsing and validating body
  const body = await req.json()
  const input = UpdateTagSchema.parse(body)

  const tag = await TagService.updateTag(tid, input, session.user.teamId)
  return Response.json(tag, { status: 200 })
}

const deleteTag = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const tid = getDynamicRoute(req)

  await TagService.deleteTag(tid, session.user.teamId)

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const TagController = {
  getTags,
  deleteTag,
  updateTag,
  createTag,
}
