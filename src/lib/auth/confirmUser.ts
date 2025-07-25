import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

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
  return await client.send(command)
}
