/**
 * Represents an online user with a unique ID and optional name.
 */
export type SocketOnlineUser = {
  userId: string // Unique user ID
  name: string | null // Optional username
  teamId: string // Team ID to track which team the user belongs to
}

/**
 * Represents a team status update.
 */
export type SocketTeamStatus = {
  teamId: string // The ID of the team
  users: SocketOnlineUser[] // List of online users in the team
}

/**
 * Represents a real-time notification.
 */
export type SocketNotification = {
  teamId: string // The team receiving the notification
  message: string // Notification message
  type: 'info' | 'success' | 'warning' | 'error' // Notification type
  timestamp: number // UNIX timestamp
}
