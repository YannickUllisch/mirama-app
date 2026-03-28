import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export const RegisterSchema = z
  .object({
    name: z.string().min(4, { message: 'Name must contain 4 characters' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(6, { message: 'Password needs to include at least 6 characters' }),
  })
  .refine((data) => /[A-Z]/.test(data.password), {
    message:
      'Password must contain at least one uppercase letter and one special character',
    path: ['password'],
  })

export const CognitoChangePasswordSchema = z
  .object({
    email: z.string().email({
      message: 'Email is required',
    }),
    currentPassword: z.string().min(1, {
      message: 'Current Password is required',
    }),
    newPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
    verifyNewPassword: z.string().min(6, {
      message: 'Please confirm your password',
    }),
  })
  .refine((data) => data.newPassword === data.verifyNewPassword, {
    message: 'Passwords must match',
    path: ['verifyNewPassword'],
  })
  .refine(
    (data) =>
      /[A-Z]/.test(data.newPassword) && /[^A-Za-z0-9]/.test(data.newPassword),
    {
      message:
        'Password must contain at least one uppercase letter and one symbol',
      path: ['newPassword'],
    },
  )

export const VerifySchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  confirmationCode: z
    .string()
    .min(6, {
      message: 'Confirmation code must be 6 digits',
    })
    .max(6, {
      message: 'Confirmation code must be 6 digits',
    })
    .regex(/^\d{6}$/, {
      message: 'Confirmation code must contain only numbers',
    }),
})
