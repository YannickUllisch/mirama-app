import z from "zod"

export const ContactRequestSchema = z.object({
  firstName: z.string().min(2, { message: 'Please define your First Name' }),
  lastName: z.string().min(2, { message: 'Please define your Last Name' }),
  email: z.string().email({ message: 'Invalid email format' }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: 'Please enter a valid phone number',
    })
    .optional(),
  message: z
    .string()
    .min(20, { message: 'Please add atleast 20 characters to your Message' })
    .max(1000, {
      message: 'Please keep your message concise and below 1000 characters',
    }),
})

export type ContactRequestType = z.infer<typeof ContactRequestSchema>
