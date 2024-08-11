'use server'
import type * as z from 'zod'
import { RegisterSchema } from '@src/lib/schemas'
import bcryptjs from 'bcryptjs'
import { db } from '@src/lib/db'
import { signIn } from '@src/lib/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data
  const hashedPassword = await bcryptjs.hash(password, 10)

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  })

  // Dont let already used Emails register again
  if (existingUser?.password && existingUser.emailVerified) {
    return { error: 'This Email is not allowed.' }
  }

  // We only let existing users create accounts, since its a invite only system.
  // Once one has been invited and registers we automatically verify their Email.
  if (existingUser && !existingUser.password) {
    await db.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })

    // We immediately sign them in after creation since we don't perform Email Verification
    try {
      await signIn('credentials', {
        email,
        hashedPassword,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      })
    } catch {
      return { success: 'Account Created!' }
    }
  }

  return { error: 'Contact System Admin for Access' }
}
