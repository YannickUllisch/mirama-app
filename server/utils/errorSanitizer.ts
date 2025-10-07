import { Prisma } from '@prisma/client'

export const sanitizePrismaError = (err: any): Error => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return new Error('A database error occurred. Please check your input.')
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return new Error('Invalid data provided. Please review your input.')
  }
  return new Error('An unexpected error occurred. Please try again.')
}
