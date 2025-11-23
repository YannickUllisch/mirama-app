import { AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

export const deleteCognitoUser = async (email: string) => {
  const client = getCognitoIdentityProviderClient()

  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID as string,
      Username: email,
    })

    await client.send(command)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to Delete User' }
  }
}
