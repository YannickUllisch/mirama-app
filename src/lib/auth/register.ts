'use server'
import type * as z from 'zod'
import { RegisterSchema } from '@src/lib/schemas'
import bcryptjs from 'bcryptjs'
import { db } from '@src/lib/db'
import { signIn } from '@auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'

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
    return { error: 'This Email is already registered' }
  }

  // We only let existing users create accounts, since its a invite only system.
  // Once one has been invited and registers we automatically verify their Email.
  if (existingUser && !existingUser.password) {
    try {
      await db.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          emailVerified: new Date(),
        },
      })

      try {
        await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
      } catch (err) {
        // We get redirect error when trying to signin even when signin is successfull
        // For now just force redirect
        if (isRedirectError(err)) {
          redirect(DEFAULT_LOGIN_REDIRECT)
        }
      }
    } catch (error) {
      console.error('Error during user update or sign-in:', error)
      return { error: 'Server Error, please contact support' }
    }
  }

  // Case 3: User does not exist
  return { error: 'This system is currently invite only' }
}
