import { io, type Socket } from 'socket.io-client'
import { create } from 'zustand'
import type { SocketNotification, SocketTeamStatus } from '../types/socketTypes' // Importing only necessary types
import { toast } from 'sonner'

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
  connect: () => void
  disconnect: () => void
  emit: <T extends keyof EmitDataTypes>(
    event: T,
    data: EmitDataTypes[T],
  ) => void
}

const useSocketStore = create<Store>((set, get) => ({
  socket: null,
  teamStatus: null,
  notifications: [],

  /**
   * Connects to the WebSocket server and sets up event listeners.
   */
  connect: () => {
    const { socket } = get()
    if (socket) {
      toast.error('Socket already connected')
      return
    }
    console.log('Connecting to socket:', 'http://localhost:8080')
    const newSocket = io('http://localhost:8080')

    newSocket
      .on('connect', () => {
        console.log('SOCKET CONNECTED:', newSocket.id)
        set({ socket: newSocket })
      })
      .on('disconnect', () => {
        console.log('SOCKET DISCONNECTED!')
        set({ socket: null })
      })
      .on('team_status', (data: SocketTeamStatus) => {
        console.log('Updated team status:', data)
        set({ teamStatus: data })
      })
      .on('notification', (data: SocketNotification) => {
        console.log('New notification:', data)
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
      set({ socket: null })
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
