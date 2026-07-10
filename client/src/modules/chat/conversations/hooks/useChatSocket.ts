import { useEffect, useRef, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@auth/hooks/useAuth"
import { useQueryClient } from "@tanstack/react-query"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"

export interface TypingUser {
  userId: string
  username?: string
}

export const useChatSocket = (config?: any) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const userId = config?.userId ?? user?._id
  const conversationId = config?.conversationId
  const type = config?.type ?? "private"
  const setMessages = config?.setMessages
  const conversationIdRef = useRef(conversationId)
  const typeRef = useRef(type)
  const setMessagesRef = useRef(setMessages)
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const mergeIncomingMessage = useCallback((incomingMessage: any) => {
    setMessagesRef.current?.((prev: any[]) => {
      const existingIndex = prev.findIndex(
        (message) =>
          message._id === incomingMessage._id ||
          (incomingMessage.clientTempId && message.clientTempId === incomingMessage.clientTempId)
      )

      if (existingIndex === -1) return [...prev, incomingMessage]

      return prev.map((message, index) =>
        index === existingIndex ? { ...incomingMessage, localStatus: undefined } : message
      )
    })
  }, [])

  const refreshConversationFiles = useCallback(
    (messageData: any, fallbackConversationId?: string) => {
      if (messageData?.messageType !== "file") return

      const fileConversationId =
        fallbackConversationId || messageData?.conversation?._id || messageData?.conversation || conversationIdRef.current

      if (!fileConversationId) return

      queryClient.invalidateQueries({ queryKey: ["conversationFiles", fileConversationId.toString()] })
    },
    [queryClient]
  )

  useEffect(() => {
    conversationIdRef.current = conversationId
    typeRef.current = type
    setMessagesRef.current = setMessages

    if (socketRef.current?.connected && type === "group" && conversationId && userId) {
      socketRef.current.emit("join-group", { conversationId, userId })
    }
  }, [conversationId, setMessages, type, userId])

  useEffect(() => {
    if (!userId) return

    socketRef.current = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true
    })

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id)

      if (typeRef.current === "group" && conversationIdRef.current) {
        socketRef.current?.emit("join-group", { conversationId: conversationIdRef.current, userId })
      }
    })

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    socketRef.current.on("receive-group-messages", (messageData, convoId) => {
      if (typeRef.current === "group" && convoId?.toString() === conversationIdRef.current?.toString()) {
        mergeIncomingMessage(messageData)
        refreshConversationFiles(messageData, convoId?.toString())
      }
    })

    socketRef.current.on("receiveMessage", (messageData) => {
      if (typeRef.current === "group") return

      if (!conversationIdRef.current && messageData.conversation) {
        navigate(`/chat/conversation/${messageData.conversation}`)
      }

      mergeIncomingMessage(messageData)
      refreshConversationFiles(messageData)
    })

    socketRef.current.on("typing:start", (typingData: TypingUser & { conversationId?: string; conversationType?: string }) => {
      if (!typingData?.userId || typingData.userId === userId) return

      if (
        typingData.conversationId &&
        conversationIdRef.current &&
        typingData.conversationId.toString() !== conversationIdRef.current.toString()
      ) {
        return
      }

      window.clearTimeout(typingTimeoutsRef.current[typingData.userId])
      setTypingUsers((prev) => {
        if (prev.some((typingUser) => typingUser.userId === typingData.userId)) return prev
        return [...prev, { userId: typingData.userId, username: typingData.username }]
      })

      typingTimeoutsRef.current[typingData.userId] = window.setTimeout(() => {
        setTypingUsers((prev) => prev.filter((typingUser) => typingUser.userId !== typingData.userId))
        delete typingTimeoutsRef.current[typingData.userId]
      }, 3000)
    })

    socketRef.current.on("typing:stop", (typingData: TypingUser) => {
      if (!typingData?.userId) return

      window.clearTimeout(typingTimeoutsRef.current[typingData.userId])
      delete typingTimeoutsRef.current[typingData.userId]
      setTypingUsers((prev) => prev.filter((typingUser) => typingUser.userId !== typingData.userId))
    })

    return () => {
      Object.values(typingTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      typingTimeoutsRef.current = {}
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [mergeIncomingMessage, navigate, refreshConversationFiles, userId])

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

  const sendMessage = useCallback((payload: any) => {
    const clientTempId = payload?.messageData?.clientTempId

    socketRef.current?.timeout(15000).emit("sendMessage", payload, (error: Error | null) => {
      if (!error || !clientTempId) return

      setMessagesRef.current?.((prev: any[]) =>
        prev.map((message) =>
          message._id === clientTempId && message.localStatus === "sending"
            ? { ...message, localStatus: "failed" }
            : message
        )
      )
    })
  }, [])

  const emitTypingStart = useCallback(
    (payload: { conversationId?: string; conversationType: "private" | "group"; recipientId?: string; username?: string }) => {
      if (!userId) return
      socketRef.current?.emit("typing:start", {
        ...payload,
        senderId: userId
      })
    },
    [userId]
  )

  const emitTypingStop = useCallback(
    (payload: { conversationId?: string; conversationType: "private" | "group"; recipientId?: string; username?: string }) => {
      if (!userId) return
      socketRef.current?.emit("typing:stop", {
        ...payload,
        senderId: userId
      })
    },
    [userId]
  )

  return {
    socket: socketRef.current,
    socketRef,
    sendMessage,
    emitTypingStart,
    emitTypingStop,
    typingUsers,
    emit,
    on,
    off
  }
}

export default useChatSocket
