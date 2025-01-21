import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  // useMemo,
  // useState,
} from 'react'
import { Socket } from 'socket.io-client'
// import { SOCKET_SERVER_URL } from '@/config/constant'
import { useAuth } from './AuthContext'
import { useSocketStore } from '@/zustand/useSocketStore'

// const isDev = import.meta.env.DEV

interface SocketContextProps {
  socket: Socket | null
  // users: any[]
  // isUserOnline: (userId: string) => boolean
  // setUsers: React.Dispatch<React.SetStateAction<any[]>>
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined)

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { connect, disconnect, socket } = useSocketStore()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      connect(user)
    }
    return () => disconnect()
  }, [user, connect, disconnect])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
      {/* {isConnected && isDev && (
        <span className="fixed top-0 hidden bg-green-500/20 px-2 text-primary lg:bottom-0">
          Socket Connected
        </span>
      )} */}
    </SocketContext.Provider>
  )
}
