'use server'
import { AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { getCognitoIdentityProviderClient } from './cognitoIdentityProvider'

export const inviteUserCognito = async ({ email }: { email: string }) => {
  const client = getCognitoIdentityProviderClient()
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: email,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
    ],
    DesiredDeliveryMediums: ['EMAIL'], // Send invitation via email
  })

  try {
    await client.send(command)
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send invitation',
    }
  }
}
