import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from '@server/domain/commentSchema'
import { CommentService } from '@server/services/general/commentService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getCommentsByTaskId = async (req: NextRequest, session: Session) => {
  const cid = getDynamicRoute(req)

  const isAdminOrOwner = isTeamAdminOrOwner(session)
  const comments = await CommentService.getCommentsByTaskId(
    cid,
    session.user.id ?? '',
    isAdminOrOwner,
  )
  return Response.json(comments, { status: 200 })
}

const createComment = async (req: NextRequest, _session: Session) => {
  // Parsing and validating body
  const body = await req.json()
  const input = CreateCommentSchema.parse(body)

  const tag = await CommentService.createComment(input)
  return Response.json(tag, { status: 201 })
}

const updateComment = async (req: NextRequest, _session: Session) => {
  // Fetching ID from query
  const tid = getDynamicRoute(req)

  // Parsing and validating body
  const body = await req.json()
  const input = UpdateCommentSchema.parse(body)

  const tag = await CommentService.updateComment(tid, input)
  return Response.json(tag, { status: 200 })
}

const deleteTag = async (req: NextRequest, session: Session) => {
  const tid = getDynamicRoute(req)

  await CommentService.deleteComment(tid, session.user.id ?? '')

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const CommentController = {
  getCommentsByTaskId,
  createComment,
  deleteTag,
  updateComment,
}
