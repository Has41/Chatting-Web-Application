import { useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@auth/hooks/useAuth"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

export const useChatSocket = () => {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (user?._id) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        query: { userId: user._id },
        transports: ["websocket"],
        autoConnect: true
      })

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id)
      })

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected")
      })

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
        }
      }
    }
  }, [user?._id])

  const emit = useCallback((event: string, ...args: unknown[]) => {
    if (socketRef.current) {
      socketRef.current.emit(event, ...args)
    }
  }, [])

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }, [])

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }, [])

  return {
    socket: socketRef.current,
    emit,
    on,
    off
  }
}

export default useChatSocket
