import { contactRequestController } from '@server/controllers/contactController'
import { genericExceptionHandler } from '@server/utils/exceptionHandler'

export const POST = genericExceptionHandler(contactRequestController)
