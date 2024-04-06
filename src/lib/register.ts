'use server'
import type * as z from 'zod'
import { RegisterSchema } from '@src/lib/schemas'
import bcryptjs from 'bcryptjs'
import { db } from '@src/lib/db'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcryptjs.hash(password, 10)

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    await db.user.update({
      where: {
        email,
      },
      data: {
        name,
        password: hashedPassword,
      },
    })
    // Implement logic to update user for which email already is in database. This way
    // We can restrict access to the site.
    return { success: 'User Created!' }
  }

  // await db.user.create({
  //   data: {
  //     name,
  //     email,
  //     password: hashedPassword,
  //   },
  // })

  // TODO send verification token email

  return { error: 'You do not have access.' }
}
