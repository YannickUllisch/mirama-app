import { CreateTagSchema, UpdateTagSchema } from '@server/domain/tagSchema'
import { TagService } from '@server/services/team/tagService'
import { fromTail } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

/**
 * Assumed route: /api/db/tag
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const getTags = async (
  _req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const tags = await TagService.getAllTeamTags(session.user.teamId)
  return Response.json(tags, { status: 200 })
}

/**
 * Assumed route: /api/db/tag
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
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

/**
 * Assumed route: /api/db/tag/${tagId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const updateTag = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  // Fetching ID from query
  const tid = fromTail(req)

  // Parsing and validating body
  const body = await req.json()
  const input = UpdateTagSchema.parse(body)

  const tag = await TagService.updateTag(tid, input, session.user.teamId)
  return Response.json(tag, { status: 200 })
}

/**
 * Assumed route: /api/db/tag/${tagId}
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const deleteTag = async (
  req: NextRequest,
  session: Session,
  logger: Logger,
) => {
  const tagLogger = logger.child({
    module: 'TagController',
    op: 'deleteTag',
  })
  const tid = fromTail(req)

  await TagService.deleteTag(tid, session.user.teamId)

  tagLogger.info({ tagId: tid, msg: 'Tag deleted' })

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
