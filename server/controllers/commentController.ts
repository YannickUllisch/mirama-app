import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from '@server/domain/commentSchema'
import { CommentService } from '@server/services/general/commentService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

const getCommentsByTaskId = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const cid = getDynamicRoute(req)

  const isAdminOrOwner = isTeamAdminOrOwner(session)
  const comments = await CommentService.getCommentsByTaskId(
    cid,
    session.user.id ?? '',
    isAdminOrOwner,
  )
  return Response.json(comments, { status: 200 })
}

const createComment = async (
  req: NextRequest,
  _session: Session,
  _logger: Logger,
) => {
  // Parsing and validating body
  const body = await req.json()
  const input = CreateCommentSchema.parse(body)

  const comment = await CommentService.createComment(input)
  return Response.json(comment, { status: 201 })
}

const updateComment = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  // Fetching ID from query
  const tid = getDynamicRoute(req)

  // Parsing and validating body
  const body = await req.json()
  const input = UpdateCommentSchema.parse(body)

  const comment = await CommentService.updateComment(
    tid,
    session.user.id ?? '',
    input,
  )
  return Response.json(comment, { status: 200 })
}

const deleteComment = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const tid = getDynamicRoute(req)

  const roleCheck = isTeamAdminOrOwner(session)
  await CommentService.deleteComment(tid, session.user.id ?? '', roleCheck)

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const CommentController = {
  getCommentsByTaskId,
  createComment,
  deleteComment,
  updateComment,
}
