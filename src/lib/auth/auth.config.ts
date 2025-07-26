import {
  type AttributeType,
  AuthFlowType,
  GetUserCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import type { NextAuthConfig } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import type { CognitoProfile } from 'next-auth/providers/cognito'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCognitoIdentityProviderClient } from './cognito/cognitoIdentityProvider'

export const runtime = 'nodejs'

export default {
  trustHost: true,
  providers: [
    CognitoProvider({
      id: 'cognito',
      name: 'Cognito',
      clientId: process.env.COGNITO_CLIENT_ID as string,
      client: {
        token_endpoint_auth_method: 'none',
      },
      checks: ['state', 'nonce'],
      issuer: process.env.COGNITO_ISSUER as string,
      authorization: {
        url: `${process.env.COGNITO_DOMAIN_URL}/oauth2/authorize`,
        params: {
          identity_provider: 'Google',
          response_type: 'code',
          client_id: process.env.COGNITO_CLIENT_ID as string,
          scope: 'openid email profile',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/cognito`,
          prompt: 'login',
        },
      },
      profile(profile: CognitoProfile, tokens: any) {
        return {
          id: profile['cognito:username'], // ID from cognito
          oauthId: profile.sub, // ID from oauth
          email: profile.email,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        }
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (creds) => {
        if (!creds) return null

        const client = getCognitoIdentityProviderClient()

        try {
          const authResult = await client.send(
            new InitiateAuthCommand({
              AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
              ClientId: process.env.COGNITO_CLIENT_ID as string,
              AuthParameters: {
                USERNAME: creds.email as string,
                PASSWORD: creds.password as string,
              },
            }),
          )

          const accessToken = authResult.AuthenticationResult?.AccessToken
          if (!accessToken) return null

          const userResult = await client.send(
            new GetUserCommand({ AccessToken: accessToken }),
          )
          const attributes = userResult.UserAttributes as
            | AttributeType[]
            | undefined

          return {
            id: userResult.Username as string,
            oauthId: attributes?.find((attr) => attr.Name === 'sub')?.Value,
            email: attributes?.find((attr) => attr.Name === 'email')?.Value,
            idToken: authResult.AuthenticationResult?.IdToken,
            accessToken,
            refreshToken: authResult.AuthenticationResult?.RefreshToken,
          }
        } catch (err) {
          console.error('Cognito Auth Error:', err)
          return null
        }
      },
    }),
  ],
} satisfies NextAuthConfig
