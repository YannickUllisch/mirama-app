import { io, type Socket } from 'socket.io-client'
import { create } from 'zustand'
import type { SocketNotification, SocketTeamStatus } from '../types/socketTypes' // Importing only necessary types
import { toast } from 'sonner'
import type { Session } from 'next-auth'

/**
 * Define the type for all possible emitted events and their data structures.
 */
type EmitDataTypes = {
  join_team: { userId: string; teamId: string }
}

type Store = {
  socket: Socket | null
  teamStatus: SocketTeamStatus | null
  notifications: SocketNotification[]
  connected: boolean
  connect: (session: Session | null) => void
  disconnect: () => void
  emit: <T extends keyof EmitDataTypes>(
    event: T,
    data: EmitDataTypes[T],
  ) => void
}

const useSocketStore = create<Store>((set, get) => ({
  socket: null,
  teamStatus: null,
  connected: false,
  notifications: [],

  /**
   * Connects to the WebSocket server and sets up event listeners.
   */
  connect: (session) => {
    if (!session?.user?.id) {
      toast.error('User not found')
      return
    }
    const { socket } = get()
    if (socket) {
      return
    }
    const newSocket = io('http://localhost:8080')

    newSocket
      .emit('join_team', {
        userId: session.user.id,
        teamId: session.user.teamId,
      })
      .on('connect', () => {
        console.debug('SOCKET CONNECTED:', newSocket.id)
        set({ socket: newSocket, connected: true })
      })
      .on('disconnect', () => {
        console.debug('SOCKET DISCONNECTED!')
        set({ socket: null, connected: false })
      })
      .on('team_status', (data: SocketTeamStatus) => {
        console.debug('Updated team status:', data)
        set({ teamStatus: data })
      })
      .on('notification', (data: SocketNotification) => {
        console.debug('New notification:', data)
        set((state) => ({ notifications: [...state.notifications, data] }))
      })
  },

  /**
   * Disconnects from the WebSocket server.
   */
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, connected: false })
    } else {
      toast.error('Socket not connected')
    }
  },

  /**
   * Emits an event to the WebSocket server.
   */
  emit: <T extends keyof EmitDataTypes>(event: T, data: EmitDataTypes[T]) => {
    const { socket } = get()
    if (!socket) {
      toast.error('Socket not connected')
      return
    }

    socket.emit(event, data, (response: { ok: boolean }) => {
      if (!response.ok) toast.error('Something went wrong')
    })
  },
}))

export default useSocketStore
