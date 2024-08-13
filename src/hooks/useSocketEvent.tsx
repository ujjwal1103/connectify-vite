import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

const useSocketEvents = (socket: Socket | null, handlers: any) => {
  useEffect(() => {
    if (!socket) return
    Object.entries(handlers).forEach(([event, handler]: any[]) => {
      socket.on(event, handler)
    })

    return () => {
      Object.entries(handlers).forEach(([event, handler]: any[]) => {
        socket.off(event, handler)
      })
    }
  }, [socket, handlers])
}

export default useSocketEvents
