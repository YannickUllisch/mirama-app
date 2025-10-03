import { Prisma } from '@prisma/client'

export const withPrismaErrorSanitizer = async <T>(
  fn: () => Promise<T>,
): Promise<T> => {
  try {
    return await fn()
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error('A database error occurred. Please check your input.')
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      throw new Error('Invalid data provided. Please review your input.')
    }
    throw new Error('An unexpected error occurred. Please try again.')
  }
}
