'use server'
import { signIn } from '@server/auth/auth'
import { LoginSchema } from '@server/auth/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@src/routes'
import { AuthError } from 'next-auth'
import type * as z from 'zod'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validatedFields.data

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
