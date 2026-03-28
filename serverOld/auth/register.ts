'use server'
import { RegisterSchema } from '@/serverOld/auth/schemas'
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import type * as z from 'zod'
import { getCognitoIdentityProviderClient } from './cognito/cognitoIdentityProvider'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password, name } = validatedFields.data

  const client = getCognitoIdentityProviderClient()
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID ?? '',
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'name', Value: name },
    ],
  })

  try {
    const result = await client.send(command)
    return { success: true, result }
  } catch (error: any) {
    return { error: error.message || 'Registration failed.' }
  }
}
