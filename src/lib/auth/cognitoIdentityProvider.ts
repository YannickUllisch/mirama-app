import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export const getCognitoIdentityProviderClient = () => {
  return new CognitoIdentityProviderClient({
    region: process.env.AWS_COGNITO_REGION,
  })
}
