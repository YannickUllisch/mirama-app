'use server'
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { RegisterSchema } from '@src/lib/schemas'
import type * as z from 'zod'
import { getValidCompanyInvitation } from '../api/queries/Invite/InviteQueries'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data

  const invitation = await getValidCompanyInvitation({ email })

  if (!invitation) {
    return {
      error: 'Invitation Error, please contact your administrator',
    }
  }

  const client = getCognitoIdentityProviderClient()
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  })

  return await client.send(command)
}
