'use server'
import { ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

export const resendConfirmationCode = async (email: string) => {
  const client = getCognitoIdentityProviderClient()

  const command = new ResendConfirmationCodeCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
  })

  try {
    await client.send(command)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to resend code' }
  }
}
