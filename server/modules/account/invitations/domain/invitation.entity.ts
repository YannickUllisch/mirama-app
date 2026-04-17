const INVITATION_EXPIRY_DAYS = 1

// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class InvitationEntity {
  static createExpiryDate(): Date {
    const date = new Date()
    date.setDate(date.getDate() + INVITATION_EXPIRY_DAYS)
    return date
  }
}
