import { Role } from '@prisma/client'
import {
  createFavouriteController,
  deleteFavouriteController,
  getFavouritesController,
} from '@server/controllers/favouriteController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(getFavouritesController),
)

export const POST = withAuth(
  Object.values(Role),
  exceptionHandler(createFavouriteController),
)

export const DELETE = withAuth(
  Object.values(Role),
  exceptionHandler(deleteFavouriteController),
)

// export const PUT = auth(async (req) => {
//   try {
//     // Checking Permissions
//     const session = req.auth
//     const validatedRequest = await validateRequest(session)
//     if (validatedRequest) {
//       return validatedRequest
//     }
//     const id = req.nextUrl.searchParams.get('id') as string

//     if (!id) {
//       return Response.json(
//         { ok: false, message: 'Task ID needs to be defined in request' },
//         { status: 400 },
//       )
//     }

//     const task = (await req.json()) as Partial<
//       Omit<Task, 'id' | 'teamId'> & {
//         tags?: string[]
//         subtasks?: string[]
//       }
//     >

//     if (!task) {
//       return Response.json(
//         { ok: false, message: 'Task attributes must be defined in request' },
//         { status: 400 },
//       )
//     }

//     try {
//       const attachedTags = await db.taskTagJoin.findMany({
//         where: {
//           taskId: id,
//         },
//         select: {
//           tagId: true,
//         },
//       })

//       const existingTagIds = attachedTags.map((tag) => tag.tagId)

//       const tagsToRemove =
//         existingTagIds.filter((tagId) => !task.tags?.includes(tagId)) ?? []
//       const tagsToAdd =
//         task.tags?.filter((tagId) => !existingTagIds.includes(tagId)) ?? []

//       await db.$transaction([
//         // Remove tags
//         db.taskTagJoin.deleteMany({
//           where: {
//             taskId: id,
//             tagId: { in: tagsToRemove },
//           },
//         }),

//         // Add new tags
//         db.taskTagJoin.createMany({
//           data: tagsToAdd.map((tagId) => ({
//             taskId: id,
//             tagId,
//           })),
//         }),

//         // Update task details
//         db.task.update({
//           where: {
//             id,
//             teamId: session?.user?.teamId ?? 'undef',
//           },
//           data: {
//             ...task,
//             assignedToId:
//               task.assignedToId === 'removeLink' ? null : task.assignedToId,
//             parentId: id !== task.parentId ? task.parentId : null, // Avoid self-parenting
//             tags: undefined,
//             subtasks: undefined,
//           },
//         }),
//       ])
//     } catch (err) {
//       console.error(err)
//       throw err
//     }

//     return Response.json({ ok: true, message: 'Task Updated' }, { status: 200 })
//   } catch (err) {
//     return Response.json(
//       { ok: false, message: `Failed with Error ${err}` },
//       { status: 500 },
//     )
//   }
// })
