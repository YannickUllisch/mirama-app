import { contactRequestController } from '@server/controllers/contactController'
import { genericExceptionHandler } from '@server/utils/exceptionHandler'

// Public endpoint so no auth needed
// TODO: Add rate limiter here so AWS cost doesnt skyrocket if someone abuses it
export const POST = genericExceptionHandler(contactRequestController)
