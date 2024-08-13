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
  const { user } = useAuth()

  const newSocket: Socket = useMemo(
    () =>
      io(SOCKET_SERVER_URL, {
        query: { user: JSON.stringify(user) },
        auth: { name: user?.name, username: user?.username, userId: user?._id },
      }),
    [user] // Add `user` as a dependency
  )

  useEffect(() => {
    setSocket(newSocket);

    // Cleanup function to disconnect the socket
    return () => {
      newSocket.disconnect();
    };
  }, [newSocket]);

  const isUserOnline = (userId: string) => {
    return users && users.some((user) => user.userId === userId)
  }

  return (
    <SocketContext.Provider value={{ socket, users, isUserOnline, setUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
