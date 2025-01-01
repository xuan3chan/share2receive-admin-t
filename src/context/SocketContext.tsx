import { createContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Khởi tạo kết nối socket
    const socketInstance = io('https://share2receive-server.onrender.com', {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to socket')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from socket')

      // Không cần phải tự reconnect lại ở đây vì socket.io đã tự động reconnect
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}

export { SocketContext, SocketProvider }
