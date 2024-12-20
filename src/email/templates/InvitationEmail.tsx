import type * as React from 'react'

export const InvitationEmail: React.FC<
  Readonly<{ teamName: string; inviterName: string; url: string }>
> = ({ teamName, inviterName, url }) => {
  const invitationLink = `${url}/auth/login`

  return (
    <div>
      <h1>You're Invited to Join {teamName}!</h1>
      <p>Hello,</p>
      <p>
        {inviterName} has invited you to join the <strong>{teamName}</strong>{' '}
        team on our platform. We're excited to have you on board!
      </p>
      <p>
        To accept the invitation and set up your account, please click the link
        below:
      </p>
      <p>
        <a href={invitationLink} target="_blank" rel="noopener noreferrer">
          Accept Invitation
        </a>
      </p>
      <p>
        If you did not expect this invitation, you can safely ignore this email.
      </p>
      <p>We look forward to seeing you!</p>
    </div>
  )
}
