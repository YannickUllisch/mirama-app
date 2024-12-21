import type { ContactSchema } from '@src/lib/schemas'
import type { FC } from 'react'
import type { z } from 'zod'

export const ContactEmail: FC<z.infer<typeof ContactSchema>> = ({
  firstName,
  lastName,
  email,
  phone,
  message,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h1>New Contact Request</h1>
      <p>
        A new contact request has been submitted with the following details:
      </p>
      <p>
        <strong>First Name:</strong> {firstName}
        <br />
        <strong>Last Name:</strong> {lastName}
        <br />
        <strong>Email:</strong> {email}
        <br />
        {phone && (
          <>
            <strong>Phone:</strong> {phone}
            <br />
          </>
        )}
        <strong>Message:</strong>
      </p>
      <blockquote
        style={{
          borderLeft: '4px solid #ccc',
          paddingLeft: '10px',
          color: '#555',
        }}
      >
        {message}
      </blockquote>
      <p>
        Kind regards,
        <br />
        Your Website Team
      </p>
    </div>
  )
}
