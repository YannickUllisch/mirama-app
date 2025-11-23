'use server'
import {
  AuthFlowType,
  ChallengeNameType,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { CognitoChangePasswordSchema } from '@server/auth/schemas'
import type z from 'zod'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

export const handleAuthChallenge = async (
  values: z.infer<typeof CognitoChangePasswordSchema>,
) => {
  const validatedFields = CognitoChangePasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, currentPassword, newPassword } = validatedFields.data

  const client = getCognitoIdentityProviderClient()

  try {
    const authResult = await client.send(
      new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: process.env.COGNITO_CLIENT_ID as string,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: currentPassword,
        },
      }),
    )

    if (!authResult.ChallengeName) {
      return { error: 'New password is not required' }
    }

    if (authResult.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      try {
        await client.send(
          new RespondToAuthChallengeCommand({
            ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
            ClientId: process.env.COGNITO_CLIENT_ID as string,
            ChallengeResponses: {
              USERNAME: email,
              NEW_PASSWORD: newPassword,
            },
            Session: authResult.Session,
          }),
        )
      } catch (err) {
        console.error(err)
      }
    }
  } catch (err) {
    console.error('Cognito Auth Error:', err)
    return null
  }
}
