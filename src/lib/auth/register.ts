'use server'
import { signIn } from '@auth'
import db from '@db'
import { RegisterSchema } from '@src/lib/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@src/routes'
import bcryptjs from 'bcryptjs'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import type * as z from 'zod'
import { getValidCompanyInvitation } from '../api/queries/Invite/InviteQueries'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data
  const hashedPassword = await bcryptjs.hash(password, 10)

  const invitation = await getValidCompanyInvitation({ email })

  if (!invitation) {
    return {
      error: 'Invitation Error, please contact your administrator',
    }
  }

  await db.user.create({
    data: {
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      teamId: invitation.teamId,
      emailVerified: new Date(),
      password: hashedPassword,
    },
  })

  try {
    await db.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
    } catch (err) {
      // We get redirect error when trying to signin even when signin is successfull
      // For now just force redirect
      if (isRedirectError(err)) {
        redirect(DEFAULT_LOGIN_REDIRECT)
      }
    }
  } catch (error) {
    console.error('Error during user update or sign-in:', error)
    return { error: 'Server Error, please contact support' }
  }

  // Case 3: User does not exist
  return { error: 'Contact your administrator for an invitation' }
}
