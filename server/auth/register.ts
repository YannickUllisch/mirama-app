'use server'
import { RegisterSchema } from '@src/lib/schemas'
import type * as z from 'zod'
import { getValidCompanyInvitation } from '../../src/lib/api/queries/Invite/InviteQueries'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email } = validatedFields.data

  const invitation = await getValidCompanyInvitation({ email })

  if (!invitation) {
    return {
      error:
        'The system is currently not open for public registrations. An invitation is required.',
    }
  }

  // const client = getCognitoIdentityProviderClient()
  // const command = new SignUpCommand({
  //   ClientId: process.env.COGNITO_CLIENT_ID,
  //   Username: email,
  //   Password: password,
  //   UserAttributes: [{ Name: 'email', Value: email }],
  // })

  // return await client.send(command)
  return {
    error:
      'Sign ups are currently disabled, due to invitational system being active.',
  }
}
