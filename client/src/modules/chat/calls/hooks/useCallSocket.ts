import { useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

export const useCallSocket = (userId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (userId) {
      socketRef.current = io(SOCKET_URL, {
        query: { userId },
        transports: ["websocket"]
      })

      return () => {
        socketRef.current?.disconnect()
      }
    }
  }, [userId])

  const callUser = useCallback(
    (to: string, type: string, offer: RTCSessionDescriptionInit) => {
      socketRef.current?.emit("call-user", { from: userId, to, type, offer })
    },
    [userId]
  )

  const answerCall = useCallback(
    (to: string, answer: RTCSessionDescriptionInit) => {
      socketRef.current?.emit("answer-call", { from: userId, to, answer })
    },
    [userId]
  )

  const rejectCall = useCallback(
    (to: string) => {
      socketRef.current?.emit("reject-call", { from: userId, to })
    },
    [userId]
  )

  const sendIceCandidate = useCallback(
    (to: string, candidate: RTCIceCandidateInit) => {
      socketRef.current?.emit("ice-candidate", { from: userId, to, candidate })
    },
    [userId]
  )

  const endCall = useCallback(
    (to: string) => {
      socketRef.current?.emit("end-call", { from: userId, to })
    },
    [userId]
  )

  return {
    socket: socketRef.current,
    callUser,
    answerCall,
    rejectCall,
    sendIceCandidate,
    endCall
  }
}

export default useCallSocket
