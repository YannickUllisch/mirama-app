'use server'
import { VerifySchema } from '@/serverOld/auth/schemas'
import type * as z from 'zod'
import { confirmUser } from './cognito/confirmUser'

export const verify = async (values: z.infer<typeof VerifySchema>) => {
  const validatedFields = VerifySchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, confirmationCode } = validatedFields.data

  try {
    const result = await confirmUser({ code: confirmationCode, email })
    return { success: true, result }
  } catch (error: any) {
    return { error: error.message || 'Registration failed.' }
  }
}
