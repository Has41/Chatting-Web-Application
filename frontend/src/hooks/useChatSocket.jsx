import { useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"

const useChatSocket = ({ userId, conversationId, type = "private", setMessages }) => {
  const socketRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return

    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId }
    })

    socketRef.current.on("connect", () => {
      console.log(`Socket connected: ${socketRef.current.id}`)

      if (type === "group") {
        socketRef.current.emit("join-group", conversationId, userId)
      }
    })

    if (type === "group") {
      socketRef.current.on("receive-group-messages", (messageData, convoId) => {
        if (convoId === conversationId) {
          setMessages((prev) => [...prev, messageData])
        }
      })
    } else {
      socketRef.current.on("receiveMessage", (messageData) => {
        if (!conversationId && messageData.conversation) {
          navigate(`/chat/conversation/${messageData.conversation}`)
        }
        setMessages((prev) => [...prev, messageData])
      })
    }

    return () => {
      socketRef.current.disconnect()
    }
  }, [userId, conversationId, type, navigate])

  const sendMessage = useCallback(({ messageData, fileData }) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", { messageData, fileData }, null)
    }
  }, [])

  return { socketRef, sendMessage }
}

export default useChatSocket
