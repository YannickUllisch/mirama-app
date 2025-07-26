import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

export const runtime = 'nodejs'

export const confirmUser = async ({
  email,
  code,
}: {
  email: string
  code: string
}) => {
  const client = getCognitoIdentityProviderClient()
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  })
  try {
    await client.send(command)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to confirm Code' }
  }
}
