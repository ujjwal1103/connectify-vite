// SocketContext.js
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import io, { Socket } from 'socket.io-client'
import { SOCKET_SERVER_URL } from '@/config/constant'
import { useAuth } from './AuthContext'

interface SocketContextProps {
  socket: Socket | null
  users: any[]
  isUserOnline: (userId: string) => boolean
  setUsers: React.Dispatch<React.SetStateAction<any[]>>
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
  const [socket, setSocket] = useState<Socket | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  const newSocket = useMemo(() => {
    if (user) {
      const ioo = io(SOCKET_SERVER_URL, {
        query: { user: JSON.stringify(user) },
        auth: { name: user?.name, username: user?.username, userId: user?._id },
      })
      return ioo
    }

    return null
  }, [user])

  useEffect(() => {
    if (newSocket) {
      setSocket(newSocket)
      newSocket.on('connect', () => {
        setIsConnected(true)
      })
      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })
      newSocket.on('', () => {})
      return () => {
        newSocket.disconnect()
      }
    }
  }, [newSocket])

  const isUserOnline = (userId: string) => {
    return users && users.some((user) => user.userId === userId)
  }

  return (
    <SocketContext.Provider value={{ socket, users, isUserOnline, setUsers }}>
      {children}

      {isConnected && import.meta.env.DEV && (
        <span className="fixed bottom-0 z-[10000929] bg-green-500 px-2 text-primary">
          Socket Connected
        </span>
      )}
    </SocketContext.Provider>
  )
}
