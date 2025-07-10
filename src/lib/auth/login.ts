'use server'
import type * as z from 'zod'
import { DEFAULT_LOGIN_REDIRECT } from '@src/routes'
import { AuthError } from 'next-auth'
import { LoginSchema } from '@src/lib/schemas'
import { getUserByEmail } from '../api/queries/User/UserQueries'
import { signIn } from '@auth'

export const resendLogin = async (formData: FormData) => {
  await signIn('resend', formData)
}

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Invalid email or password' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' }
        default:
          return { error: 'Auth Error Occured' }
      }
    }
    throw error
  }
}
