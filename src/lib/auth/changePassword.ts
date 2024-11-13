'use server'
import type * as z from 'zod'
import { auth } from '@auth'
import { ChangePasswordSchema } from '@src/lib/schemas'
import { getUserById } from '../api/queries/User/UserQueries'
import bcryptjs from 'bcryptjs'
import { db } from '@db'

export const changePassword = async (
  values: z.infer<typeof ChangePasswordSchema>,
) => {
  const validatedFields = ChangePasswordSchema.safeParse(values)

  const session = await auth()
  if (!session) {
    return { error: 'You need to be logged in.' }
  }

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { data } = validatedFields
  // We fetch existing user to get access to current password
  const existingUser = await getUserById(session.user.id ?? 'undefined')
  if (!existingUser) {
    return { error: 'User cannot be found' }
  }

  // We compare password 'old' with current password
  // If incorrect we return error
  const comparison = await bcryptjs.compare(
    data.old,
    existingUser?.password ?? '',
  )

  if (!comparison) {
    return { error: 'Incorrect Password given.' }
  }

  // If everything worked, we update users password
  const hashedNew = await bcryptjs.hash(data.new, 10)

  try {
    await db.user.update({
      where: {
        id: session.user.id ?? 'undefined',
      },
      data: {
        password: hashedNew,
      },
    })
    return { success: 'Password Updated' }
  } catch (err) {
    return { error: `Server Error: ${err}` }
  }
}
