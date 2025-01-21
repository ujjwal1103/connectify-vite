import { io, Socket } from 'socket.io-client'
import { SOCKET_SERVER_URL } from '@/config/constant'
import { create } from 'zustand'

interface SocketState {
  socket: Socket | null
  connect: (user: any) => void
  disconnect: () => void
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connect: (user) => {
    console.log('socket connection from zustand')
    const socket = io(SOCKET_SERVER_URL, {
      query: { user: JSON.stringify(user) },
      auth: { name: user.name, username: user.username, userId: user._id },
    })
    set({ socket })
  },
  disconnect: () => {
    set((state) => {
      state.socket?.disconnect()
      return { socket: null }
    })
  },
}))

